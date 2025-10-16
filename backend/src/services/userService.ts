import User, { IUser } from '../models/User';
import { NotFoundError, ConflictError } from '../utils/errors';
import logger from '../config/logger';

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  globalRole: 'tech' | 'admin' | 'customer_admin' | 'vendor_admin';
  tenantId?: string;
  tenantRoleId?: string;
  createdBy: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  tenantRoleId?: string;
  isActive?: boolean;
}

export class UserService {
  async getAllUsers(filters: any = {}): Promise<IUser[]> {
    try {
      const users = await User.find(filters)
        .populate('tenantId')
        .populate('tenantRoleId')
        .sort({ createdAt: -1 });

      return users;
    } catch (error) {
      logger.error('Get all users error:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<IUser> {
    try {
      const user = await User.findById(userId)
        .populate('tenantId')
        .populate('tenantRoleId');

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Get user by ID error:', error);
      throw error;
    }
  }

  async createUser(data: CreateUserDTO): Promise<IUser> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      const user = await User.create(data);

      logger.info(`User created: ${user.email} by ${data.createdBy}`);

      return user;
    } catch (error) {
      logger.error('Create user error:', error);
      throw error;
    }
  }

  async updateUser(userId: string, data: UpdateUserDTO): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: data },
        { new: true, runValidators: true }
      )
        .populate('tenantId')
        .populate('tenantRoleId');

      if (!user) {
        throw new NotFoundError('User not found');
      }

      logger.info(`User updated: ${user.email}`);

      return user;
    } catch (error) {
      logger.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      logger.info(`User deleted: ${user.email}`);
    } catch (error) {
      logger.error('Delete user error:', error);
      throw error;
    }
  }

  async getUsersByTenant(tenantId: string): Promise<IUser[]> {
    try {
      const users = await User.find({ tenantId })
        .populate('tenantRoleId')
        .sort({ createdAt: -1 });

      return users;
    } catch (error) {
      logger.error('Get users by tenant error:', error);
      throw error;
    }
  }

  async assignTenantRole(userId: string, tenantRoleId: string | null): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { tenantRoleId } },
        { new: true, runValidators: true }
      )
        .populate('tenantId')
        .populate('tenantRoleId');

      if (!user) {
        throw new NotFoundError('User not found');
      }

      logger.info(`Tenant role assigned to user: ${user.email}`);

      return user;
    } catch (error) {
      logger.error('Assign tenant role error:', error);
      throw error;
    }
  }
}

export default new UserService();

