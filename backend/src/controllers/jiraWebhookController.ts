import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

/**
 * Jira Webhook Controller
 * Handles webhooks from Jira for bi-directional synchronization
 */
export class JiraWebhookController {
  /**
   * Handle issue created webhook
   */
  async handleIssueCreated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { issue, user } = req.body;

      logger.info('Jira webhook - Issue created:', {
        key: issue?.key,
        summary: issue?.fields?.summary,
        createdBy: user?.displayName,
      });

      // TODO: Add your business logic here
      // Example: If issue is related to RFQ, update RFQ status in database

      res.status(200).json({
        status: 'success',
        message: 'Webhook processed',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle issue updated webhook
   */
  async handleIssueUpdated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { issue, changelog, user } = req.body;

      logger.info('Jira webhook - Issue updated:', {
        key: issue?.key,
        changes: changelog?.items?.map((item: any) => ({
          field: item.field,
          from: item.fromString,
          to: item.toString,
        })),
        updatedBy: user?.displayName,
      });

      // Check if status changed
      const statusChange = changelog?.items?.find((item: any) => item.field === 'status');

      if (statusChange) {
        logger.info(`Issue ${issue.key} status changed: ${statusChange.fromString} → ${statusChange.toString}`);
        
        // TODO: Sync status back to your database
        // Example: Update RFQ status if linked to Jira issue
      }

      res.status(200).json({
        status: 'success',
        message: 'Webhook processed',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle comment added webhook
   */
  async handleCommentAdded(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { comment, issue, user } = req.body;

      logger.info('Jira webhook - Comment added:', {
        issue: issue?.key,
        author: user?.displayName,
        comment: comment?.body?.substring(0, 100),
      });

      // TODO: Notify relevant users or sync to database

      res.status(200).json({
        status: 'success',
        message: 'Webhook processed',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generic webhook handler
   */
  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { webhookEvent, issue } = req.body;

      logger.info('Jira webhook received:', {
        event: webhookEvent,
        issueKey: issue?.key,
      });

      // Route to specific handlers based on event type
      switch (webhookEvent) {
        case 'jira:issue_created':
          return this.handleIssueCreated(req, res, next);
        case 'jira:issue_updated':
          return this.handleIssueUpdated(req, res, next);
        case 'comment_created':
          return this.handleCommentAdded(req, res, next);
        default:
          logger.info(`Unhandled webhook event: ${webhookEvent}`);
      }

      res.status(200).json({
        status: 'success',
        message: 'Webhook received',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new JiraWebhookController();

