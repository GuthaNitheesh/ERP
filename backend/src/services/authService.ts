import User, { IUser } from '../models/User';
import { generateToken, JWTPayload } from '../utils/jwt';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../utils/errors';
import logger from '../config/logger';

export interface RegisterUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  globalRole: 'tech' | 'admin' | 'customer_admin' | 'vendor_admin';
  tenantId?: string;
  tenantRoleId?: string;
  createdBy?: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterUserDTO): Promise<{ user: IUser; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Create user
      const user = await User.create(data);

      // Generate token
      const tokenPayload: JWTPayload = {
        userId: (user._id as any).toString(),
        email: user.email,
        globalRole: user.globalRole,
        tenantId: user.tenantId?.toString(),
        tenantRoleId: user.tenantRoleId?.toString(),
      };

      const token = generateToken(tokenPayload);

      logger.info(`User registered: ${user.email}`);

      return { user, token };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(data: LoginUserDTO): Promise<{ user: IUser; token: string }> {
    try {
      // Find user with password
      const user = await User.findOne({ email: data.email }).select('+password');

      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AuthenticationError('Account is inactive');
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(data.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const tokenPayload: JWTPayload = {
        userId: (user._id as any).toString(),
        email: user.email,
        globalRole: user.globalRole,
        tenantId: user.tenantId?.toString(),
        tenantRoleId: user.tenantRoleId?.toString(),
      };

      const token = generateToken(tokenPayload);

      logger.info(`User logged in: ${user.email}`);

      // Remove password from response
      user.password = undefined as any;

      return { user, token };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async getMe(userId: string): Promise<IUser> {
    try {
      const user = await User.findById(userId)
        .populate('tenantId')
        .populate('tenantRoleId');

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Get me error:', error);
      throw error;
    }
  }
}

export default new AuthService();

