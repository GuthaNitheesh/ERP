import Tenant, { ITenant } from '../models/Tenant';
import { NotFoundError, ConflictError } from '../utils/errors';
import logger from '../config/logger';

export interface CreateTenantDTO {
  name: string;
  type: 'admin' | 'customer' | 'vendor' | 'tech';
  organizationName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  metadata?: Record<string, any>;
  createdBy: string;
}

export interface UpdateTenantDTO {
  organizationName?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export class TenantService {
  async getAllTenants(filters: any = {}): Promise<ITenant[]> {
    try {
      const query: any = {};

      if (filters.type) {
        query.type = filters.type;
      }

      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      const tenants = await Tenant.find(query)
        .populate('createdBy', 'email firstName lastName')
        .sort({ createdAt: -1 });

      return tenants;
    } catch (error) {
      logger.error('Get all tenants error:', error);
      throw error;
    }
  }

  async getTenantById(tenantId: string): Promise<ITenant> {
    try {
      const tenant = await Tenant.findById(tenantId)
        .populate('createdBy', 'email firstName lastName');

      if (!tenant) {
        throw new NotFoundError('Tenant not found');
      }

      return tenant;
    } catch (error) {
      logger.error('Get tenant by ID error:', error);
      throw error;
    }
  }

  async createTenant(data: CreateTenantDTO): Promise<ITenant> {
    try {
      // Check if tenant with same name already exists
      const existingTenant = await Tenant.findOne({ name: data.name });
      if (existingTenant) {
        throw new ConflictError('Tenant with this name already exists');
      }

      const tenant = await Tenant.create(data);

      logger.info(`Tenant created: ${tenant.name} by ${data.createdBy}`);

      return tenant;
    } catch (error) {
      logger.error('Create tenant error:', error);
      throw error;
    }
  }

  async updateTenant(tenantId: string, data: UpdateTenantDTO): Promise<ITenant> {
    try {
      const tenant = await Tenant.findByIdAndUpdate(
        tenantId,
        { $set: data },
        { new: true, runValidators: true }
      ).populate('createdBy', 'email firstName lastName');

      if (!tenant) {
        throw new NotFoundError('Tenant not found');
      }

      logger.info(`Tenant updated: ${tenant.name}`);

      return tenant;
    } catch (error) {
      logger.error('Update tenant error:', error);
      throw error;
    }
  }

  async deleteTenant(tenantId: string): Promise<void> {
    try {
      const tenant = await Tenant.findByIdAndDelete(tenantId);

      if (!tenant) {
        throw new NotFoundError('Tenant not found');
      }

      logger.info(`Tenant deleted: ${tenant.name}`);
    } catch (error) {
      logger.error('Delete tenant error:', error);
      throw error;
    }
  }

  async deactivateTenant(tenantId: string): Promise<ITenant> {
    try {
      const tenant = await Tenant.findByIdAndUpdate(
        tenantId,
        { $set: { isActive: false } },
        { new: true }
      );

      if (!tenant) {
        throw new NotFoundError('Tenant not found');
      }

      logger.info(`Tenant deactivated: ${tenant.name}`);

      return tenant;
    } catch (error) {
      logger.error('Deactivate tenant error:', error);
      throw error;
    }
  }

  async activateTenant(tenantId: string): Promise<ITenant> {
    try {
      const tenant = await Tenant.findByIdAndUpdate(
        tenantId,
        { $set: { isActive: true } },
        { new: true }
      );

      if (!tenant) {
        throw new NotFoundError('Tenant not found');
      }

      logger.info(`Tenant activated: ${tenant.name}`);

      return tenant;
    } catch (error) {
      logger.error('Activate tenant error:', error);
      throw error;
    }
  }
}

export default new TenantService();

