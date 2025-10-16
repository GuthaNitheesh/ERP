import { createClient } from 'redis';
import logger from './logger';

// Use REDIS_URL if available (for cloud Redis with TLS), otherwise use individual config
const redisClient = process.env.REDIS_URL
  ? createClient({
      url: process.env.REDIS_URL,
    })
  : createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        tls: process.env.REDIS_TLS === 'true',
      },
      password: process.env.REDIS_PASSWORD || undefined,
      username: process.env.REDIS_USERNAME || undefined,
    });

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis reconnecting...');
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

export const connectRedis = async (): Promise<void> => {
  try {
    // Only attempt connection if not already connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
      logger.info('Redis connection initiated');
    }
  } catch (error: any) {
    logger.error('Redis connection failed:', error.message);
    // Don't exit process - Redis is optional for basic functionality
    // Stop reconnection attempts
    try {
      await redisClient.disconnect();
    } catch (disconnectError) {
      // Ignore disconnect errors
    }
  }
};

export default redisClient;

