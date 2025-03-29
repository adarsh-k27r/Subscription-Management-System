import { verifyAccessToken } from '../utils/jwt-helper.js';
import { INTERNAL_API_KEY } from "../config/env.js";
import User from '../models/user.model.js';

const authorize = async (req, res, next) => {
  try {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if(!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = await verifyAccessToken(token);

    const user = await User.findById(decoded.sub);

    if(!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
}

const authorizeRole = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. You do not have permission to perform this action.' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};


// INTERNAL_API_ENDPOINT_PROTECTION MIDDLEWARE
const verifyInternalRequest = (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    // Check if the API key matches internal secret key
    if (!apiKey || apiKey !== INTERNAL_API_KEY) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to internal endpoint",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { authorize as default, authorizeRole, verifyInternalRequest };