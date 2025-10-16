import { Response, NextFunction } from 'express';
import userService from '../services/userService';
import { AuthRequest } from '../middlewares/auth';

export class UserController {
  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: any = {};

      // Apply tenant filter for non-tech users
      if (req.user?.globalRole !== 'tech' && req.user?.tenantId) {
        filters.tenantId = req.user.tenantId;
      }

      const users = await userService.getAllUsers(filters);

      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users: users.map((user) => ({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            globalRole: user.globalRole,
            tenantId: user.tenantId,
            tenantRoleId: user.tenantRoleId,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            globalRole: user.globalRole,
            tenantId: user.tenantId,
            tenantRoleId: user.tenantRoleId,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = {
        ...req.body,
        createdBy: req.user!._id,
      };

      const user = await userService.createUser(userData);

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            globalRole: user.globalRole,
            tenantId: user.tenantId,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUser(req.params.id, req.body);

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            globalRole: user.globalRole,
            tenantId: user.tenantId,
            tenantRoleId: user.tenantRoleId,
            isActive: user.isActive,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteUser(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsersByTenant(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getUsersByTenant(req.params.tenantId);

      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async assignTenantRole(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { tenantRoleId } = req.body;

      const user = await userService.assignTenantRole(userId, tenantRoleId);

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();

