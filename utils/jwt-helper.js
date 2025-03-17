import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../config/env.js";
import {client} from "../database/redis.js";

export const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            sub: userId,  // subject (user identifier)
            iat: Math.floor(Date.now() / 1000),  // issued at
        };
        
        const options = {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
            issuer: 'subscription-tracker',
            audience: userId.toString(),
            algorithm: 'HS256'
        };

        jwt.sign(payload, ACCESS_TOKEN_SECRET, options, (error, token) => {
            if (error) {
                console.error('Error signing token:', error.message);
                return reject(new Error('Error generating access token'));
            }
            resolve(token);
        });
    });
}

export const verifyAccessToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, ACCESS_TOKEN_SECRET, {
            algorithms: ['HS256']
        }, (error, decoded) => {
            if (error) {
                const message = error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
                return reject(new Error(message));
            }
            resolve(decoded);
        });
    });
}

export const signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            sub: userId,
            iat: Math.floor(Date.now() / 1000),
        };
        
        const options = {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
            issuer: 'subscription-tracker',
            audience: userId.toString(),
            algorithm: 'HS256'
        };

        jwt.sign(payload, REFRESH_TOKEN_SECRET, options, async (error, token) => {
            if (error) {
                console.error('Error signing token:', error.message);
                return reject(new Error('Error generating refresh token'));
            }

            try {
                // Convert userId to string for Redis key
                const redisKey = `auth:${userId.toString()}`;
                await client.set(redisKey, token, {
                    EX: 7*24*60*60 // 7 days expiry
                });
                resolve(token);
            } catch (err) {
                console.error(err.message);
                reject(new Error("Internal server error"));
            }
        });
    });
}

export const verifyRefreshToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, REFRESH_TOKEN_SECRET, {
            algorithms: ['HS256']
        }, async (error, decoded) => {
            if (error) {
                const message = error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
                return reject(new Error(message));
            }
            
            try {
                // Convert userId to string and add prefix
                const redisKey = `auth:${decoded.sub.toString()}`;
                const result = await client.get(redisKey);
                
                if (token === result) {
                    resolve(decoded.sub);
                } else {
                    reject(new Error("Unauthorized"));
                }
            } catch (err) {
                console.error(err.message);
                reject(new Error("Session Timeout !! Please login again"));
            }
        });
    });
}


