import JiraClient from 'jira-client';
import logger from './logger';

let jiraClient: JiraClient | null = null;

export const initJira = (): JiraClient | null => {
  try {
    // Check if Jira is configured
    if (!process.env.JIRA_HOST || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
      logger.warn('Jira not configured. Set JIRA_HOST, JIRA_EMAIL, and JIRA_API_TOKEN in .env');
      return null;
    }

    jiraClient = new JiraClient({
      protocol: 'https',
      host: process.env.JIRA_HOST, // e.g., yourcompany.atlassian.net
      username: process.env.JIRA_EMAIL,
      password: process.env.JIRA_API_TOKEN, // API token, not password
      apiVersion: '2',
      strictSSL: true,
    });

    logger.info('Jira client initialized successfully');
    return jiraClient;
  } catch (error) {
    logger.error('Failed to initialize Jira client:', error);
    return null;
  }
};

export const getJiraClient = (): JiraClient | null => {
  return jiraClient;
};

export default { initJira, getJiraClient };

