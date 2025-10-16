import { Router } from 'express';
import tenantRoleController from '../controllers/tenantRoleController';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permission';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get(
  '/',
  requirePermission('roles', 'read'),
  tenantRoleController.getAllRoles
);

router.get(
  '/tenant/:tenantId',
  requirePermission('roles', 'read'),
  tenantRoleController.getRolesByTenant
);

router.get(
  '/:id',
  requirePermission('roles', 'read'),
  tenantRoleController.getRoleById
);

router.post(
  '/',
  requirePermission('roles', 'write'),
  tenantRoleController.createRole
);

router.patch(
  '/:id',
  requirePermission('roles', 'write'),
  tenantRoleController.updateRole
);

router.delete(
  '/:id',
  requirePermission('roles', 'delete'),
  tenantRoleController.deleteRole
);

router.post(
  '/:roleId/permissions',
  requirePermission('roles', 'write'),
  tenantRoleController.addPermission
);

router.delete(
  '/:roleId/permissions',
  requirePermission('roles', 'write'),
  tenantRoleController.removePermission
);

export default router;

