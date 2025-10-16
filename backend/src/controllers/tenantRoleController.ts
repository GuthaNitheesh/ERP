import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import tenantRoleService from '../services/tenantRoleService';
import { AuthorizationError } from '../utils/errors';

export class TenantRoleController {
  async getAllRoles(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, isActive } = req.query;

      const filters: any = {};

      // Non-tech users can only see roles from their own tenant
      if (req.user!.globalRole !== 'tech') {
        if (!req.user!.tenantId) {
          throw new AuthorizationError('You must belong to a tenant to view roles');
        }
        filters.tenantId = req.user!.tenantId;
      } else if (tenantId) {
        // Tech users can filter by specific tenant
        filters.tenantId = tenantId;
      }

      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      const roles = await tenantRoleService.getAllRoles(filters);

      res.status(200).json({
        status: 'success',
        results: roles.length,
        data: {
          roles,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getRoleById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await tenantRoleService.getRoleById(req.params.id);

      // Check if user has access to this role's tenant
      if (req.user!.globalRole !== 'tech') {
        if (!req.user!.tenantId || role.tenantId._id.toString() !== req.user!.tenantId.toString()) {
          throw new AuthorizationError('You do not have access to this role');
        }
      }

      res.status(200).json({
        status: 'success',
        data: {
          role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getRolesByTenant(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.params.tenantId;

      // Check if user has access to this tenant
      if (req.user!.globalRole !== 'tech') {
        if (!req.user!.tenantId || tenantId !== req.user!.tenantId.toString()) {
          throw new AuthorizationError('You do not have access to this tenant');
        }
      }

      const roles = await tenantRoleService.getRolesByTenantId(tenantId);

      res.status(200).json({
        status: 'success',
        results: roles.length,
        data: {
          roles,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createRole(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const roleData = {
        ...req.body,
        createdBy: req.user!._id,
      };

      // Non-tech users can only create roles in their own tenant
      if (req.user!.globalRole !== 'tech') {
        if (!req.user!.tenantId) {
          throw new AuthorizationError('You must belong to a tenant to create roles');
        }
        roleData.tenantId = req.user!.tenantId;
      }

      const role = await tenantRoleService.createRole(roleData);

      res.status(201).json({
        status: 'success',
        data: {
          role: {
            id: role._id,
            name: role.name,
            displayName: role.displayName,
            tenantId: role.tenantId,
            permissions: role.permissions,
            description: role.description,
            isActive: role.isActive,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // First get the role to check tenant ownership
      const existingRole = await tenantRoleService.getRoleById(req.params.id);

      // Check if user has access to this role's tenant
      if (req.user!.globalRole !== 'tech') {
        if (!req.user!.tenantId || existingRole.tenantId._id.toString() !== req.user!.tenantId.toString()) {
          throw new AuthorizationError('You do not have access to update this role');
        }
      }

      const role = await tenantRoleService.updateRole(req.params.id, req.body);

      res.status(200).json({
        status: 'success',
        data: {
          role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // First get the role to check tenant ownership
      const existingRole = await tenantRoleService.getRoleById(req.params.id);

      // Check if user has access to this role's tenant
      if (req.user!.globalRole !== 'tech') {
        if (!req.user!.tenantId || existingRole.tenantId._id.toString() !== req.user!.tenantId.toString()) {
          throw new AuthorizationError('You do not have access to delete this role');
        }
      }

      await tenantRoleService.deleteRole(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async addPermission(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roleId } = req.params;
      const { permission } = req.body;

      // First get the role to check tenant ownership
      const existingRole = await tenantRoleService.getRoleById(roleId);

      // Check if user has access to this role's tenant
      if (req.user!.globalRole !== 'tech') {
        if (!req.user!.tenantId || existingRole.tenantId._id.toString() !== req.user!.tenantId.toString()) {
          throw new AuthorizationError('You do not have access to modify this role');
        }
      }

      const role = await tenantRoleService.addPermission(roleId, permission);

      res.status(200).json({
        status: 'success',
        data: {
          role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async removePermission(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roleId } = req.params;
      const { permission } = req.body;

      // First get the role to check tenant ownership
      const existingRole = await tenantRoleService.getRoleById(roleId);

      // Check if user has access to this role's tenant
      if (req.user!.globalRole !== 'tech') {
        if (!req.user!.tenantId || existingRole.tenantId._id.toString() !== req.user!.tenantId.toString()) {
          throw new AuthorizationError('You do not have access to modify this role');
        }
      }

      const role = await tenantRoleService.removePermission(roleId, permission);

      res.status(200).json({
        status: 'success',
        data: {
          role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TenantRoleController();

