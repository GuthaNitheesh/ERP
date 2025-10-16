import { Router } from 'express';
import tenantController from '../controllers/tenantController';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permission';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get(
  '/',
  requirePermission('tenants', 'read'),
  tenantController.getAllTenants
);

router.get(
  '/:id',
  requirePermission('tenants', 'read'),
  tenantController.getTenantById
);

router.post(
  '/',
  requirePermission('tenants', 'write'),
  tenantController.createTenant
);

router.patch(
  '/:id',
  requirePermission('tenants', 'write'),
  tenantController.updateTenant
);

router.delete(
  '/:id',
  requirePermission('tenants', 'delete'),
  tenantController.deleteTenant
);

router.patch(
  '/:id/deactivate',
  requirePermission('tenants', 'write'),
  tenantController.deactivateTenant
);

router.patch(
  '/:id/activate',
  requirePermission('tenants', 'write'),
  tenantController.activateTenant
);

export default router;

