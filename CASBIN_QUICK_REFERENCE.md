# Casbin RBAC Quick Reference

## 🚀 Quick Start

### 1. Seed Initial Users
```bash
cd /media/jay/DATA/EuroasiannGroupProd/euroasianngroupERP
npm run seed
```

**Default Users Created:**
- **Tech:** `tech@euroasiangroup.com` / `TechAdmin123!`
- **Admin:** `admin@euroasiangroup.com` / `Admin123!`

### 2. Start Backend
```bash
npm run dev:backend
# Server runs on http://localhost:5000
```

### 3. Start Frontend (Tech Portal)
```bash
npm run dev:tech
# Portal runs on http://localhost:3000
```

---

## 🔑 Global Roles

| Role | Description | Tenant Required? | Delete Access? |
|------|-------------|------------------|----------------|
| `tech` | Super Admin / Platform Developer | ❌ No | ✅ Yes |
| `admin` | Platform Owner (EuroAsianN Group) | ❌ No | ❌ No |
| `customer_admin` | Ship Management Company Admin | ✅ Yes | ❌ No |
| `vendor_admin` | Spare Parts Supplier Admin | ✅ Yes | ❌ No |

---

## 📊 Permission Matrix

### Resources
- `users` - User accounts
- `tenants` - Organizations (customer/vendor companies)
- `roles` - Tenant-specific roles
- `rfqs` - Request for Quotations
- `quotes` - Vendor quotes/proposals

### Actions
- `read` - View/list resources
- `write` - Create/update resources
- `delete` - Delete resources

### Who Can Do What?

```
tech            → read, write, delete on EVERYTHING
admin           → read, write on EVERYTHING (no delete)
customer_admin  → read, write on users, roles, rfqs, quotes (own tenant)
                  write on rfqs (create RFQs)
                  read only on quotes (view vendor responses)
vendor_admin    → read, write on users, roles, quotes (own tenant)
                  write on quotes (submit quotes)
                  read only on rfqs (view customer requests)
```

---

## 🌐 Portal URLs

| Portal | URL | For Role | Status |
|--------|-----|----------|--------|
| Tech Portal | http://localhost:3000 | `tech` | ✅ Running |
| Admin Portal | http://localhost:3001 | `admin` | 📁 Directory exists |
| Customer Portal | http://localhost:3002 | `customer_admin` | 📁 Directory exists |
| Vendor Portal | http://localhost:3003 | `vendor_admin` | 📁 Directory exists |

---

## 🛠️ API Endpoints

### Authentication (Public)

```bash
# Register
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "globalRole": "admin"
}

# Login
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "tech@euroasiangroup.com",
  "password": "TechAdmin123!"
}

# Get Current User
GET /api/v1/auth/me
Cookie: jwt=<token>

# Logout
POST /api/v1/auth/logout
Cookie: jwt=<token>
```

### Users (Protected)

```bash
# List all users (requires: users:read)
GET /api/v1/users
Cookie: jwt=<token>

# Get user by ID (requires: users:read)
GET /api/v1/users/:id
Cookie: jwt=<token>

# Create user (requires: users:write)
POST /api/v1/users
Cookie: jwt=<token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Doe",
  "globalRole": "customer_admin",
  "tenantId": "60d5ec49f1b2c72b8c8e4f1a"
}

# Update user (requires: users:write)
PATCH /api/v1/users/:id
Cookie: jwt=<token>
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name"
}

# Delete user (requires: users:delete - TECH ONLY)
DELETE /api/v1/users/:id
Cookie: jwt=<token>
```

---

## 🔍 Testing Permissions

### Test as Tech User
```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "tech@euroasiangroup.com",
    "password": "TechAdmin123!"
  }'

# Create user (should work)
curl -X POST http://localhost:5000/api/v1/users \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "globalRole": "admin"
  }'

# Delete user (should work)
curl -X DELETE http://localhost:5000/api/v1/users/<USER_ID> \
  -b cookies.txt
```

### Test as Admin User
```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c admin-cookies.txt \
  -d '{
    "email": "admin@euroasiangroup.com",
    "password": "Admin123!"
  }'

# Create user (should work)
curl -X POST http://localhost:5000/api/v1/users \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
  -d '{
    "email": "test2@example.com",
    "password": "Test123!",
    "firstName": "Test2",
    "lastName": "User",
    "globalRole": "customer_admin",
    "tenantId": "<TENANT_ID>"
  }'

# Delete user (should FAIL with 403)
curl -X DELETE http://localhost:5000/api/v1/users/<USER_ID> \
  -b admin-cookies.txt
# Response: "You don't have permission to delete users"
```

---

## 📝 Key Files

### Backend
```
backend/src/
├── casbin/
│   ├── model.conf          # Casbin RBAC model
│   ├── policy.csv          # Permission policies
│   └── enforcer.ts         # Casbin initialization
├── middlewares/
│   ├── auth.ts             # JWT authentication
│   └── permission.ts       # Casbin permission check
├── models/
│   ├── User.ts             # User model
│   ├── Tenant.ts           # Tenant model
│   └── TenantRole.ts       # Role model
├── routes/
│   ├── authRoutes.ts       # Auth endpoints
│   └── userRoutes.ts       # User endpoints (protected)
├── controllers/
│   ├── authController.ts   # Auth logic
│   └── userController.ts   # User CRUD logic
└── services/
    ├── authService.ts      # Auth business logic
    └── userService.ts      # User business logic
```

### Frontend
```
frontend/
├── tech-portal/            # For tech users
├── admin-portal/           # For admin users
├── customer-portal/        # For customer_admin users
└── vendor-portal/          # For vendor_admin users
```

---

## 🔧 Common Tasks

### Add New Permission

Edit `backend/src/casbin/policy.csv`:

```csv
# Format: p, role, resource, action
p, admin, users, delete
```

Restart backend for changes to take effect.

### Create New Resource Type

1. Add policies in `policy.csv`:
```csv
p, tech, products, read
p, tech, products, write
p, tech, products, delete
p, admin, products, read
p, admin, products, write
```

2. Use in routes:
```typescript
router.get('/products', requirePermission('products', 'read'), ...);
router.post('/products', requirePermission('products', 'write'), ...);
```

### Check User's Permissions Programmatically

```typescript
import { checkPermission } from '../casbin/enforcer';

const canDelete = await checkPermission('admin', 'users', 'delete');
// Returns: false (admin cannot delete users)

const canWrite = await checkPermission('admin', 'users', 'write');
// Returns: true (admin can create/update users)
```

---

## 🐛 Troubleshooting

### Issue: "Casbin enforcer not initialized"
**Solution:** Make sure backend is fully started. Casbin initializes on startup.

### Issue: "403 Forbidden" when accessing endpoint
**Solution:** 
1. Check your JWT token is valid
2. Verify your role has permission in `policy.csv`
3. Check backend logs for permission denial details

### Issue: User created but can't login
**Solution:** Check `isActive` field is `true` in MongoDB

### Issue: Can't create customer_admin without tenantId
**Solution:** Customer and vendor admins MUST have a tenantId. Create tenant first.

---

## 📚 Environment Variables

```bash
# Backend (.env)
NODE_ENV=development
PORT=5000
API_VERSION=v1

# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Redis
REDIS_URL=rediss://...
REDIS_HOST=oregon-keyvalue.render.com
REDIS_PORT=6379
REDIS_PASSWORD=...
REDIS_USERNAME=...
REDIS_TLS=true

# CORS
FRONTEND_TECH_URL=http://localhost:3000
FRONTEND_ADMIN_URL=http://localhost:3001
FRONTEND_CUSTOMER_URL=http://localhost:3002
FRONTEND_VENDOR_URL=http://localhost:3003
```

---

## 🎯 User Creation Rules

| Creator Role | Can Create |
|--------------|------------|
| `tech` | tech, admin, customer_admin, vendor_admin |
| `admin` | admin, customer_admin, vendor_admin |
| `customer_admin` | Users within their tenant only |
| `vendor_admin` | Users within their tenant only |

**Validation:**
- `customer_admin` and `vendor_admin` MUST have `tenantId`
- Email must be unique
- Password must be at least 8 characters
- All users need: email, password, firstName, lastName, globalRole

---

## 💡 Tips

1. **Always use `tech` user for initial setup** - Full access to everything
2. **Test permissions thoroughly** - Use different roles in Postman/curl
3. **Check logs** - Backend logs show permission denials with details
4. **Use HttpOnly cookies** - More secure than localStorage for JWT
5. **Tenant isolation is automatic** - Users only see their tenant's data (except tech)

---

## 🔗 Related Documentation

- [CASBIN_RBAC_GUIDE.md](./CASBIN_RBAC_GUIDE.md) - Complete guide
- [CASBIN_FLOW_DIAGRAM.md](./CASBIN_FLOW_DIAGRAM.md) - Visual diagrams
- [README.md](./README.md) - Main project documentation
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - What's implemented

---

**Need Help?** Check the main documentation or contact the development team!

