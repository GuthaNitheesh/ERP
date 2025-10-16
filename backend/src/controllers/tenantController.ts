import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import tenantService from '../services/tenantService';

export class TenantController {
  async getAllTenants(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, isActive } = req.query;

      const filters: any = {};
      if (type) filters.type = type;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const tenants = await tenantService.getAllTenants(filters);

      res.status(200).json({
        status: 'success',
        results: tenants.length,
        data: {
          tenants,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getTenantById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await tenantService.getTenantById(req.params.id);

      res.status(200).json({
        status: 'success',
        data: {
          tenant,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createTenant(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantData = {
        ...req.body,
        createdBy: req.user!._id,
      };

      const tenant = await tenantService.createTenant(tenantData);

      res.status(201).json({
        status: 'success',
        data: {
          tenant: {
            id: tenant._id,
            name: tenant.name,
            type: tenant.type,
            organizationName: tenant.organizationName,
            email: tenant.email,
            phone: tenant.phone,
            address: tenant.address,
            isActive: tenant.isActive,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTenant(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await tenantService.updateTenant(req.params.id, req.body);

      res.status(200).json({
        status: 'success',
        data: {
          tenant,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTenant(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await tenantService.deleteTenant(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateTenant(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await tenantService.deactivateTenant(req.params.id);

      res.status(200).json({
        status: 'success',
        data: {
          tenant,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async activateTenant(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await tenantService.activateTenant(req.params.id);

      res.status(200).json({
        status: 'success',
        data: {
          tenant,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TenantController();

