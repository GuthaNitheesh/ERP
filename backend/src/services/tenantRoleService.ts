import TenantRole, { ITenantRole } from '../models/TenantRole';
import { NotFoundError, ConflictError } from '../utils/errors';
import logger from '../config/logger';

export interface CreateTenantRoleDTO {
  name: string;
  displayName: string;
  tenantId: string;
  permissions: string[];
  description?: string;
  createdBy: string;
}

export interface UpdateTenantRoleDTO {
  displayName?: string;
  permissions?: string[];
  description?: string;
  isActive?: boolean;
}

export class TenantRoleService {
  async getAllRoles(filters: any = {}): Promise<ITenantRole[]> {
    try {
      const query: any = {};

      if (filters.tenantId) {
        query.tenantId = filters.tenantId;
      }

      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      const roles = await TenantRole.find(query)
        .populate('tenantId', 'name organizationName type')
        .populate('createdBy', 'email firstName lastName')
        .sort({ createdAt: -1 });

      return roles;
    } catch (error) {
      logger.error('Get all tenant roles error:', error);
      throw error;
    }
  }

  async getRoleById(roleId: string): Promise<ITenantRole> {
    try {
      const role = await TenantRole.findById(roleId)
        .populate('tenantId', 'name organizationName type')
        .populate('createdBy', 'email firstName lastName');

      if (!role) {
        throw new NotFoundError('Tenant role not found');
      }

      return role;
    } catch (error) {
      logger.error('Get tenant role by ID error:', error);
      throw error;
    }
  }

  async getRolesByTenantId(tenantId: string): Promise<ITenantRole[]> {
    try {
      const roles = await TenantRole.find({ tenantId, isActive: true })
        .populate('createdBy', 'email firstName lastName')
        .sort({ createdAt: -1 });

      return roles;
    } catch (error) {
      logger.error('Get roles by tenant ID error:', error);
      throw error;
    }
  }

  async createRole(data: CreateTenantRoleDTO): Promise<ITenantRole> {
    try {
      // Check if role with same name exists in this tenant
      const existingRole = await TenantRole.findOne({
        name: data.name,
        tenantId: data.tenantId,
      });

      if (existingRole) {
        throw new ConflictError('Role with this name already exists in this tenant');
      }

      const role = await TenantRole.create(data);

      logger.info(`Tenant role created: ${role.name} for tenant ${role.tenantId} by ${data.createdBy}`);

      return role;
    } catch (error) {
      logger.error('Create tenant role error:', error);
      throw error;
    }
  }

  async updateRole(roleId: string, data: UpdateTenantRoleDTO): Promise<ITenantRole> {
    try {
      const role = await TenantRole.findByIdAndUpdate(
        roleId,
        { $set: data },
        { new: true, runValidators: true }
      )
        .populate('tenantId', 'name organizationName type')
        .populate('createdBy', 'email firstName lastName');

      if (!role) {
        throw new NotFoundError('Tenant role not found');
      }

      logger.info(`Tenant role updated: ${role.name}`);

      return role;
    } catch (error) {
      logger.error('Update tenant role error:', error);
      throw error;
    }
  }

  async deleteRole(roleId: string): Promise<void> {
    try {
      const role = await TenantRole.findByIdAndDelete(roleId);

      if (!role) {
        throw new NotFoundError('Tenant role not found');
      }

      logger.info(`Tenant role deleted: ${role.name}`);
    } catch (error) {
      logger.error('Delete tenant role error:', error);
      throw error;
    }
  }

  async checkRolePermission(roleId: string, permission: string): Promise<boolean> {
    try {
      const role = await TenantRole.findById(roleId);

      if (!role || !role.isActive) {
        return false;
      }

      return role.permissions.includes(permission);
    } catch (error) {
      logger.error('Check role permission error:', error);
      return false;
    }
  }

  async addPermission(roleId: string, permission: string): Promise<ITenantRole> {
    try {
      const role = await TenantRole.findById(roleId);

      if (!role) {
        throw new NotFoundError('Tenant role not found');
      }

      if (!role.permissions.includes(permission)) {
        role.permissions.push(permission);
        await role.save();
        logger.info(`Permission '${permission}' added to role ${role.name}`);
      }

      return role;
    } catch (error) {
      logger.error('Add permission error:', error);
      throw error;
    }
  }

  async removePermission(roleId: string, permission: string): Promise<ITenantRole> {
    try {
      const role = await TenantRole.findById(roleId);

      if (!role) {
        throw new NotFoundError('Tenant role not found');
      }

      role.permissions = role.permissions.filter((p) => p !== permission);
      await role.save();

      logger.info(`Permission '${permission}' removed from role ${role.name}`);

      return role;
    } catch (error) {
      logger.error('Remove permission error:', error);
      throw error;
    }
  }
}

export default new TenantRoleService();

