import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "production"}.local` });

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  ARCJET_KEY,
  ARCJET_ENV,
  QSTASH_URL,
  QSTASH_TOKEN,
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
  SERVER_URL,
  EMAIL_PASSWORD,
  INTERNAL_API_KEY,
  REDIS_USERNAME,
  REDIS_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
  CORS_ALLOWED_ORIGINS,
  CORS_MAX_AGE,
} = process.env;

// Parse comma-separated allowed origins into an array
export const ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS 
  ? CORS_ALLOWED_ORIGINS.split(',') 
  : [];