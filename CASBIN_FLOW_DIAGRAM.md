# Casbin RBAC Flow Diagrams

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     EuroAsianNGroup ERP Platform                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Tech Portal  │  │ Admin Portal │  │Customer Port.│  │ Vendor Port. │
│  :3000       │  │  :3001       │  │  :3002       │  │  :3003       │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │                 │
       └─────────────────┴─────────────────┴─────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Backend API :5000     │
                    │  JWT + Casbin RBAC      │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
        ┌─────▼─────┐    ┌──────▼──────┐   ┌──────▼──────┐
        │  MongoDB  │    │    Redis    │   │   Casbin    │
        │   :27017  │    │    :6379    │   │  Enforcer   │
        └───────────┘    └─────────────┘   └─────────────┘
```

---

## 2. User Role Hierarchy

```
                        ┌──────────────┐
                        │     TECH     │ (Super Admin)
                        │ Full Access  │
                        └──────┬───────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
         ┌──────▼───────┐     │      ┌───────▼────────┐
         │    ADMIN     │     │      │  TENANT USERS  │
         │   Platform   │     │      └───────┬────────┘
         │    Owner     │     │              │
         └──────────────┘     │      ┌───────┴────────┐
                              │      │                │
                              │  ┌───▼──────────┐ ┌──▼─────────────┐
                              │  │CUSTOMER_ADMIN│ │ VENDOR_ADMIN   │
                              │  │ (Ship Mgmt)  │ │ (Spare Parts)  │
                              │  └──────────────┘ └────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │ Can create:       │
                    │ - Admins          │
                    │ - Customer Orgs   │
                    │ - Vendor Orgs     │
                    └───────────────────┘
```

---

## 3. Authentication & Authorization Flow

```
┌─────────┐                                              ┌─────────┐
│  USER   │                                              │ BACKEND │
└────┬────┘                                              └────┬────┘
     │                                                        │
     │  1. POST /api/v1/auth/login                           │
     │    { email, password }                                │
     ├──────────────────────────────────────────────────────►│
     │                                                        │
     │                             2. Validate credentials   │
     │                                Check User in MongoDB ◄─┤
     │                                                        │
     │                             3. Generate JWT Token     │
     │                                with user data:        │
     │                                - userId               │
     │                                - globalRole           │
     │                                - tenantId             │
     │                                                        │
     │  4. Set HttpOnly Cookie + Return user data            │
     │◄──────────────────────────────────────────────────────┤
     │                                                        │
     │  5. GET /api/v1/users (with JWT cookie)               │
     ├──────────────────────────────────────────────────────►│
     │                                                        │
     │                             6. authenticate middleware │
     │                                Verify JWT Token      ◄─┤
     │                                Extract globalRole      │
     │                                                        │
     │                             7. requirePermission       │
     │                                ('users', 'read')       │
     │                                                        │
     │                             8. Casbin.enforce()        │
     │                                Check policy.csv:       │
     │                                Can role 'admin' do     │
     │                                'read' on 'users'?      │
     │                                                        │
     │                             9. YES → Proceed           │
     │                                NO  → 403 Forbidden     │
     │                                                        │
     │  10. Return users data                                │
     │◄──────────────────────────────────────────────────────┤
     │                                                        │
```

---

## 4. Casbin Permission Check Flow

```
                    User makes API request
                             │
                             ▼
                    ┌────────────────┐
                    │ authenticate   │
                    │  middleware    │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │ Extract JWT token      │
                    │ Decode & verify        │
                    │ Attach user to req     │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌─────────────────────────┐
                    │ requirePermission(      │
                    │   resource, action      │
                    │ )                       │
                    └────────┬────────────────┘
                             │
                             ▼
                    ┌─────────────────────────┐
                    │ Get user.globalRole     │
                    │ e.g., "admin"           │
                    └────────┬────────────────┘
                             │
                             ▼
                    ┌─────────────────────────┐
                    │ Casbin Enforcer         │
                    │ enforce(role, obj, act) │
                    │                         │
                    │ Check policy.csv:       │
                    │ p, admin, users, read   │
                    │ p, admin, users, write  │
                    └────────┬────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                   YES               NO
                    │                 │
                    ▼                 ▼
            ┌───────────────┐  ┌──────────────────┐
            │ Allow Access  │  │ 403 Forbidden    │
            │ Call next()   │  │ AuthorizationError│
            └───────────────┘  └──────────────────┘
```

---

## 5. Permission Matrix

```
┌────────────────┬─────────┬─────────┬──────────┬────────────────┬──────────────┐
│   Resource     │  tech   │  admin  │ cust_adm │   vend_adm     │    Action    │
├────────────────┼─────────┼─────────┼──────────┼────────────────┼──────────────┤
│                │    ✓    │    ✓    │    ✓     │      ✓         │    read      │
│    users       │    ✓    │    ✓    │    ✓     │      ✓         │    write     │
│                │    ✓    │    ✗    │    ✗     │      ✗         │    delete    │
├────────────────┼─────────┼─────────┼──────────┼────────────────┼──────────────┤
│                │    ✓    │    ✓    │    ✗     │      ✗         │    read      │
│   tenants      │    ✓    │    ✓    │    ✗     │      ✗         │    write     │
│                │    ✓    │    ✗    │    ✗     │      ✗         │    delete    │
├────────────────┼─────────┼─────────┼──────────┼────────────────┼──────────────┤
│                │    ✓    │    ✓    │    ✓     │      ✓         │    read      │
│    roles       │    ✓    │    ✓    │    ✓     │      ✓         │    write     │
│                │    ✓    │    ✗    │    ✗     │      ✗         │    delete    │
├────────────────┼─────────┼─────────┼──────────┼────────────────┼──────────────┤
│                │    ✓    │    ✓    │    ✓     │      ✓         │    read      │
│     rfqs       │    ✓    │    ✓    │    ✓     │      ✗         │    write     │
│                │    ✓    │    ✗    │    ✗     │      ✗         │    delete    │
├────────────────┼─────────┼─────────┼──────────┼────────────────┼──────────────┤
│                │    ✓    │    ✓    │    ✓     │      ✓         │    read      │
│    quotes      │    ✓    │    ✓    │    ✗     │      ✓         │    write     │
│                │    ✓    │    ✗    │    ✗     │      ✗         │    delete    │
└────────────────┴─────────┴─────────┴──────────┴────────────────┴──────────────┘

Legend:
  ✓ = Allowed
  ✗ = Denied
  cust_adm = customer_admin
  vend_adm = vendor_admin
```

---

## 6. Tenant Isolation

```
                        ┌─────────────────────┐
                        │   TECH USERS        │
                        │  No Tenant ID       │
                        │  Access All Tenants │
                        └──────────┬──────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
   ┌────▼─────┐              ┌────▼─────┐              ┌────▼─────┐
   │ Tenant A │              │ Tenant B │              │ Tenant C │
   │ Customer │              │  Vendor  │              │ Customer │
   └────┬─────┘              └────┬─────┘              └────┬─────┘
        │                         │                         │
   ┌────▼─────────────┐      ┌───▼──────────────┐     ┌───▼──────────────┐
   │ customer_admin   │      │  vendor_admin    │     │  customer_admin  │
   │ user@tenantA.com │      │  user@tenantB.com│     │  user@tenantC.com│
   │                  │      │                  │     │                  │
   │ Can only:        │      │  Can only:       │     │  Can only:       │
   │ - See Tenant A   │      │  - See Tenant B  │     │  - See Tenant C  │
   │   users          │      │    users         │     │    users         │
   │ - Create RFQs    │      │  - View RFQs     │     │  - Create RFQs   │
   │ - View quotes    │      │  - Create quotes │     │  - View quotes   │
   └──────────────────┘      └──────────────────┘     └──────────────────┘

Note: requireTenantAccess middleware enforces this isolation
```

---

## 7. User Creation Workflow

```
                    ┌────────────────┐
                    │   Tech User    │
                    │   Logged In    │
                    └────────┬───────┘
                             │
                             ▼
                    ┌─────────────────────────┐
                    │ POST /api/v1/users      │
                    │ {                       │
                    │   email: "...",         │
                    │   password: "...",      │
                    │   globalRole: "admin"   │
                    │ }                       │
                    └────────┬────────────────┘
                             │
                             ▼
                    ┌─────────────────────────┐
                    │ authenticate middleware │
                    │ ✓ Valid JWT             │
                    └────────┬────────────────┘
                             │
                             ▼
                    ┌─────────────────────────────┐
                    │ requirePermission(          │
                    │   'users', 'write'          │
                    │ )                           │
                    └────────┬────────────────────┘
                             │
                             ▼
                    ┌─────────────────────────────┐
                    │ Casbin checks:              │
                    │ Can 'tech' write to 'users'?│
                    │ → YES (from policy.csv)     │
                    └────────┬────────────────────┘
                             │
                             ▼
                    ┌─────────────────────────────┐
                    │ UserController.createUser   │
                    │ → UserService.createUser    │
                    └────────┬────────────────────┘
                             │
                             ▼
                    ┌─────────────────────────────┐
                    │ 1. Check if user exists     │
                    │    (by email)               │
                    │ 2. Hash password (bcrypt)   │
                    │ 3. Create User in MongoDB   │
                    │ 4. Set createdBy field      │
                    └────────┬────────────────────┘
                             │
                             ▼
                    ┌─────────────────────────────┐
                    │ Return 201 Created          │
                    │ { user: { ... } }           │
                    └─────────────────────────────┘
```

---

## 8. Multi-Portal Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Frontend Portals                          │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Tech Portal    │  │  Admin Portal   │  │ Customer Portal │  │  Vendor Portal  │
│  :3000          │  │  :3001          │  │  :3002          │  │  :3003          │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ For:            │  │ For:            │  │ For:            │  │ For:            │
│ - tech users    │  │ - admin users   │  │ - customer_admin│  │ - vendor_admin  │
│                 │  │                 │  │                 │  │                 │
│ Features:       │  │ Features:       │  │ Features:       │  │ Features:       │
│ - User CRUD     │  │ - Tenant Mgmt   │  │ - Create RFQs   │  │ - View RFQs     │
│ - Tenant CRUD   │  │ - User Mgmt     │  │ - View Quotes   │  │ - Submit Quotes │
│ - System Admin  │  │ - RFQ/Quote view│  │ - Team Mgmt     │  │ - Team Mgmt     │
│ - Full Access   │  │ - Limited delete│  │ - No delete     │  │ - No delete     │
└─────────┬───────┘  └─────────┬───────┘  └─────────┬───────┘  └─────────┬───────┘
          │                    │                    │                    │
          │   ┌────────────────┴────────────────────┴────────────────┐   │
          │   │                                                       │   │
          └───┼────────────────► Backend API :5000 ◄─────────────────┼───┘
              │                                                       │
              │        Same API, Different Permissions                │
              │        Based on globalRole in JWT                     │
              └───────────────────────────────────────────────────────┘

All portals:
  ✓ Use same shared-components package
  ✓ Use same API client
  ✓ JWT authentication with HttpOnly cookies
  ✓ Casbin enforces permissions per role
  ✓ React Router for navigation
  ✓ Tailwind CSS for styling
```

---

## 9. JWT Token Structure

```
┌────────────────────────────────────────────┐
│           JWT Token Payload                │
├────────────────────────────────────────────┤
│  {                                         │
│    "userId": "60d5ec49f1b2c72b8c8e4f1a",  │
│    "email": "admin@euroasiangroup.com",    │
│    "globalRole": "admin",                  │
│    "tenantId": null,                       │
│    "tenantRoleId": null,                   │
│    "iat": 1678901234,                      │
│    "exp": 1679506034                       │
│  }                                         │
└────────────────────────────────────────────┘
         │
         │ Stored in HttpOnly Cookie
         │ (Prevents XSS attacks)
         ▼
┌────────────────────────────────────────────┐
│  Set-Cookie: jwt=eyJhbGc....; HttpOnly;    │
│  Secure; SameSite=Strict                   │
└────────────────────────────────────────────┘
         │
         │ Sent with every request
         ▼
┌────────────────────────────────────────────┐
│  Backend extracts JWT from cookie          │
│  Verifies signature with JWT_SECRET        │
│  Attaches user data to req.user            │
└────────────────────────────────────────────┘
```

---

## 10. Complete Request-Response Cycle

```
┌──────────┐                                                    ┌──────────┐
│ Frontend │                                                    │ Backend  │
└────┬─────┘                                                    └────┬─────┘
     │                                                               │
     │ 1. GET /api/v1/users                                          │
     │    Cookie: jwt=eyJhbGc...                                     │
     ├──────────────────────────────────────────────────────────────►│
     │                                                               │
     │                            2. Parse JWT from cookie          │
     │                               ├─► Verify signature            │
     │                               ├─► Extract payload             │
     │                               └─► req.user = {               │
     │                                     userId: "...",            │
     │                                     globalRole: "admin"       │
     │                                   }                           │
     │                                                               │
     │                            3. requirePermission('users','read')│
     │                               ├─► Get req.user.globalRole     │
     │                               ├─► Casbin.enforce('admin',     │
     │                               │     'users', 'read')          │
     │                               └─► Check policy.csv            │
     │                                     p, admin, users, read ✓   │
     │                                                               │
     │                            4. UserController.getAllUsers      │
     │                               ├─► UserService.getAllUsers     │
     │                               └─► Query MongoDB               │
     │                                                               │
     │                            5. Filter by tenant (if applicable)│
     │                               ├─► If globalRole = 'tech':     │
     │                               │     Return all users          │
     │                               └─► Else:                       │
     │                                     Return only tenant users  │
     │                                                               │
     │ 6. { status: "success", data: { users: [...] } }             │
     │◄──────────────────────────────────────────────────────────────┤
     │                                                               │
```

---

This visual guide should help you understand exactly how Casbin RBAC is working in your system!

