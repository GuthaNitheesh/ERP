# 🚀 Quick Start Guide - EuroAsianNGroup ERP

## Get Up and Running in 5 Minutes!

### Prerequisites
- Node.js >= 18.0.0
- MongoDB running (local or cloud)
- Redis running (optional)

---

## Step 1: Install Dependencies
```bash
cd /media/jay/DATA/EuroasiannGroupProd/euroasianngroupERP
npm install
```

---

## Step 2: Seed Demo Data (All 4 Portals)
```bash
cd backend
npm run seed:complete
```

**This creates:**
- ✅ 4 Tenants (Tech, Admin, Customer, Vendor)
- ✅ 16 Custom Roles
- ✅ 12 Demo Users

---

## Step 3: Start Backend
```bash
npm run dev
```

**Backend runs on:** http://localhost:5000

---

## Step 4: Test Login

### Option A: Using cURL
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "tech@euroasiangroup.com",
    "password": "TechAdmin123!"
  }'
```

### Option B: Using Postman
1. Create POST request to `http://localhost:5000/api/v1/auth/login`
2. Set Body (raw JSON):
   ```json
   {
     "email": "tech@euroasiangroup.com",
     "password": "TechAdmin123!"
   }
   ```
3. Send!

---

## Step 5: Start Frontend (Tech Portal)
```bash
cd frontend/tech-portal
npm install
npm run dev
```

**Tech Portal runs on:** http://localhost:3000

**Login with:**
- Email: `tech@euroasiangroup.com`
- Password: `TechAdmin123!`

---

## 🎯 Quick Test Scenarios

### Test 1: View All Tenants (Tech User)
```bash
# Login first
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email": "tech@euroasiangroup.com", "password": "TechAdmin123!"}'

# Get all tenants
curl -X GET http://localhost:5000/api/v1/tenants -b cookies.txt
```

**Expected:** List of 4 tenants (tech, admin, customer, vendor)

---

### Test 2: View Tenant Roles
```bash
curl -X GET http://localhost:5000/api/v1/tenant-roles -b cookies.txt
```

**Expected:** List of all 16 custom roles

---

### Test 3: View All Users
```bash
curl -X GET http://localhost:5000/api/v1/users -b cookies.txt
```

**Expected:** List of all 12 demo users

---

### Test 4: Test Permission Denial (Admin Cannot Delete)
```bash
# Login as admin
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c admin-cookies.txt \
  -d '{"email": "admin@euroasiangroup.com", "password": "Admin123!"}'

# Try to delete a user (should fail)
curl -X DELETE http://localhost:5000/api/v1/users/<SOME_USER_ID> \
  -b admin-cookies.txt
```

**Expected:** 403 Forbidden - "You don't have permission to delete users"

---

## 📋 All Demo Accounts

### 📱 Tech Portal
```
tech@euroasiangroup.com         / TechAdmin123!    (Tenant Admin)
watchkeeper@euroasiangroup.com  / Watch123!        (Server Watchkeeper)
maintainer@euroasiangroup.com   / Maintain123!     (Maintainer)
```

### 🏢 Admin Portal
```
admin@euroasiangroup.com              / Admin123!   (Tenant Admin)
sales.manager@euroasiangroup.com      / Sales123!   (Sales Manager)
support@euroasiangroup.com            / Support123! (Support Staff)
```

### 🚢 Customer Portal
```
admin@abcshipping.com           / Customer123!  (Tenant Admin)
fleet.manager@abcshipping.com   / Fleet123!     (Fleet Manager)
procurement@abcshipping.com     / Procure123!   (Procurement Officer)
```

### 🔧 Vendor Portal
```
admin@xyzmarineparts.com              / Vendor123!     (Tenant Admin)
sales.manager@xyzmarineparts.com      / VSales123!     (Sales Manager)
sales@xyzmarineparts.com              / VSalesExec123! (Sales Executive)
```

---

## 🔍 Explore the System

### View Current User Info
```bash
curl -X GET http://localhost:5000/api/v1/auth/me -b cookies.txt
```

### Create a New Tenant (as Tech/Admin)
```bash
curl -X POST http://localhost:5000/api/v1/tenants \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "new-customer-org",
    "type": "customer",
    "organizationName": "New Customer Company",
    "email": "contact@newcustomer.com",
    "phone": "+1-555-NEW-CUST"
  }'
```

### Create a Custom Role (as any Tenant Admin)
```bash
# Login as customer admin
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c customer-cookies.txt \
  -d '{"email": "admin@abcshipping.com", "password": "Customer123!"}'

# Create custom role
curl -X POST http://localhost:5000/api/v1/tenant-roles \
  -H "Content-Type: application/json" \
  -b customer-cookies.txt \
  -d '{
    "name": "custom-role",
    "displayName": "Custom Role",
    "permissions": ["view_rfqs", "comment_rfqs"]
  }'
```

### Assign Role to User
```bash
curl -X PATCH http://localhost:5000/api/v1/users/<USER_ID>/assign-role \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"tenantRoleId": "<ROLE_ID>"}'
```

---

## 📚 Documentation

- **IMPLEMENTATION_COMPLETE.md** - What was implemented
- **DEMO_CREDENTIALS.md** - All demo account details
- **TWO_LEVEL_RBAC_EXPLAINED.md** - Architecture explanation
- **CASBIN_RBAC_GUIDE.md** - Casbin implementation
- **CASBIN_FLOW_DIAGRAM.md** - Visual diagrams

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Problem:** `Failed to connect to MongoDB`

**Solution:**
```bash
# Start MongoDB with Docker
docker-compose up -d mongodb

# Or update MONGODB_URI in backend/.env
```

### Redis Connection Warning
**Problem:** `Redis connection failed`

**Solution:** Redis is optional. Ignore warning or start Redis:
```bash
docker-compose up -d redis
```

### Seed Script Error
**Problem:** `Seed error: User already exists`

**Solution:** Clear database first:
```bash
# In MongoDB shell or Compass, drop the database
# Then run seed again
npm run seed:complete
```

---

## ✅ Verify Everything Works

### Health Check
```bash
curl http://localhost:5000/api/v1/health
```

**Expected:**
```json
{
  "status": "success",
  "message": "API is running",
  "timestamp": "2025-10-14T..."
}
```

### Check Casbin
Look for this in backend console:
```
[INFO] Casbin enforcer initialized successfully
```

### Check Database
```bash
# Login and check user count
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email": "tech@euroasiangroup.com", "password": "TechAdmin123!"}'

curl -X GET http://localhost:5000/api/v1/users -b cookies.txt | jq '.results'
```

**Expected:** 12 users

---

## 🎯 Next Steps

1. ✅ **Backend is ready!**
2. 🔨 **Build frontend UIs** for Admin, Customer, Vendor portals
3. 🚀 **Deploy** to production

---

## 🏆 You're Ready!

The complete two-level RBAC system is running with:
- ✅ 4 Portals
- ✅ 16 Custom Roles
- ✅ 12 Demo Users
- ✅ Full API
- ✅ Production-ready security

**Happy coding! 🎉**

