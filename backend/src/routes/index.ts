import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import tenantRoutes from './tenantRoutes';
import tenantRoleRoutes from './tenantRoleRoutes';
import jiraRoutes from './jiraRoutes';
import jiraWebhookRoutes from './jiraWebhookRoutes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tenants', tenantRoutes);
router.use('/tenant-roles', tenantRoleRoutes);
router.use('/jira', jiraRoutes);
router.use('/webhooks', jiraWebhookRoutes);

export default router;

