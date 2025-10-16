# Two-Level RBAC System - Complete Explanation

## 🎯 Understanding Your Architecture

You have a **TWO-LEVEL ROLE SYSTEM**:

### Level 1: Global Roles (Platform-Wide)
These are controlled by **Casbin** and define access across the entire platform.

### Level 2: Tenant Roles (Organization-Specific)
These are **internal custom roles** within each customer/vendor organization.

---

## 🏢 Organization Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Platform Level                                │
│                    (EuroAsianNGroup Platform)                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐              ┌──────────────────────┐
│   PLATFORM OWNER     │              │   PLATFORM USERS     │
│   (Your Company)     │              │   (Your Customers)   │
└──────────────────────┘              └──────────────────────┘
         │                                      │
         ├─────────────────────┬───────────────┴───────────────┐
         │                     │                               │
┌────────▼────────┐   ┌────────▼────────┐         ┌──────────▼──────────┐
│  TECH PORTAL    │   │  ADMIN PORTAL   │         │  CUSTOMER/VENDOR    │
│  (Developers)   │   │  (Employees)    │         │   ORGANIZATIONS     │
└─────────────────┘   └─────────────────┘         └──────────┬──────────┘
                                                               │
                        ┌──────────────────────────────────────┴────────┐
                        │                                               │
               ┌────────▼────────┐                           ┌──────────▼──────────┐
               │ CUSTOMER ORG 1  │                           │  VENDOR ORG 1       │
               │ (Ship Company)  │                           │  (Parts Supplier)   │
               └────────┬────────┘                           └──────────┬──────────┘
                        │                                               │
         ┌──────────────┴──────────────┐                 ┌──────────────┴──────────────┐
         │                             │                 │                             │
    ┌────▼─────┐                  ┌───▼──────┐      ┌───▼──────┐                 ┌────▼─────┐
    │ Admin    │                  │ Employee │      │ Admin    │                 │ Employee │
    │ (C-Admin)│                  │ (Custom  │      │ (V-Admin)│                 │ (Custom  │
    │          │                  │  Roles)  │      │          │                 │  Roles)  │
    └──────────┘                  └──────────┘      └──────────┘                 └──────────┘
```

---

## 🔐 Two-Level Permission System

### LEVEL 1: Global Roles (Casbin RBAC)

**Purpose:** Control access to PLATFORM-LEVEL resources

| Global Role | Belongs To | Portal | Tenant? |
|-------------|------------|--------|---------|
| `tech` | Platform developers | Tech Portal | ❌ No tenant |
| `admin` | Platform owner employees | Admin Portal | ❌ No tenant (or admin tenant) |
| `customer_admin` | Customer organization admin | Customer Portal | ✅ Has tenantId |
| `vendor_admin` | Vendor organization admin | Vendor Portal | ✅ Has tenantId |

**These are FIXED roles** managed by Casbin policy.csv

---

### LEVEL 2: Tenant Roles (Custom Internal Roles)

**Purpose:** Control access to ORGANIZATION-SPECIFIC features

#### For Customer Organizations:
```
Customer Org: "ABC Shipping Company" (tenantId: 123)

Custom Roles:
  ├── Fleet Manager
  │   └── Permissions: [view_rfqs, create_rfqs, approve_rfqs]
  │
  ├── Procurement Officer
  │   └── Permissions: [view_rfqs, create_rfqs, view_quotes]
  │
  ├── Technical Superintendent
  │   └── Permissions: [view_rfqs, comment_on_rfqs]
  │
  └── Viewer (Read-only)
      └── Permissions: [view_rfqs]
```

#### For Vendor Organizations:
```
Vendor Org: "XYZ Spare Parts Ltd" (tenantId: 456)

Custom Roles:
  ├── Sales Manager
  │   └── Permissions: [view_rfqs, create_quotes, approve_quotes]
  │
  ├── Sales Executive
  │   └── Permissions: [view_rfqs, create_quotes]
  │
  ├── Technical Specialist
  │   └── Permissions: [view_rfqs, view_technical_specs]
  │
  └── Viewer
      └── Permissions: [view_rfqs]
```

---

## 📊 Current Implementation Status

### ✅ What's Already Implemented:

1. **Models:**
   - ✅ User model (with globalRole, tenantId, tenantRoleId)
   - ✅ Tenant model (type: admin, customer, vendor)
   - ✅ TenantRole model (permissions array)

2. **Casbin (Level 1):**
   - ✅ Global role enforcement
   - ✅ Policy.csv with permissions
   - ✅ Middleware for checking global permissions

3. **JWT:**
   - ✅ Includes tenantRoleId in token

---

### ❌ What's MISSING:

1. **Tenant Management:**
   - ❌ No routes for creating/managing tenants
   - ❌ No TenantController
   - ❌ No TenantService

2. **Tenant Role Management:**
   - ❌ No routes for creating custom roles within tenants
   - ❌ No TenantRoleController
   - ❌ No TenantRoleService
   - ❌ No way for customer_admin to create custom roles

3. **Level 2 Permission Checking:**
   - ❌ No middleware to check tenant role permissions
   - ❌ Only Casbin (Level 1) is being checked
   - ❌ tenantRoleId is in JWT but not being used for authorization

4. **User Assignment:**
   - ❌ No way to assign tenant roles to users
   - ❌ No UI for managing organization users

5. **Portal Separation:**
   - ❌ Admin, Customer, Vendor portals exist but are not built

---

## 🎯 Summary of How It SHOULD Work

```
LEVEL 1: Casbin (Platform-Wide Permissions)
   ↓
   Controls: tech, admin, customer_admin, vendor_admin
   Fixed in policy.csv
   
LEVEL 2: Tenant Roles (Per-Organization Custom Permissions)
   ↓
   Each tenant creates their own roles
   Each role has permissions array
   Users get assigned these roles
```

**Currently:**
- ✅ Level 1 (Casbin) is 100% working
- ⚠️ Level 2 (Tenant Roles) has the database models but NO implementation

---

## 🚀 What Needs to Be Built

### 1. Tenant Management API
- Create/edit/delete customer/vendor organizations
- Assign tenant admins

### 2. Tenant Role Management API
- Create custom roles within each organization
- Define permissions for each role
- Assign roles to users

### 3. Level 2 Permission Middleware
- Check tenant role permissions in addition to Casbin
- Enforce organization-specific access control

### 4. Portal UIs
- Admin Portal: Manage tenants
- Customer Portal: Manage org users/roles, create RFQs
- Vendor Portal: Manage org users/roles, submit quotes

---

Would you like me to implement these missing pieces now?

