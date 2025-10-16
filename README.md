# EuroAsianNGroup ERP Platform

A high-load, production-ready SaaS ERP platform for maritime procurement with multi-tenant architecture, role-based access control (RBAC) using Casbin, and modern tech stack.

## 🏗️ Architecture Overview

This is a monorepo containing:
- **Backend**: Node.js + Express + MongoDB + Casbin RBAC
- **Frontend**: Multiple React portals (Tech, Admin, Customer, Vendor)
- **Shared Components**: Reusable UI library and utilities

### Key Features

- ✅ JWT-based authentication with HttpOnly cookies
- ✅ Casbin RBAC for fine-grained permissions
- ✅ Multi-tenant architecture
- ✅ Production-ready backend with logging, error handling, and rate limiting
- ✅ Shared component library for consistent UI
- ✅ Docker support for easy deployment
- ✅ Redis caching and job queues
- ✅ MongoDB with optimized indexes

## 📋 Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **MongoDB**: >= 7.0 (or use Docker)
- **Redis**: >= 7.0 (or use Docker, optional)
- **Docker** & **Docker Compose** (optional, for containerized deployment)

## 🚀 Getting Started

### Option 1: Local Development (Without Docker)

#### 1. Install Dependencies

```bash
npm run install:all
```

#### 2. Set Up Environment Variables

```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

#### 3. Start MongoDB and Redis Locally

Make sure MongoDB is running on `mongodb://localhost:27017` and Redis on `localhost:6379`.

Alternatively, update the connection strings in `backend/.env`.

#### 4. Seed Initial Data

```bash
npm run seed
```

This creates:
- Tech user: `tech@euroasiangroup.com` / `TechAdmin123!`
- Admin user: `admin@euroasiangroup.com` / `Admin123!`

#### 5. Start Development Servers

In separate terminals:

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Tech Portal
npm run dev:tech
```

The services will be available at:
- **Backend API**: http://localhost:5000
- **Tech Portal**: http://localhost:3000

### Option 2: Docker Deployment

#### 1. Start All Services with Docker Compose

```bash
npm run docker:up
```

This starts:
- MongoDB (port 27017)
- Redis (port 6379)
- Backend API (port 5000)

#### 2. Seed the Database

```bash
# Enter the backend container
docker exec -it euroasian-backend sh

# Run seed script
npm run seed
```

#### 3. Start Frontend Locally

```bash
npm run dev:tech
```

#### Stop Docker Services

```bash
npm run docker:down
```

## 📁 Project Structure

```
euroasiangroup-erp/
├── backend/                      # Node.js Express API
│   ├── src/
│   │   ├── casbin/              # Casbin RBAC configuration
│   │   ├── config/              # Database, Redis, Logger
│   │   ├── controllers/         # Request handlers
│   │   ├── middlewares/         # Auth, permissions, error handling
│   │   ├── models/              # MongoDB models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Utilities, validation
│   │   ├── scripts/             # Seed scripts
│   │   └── index.ts             # Entry point
│   ├── logs/                    # Application logs
│   ├── .env                     # Environment variables
│   └── package.json
│
├── frontend/
│   ├── tech-portal/             # Tech super-admin portal
│   ├── admin-portal/            # Platform admin portal (future)
│   ├── customer-portal/         # Customer portal (future)
│   └── vendor-portal/           # Vendor portal (future)
│
├── packages/
│   └── shared-components/       # Shared UI library
│       ├── src/
│       │   ├── api/            # API client
│       │   ├── components/     # Reusable components
│       │   ├── hooks/          # Custom hooks
│       │   └── theme/          # Theme & ThemeProvider
│       └── package.json
│
├── docker/
│   └── Dockerfile.backend       # Backend Docker image
│
├── docker-compose.yml           # Docker orchestration
└── package.json                 # Monorepo workspace config
```

## 🔐 Authentication & Authorization

### Global Roles

1. **Tech** - Global super-admin (platform developers)
   - Full access to all features and tenants
   - Can create Admins, Customers, Vendors, and Tech users

2. **Admin** - Platform owner (EuroAsianNGroup employees)
   - Can create Admin employees, Customer orgs, Vendor orgs
   - Manage platform-level operations

3. **Customer Admin** - Ship management company admin
   - Create internal roles/employees for their organization
   - Manage RFQs and quotes

4. **Vendor Admin** - Spare parts supplier admin
   - Create internal roles/employees for their organization
   - Submit quotes to RFQs

### Casbin RBAC Permissions

Casbin enforces resource-level permissions:

```
Resource: users, tenants, roles, rfqs, quotes
Action: read, write, delete
```

Example policies (see `backend/src/casbin/policy.csv`):
```
p, tech, users, read
p, tech, users, write
p, admin, tenants, write
p, customer_admin, rfqs, write
```

## 🗄️ Database Models

### User
- email, password (hashed), firstName, lastName
- globalRole: tech | admin | customer_admin | vendor_admin
- tenantId (for customer/vendor users)
- tenantRoleId (internal role within tenant)

### Tenant
- name, type (admin | customer | vendor)
- organizationName, email, phone, address
- isActive, metadata

### TenantRole
- name, displayName, tenantId
- permissions (array of strings)
- description, isActive

### RFQ (Request for Quotation)
- rfqNumber, customerTenantId
- title, description, items, status
- deadline, attachments

### Quote
- quoteNumber, rfqId, vendorTenantId
- items (with pricing), totalAmount, currency
- status, validUntil, terms

## 🌐 API Endpoints

### Authentication
```
POST   /api/v1/auth/register    - Register new user
POST   /api/v1/auth/login       - Login
GET    /api/v1/auth/me          - Get current user
POST   /api/v1/auth/logout      - Logout
```

### Users (Protected)
```
GET    /api/v1/users            - List users (with tenant filter)
GET    /api/v1/users/:id        - Get user by ID
POST   /api/v1/users            - Create user
PATCH  /api/v1/users/:id        - Update user
DELETE /api/v1/users/:id        - Delete user
```

### Health
```
GET    /api/v1/health           - API health check
```

All protected routes require:
1. Valid JWT token (HttpOnly cookie)
2. Casbin permission check

## 🧪 Testing

### Default Credentials

**Tech User:**
- Email: `tech@euroasiangroup.com`
- Password: `TechAdmin123!`

**Admin User:**
- Email: `admin@euroasiangroup.com`
- Password: `Admin123!`

### Testing the API

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tech@euroasiangroup.com","password":"TechAdmin123!"}' \
  --cookie-jar cookies.txt

# Get current user
curl http://localhost:5000/api/v1/auth/me \
  --cookie cookies.txt
```

## 🔧 Configuration

### Environment Variables

See `backend/.env.example` for all available options:

- `NODE_ENV` - development | production
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `REDIS_HOST`, `REDIS_PORT` - Redis configuration
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `ALLOWED_ORIGINS` - CORS allowed origins

### Security Best Practices

- ✅ HttpOnly cookies prevent XSS attacks
- ✅ Helmet.js for HTTP headers security
- ✅ Rate limiting prevents brute force
- ✅ CORS with credentials
- ✅ Password hashing with bcrypt
- ✅ Environment-based secrets
- ✅ Input validation with Joi

## 📦 Build & Deploy

### Build for Production

```bash
# Build backend
npm run build:backend

# Build shared components
npm run build:shared

# Build tech portal
npm run build:tech
```

### Docker Production Build

```bash
# Build backend image
docker build -f docker/Dockerfile.backend -t euroasian-backend:latest .

# Run with docker-compose
docker-compose up -d
```

### Environment for Production

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure proper MongoDB Atlas URI
4. Set up Redis for caching
5. Configure Sentry DSN for error tracking
6. Use proper CORS origins
7. Enable SSL/HTTPS

## 🛠️ Development Scripts

```bash
# Install all dependencies
npm run install:all

# Development
npm run dev:backend          # Start backend dev server
npm run dev:tech            # Start tech portal
npm run dev:admin           # Start admin portal
npm run dev:customer        # Start customer portal
npm run dev:vendor          # Start vendor portal

# Build
npm run build:backend       # Build backend
npm run build:tech          # Build tech portal
npm run build:shared        # Build shared components

# Docker
npm run docker:up           # Start all Docker services
npm run docker:down         # Stop all Docker services

# Database
npm run seed                # Seed initial data

# Testing
npm run test                # Run all tests
```

## 🚧 Roadmap (Future Milestones)

### Milestone 2
- [ ] Admin Portal implementation
- [ ] Tenant management UI
- [ ] Role management UI

### Milestone 3
- [ ] Customer Portal
- [ ] RFQ creation and management
- [ ] Quote viewing

### Milestone 4
- [ ] Vendor Portal
- [ ] Quote submission
- [ ] Bid management

### Milestone 5
- [ ] Email notifications
- [ ] File uploads (S3/MinIO)
- [ ] Advanced reporting & analytics
- [ ] Audit logs

## 📝 License

MIT

## 👥 Support

For issues and questions, please contact the development team.

---

**Built with ❤️ for EuroAsianNGroup**

