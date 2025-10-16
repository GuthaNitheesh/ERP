import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import jiraService from '../services/jiraService';
import { ValidationError } from '../utils/errors';

export class JiraController {
  /**
   * Create a bug report
   */
  async createBugReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!jiraService.isAvailable()) {
        res.status(503).json({
          status: 'error',
          message: 'Jira integration is not configured',
        });
        return;
      }

      const { summary, description, errorStack, endpoint, priority } = req.body;

      if (!summary || !description) {
        throw new ValidationError('Summary and description are required');
      }

      const issue = await jiraService.createBugReport({
        summary,
        description,
        errorStack,
        userEmail: req.user?.email,
        endpoint,
        priority,
      });

      res.status(201).json({
        status: 'success',
        data: {
          issue: {
            key: issue?.key,
            id: issue?.id,
            self: issue?.self,
          },
        },
        message: 'Bug report created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a support ticket
   */
  async createSupportTicket(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!jiraService.isAvailable()) {
        res.status(503).json({
          status: 'error',
          message: 'Jira integration is not configured',
        });
        return;
      }

      const { summary, description, category, priority } = req.body;

      if (!summary || !description) {
        throw new ValidationError('Summary and description are required');
      }

      const issue = await jiraService.createSupportTicket({
        summary,
        description,
        customerEmail: req.user!.email,
        customerName: req.user!.email, // Use email as name since firstName/lastName not in JWT
        tenantName: req.user!.tenantId?.toString(),
        category,
        priority,
      });

      res.status(201).json({
        status: 'success',
        data: {
          issue: {
            key: issue?.key,
            id: issue?.id,
          },
        },
        message: 'Support ticket created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a feature request
   */
  async createFeatureRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!jiraService.isAvailable()) {
        res.status(503).json({
          status: 'error',
          message: 'Jira integration is not configured',
        });
        return;
      }

      const { summary, description } = req.body;

      if (!summary || !description) {
        throw new ValidationError('Summary and description are required');
      }

      const requestedBy = `${req.user!.email}`;

      const issue = await jiraService.createFeatureRequest(summary, description, requestedBy);

      res.status(201).json({
        status: 'success',
        data: {
          issue: {
            key: issue?.key,
            id: issue?.id,
          },
        },
        message: 'Feature request submitted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get my support tickets
   */
  async getMyTickets(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!jiraService.isAvailable()) {
        res.status(200).json({
          status: 'success',
          data: { tickets: [] },
          message: 'Jira integration is not configured',
        });
        return;
      }

      const tickets = await jiraService.getCustomerTickets(req.user!.email);

      res.status(200).json({
        status: 'success',
        results: tickets.length,
        data: {
          tickets,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all bugs (tech/admin only)
   */
  async getAllBugs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!jiraService.isAvailable()) {
        res.status(200).json({
          status: 'success',
          data: { bugs: [] },
          message: 'Jira integration is not configured',
        });
        return;
      }

      const { status } = req.query;
      const bugs = await jiraService.getAllBugs(status as string);

      res.status(200).json({
        status: 'success',
        results: bugs.length,
        data: {
          bugs,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add comment to issue
   */
  async addComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!jiraService.isAvailable()) {
        res.status(503).json({
          status: 'error',
          message: 'Jira integration is not configured',
        });
        return;
      }

      const { issueKey } = req.params;
      const { comment } = req.body;

      if (!comment) {
        throw new ValidationError('Comment is required');
      }

      const result = await jiraService.addComment(
        issueKey,
        `*Comment from ${req.user!.email}:*\n\n${comment}`
      );

      res.status(200).json({
        status: 'success',
        data: { result },
        message: 'Comment added successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get issue details
   */
  async getIssue(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!jiraService.isAvailable()) {
        res.status(503).json({
          status: 'error',
          message: 'Jira integration is not configured',
        });
        return;
      }

      const { issueKey } = req.params;
      const issue = await jiraService.getIssue(issueKey);

      if (!issue) {
        res.status(404).json({
          status: 'error',
          message: 'Issue not found',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: { issue },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Health check for Jira integration
   */
  async checkJiraHealth(_req: AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    try {
      const isAvailable = jiraService.isAvailable();

      if (!isAvailable) {
        res.status(200).json({
          status: 'warning',
          message: 'Jira integration is not configured',
          configured: false,
        });
        return;
      }

      // Try to get project info to verify connection
      const project = await jiraService.getProject();

      res.status(200).json({
        status: 'success',
        message: 'Jira integration is healthy',
        configured: true,
        data: {
          project: {
            key: project?.key,
            name: project?.name,
          },
        },
      });
    } catch (error) {
      res.status(200).json({
        status: 'error',
        message: 'Jira is configured but connection failed',
        configured: true,
        error: (error as Error).message,
      });
    }
  }
}

export default new JiraController();

