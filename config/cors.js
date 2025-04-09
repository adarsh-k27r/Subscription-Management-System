import { NODE_ENV, ALLOWED_ORIGINS, CORS_MAX_AGE } from './env.js';

// Default origins if environment variables are not set
const defaultProductionOrigins = ['https://v1rvx0b2fl.execute-api.ap-south-1.amazonaws.com/prod','https://qstash.upstash.io', undefined];
const defaultDevelopmentOrigins = ['http://localhost:3000', 'http://localhost:8080', undefined];

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Use environment variable origins if available, otherwise use defaults
    const allowedOrigins = ALLOWED_ORIGINS.length > 0
      ? [...ALLOWED_ORIGINS, undefined] // Include undefined to allow requests with no origin
      : (NODE_ENV === 'production' ? defaultProductionOrigins : defaultDevelopmentOrigins);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Upstash-Signature', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  credentials: true,         // Allow cookies to be sent with requests
  maxAge: CORS_MAX_AGE ? parseInt(CORS_MAX_AGE, 10) : 86400, // Default to 24 hours if not specified
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default corsOptions;