import { INTERNAL_API_KEY } from "../config/env.js";

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

export default verifyInternalRequest;
