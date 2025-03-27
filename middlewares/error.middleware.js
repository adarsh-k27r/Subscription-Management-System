const errorMiddleware = (err, req, res, next) => {
    try {
      let error = { ...err };
  
      error.message = err.message;
  
      console.error(err);

      // CORS validation error
      if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
          success: false,
          message: 'Origin not allowed by CORS policy',
          error: 'CORS_POLICY_VIOLATION',
          requestId: req.headers['x-request-id'] || null,
        });
      }
  
      // Mongoose bad ObjectId
      if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new Error(message);
        error.statusCode = 404;
      }
  
      // Mongoose duplicate key
      if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new Error(message);
        error.statusCode = 400;
      }
  
      // Mongoose validation error
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new Error(message.join(', '));
        error.statusCode = 400;
      }
  
      res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
    } catch (error) {
      next(error);
    }
  };
  
  export default errorMiddleware;