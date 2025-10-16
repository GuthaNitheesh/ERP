# Installation Checklist

Follow this checklist to ensure your EuroAsianNGroup ERP platform is properly set up.

## ✅ Pre-Installation

- [ ] Node.js >= 18.0.0 installed
- [ ] npm >= 9.0.0 installed
- [ ] Docker & Docker Compose installed (optional but recommended)
- [ ] Git installed

## ✅ Installation Steps

### Step 1: Clone Repository
```bash
cd /media/jay/DATA/EuroasiannGroupProd/euroasianngroupERP
```

### Step 2: Install Root Dependencies
```bash
npm install
```

### Step 3: Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### Step 4: Install Shared Components
```bash
cd packages/shared-components
npm install
cd ../..
```

### Step 5: Install Tech Portal
```bash
cd frontend/tech-portal
npm install
cd ../..
```

### Step 6: Configure Environment
```bash
# Backend environment is already configured at backend/.env
# Verify it exists:
ls -la backend/.env
```

If missing, copy from example:
```bash
cp backend/.env.example backend/.env
```

### Step 7: Start Infrastructure
```bash
# Option A: Using Docker (Recommended)
docker-compose up -d

# Option B: Manual MongoDB/Redis
# Make sure MongoDB is running on localhost:27017
# Make sure Redis is running on localhost:6379
```

### Step 8: Seed Database
```bash
npm run seed
```

Expected output:
```
✅ Tech user created successfully!
Email: tech@euroasiangroup.com
Password: TechAdmin123!
Role: tech (super-admin)

✅ Admin user created successfully!
Email: admin@euroasiangroup.com
Password: Admin123!
Role: admin
```

### Step 9: Start Backend (Terminal 1)
```bash
npm run dev:backend
```

Expected output:
```
Server is running on port 5000
Environment: development
API Version: v1
MongoDB connected successfully
Redis connected successfully
Casbin enforcer initialized successfully
```

### Step 10: Start Tech Portal (Terminal 2)
```bash
npm run dev:tech
```

Expected output:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

## ✅ Verification

### Check Backend Health
```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "status": "success",
  "message": "API is running",
  "timestamp": "2025-10-14T..."
}
```

### Check Frontend
Open browser: http://localhost:3000

You should see the login page.

### Test Login
- Email: `tech@euroasiangroup.com`
- Password: `TechAdmin123!`

You should be redirected to the dashboard.

### Check API Authentication
```bash
# Login and save cookie
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tech@euroasiangroup.com","password":"TechAdmin123!"}' \
  --cookie-jar cookies.txt

# Get current user
curl http://localhost:5000/api/v1/auth/me \
  --cookie cookies.txt
```

## ✅ Docker Services

If using Docker, verify all services are running:

```bash
docker-compose ps
```

Expected output:
```
NAME                  IMAGE              STATUS
euroasian-backend     ...                Up
euroasian-mongodb     mongo:7.0          Up
euroasian-redis       redis:7-alpine     Up
```

## ✅ File Structure Verification

Verify key files exist:

```bash
# Backend
ls backend/src/index.ts
ls backend/src/models/User.ts
ls backend/.env

# Frontend
ls frontend/tech-portal/src/App.tsx
ls frontend/tech-portal/src/pages/LoginPage.tsx

# Shared
ls packages/shared-components/src/index.ts

# Docker
ls docker-compose.yml
ls docker/Dockerfile.backend
```

## ✅ Dependencies Check

### Backend Dependencies
```bash
cd backend
npm list express mongoose jsonwebtoken casbin
cd ..
```

### Frontend Dependencies
```bash
cd frontend/tech-portal
npm list react react-router-dom
cd ../..
```

## ✅ Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:**
```bash
docker-compose up -d mongodb
# Or install MongoDB locally
```

### Issue: Port 5000 Already in Use
**Solution:**
```bash
# Change PORT in backend/.env
# Example: PORT=5001
```

### Issue: Port 3000 Already in Use
**Solution:**
```bash
# Change port in frontend/tech-portal/vite.config.ts
# Update server.port to 3001
```

### Issue: Module Not Found
**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf packages/shared-components/node_modules packages/shared-components/package-lock.json
rm -rf frontend/tech-portal/node_modules frontend/tech-portal/package-lock.json

# Reinstall
npm install
cd backend && npm install && cd ..
cd packages/shared-components && npm install && cd ../..
cd frontend/tech-portal && npm install && cd ../..
```

### Issue: Cannot Import @euroasian/shared-components
**Solution:**
```bash
# Build shared components first
cd packages/shared-components
npm run build
cd ../..

# Then restart frontend
npm run dev:tech
```

### Issue: TypeScript Errors
**Solution:**
```bash
# Backend
cd backend
npm run build
cd ..

# Frontend
cd frontend/tech-portal
npx tsc --noEmit
cd ../..
```

## ✅ Production Deployment Checklist

- [ ] Set `NODE_ENV=production` in backend/.env
- [ ] Generate strong `JWT_SECRET`
- [ ] Configure production MongoDB URI
- [ ] Configure production Redis
- [ ] Set proper `ALLOWED_ORIGINS`
- [ ] Enable HTTPS/SSL
- [ ] Configure Sentry DSN (optional)
- [ ] Set up CI/CD pipeline
- [ ] Configure backups
- [ ] Set up monitoring
- [ ] Configure load balancer
- [ ] Review security settings

## ✅ Next Steps

- [ ] Read README.md for full documentation
- [ ] Review API endpoints
- [ ] Explore the dashboard
- [ ] Check Casbin policies
- [ ] Start building features
- [ ] Set up additional portals (Admin, Customer, Vendor)

## Support

For issues:
1. Check this checklist
2. Review README.md
3. Check QUICKSTART.md
4. Open an issue on GitHub

---

✅ **Installation Complete!** You're ready to start developing! 🚀

