# Casbin RBAC Implementation Guide

## Overview

Yes, **Casbin RBAC is fully implemented** in your EuroAsianNGroup ERP platform! This guide explains how it works, how users are created, and how it integrates with all four portals.

---

## 🏗️ Architecture

### Global Roles (4 Types)

Your system has **4 global roles** that define top-level access:

1. **`tech`** - Platform Super Admin (Developers)
   - Full access to everything across all tenants
   - Can create any type of user
   - Can manage all resources without restrictions

2. **`admin`** - Platform Owner (EuroAsianNGroup Employees)
   - Can create customer organizations and vendor organizations
   - Can manage platform-level operations
   - Cannot delete users (only read/write)

3. **`customer_admin`** - Ship Management Company Admin
   - Belongs to a **Customer Tenant**
   - Can create internal users/roles for their organization
   - Can create and manage RFQs (Request for Quotations)
   - Can view quotes from vendors

4. **`vendor_admin`** - Spare Parts Supplier Admin
   - Belongs to a **Vendor Tenant**
   - Can create internal users/roles for their organization
   - Can view RFQs and submit quotes
   - Can manage their quote submissions

---

## 🔐 How Casbin RBAC Works

### 1. Casbin Model Configuration

Located at: `backend/src/casbin/model.conf`

```conf
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
```

**Explanation:**
- **sub** = subject (user's global role: tech, admin, customer_admin, vendor_admin)
- **obj** = object/resource (users, tenants, roles, rfqs, quotes)
- **act** = action (read, write, delete)

### 2. Casbin Policies

Located at: `backend/src/casbin/policy.csv`

| Role | Resource | Actions |
|------|----------|---------|
| **tech** | users, tenants, roles, rfqs, quotes | read, write, delete |
| **admin** | users, tenants, roles, rfqs, quotes | read, write |
| **customer_admin** | users, roles, rfqs, quotes | read, write |
| **vendor_admin** | users, roles, rfqs, quotes | read, write |

**Key Differences:**
- Only `tech` can **delete** resources
- `customer_admin` can **write** RFQs but only **read** quotes
- `vendor_admin` can **write** quotes but only **read** RFQs
- No one can delete tenants except `tech`

### 3. Enforcement Flow

```
User Request
    ↓
JWT Authentication (checks if user is logged in)
    ↓
Extract globalRole from JWT token
    ↓
Casbin Enforcer checks: Can this role perform this action on this resource?
    ↓
If YES → Allow access
If NO → Return 403 Forbidden
```

### 4. Code Implementation

**Middleware:** `backend/src/middlewares/permission.ts`

```typescript
// Usage in routes
router.get('/', requirePermission('users', 'read'), userController.getAllUsers);
router.post('/', requirePermission('users', 'write'), userController.createUser);
router.delete('/:id', requirePermission('users', 'delete'), userController.deleteUser);
```

**How it works:**
1. `requirePermission('users', 'read')` middleware is called
2. It extracts the user's `globalRole` from the JWT token
3. Calls Casbin: `checkPermission(globalRole, 'users', 'read')`
4. Casbin checks the policy.csv file
5. Returns `true` or `false`
6. If `false`, throws `AuthorizationError`

---

## 👥 User Creation & Management

### Initial Setup (Seeding)

Run the seed script to create initial users:

```bash
npm run seed
```

This creates:
- **Tech User:** `tech@euroasiangroup.com` / `TechAdmin123!`
- **Admin User:** `admin@euroasiangroup.com` / `Admin123!`

### Creating Users via API

**Endpoint:** `POST /api/v1/users`

**Authentication Required:** Yes (JWT token in cookie or header)

**Who can create users?**
- `tech` → Can create any type of user
- `admin` → Can create admins, customer_admins, vendor_admins
- `customer_admin` → Can create users within their tenant
- `vendor_admin` → Can create users within their tenant

**Example Request:**

```json
POST /api/v1/users
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "globalRole": "customer_admin",
  "tenantId": "60d5ec49f1b2c72b8c8e4f1a"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4f1b",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "globalRole": "customer_admin",
      "tenantId": "60d5ec49f1b2c72b8c8e4f1a"
    }
  }
}
```

---

## 🌐 Portal Integration

### 1. Tech Portal (http://localhost:3000)

**Purpose:** Platform developers and super admins

**Features:**
- Full access to all features
- User management (CRUD)
- Tenant management
- System monitoring
- Can impersonate other roles

**Login:**
- Email: `tech@euroasiangroup.com`
- Password: `TechAdmin123!`

**Implementation:**
- Location: `frontend/tech-portal/`
- Authentication: JWT stored in HttpOnly cookie
- Protected routes with `<ProtectedRoute>` component

### 2. Admin Portal (http://localhost:3001)

**Purpose:** EuroAsianNGroup employees

**Features:**
- Create and manage customer/vendor organizations
- Platform-level operations
- User management (limited to their scope)

**Status:** Directory exists at `frontend/admin-portal/`

### 3. Customer Portal (http://localhost:3002)

**Purpose:** Ship management companies

**Features:**
- Create RFQs for spare parts
- Manage internal team/roles
- View and compare vendor quotes
- Track RFQ status

**Status:** Directory exists at `frontend/customer-portal/`

### 4. Vendor Portal (http://localhost:3003)

**Purpose:** Spare parts suppliers

**Features:**
- View available RFQs
- Submit quotes
- Manage internal team/roles
- Track quote status

**Status:** Directory exists at `frontend/vendor-portal/`

---

## 🔒 Access Control Examples

### Example 1: Tech User

**Logged in as:** `tech@euroasiangroup.com`

**Can do:**
- ✅ Read all users across all tenants
- ✅ Create users with any role
- ✅ Delete users
- ✅ Create/delete tenants
- ✅ Full CRUD on RFQs and quotes

### Example 2: Admin User

**Logged in as:** `admin@euroasiangroup.com`

**Can do:**
- ✅ Read all users
- ✅ Create customer/vendor admin users
- ✅ Create tenants (customer/vendor organizations)
- ✅ Read/write RFQs and quotes
- ❌ Cannot delete users or tenants

### Example 3: Customer Admin

**Logged in as:** `customer@shipcompany.com`

**Can do:**
- ✅ Read users in their tenant only
- ✅ Create users in their tenant
- ✅ Create and manage RFQs
- ✅ View quotes from vendors
- ❌ Cannot create RFQ responses (that's for vendors)
- ❌ Cannot access other tenants' data

### Example 4: Vendor Admin

**Logged in as:** `vendor@supplier.com`

**Can do:**
- ✅ Read users in their tenant only
- ✅ Create users in their tenant
- ✅ View RFQs from customers
- ✅ Submit and manage quotes
- ❌ Cannot create RFQs
- ❌ Cannot access other tenants' data

---

## 🔑 Authentication Flow

### 1. Login Process

```
User submits email/password
    ↓
Backend validates credentials
    ↓
Backend generates JWT token containing:
  - userId
  - email
  - globalRole
  - tenantId (if applicable)
  - tenantRoleId (if applicable)
    ↓
JWT stored in HttpOnly cookie
    ↓
Frontend receives user data
    ↓
User redirected to appropriate dashboard
```

### 2. Protected Route Access

```
User tries to access /users
    ↓
authenticate middleware checks JWT
    ↓
requirePermission('users', 'read') checks Casbin
    ↓
Casbin enforces: "Can this role read users?"
    ↓
If YES → Show users
If NO → 403 Forbidden
```

---

## 📊 Database Models

### User Model

```typescript
{
  email: string;
  password: string; // bcrypt hashed
  firstName: string;
  lastName: string;
  phone?: string;
  globalRole: 'tech' | 'admin' | 'customer_admin' | 'vendor_admin';
  tenantId?: ObjectId; // Required for customer_admin, vendor_admin
  tenantRoleId?: ObjectId; // Internal role within tenant
  isActive: boolean;
  lastLogin?: Date;
  createdBy?: ObjectId;
}
```

### Tenant Model

```typescript
{
  name: string;
  type: 'admin' | 'customer' | 'vendor';
  organizationName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  metadata?: object;
}
```

### TenantRole Model

```typescript
{
  name: string;
  displayName: string;
  tenantId: ObjectId;
  permissions: string[]; // e.g., ['create_rfq', 'view_quotes']
  description?: string;
  isActive: boolean;
}
```

---

## 🚀 API Endpoints

### Authentication

```
POST   /api/v1/auth/register  - Register new user
POST   /api/v1/auth/login     - Login user
GET    /api/v1/auth/me        - Get current user info
POST   /api/v1/auth/logout    - Logout user
```

### Users (Protected)

```
GET    /api/v1/users          - Get all users (requires: users:read)
GET    /api/v1/users/:id      - Get user by ID (requires: users:read)
POST   /api/v1/users          - Create user (requires: users:write)
PATCH  /api/v1/users/:id      - Update user (requires: users:write)
DELETE /api/v1/users/:id      - Delete user (requires: users:delete)
```

---

## 🛠️ How to Test Permissions

### 1. Login as Tech User

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tech@euroasiangroup.com",
    "password": "TechAdmin123!"
  }'
```

### 2. Create a User (Tech can do this)

```bash
curl -X POST http://localhost:5000/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=<YOUR_JWT_TOKEN>" \
  -d '{
    "email": "newuser@test.com",
    "password": "Test123!",
    "firstName": "New",
    "lastName": "User",
    "globalRole": "admin"
  }'
```

### 3. Try to Delete as Admin (Should fail)

```bash
# Login as admin first
curl -X DELETE http://localhost:5000/api/v1/users/<USER_ID> \
  -H "Cookie: jwt=<ADMIN_JWT_TOKEN>"

# Response: 403 Forbidden
# "You don't have permission to delete users"
```

---

## 📝 Key Files

| File | Purpose |
|------|---------|
| `backend/src/casbin/model.conf` | Casbin RBAC model definition |
| `backend/src/casbin/policy.csv` | Permission policies |
| `backend/src/casbin/enforcer.ts` | Casbin initialization & enforcement |
| `backend/src/middlewares/permission.ts` | Permission middleware |
| `backend/src/middlewares/auth.ts` | JWT authentication middleware |
| `backend/src/models/User.ts` | User database model |
| `backend/src/routes/userRoutes.ts` | User API routes with Casbin protection |

---

## ✅ Summary

**Yes, Casbin RBAC is fully implemented!**

**What works:**
- ✅ 4 global roles (tech, admin, customer_admin, vendor_admin)
- ✅ Resource-based permissions (users, tenants, roles, rfqs, quotes)
- ✅ Action-based access control (read, write, delete)
- ✅ JWT authentication with HttpOnly cookies
- ✅ Multi-tenant architecture
- ✅ Protected API routes
- ✅ User creation and management

**How to create users:**
1. Use the seed script for initial users
2. Use API endpoint `POST /api/v1/users`
3. Permissions checked automatically by Casbin

**Portal access:**
- Tech Portal: Full access (tech role)
- Admin Portal: Platform management (admin role)
- Customer Portal: RFQ management (customer_admin role)
- Vendor Portal: Quote management (vendor_admin role)

**Next Steps:**
1. Run `npm run seed` to create initial users
2. Start backend: `npm run dev:backend`
3. Start tech portal: `npm run dev:tech`
4. Login with `tech@euroasiangroup.com` / `TechAdmin123!`
5. Create additional users via API or UI

---

## 🔧 Customizing Permissions

To add new permissions, edit `backend/src/casbin/policy.csv`:

```csv
p, <role>, <resource>, <action>
```

Example - Allow admin to delete users:
```csv
p, admin, users, delete
```

After editing, restart the backend server for changes to take effect.

---

**Questions? Need help?**

Check the main README.md or PROJECT_SUMMARY.md for more details!

