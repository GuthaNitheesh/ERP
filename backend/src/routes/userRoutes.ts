import { Router } from 'express';
import userController from '../controllers/userController';
import { authenticate } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permission';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get(
  '/',
  requirePermission('users', 'read'),
  userController.getAllUsers
);

router.get(
  '/:id',
  requirePermission('users', 'read'),
  userController.getUserById
);

router.post(
  '/',
  requirePermission('users', 'write'),
  userController.createUser
);

router.patch(
  '/:id',
  requirePermission('users', 'write'),
  userController.updateUser
);

router.delete(
  '/:id',
  requirePermission('users', 'delete'),
  userController.deleteUser
);

router.get(
  '/tenant/:tenantId',
  requirePermission('users', 'read'),
  userController.getUsersByTenant
);

router.patch(
  '/:userId/assign-role',
  requirePermission('users', 'write'),
  userController.assignTenantRole
);

export default router;

