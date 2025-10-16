# Demo Account Credentials - EuroAsianNGroup ERP Platform

## 🎯 Overview

This document contains all demo account credentials for the complete two-level RBAC system across all 4 portals.

**To seed the database with all demo accounts:**
```bash
cd /media/jay/DATA/EuroasiannGroupProd/euroasianngroupERP
npm run seed:complete
```

---

## 📱 TECH PORTAL
**URL:** http://localhost:3000  
**Organization:** EuroAsianNGroup Tech Team  
**Tenant Type:** `tech`

### Tenant Admin (Full Access)
- **Email:** `tech@euroasiangroup.com`
- **Password:** `TechAdmin123!`
- **Role:** Tenant Admin (no internal role)
- **Access:** Full platform access, can manage all tenants

### Server Watchkeeper
- **Email:** `watchkeeper@euroasiangroup.com`
- **Password:** `Watch123!`
- **Tenant Role:** Server Watchkeeper
- **Permissions:**
  - view_system_logs
  - monitor_servers
  - view_metrics
  - restart_services
  - view_alerts

### System Maintainer
- **Email:** `maintainer@euroasiangroup.com`
- **Password:** `Maintain123!`
- **Tenant Role:** Maintainer
- **Permissions:**
  - deploy_code
  - manage_infrastructure
  - update_dependencies
  - configure_services
  - backup_restore

---

## 🏢 ADMIN PORTAL
**URL:** http://localhost:3001  
**Organization:** EuroAsianNGroup Administration  
**Tenant Type:** `admin`

### Tenant Admin (Full Access)
- **Email:** `admin@euroasiangroup.com`
- **Password:** `Admin123!`
- **Role:** Tenant Admin (no internal role)
- **Access:** Can manage all customer/vendor organizations

### Sales Manager
- **Email:** `sales.manager@euroasiangroup.com`
- **Password:** `Sales123!`
- **Tenant Role:** Sales Manager
- **Permissions:**
  - view_all_tenants
  - create_tenants
  - edit_tenants
  - view_analytics
  - manage_sales_team
  - approve_deals

### Support Staff
- **Email:** `support@euroasiangroup.com`
- **Password:** `Support123!`
- **Tenant Role:** Support Staff
- **Permissions:**
  - view_tenants
  - view_users
  - view_support_tickets
  - respond_tickets
  - view_rfqs
  - view_quotes

---

## 🚢 CUSTOMER PORTAL
**URL:** http://localhost:3002  
**Organization:** ABC Shipping Company Ltd  
**Tenant Type:** `customer`

### Tenant Admin (Full Access)
- **Email:** `admin@abcshipping.com`
- **Password:** `Customer123!`
- **Name:** James Wilson
- **Role:** Tenant Admin (no internal role)
- **Access:** Full access to ABC Shipping organization

### Fleet Manager
- **Email:** `fleet.manager@abcshipping.com`
- **Password:** `Fleet123!`
- **Name:** Michael Roberts
- **Tenant Role:** Fleet Manager
- **Permissions:**
  - view_rfqs
  - create_rfqs
  - edit_rfqs
  - approve_rfqs
  - view_quotes
  - compare_quotes
  - select_quotes
  - manage_team

### Procurement Officer
- **Email:** `procurement@abcshipping.com`
- **Password:** `Procure123!`
- **Name:** Sarah Chen
- **Tenant Role:** Procurement Officer
- **Permissions:**
  - view_rfqs
  - create_rfqs
  - edit_rfqs
  - view_quotes
  - compare_quotes

---

## 🔧 VENDOR PORTAL
**URL:** http://localhost:3003  
**Organization:** XYZ Marine Parts Supplier Ltd  
**Tenant Type:** `vendor`

### Tenant Admin (Full Access)
- **Email:** `admin@xyzmarineparts.com`
- **Password:** `Vendor123!`
- **Name:** Robert Martinez
- **Role:** Tenant Admin (no internal role)
- **Access:** Full access to XYZ Marine Parts organization

### Sales Manager
- **Email:** `sales.manager@xyzmarineparts.com`
- **Password:** `VSales123!`
- **Name:** David Thompson
- **Tenant Role:** Sales Manager
- **Permissions:**
  - view_rfqs
  - view_rfq_details
  - create_quotes
  - edit_quotes
  - submit_quotes
  - approve_quotes
  - view_quote_history
  - manage_pricing
  - manage_team

### Sales Executive
- **Email:** `sales@xyzmarineparts.com`
- **Password:** `VSalesExec123!`
- **Name:** Linda Anderson
- **Tenant Role:** Sales Executive
- **Permissions:**
  - view_rfqs
  - view_rfq_details
  - create_quotes
  - edit_quotes
  - submit_quotes

---

## 📊 Summary

### Total Accounts Created:
- **Tenants:** 4 (Tech, Admin, Customer, Vendor)
- **Tenant Roles:** 16 custom roles
- **Users:** 12 demo users

### Account Types:
- **Tenant Admins:** 4 (full access to their organization)
- **Role-based Users:** 8 (with specific permissions)

---

## 🔐 Security Notes

### Password Format:
All passwords follow the pattern: `<Role>123!`
- Minimum 8 characters
- Contains uppercase, lowercase, numbers, and special characters
- **⚠️ CHANGE IN PRODUCTION!**

### Role Hierarchy:
1. **Tech (Super Admin):** Can access everything across all tenants
2. **Tenant Admins:** Full access within their organization
3. **Role-based Users:** Access based on their tenant role permissions

### Two-Level RBAC:
- **Level 1 (Casbin):** Global role permissions (tech, admin, customer_admin, vendor_admin)
- **Level 2 (Tenant Roles):** Organization-specific custom role permissions

---

## 🧪 Testing Scenarios

### Scenario 1: Tech User Full Access
Login as `tech@euroasiangroup.com` → Can view/manage all tenants, users, roles

### Scenario 2: Admin Portal Management
Login as `admin@euroasiangroup.com` → Can create customer/vendor organizations

### Scenario 3: Customer RFQ Creation
Login as `fleet.manager@abcshipping.com` → Can create RFQs for spare parts

### Scenario 4: Vendor Quote Submission
Login as `sales@xyzmarineparts.com` → Can view RFQs and submit quotes

### Scenario 5: Permission Testing
Login as `procurement@abcshipping.com` → Has limited permissions (cannot approve RFQs)

---

## 📝 API Testing with cURL

### Login Example:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "tech@euroasiangroup.com",
    "password": "TechAdmin123!"
  }'
```

### Get Current User:
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -b cookies.txt
```

### List Tenants (Tech/Admin only):
```bash
curl -X GET http://localhost:5000/api/v1/tenants \
  -b cookies.txt
```

### List Tenant Roles:
```bash
curl -X GET http://localhost:5000/api/v1/tenant-roles \
  -b cookies.txt
```

### Assign Role to User:
```bash
curl -X PATCH http://localhost:5000/api/v1/users/<USER_ID>/assign-role \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "tenantRoleId": "<ROLE_ID>"
  }'
```

---

## 🚀 Quick Start

1. **Start MongoDB** (if not running via Docker)
```bash
docker-compose up -d mongodb
```

2. **Seed Database**
```bash
cd backend
npm run seed:complete
```

3. **Start Backend**
```bash
npm run dev
```

4. **Start Frontend (any portal)**
```bash
# Tech Portal
cd frontend/tech-portal
npm run dev

# Admin Portal
cd frontend/admin-portal
npm run dev

# Customer Portal
cd frontend/customer-portal
npm run dev

# Vendor Portal
cd frontend/vendor-portal
npm run dev
```

5. **Login with any credentials above!**

---

## 🎓 Understanding the Structure

```
Tech/Admin Portals
├── Platform Owners (EuroAsianN Group)
├── Have internal roles (watchkeeper, maintainer, sales manager, etc.)
└── Can manage customer/vendor organizations

Customer/Vendor Portals
├── Individual Organizations (separate tenants)
├── Each has custom internal roles
├── Tenant isolation enforced
└── Cannot access other organizations' data
```

---

**For more details, see:**
- [TWO_LEVEL_RBAC_EXPLAINED.md](./TWO_LEVEL_RBAC_EXPLAINED.md)
- [CASBIN_RBAC_GUIDE.md](./CASBIN_RBAC_GUIDE.md)
- [CASBIN_FLOW_DIAGRAM.md](./CASBIN_FLOW_DIAGRAM.md)

