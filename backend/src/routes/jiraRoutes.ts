import { Router } from 'express';
import jiraController from '../controllers/jiraController';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/permission';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Health check (anyone authenticated)
router.get('/health', jiraController.checkJiraHealth);

// Bug reports (anyone authenticated can report bugs)
router.post('/bugs', jiraController.createBugReport);

// Support tickets (anyone authenticated)
router.post('/support/tickets', jiraController.createSupportTicket);
router.get('/support/my-tickets', jiraController.getMyTickets);

// Feature requests (anyone authenticated)
router.post('/features', jiraController.createFeatureRequest);

// Get all bugs (tech/admin only)
router.get(
  '/bugs',
  requireRole('tech', 'admin'),
  jiraController.getAllBugs
);

// Get issue details (anyone authenticated)
router.get('/issues/:issueKey', jiraController.getIssue);

// Add comment to issue (anyone authenticated)
router.post('/issues/:issueKey/comments', jiraController.addComment);

export default router;

