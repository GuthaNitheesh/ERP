# Quick Start Guide

Get the EuroAsianNGroup ERP platform running in 5 minutes!

## Prerequisites

- Node.js >= 18
- MongoDB running locally or Docker installed

## Quick Setup (Using Docker)

### 1. Clone and Install

```bash
cd /media/jay/DATA/EuroasiannGroupProd/euroasianngroupERP
npm install
```

### 2. Start Services with Docker

```bash
docker-compose up -d
```

This starts MongoDB and Redis automatically.

### 3. Create .env file

```bash
cp backend/.env.example backend/.env
```

The default `.env` file is already configured for local development.

### 4. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 5. Seed the Database

```bash
npm run seed
```

Creates:
- **Tech User**: tech@euroasiangroup.com / TechAdmin123!
- **Admin User**: admin@euroasiangroup.com / Admin123!

### 6. Start Backend

```bash
npm run dev:backend
```

Backend runs at: http://localhost:5000

### 7. Start Tech Portal (New Terminal)

```bash
# Install shared components first
cd packages/shared-components
npm install
cd ../..

# Install frontend dependencies
cd frontend/tech-portal
npm install
cd ../..

# Start Tech Portal
npm run dev:tech
```

Tech Portal runs at: http://localhost:3000

## Login

Navigate to http://localhost:3000

- **Email**: tech@euroasiangroup.com
- **Password**: TechAdmin123!

## Quick Manual Setup (Without Docker)

If you have MongoDB running locally:

```bash
# 1. Install all dependencies
npm run install:all

# 2. Create .env
cp backend/.env.example backend/.env

# 3. Seed database
npm run seed

# 4. Start backend (Terminal 1)
npm run dev:backend

# 5. Start frontend (Terminal 2)
npm run dev:tech
```

## Troubleshooting

### MongoDB Connection Error

Make sure MongoDB is running:
```bash
docker-compose up -d mongodb
```

Or install MongoDB locally.

### Port Already in Use

Change ports in:
- Backend: `backend/.env` (PORT=5000)
- Frontend: `frontend/tech-portal/vite.config.ts` (port: 3000)

### Module Not Found

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- ✅ Login to Tech Portal
- ✅ Explore the Dashboard
- ✅ Check API health: http://localhost:5000/api/v1/health
- ✅ Review README.md for full documentation
- ✅ Start building features!

## Support

For detailed documentation, see [README.md](./README.md)

