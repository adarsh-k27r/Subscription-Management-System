/**
 * Helmet security configuration
 * Configures various HTTP security headers
 */
import { NODE_ENV, ALLOWED_ORIGINS } from './env.js';

const defaultProductionOrigins = ['https://v1rvx0b2fl.execute-api.ap-south-1.amazonaws.com/prod', 'https://qstash.upstash.io', undefined];
const defaultDevelopmentOrigins = ['http://localhost:3000', 'http://localhost:8080', undefined];

const allowedOriginsList = ALLOWED_ORIGINS.length > 0
      ? [...ALLOWED_ORIGINS, undefined] // Include undefined to allow requests with no origin
      : (NODE_ENV === 'production' ? defaultProductionOrigins : defaultDevelopmentOrigins);

const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", ...allowedOriginsList],
      styleSrc: ["'self'", "'unsafe-inline'", ...allowedOriginsList],
      imgSrc: ["'self'", "data:", ...allowedOriginsList],
      connectSrc: ["'self'", ...allowedOriginsList],
      fontSrc: ["'self'", ...allowedOriginsList],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false, // Allows embedding of resources from other origins
  crossOriginOpenerPolicy: { policy: NODE_ENV === 'production' ? "same-origin" : "unsafe-none" },
  crossOriginResourcePolicy: { policy: NODE_ENV === 'production' ? "same-site" : "cross-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  strictTransportSecurity: {
    maxAge: 63072000, // 2 years in seconds
    includeSubDomains: true,
    preload: true
  },
  xssFilter: true
};

export default helmetConfig;