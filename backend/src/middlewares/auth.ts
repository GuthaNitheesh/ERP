import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { AuthenticationError } from '../utils/errors';
import User from '../models/User';
import logger from '../config/logger';

export interface AuthRequest extends Request {
  user?: JWTPayload & { _id: string };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie
    const token = req.cookies?.jwt;

    if (!token) {
      throw new AuthenticationError('No authentication token provided');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new AuthenticationError('User no longer exists or is inactive');
    }

    // Attach user to request
    req.user = {
      ...decoded,
      _id: decoded.userId,
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      logger.error('Authentication error:', error);
      next(new AuthenticationError('Invalid authentication token'));
    }
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.jwt;

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = {
          ...decoded,
          _id: decoded.userId,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

