import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AuthorizationError, AuthenticationError } from '../utils/errors';
import { checkPermission } from '../casbin/enforcer';
import tenantRoleService from '../services/tenantRoleService';
import logger from '../config/logger';

export const requirePermission = (resource: string, action: string) => {
  return async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      const { globalRole } = req.user;

      // Check permission with Casbin
      const hasPermission = await checkPermission(globalRole, resource, action);

      if (!hasPermission) {
        logger.warn(
          `Permission denied: ${globalRole} tried to ${action} ${resource}`
        );
        throw new AuthorizationError(
          `You don't have permission to ${action} ${resource}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      const { globalRole } = req.user;

      if (!allowedRoles.includes(globalRole)) {
        throw new AuthorizationError(
          `Access restricted to roles: ${allowedRoles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireTenantAccess = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const { globalRole, tenantId } = req.user;

    // Tech users have access to all tenants
    if (globalRole === 'tech') {
      return next();
    }

    // Other users must have a tenantId
    if (!tenantId) {
      throw new AuthorizationError('Tenant access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Level 2 Permission Check - Tenant Role Permissions
 * Checks if user's tenant role has specific permission
 * This is checked AFTER Casbin (Level 1) permissions
 */
export const requireTenantPermission = (...permissions: string[]) => {
  return async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      const { globalRole, tenantRoleId } = req.user;

      // Tech users bypass tenant role permissions (they have full access)
      if (globalRole === 'tech') {
        return next();
      }

      // If user is tenant admin (no tenantRoleId), they have all permissions
      if (!tenantRoleId) {
        // Tenant admins (customer_admin, vendor_admin, admin without role) have full access to their tenant
        return next();
      }

      // Check if user's tenant role has required permissions
      let hasAllPermissions = true;

      for (const permission of permissions) {
        const hasPermission = await tenantRoleService.checkRolePermission(
          tenantRoleId.toString(),
          permission
        );

        if (!hasPermission) {
          hasAllPermissions = false;
          logger.warn(
            `Tenant permission denied: User with role ${tenantRoleId} tried to access ${permission}`
          );
          break;
        }
      }

      if (!hasAllPermissions) {
        throw new AuthorizationError(
          `You don't have the required permissions: ${permissions.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

