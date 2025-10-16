# 🚀 Jira + Swagger Integration - Complete Guide

## ✅ **WHAT'S BEEN INTEGRATED**

### **1. Full Jira Integration** ✅
- Bug reporting system
- Support ticket management
- Feature request system
- RFQ tracking in Jira
- Webhook handlers for bi-directional sync
- Auto bug creation on server errors

### **2. Swagger/OpenAPI Documentation** ✅
- Complete API documentation
- Interactive API testing UI
- Request/Response schemas
- Authentication examples

---

## 📚 **SWAGGER API DOCUMENTATION**

### **Access Swagger UI:**

Once backend is running, visit:

**URL:** http://localhost:5000/api-docs

**Features:**
- ✅ Browse all API endpoints
- ✅ Test APIs directly from browser
- ✅ See request/response examples
- ✅ Authentication testing
- ✅ Schema definitions

### **Swagger JSON:**
http://localhost:5000/api-docs.json

---

## 🔧 **JIRA CONFIGURATION**

### **Step 1: Create Jira Account**

1. Go to https://www.atlassian.com/software/jira
2. Sign up for free (up to 10 users)
3. Create a workspace: `yourcompany.atlassian.net`

### **Step 2: Create Jira Project**

1. In Jira, click "Create Project"
2. Select "Kanban" or "Scrum"
3. Name it "ERP" (or your preferred name)
4. Note the **Project Key** (e.g., "ERP")

### **Step 3: Generate API Token**

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name it: "ERP Backend Integration"
4. Copy the token (you won't see it again!)

### **Step 4: Configure Environment Variables**

Edit `backend/.env`:

```env
# Jira Integration
JIRA_HOST=yourcompany.atlassian.net
JIRA_EMAIL=your-email@euroasiangroup.com
JIRA_API_TOKEN=your_actual_api_token_here
JIRA_PROJECT_KEY=ERP
```

### **Step 5: Restart Backend**

```bash
npm run dev
```

You should see:
```
[info] Jira client initialized successfully
```

---

## 🎯 **JIRA API ENDPOINTS**

### **1. Bug Reports**

**Create Bug Report:**
```bash
POST /api/v1/jira/bugs
Authorization: Cookie (JWT)
Content-Type: application/json

{
  "summary": "Login page shows error 500",
  "description": "When I try to login, I get a server error",
  "errorStack": "Optional error stack trace",
  "endpoint": "POST /api/v1/auth/login",
  "priority": "High"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "issue": {
      "key": "ERP-123",
      "id": "10001",
      "self": "https://yourcompany.atlassian.net/rest/api/2/issue/10001"
    }
  },
  "message": "Bug report created successfully"
}
```

---

### **2. Support Tickets**

**Create Support Ticket:**
```bash
POST /api/v1/jira/support/tickets
Authorization: Cookie (JWT)

{
  "summary": "Cannot export RFQ to PDF",
  "description": "The export button doesn't work",
  "category": "technical",
  "priority": "Medium"
}
```

**Get My Support Tickets:**
```bash
GET /api/v1/jira/support/my-tickets
Authorization: Cookie (JWT)
```

---

### **3. Feature Requests**

**Submit Feature Request:**
```bash
POST /api/v1/jira/features
Authorization: Cookie (JWT)

{
  "summary": "Add multi-currency support",
  "description": "We need to handle USD, EUR, and GBP in quotes"
}
```

---

### **4. View All Bugs (Tech/Admin Only)**

```bash
GET /api/v1/jira/bugs?status=Open
Authorization: Cookie (JWT)
```

---

### **5. Get Issue Details**

```bash
GET /api/v1/jira/issues/ERP-123
Authorization: Cookie (JWT)
```

---

### **6. Add Comment to Issue**

```bash
POST /api/v1/jira/issues/ERP-123/comments
Authorization: Cookie (JWT)

{
  "comment": "I tried this on Chrome and it works, but fails on Firefox"
}
```

---

### **7. Jira Health Check**

```bash
GET /api/v1/jira/health
Authorization: Cookie (JWT)
```

---

## 🔄 **JIRA WEBHOOKS (Bi-directional Sync)**

### **What They Do:**

Webhooks allow Jira to **notify your backend** when:
- Issues are created
- Issues are updated
- Status changes
- Comments are added

### **Setup Webhooks in Jira:**

1. **Go to Jira Settings → System → Webhooks**

2. **Create Webhook:**
   - Name: "ERP Backend Sync"
   - URL: `https://your-backend-url.com/api/v1/webhooks/jira`
   - Events to trigger:
     - Issue created
     - Issue updated
     - Comment created

3. **Webhook Endpoints:**
   ```
   POST /api/v1/webhooks/jira              (Generic handler)
   POST /api/v1/webhooks/jira/issue-created
   POST /api/v1/webhooks/jira/issue-updated
   POST /api/v1/webhooks/jira/comment-added
   ```

### **What Happens:**

```
Customer updates Jira ticket status
         ↓
Jira sends webhook to your backend
         ↓
Webhook handler processes update
         ↓
Sync status back to your database
         ↓
Customer sees updated status in portal
```

---

## 🎨 **AUTOMATIC FEATURES**

### **1. Auto Bug Creation on Server Errors**

When a 500 error occurs in **production**:
- ✅ Automatically creates Jira bug report
- ✅ Includes error stack trace
- ✅ Includes user info and endpoint
- ✅ Sets priority to "Critical"

**No manual action needed!**

---

### **2. Portal Integration Examples**

#### **Tech Portal:**
```typescript
// Report a bug button
const reportBug = async () => {
  await axios.post('/api/v1/jira/bugs', {
    summary: 'UI Issue: Dashboard not loading',
    description: 'The dashboard shows loading spinner forever',
    priority: 'High'
  });
  
  alert('Bug reported successfully!');
};
```

#### **Customer Portal:**
```typescript
// Help/Support button
const createSupportTicket = async () => {
  await axios.post('/api/v1/jira/support/tickets', {
    summary: 'Need help with RFQ creation',
    description: 'How do I attach files to an RFQ?',
    category: 'general',
    priority: 'Low'
  });
  
  navigate('/support/tickets'); // View my tickets
};
```

#### **Any Portal:**
```typescript
// Feature request button
const requestFeature = async () => {
  await axios.post('/api/v1/jira/features', {
    summary: 'Add email notifications',
    description: 'Send email when quote is received'
  });
};
```

---

## 📊 **USE CASES BY PORTAL**

### **Tech Portal:**
- ✅ View all bugs across system
- ✅ Monitor support tickets
- ✅ Track feature requests
- ✅ Jira integration health check

### **Admin Portal:**
- ✅ Create support tickets for customers
- ✅ Track onboarding issues
- ✅ Report platform bugs
- ✅ Submit feature requests

### **Customer Portal:**
- ✅ Report issues with RFQs/Quotes
- ✅ Request new features
- ✅ Track support tickets
- ✅ View ticket history

### **Vendor Portal:**
- ✅ Report quote submission issues
- ✅ Technical support tickets
- ✅ Feature requests
- ✅ Track issue status

---

## 🛠️ **ADVANCED FEATURES INCLUDED**

### **1. Link Issues**
```javascript
// Link RFQ issue to Quote issue
await jiraService.linkIssues('ERP-123', 'ERP-456', 'Relates');
```

### **2. Assign Issues**
```javascript
// Assign bug to developer
await jiraService.assignIssue('ERP-123', 'developer@euroasiangroup.com');
```

### **3. Search with JQL**
```javascript
// Search for all high-priority bugs
const bugs = await jiraService.searchIssues(
  'project = ERP AND issuetype = Bug AND priority = High'
);
```

### **4. Update Status**
```javascript
// Move issue through workflow
await jiraService.updateIssueStatus('ERP-123', 'In Progress');
```

---

## 📋 **JIRA WORKFLOW EXAMPLES**

### **Example 1: RFQ Lifecycle Tracking**

```
Customer creates RFQ in ERP
         ↓
Create Jira issue: "RFQ-12345: Engine Parts"
         ↓
Jira Workflow:
  - To Do → Waiting for vendor quotes
  - In Progress → Reviewing quotes  
  - Done → Quote accepted
         ↓
Status syncs back to ERP via webhook
         ↓
Customer sees updated status in portal
```

### **Example 2: Bug Report Flow**

```
User clicks "Report Bug" in portal
         ↓
Creates Jira bug: "[BUG] Cannot upload file"
         ↓
Auto-assigned to support team
         ↓
Developer fixes bug
         ↓
Updates Jira status to "Done"
         ↓
Webhook notifies user via email
```

### **Example 3: Support Ticket Flow**

```
Customer creates support ticket
         ↓
Jira issue created: "[SUPPORT] How to...?"
         ↓
Support staff sees in Jira
         ↓
Adds comment with solution
         ↓
Customer sees response in portal
         ↓
Ticket closed in Jira
         ↓
Status synced to ERP
```

---

## 🔒 **SECURITY CONSIDERATIONS**

### **1. Webhook Security**

In production, add webhook secret verification:

```typescript
app.post('/webhooks/jira', (req, res, next) => {
  const webhookSecret = process.env.JIRA_WEBHOOK_SECRET;
  const signature = req.headers['x-atlassian-webhook-identifier'];
  
  if (signature !== webhookSecret) {
    return res.status(401).json({ error: 'Invalid webhook' });
  }
  
  next();
});
```

### **2. API Token Storage**

- ✅ Store in environment variables
- ✅ Never commit to Git
- ✅ Rotate tokens regularly
- ✅ Use different tokens for dev/prod

---

## 📊 **JIRA PROJECT STRUCTURE**

### **Recommended Issue Types:**

1. **Bug** - System errors, UI issues
2. **Support** - Customer help requests
3. **Story** - Feature requests
4. **Task** - RFQ tracking, administrative tasks
5. **Epic** - Major features (e.g., "Multi-currency support")

### **Recommended Labels:**

- `auto-generated` - Created by system
- `backend-error` - Server-side errors
- `frontend-error` - Client-side errors
- `support` - Support tickets
- `feature-request` - Customer requests
- `rfq` - RFQ-related
- `customer-{tenant-name}` - Per customer
- `critical` - Urgent issues

### **Recommended Workflow:**

```
To Do → In Progress → In Review → Done
                  ↓
              Blocked (if issues arise)
```

---

## 🚀 **GETTING STARTED**

### **Option 1: Without Jira (Works Now)**

Backend works fine without Jira configuration:
- ✅ All endpoints return friendly messages
- ✅ No errors if Jira not configured
- ✅ Can add Jira later

### **Option 2: With Jira (Full Integration)**

1. **Set up Jira** (follow steps above)
2. **Configure .env** with your Jira credentials
3. **Restart backend**
4. **Test:** http://localhost:5000/api/v1/jira/health

---

## 🧪 **TESTING JIRA INTEGRATION**

### **Test 1: Check Jira Health**
```bash
curl -X GET http://localhost:5000/api/v1/jira/health \
  -H "Cookie: jwt=YOUR_JWT_TOKEN"
```

### **Test 2: Create Bug Report**
```bash
curl -X POST http://localhost:5000/api/v1/jira/bugs \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN" \
  -d '{
    "summary": "Test bug report",
    "description": "This is a test bug from API",
    "priority": "Low"
  }'
```

### **Test 3: Create Support Ticket**
```bash
curl -X POST http://localhost:5000/api/v1/jira/support/tickets \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN" \
  -d '{
    "summary": "Test support ticket",
    "description": "How do I use this feature?",
    "category": "general"
  }'
```

---

## 📖 **SWAGGER DOCUMENTATION**

### **Access Points:**

**Interactive UI:**
http://localhost:5000/api-docs

**JSON Spec:**
http://localhost:5000/api-docs.json

### **What's Documented:**

✅ **All API Endpoints:**
- Authentication (`/auth/*`)
- Users (`/users/*`)
- Tenants (`/tenants/*`)
- Tenant Roles (`/tenant-roles/*`)
- Jira Integration (`/jira/*`)
- Webhooks (`/webhooks/*`)

✅ **Schemas:**
- User model
- Tenant model
- TenantRole model
- Error responses

✅ **Authentication:**
- JWT cookie authentication
- Bearer token support

### **How to Use Swagger UI:**

1. **Open:** http://localhost:5000/api-docs
2. **Click "Authorize"** button
3. **Enter JWT token** from login
4. **Test any endpoint** directly!

---

## 🎯 **COMPLETE API REFERENCE**

### **Jira Endpoints:**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/jira/health` | Check Jira integration status | ✅ |
| POST | `/jira/bugs` | Create bug report | ✅ |
| GET | `/jira/bugs` | Get all bugs (Tech/Admin only) | ✅ |
| POST | `/jira/support/tickets` | Create support ticket | ✅ |
| GET | `/jira/support/my-tickets` | Get my support tickets | ✅ |
| POST | `/jira/features` | Submit feature request | ✅ |
| GET | `/jira/issues/:key` | Get issue details | ✅ |
| POST | `/jira/issues/:key/comments` | Add comment to issue | ✅ |

### **Webhook Endpoints:**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/webhooks/jira` | Generic Jira webhook | ❌ Public |
| POST | `/webhooks/jira/issue-created` | Issue created event | ❌ Public |
| POST | `/webhooks/jira/issue-updated` | Issue updated event | ❌ Public |
| POST | `/webhooks/jira/comment-added` | Comment added event | ❌ Public |

---

## 💡 **REAL-WORLD EXAMPLES**

### **Example 1: Customer Reports Bug**

**Frontend (Customer Portal):**
```typescript
const handleReportBug = async () => {
  try {
    await apiClient.post('/jira/bugs', {
      summary: bugSummary,
      description: bugDescription,
      priority: 'High'
    });
    
    toast.success('Bug reported! We\'ll look into it.');
  } catch (error) {
    toast.error('Failed to report bug');
  }
};
```

**Jira:**
- Creates issue: `[BUG] Cannot upload file`
- Auto-assigned to support team
- Customer gets issue key: `ERP-456`

---

### **Example 2: RFQ Creation Tracking**

**Backend (when RFQ is created):**
```typescript
// In rfqController.createRFQ()
const rfq = await rfqService.createRFQ(rfqData);

// Create Jira issue to track it
await jiraService.createRFQIssue({
  rfqNumber: rfq.rfqNumber,
  rfqTitle: rfq.title,
  customerName: customer.organizationName,
  customerEmail: customer.email,
  deadline: rfq.deadline,
  description: rfq.description,
});
```

**Result:**
- RFQ in ERP database ✅
- Jira task created ✅
- Team can track progress ✅

---

### **Example 3: Automatic Error Reporting**

**What Happens:**
```
Server error occurs (500)
         ↓
Error handler catches it
         ↓
Automatically creates Jira bug
         ↓
Includes:
  - Error message
  - Stack trace
  - User email
  - Endpoint
  - Timestamp
         ↓
Developer gets notified
         ↓
Bug fixed
```

**No manual bug reporting needed!** 🎉

---

## 📱 **PORTAL UI EXAMPLES**

### **Add to All Portals:**

**1. Bug Report Modal:**
```typescript
<Modal title="Report a Bug">
  <Input label="Summary" value={summary} />
  <TextArea label="Description" value={description} />
  <Select label="Priority" options={['Low', 'Medium', 'High']} />
  <Button onClick={handleReportBug}>Submit</Button>
</Modal>
```

**2. Support Button in Header:**
```typescript
<Header>
  <Logo />
  <Nav />
  <Button onClick={() => setShowSupport(true)}>
    Get Support
  </Button>
</Header>
```

**3. My Tickets Page:**
```typescript
<Page title="My Support Tickets">
  {tickets.map(ticket => (
    <TicketCard
      key={ticket.key}
      issueKey={ticket.key}
      summary={ticket.fields.summary}
      status={ticket.fields.status.name}
      created={ticket.fields.created}
    />
  ))}
</Page>
```

---

## 📊 **BENEFITS SUMMARY**

### **For Customers:**
- ✅ Easy bug reporting
- ✅ Track support tickets
- ✅ Request features
- ✅ Transparent issue tracking

### **For Your Team:**
- ✅ Centralized issue management
- ✅ Automatic bug capture
- ✅ Better prioritization
- ✅ Improved collaboration
- ✅ Audit trail for compliance

### **For Business:**
- ✅ Better customer satisfaction
- ✅ Faster bug resolution
- ✅ Data-driven decisions
- ✅ Professional image
- ✅ Scalable support system

---

## 🎯 **NEXT STEPS**

### **1. Test Without Jira (Now)**
```bash
# Backend runs fine without Jira config
npm run dev

# Visit Swagger docs
http://localhost:5000/api-docs

# Jira endpoints will return:
"Jira integration is not configured"
```

### **2. Set Up Jira (Later)**
1. Create Jira account
2. Generate API token
3. Update .env with credentials
4. Restart backend
5. Test Jira endpoints

### **3. Add UI Components (Frontend)**
- Add "Report Bug" buttons
- Add "Support" section
- Add "Feature Requests" page

---

## ✅ **WHAT'S READY NOW**

✅ **Complete Jira Service** - Full functionality
✅ **API Endpoints** - Bug reports, support, features
✅ **Webhooks** - Bi-directional sync
✅ **Auto Bug Reporting** - On server errors
✅ **Swagger Docs** - Interactive API documentation
✅ **Environment Config** - Ready to add credentials

---

## 🚀 **START USING IT**

### **1. View Swagger Docs:**
```bash
# Start backend
npm run dev

# Open browser
http://localhost:5000/api-docs
```

### **2. Test Jira Endpoints:**

Even without Jira configured, you can see the API structure in Swagger!

---

## 🏆 **PRODUCTION-READY INTEGRATION**

Your ERP now has:
- ✅ Professional issue tracking
- ✅ Complete API documentation
- ✅ Auto bug reporting
- ✅ Support ticket system
- ✅ Feature request management
- ✅ Webhook integration
- ✅ Enterprise-grade architecture

**Jira + Swagger fully integrated! 🎉**

---

## 📞 **QUICK REFERENCE**

**Swagger UI:** http://localhost:5000/api-docs  
**Jira Health:** GET /api/v1/jira/health  
**Report Bug:** POST /api/v1/jira/bugs  
**Support Ticket:** POST /api/v1/jira/support/tickets  
**Feature Request:** POST /api/v1/jira/features  

**Everything is ready to use! 🚀**

