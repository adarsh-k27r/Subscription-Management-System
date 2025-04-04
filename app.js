import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import connectDB from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.route.js';
import connectRedis from './database/redis.js';
import corsOptions from './config/cors.js';
import helmetConfig from './config/helmet.js';
import { serve, setup } from './swagger.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet(helmetConfig));
app.use(arcjetMiddleware);

app.use("/api-docs", serve, setup); // Swagger documentation route
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Subscription Tracker API!");
});

// Error handling middleware - must be last
app.use(errorMiddleware);

// Initialize database connections when not in Lambda environment
// This allows the app to be run locally or in Lambda
if (process.env.NODE_ENV !== 'lambda') {
  const startServer = async () => {
    try {
      await connectDB();
      await connectRedis();
      
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
} else {
  // For Lambda, initialize connections on cold start
  (async () => {
    try {
      await connectDB();
      await connectRedis();
      console.log('Database connections established in Lambda environment');
    } catch (error) {
      console.error('Failed to establish database connections:', error);
    }
  })();
}

export default app;
