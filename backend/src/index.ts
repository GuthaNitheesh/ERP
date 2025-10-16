import dotenv from 'dotenv';
import path from 'path';
import app from './app';
import connectDB from './config/database';
import { connectRedis } from './config/redis';
import { initCasbin } from './casbin/enforcer';
import { initJira } from './config/jira';
import logger from './config/logger';
import fs from 'fs';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis (optional)
    await connectRedis().catch((err) => {
      logger.warn('Redis connection failed, continuing without Redis:', err.message);
    });

    // Initialize Casbin
    await initCasbin();

    // Initialize Jira (optional)
    initJira();

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`API Version: ${process.env.API_VERSION || 'v1'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();

