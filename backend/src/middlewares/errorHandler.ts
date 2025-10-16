import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../config/logger';
import jiraService from '../services/jiraService';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    // Operational errors - send to client
    logger.error(`Operational error: ${err.message}`, {
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });

    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    // Programming or unknown errors
    logger.error('Unexpected error:', {
      error: err,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    // Auto-create Jira bug report for server errors (500+)
    if (jiraService.isAvailable() && process.env.NODE_ENV === 'production') {
      jiraService.createBugReport({
        summary: `Server Error: ${err.message}`,
        description: `An unexpected error occurred in the system.`,
        errorStack: err.stack,
        endpoint: `${req.method} ${req.path}`,
        priority: 'Critical',
      }).catch((jiraErr) => {
        logger.error('Failed to create Jira bug report:', jiraErr);
      });
    }

    // Don't leak error details in production
    const message =
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message;

    res.status(500).json({
      status: 'error',
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  }
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
};

