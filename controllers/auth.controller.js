import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt-helper.js";
import {client} from "../database/redis.js";
import { NODE_ENV } from "../config/env.js";

// Cookie options for refresh token
const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // Check if a user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Validate password length before hashing
    if (password.length < 8) {
      const error = new Error("Password must be at least 8 characters long");
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );

    const access_token = await signAccessToken(newUsers[0]._id);
    const refresh_token = await signRefreshToken(newUsers[0]._id);

    await session.commitTransaction();
    session.endSession();

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refresh_token, refreshTokenCookieOptions);

    // Use destructuring to exclude password
    const { password: _, ...userWithoutPassword } = newUsers[0].toObject();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        access_token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Get user with password for authentication
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const access_token = await signAccessToken(user._id);
    const refresh_token = await signRefreshToken(user._id);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refresh_token, refreshTokenCookieOptions);

    // Destructure user object to exclude password
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        access_token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "No refresh token found",
      });
    }

    // Invalidate Refresh Token
    const userId = await verifyRefreshToken(refreshToken);
    const redisKey = `auth:${userId.toString()}`;
    await client.del(redisKey);

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', refreshTokenCookieOptions);

    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      const error = new Error("Please Login Again");
      error.statusCode = 401;
      throw error;
    }

    const userId = await verifyRefreshToken(refreshToken);

    const access_token = await signAccessToken(userId);
    const new_refresh_token = await signRefreshToken(userId);

    // Set new refresh token in HTTP-only cookie
    res.cookie('refreshToken', new_refresh_token, refreshTokenCookieOptions);

    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: {
        access_token,
      },
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};
