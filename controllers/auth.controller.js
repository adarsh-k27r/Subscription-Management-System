import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js'

// In-memory token blacklist (for demonstration)
// In production, use Redis or another persistent store
export const tokenBlacklist = new Set();

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // Check if a user already exists
    const existingUser = await User.findOne({ email });

    if(existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    // Validate password length before hashing
    if (password.length < 8) {
      const error = new Error('Password must be at least 8 characters long');
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    await session.commitTransaction();
    session.endSession();

    // Use destructuring to exclude password
    const { password: _, ...userWithoutPassword } = newUsers[0].toObject();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: userWithoutPassword,
      }
    })
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
}

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Get user with password for authentication
    const user = await User.findOne({ email });

    if(!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Destructure user object to exclude password
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user: userWithoutPassword,
      }
    });
  } catch (error) {
    next(error);
  }
}

export const signOut = async (req, res, next) => {
  try {
    // Get the token from the authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Add the token to the blacklist
    tokenBlacklist.add(token);
    
    res.status(200).json({
      success: true,
      message: 'User signed out successfully'
    });
  } catch (error) {
    next(error);
  }
}