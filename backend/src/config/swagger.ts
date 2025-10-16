import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Request, Response } from 'express';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EuroAsianNGroup ERP API',
      version: '1.0.0',
      description: `
        Production-ready SaaS ERP platform for maritime procurement with:
        - Two-level RBAC (Casbin + Tenant Roles)
        - Multi-tenant architecture
        - Jira integration for issue tracking
        - JWT authentication
        - Redis caching
      `,
      contact: {
        name: 'EuroAsianNGroup',
        email: 'tech@euroasiangroup.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.euroasiangroup.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            globalRole: {
              type: 'string',
              enum: ['tech', 'admin', 'customer_admin', 'vendor_admin'],
            },
            tenantId: { type: 'string' },
            tenantRoleId: { type: 'string' },
            isActive: { type: 'boolean' },
            lastLogin: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Tenant: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            type: {
              type: 'string',
              enum: ['tech', 'admin', 'customer', 'vendor'],
            },
            organizationName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                country: { type: 'string' },
                postalCode: { type: 'string' },
              },
            },
            isActive: { type: 'boolean' },
          },
        },
        TenantRole: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            displayName: { type: 'string' },
            tenantId: { type: 'string' },
            permissions: {
              type: 'array',
              items: { type: 'string' },
            },
            description: { type: 'string' },
            isActive: { type: 'boolean' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Tenants',
        description: 'Tenant (organization) management',
      },
      {
        name: 'Tenant Roles',
        description: 'Custom role management per tenant',
      },
      {
        name: 'Jira Integration',
        description: 'Jira issue tracking and support tickets',
      },
      {
        name: 'Webhooks',
        description: 'Webhook endpoints for external integrations',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/models/*.ts',
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: any): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'EuroAsianNGroup ERP API Docs',
  }));

  // Swagger JSON
  app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default swaggerSpec;

