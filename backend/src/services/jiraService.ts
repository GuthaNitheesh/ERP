import { getJiraClient } from '../config/jira';
import logger from '../config/logger';

export interface CreateJiraIssueDTO {
  projectKey: string;
  summary: string;
  description: string;
  issueType: 'Bug' | 'Task' | 'Story' | 'Epic' | 'Support';
  priority?: 'Lowest' | 'Low' | 'Medium' | 'High' | 'Highest';
  assignee?: string;
  labels?: string[];
  customFields?: Record<string, any>;
}

export interface CreateBugReportDTO {
  summary: string;
  description: string;
  errorStack?: string;
  userEmail?: string;
  endpoint?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface CreateSupportTicketDTO {
  summary: string;
  description: string;
  customerEmail: string;
  customerName: string;
  tenantName?: string;
  category?: 'technical' | 'billing' | 'feature-request' | 'general';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface CreateRFQIssueDTO {
  rfqNumber: string;
  rfqTitle: string;
  customerName: string;
  customerEmail: string;
  deadline?: Date;
  description: string;
}

export class JiraService {
  private jiraClient = getJiraClient();
  private projectKey = process.env.JIRA_PROJECT_KEY || 'ERP';

  /**
   * Check if Jira is configured and available
   */
  isAvailable(): boolean {
    return this.jiraClient !== null;
  }

  /**
   * Create a generic Jira issue
   */
  async createIssue(data: CreateJiraIssueDTO): Promise<any> {
    if (!this.jiraClient) {
      logger.warn('Jira client not available, skipping issue creation');
      return null;
    }

    try {
      const issue = await this.jiraClient.addNewIssue({
        fields: {
          project: { key: data.projectKey },
          summary: data.summary,
          description: data.description,
          issuetype: { name: data.issueType },
          priority: data.priority ? { name: data.priority } : undefined,
          assignee: data.assignee ? { name: data.assignee } : undefined,
          labels: data.labels || [],
          ...data.customFields,
        },
      });

      logger.info(`Jira issue created: ${issue.key}`);
      return issue;
    } catch (error) {
      logger.error('Failed to create Jira issue:', error);
      throw error;
    }
  }

  /**
   * Create a bug report (for automatic error tracking)
   */
  async createBugReport(data: CreateBugReportDTO): Promise<any> {
    if (!this.jiraClient) {
      return null;
    }

    try {
      const description = `
*Bug Report*

*Summary:* ${data.summary}

*Description:*
${data.description}

${data.errorStack ? `*Stack Trace:*\n{code}\n${data.errorStack}\n{code}` : ''}

${data.userEmail ? `*Reported By:* ${data.userEmail}` : ''}
${data.endpoint ? `*Endpoint:* ${data.endpoint}` : ''}

*Environment:* ${process.env.NODE_ENV || 'development'}
*Timestamp:* ${new Date().toISOString()}
      `.trim();

      const priorityMap: Record<string, string> = {
        Low: 'Low',
        Medium: 'Medium',
        High: 'High',
        Critical: 'Highest',
      };

      const issue = await this.createIssue({
        projectKey: this.projectKey,
        summary: `[BUG] ${data.summary}`,
        description,
        issueType: 'Bug',
        priority: priorityMap[data.priority || 'Medium'] as any,
        labels: ['auto-generated', 'backend-error'],
      });

      return issue;
    } catch (error) {
      logger.error('Failed to create bug report:', error);
      return null;
    }
  }

  /**
   * Create a support ticket (for customer issues)
   */
  async createSupportTicket(data: CreateSupportTicketDTO): Promise<any> {
    if (!this.jiraClient) {
      return null;
    }

    try {
      const description = `
*Support Request*

*Customer:* ${data.customerName} (${data.customerEmail})
${data.tenantName ? `*Organization:* ${data.tenantName}` : ''}

*Category:* ${data.category || 'general'}

*Description:*
${data.description}

*Timestamp:* ${new Date().toISOString()}
      `.trim();

      const priorityMap: Record<string, string> = {
        Low: 'Low',
        Medium: 'Medium',
        High: 'High',
        Critical: 'Highest',
      };

      const issue = await this.createIssue({
        projectKey: this.projectKey,
        summary: `[SUPPORT] ${data.summary}`,
        description,
        issueType: 'Support',
        priority: priorityMap[data.priority || 'Medium'] as any,
        labels: ['support', 'customer-request', data.category || 'general'],
      });

      logger.info(`Support ticket created: ${issue?.key} for ${data.customerEmail}`);
      return issue;
    } catch (error) {
      logger.error('Failed to create support ticket:', error);
      return null;
    }
  }

  /**
   * Create RFQ tracking issue
   */
  async createRFQIssue(data: CreateRFQIssueDTO): Promise<any> {
    if (!this.jiraClient) {
      return null;
    }

    try {
      const description = `
*RFQ Created*

*RFQ Number:* ${data.rfqNumber}
*Customer:* ${data.customerName} (${data.customerEmail})
${data.deadline ? `*Deadline:* ${data.deadline.toISOString()}` : ''}

*Description:*
${data.description}

*Created:* ${new Date().toISOString()}
      `.trim();

      const issue = await this.createIssue({
        projectKey: this.projectKey,
        summary: `RFQ-${data.rfqNumber}: ${data.rfqTitle}`,
        description,
        issueType: 'Task',
        priority: 'Medium',
        labels: ['rfq', 'procurement', 'customer-request'],
      });

      logger.info(`RFQ Jira issue created: ${issue?.key} for RFQ ${data.rfqNumber}`);
      return issue;
    } catch (error) {
      logger.error('Failed to create RFQ issue:', error);
      return null;
    }
  }

  /**
   * Update issue status
   */
  async updateIssueStatus(issueKey: string, statusName: string): Promise<any> {
    if (!this.jiraClient) {
      return null;
    }

    try {
      const transitions = await this.jiraClient.listTransitions(issueKey);
      const transition = transitions.transitions.find(
        (t: any) => t.name.toLowerCase() === statusName.toLowerCase()
      );

      if (!transition) {
        logger.warn(`Transition '${statusName}' not found for issue ${issueKey}`);
        return null;
      }

      await this.jiraClient.transitionIssue(issueKey, {
        transition: { id: transition.id },
      });

      logger.info(`Issue ${issueKey} transitioned to ${statusName}`);
      return { issueKey, status: statusName };
    } catch (error) {
      logger.error('Failed to update issue status:', error);
      return null;
    }
  }

  /**
   * Add comment to issue
   */
  async addComment(issueKey: string, comment: string): Promise<any> {
    if (!this.jiraClient) {
      return null;
    }

    try {
      const result = await this.jiraClient.addComment(issueKey, comment);
      logger.info(`Comment added to issue ${issueKey}`);
      return result;
    } catch (error) {
      logger.error('Failed to add comment:', error);
      return null;
    }
  }

  /**
   * Get issue details
   */
  async getIssue(issueKey: string): Promise<any> {
    if (!this.jiraClient) {
      return null;
    }

    try {
      const issue = await this.jiraClient.findIssue(issueKey);
      return issue;
    } catch (error) {
      logger.error('Failed to get issue:', error);
      return null;
    }
  }

  /**
   * Search issues with JQL
   */
  async searchIssues(jql: string, maxResults: number = 50): Promise<any[]> {
    if (!this.jiraClient) {
      return [];
    }

    try {
      const result = await this.jiraClient.searchJira(jql, {
        maxResults,
        fields: ['summary', 'status', 'assignee', 'created', 'updated', 'priority'],
      });

      return result.issues || [];
    } catch (error) {
      logger.error('Failed to search issues:', error);
      return [];
    }
  }

  /**
   * Get all support tickets for a customer
   */
  async getCustomerTickets(customerEmail: string): Promise<any[]> {
    const jql = `project = ${this.projectKey} AND labels = "support" AND description ~ "${customerEmail}" ORDER BY created DESC`;
    return this.searchIssues(jql);
  }

  /**
   * Get all bugs in the system
   */
  async getAllBugs(status?: string): Promise<any[]> {
    let jql = `project = ${this.projectKey} AND issuetype = Bug`;
    if (status) {
      jql += ` AND status = "${status}"`;
    }
    jql += ' ORDER BY priority DESC, created DESC';
    
    return this.searchIssues(jql);
  }

  /**
   * Create feature request
   */
  async createFeatureRequest(
    summary: string,
    description: string,
    requestedBy: string
  ): Promise<any> {
    if (!this.jiraClient) {
      return null;
    }

    try {
      const fullDescription = `
*Feature Request*

*Requested By:* ${requestedBy}

*Description:*
${description}

*Timestamp:* ${new Date().toISOString()}
      `.trim();

      const issue = await this.createIssue({
        projectKey: this.projectKey,
        summary: `[FEATURE] ${summary}`,
        description: fullDescription,
        issueType: 'Story',
        priority: 'Medium',
        labels: ['feature-request', 'customer-feedback'],
      });

      return issue;
    } catch (error) {
      logger.error('Failed to create feature request:', error);
      return null;
    }
  }

  /**
   * Link issues (e.g., link RFQ issue to Quote issue)
   */
  async linkIssues(
    inwardIssue: string,
    outwardIssue: string,
    linkType: string = 'Relates'
  ): Promise<any> {
    if (!this.jiraClient) {
      return null;
    }

    try {
      const result = await this.jiraClient.issueLink({
        type: { name: linkType },
        inwardIssue: { key: inwardIssue },
        outwardIssue: { key: outwardIssue },
      });

      logger.info(`Linked issues: ${inwardIssue} ${linkType} ${outwardIssue}`);
      return result;
    } catch (error) {
      logger.error('Failed to link issues:', error);
      return null;
    }
  }

  /**
   * Assign issue to user
   */
  async assignIssue(issueKey: string, assignee: string): Promise<any> {
    if (!this.jiraClient) {
      return null;
    }

    try {
      await this.jiraClient.updateAssignee(issueKey, assignee);
      logger.info(`Issue ${issueKey} assigned to ${assignee}`);
      return { issueKey, assignee };
    } catch (error) {
      logger.error('Failed to assign issue:', error);
      return null;
    }
  }

  /**
   * Get project information
   */
  async getProject(projectKey?: string): Promise<any> {
    if (!this.jiraClient) {
      return null;
    }

    try {
      const key = projectKey || this.projectKey;
      const project = await this.jiraClient.getProject(key);
      return project;
    } catch (error) {
      logger.error('Failed to get project:', error);
      return null;
    }
  }

  /**
   * Get all projects
   */
  async getAllProjects(): Promise<any[]> {
    if (!this.jiraClient) {
      return [];
    }

    try {
      const projects = await this.jiraClient.listProjects();
      return projects;
    } catch (error) {
      logger.error('Failed to get projects:', error);
      return [];
    }
  }
}

export default new JiraService();

