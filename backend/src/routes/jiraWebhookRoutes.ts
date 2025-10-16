import { Router } from 'express';
import jiraWebhookController from '../controllers/jiraWebhookController';

const router = Router();

// Webhooks are public (Jira sends them)
// You should add webhook secret verification in production
router.post('/jira', jiraWebhookController.handleWebhook);
router.post('/jira/issue-created', jiraWebhookController.handleIssueCreated);
router.post('/jira/issue-updated', jiraWebhookController.handleIssueUpdated);
router.post('/jira/comment-added', jiraWebhookController.handleCommentAdded);

export default router;

