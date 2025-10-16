#!/bin/bash

echo "🚀 Setting up Admin, Customer, and Vendor Portals..."
echo ""

cd "$(dirname "$0")/frontend"

# ============================================
# ADMIN PORTAL
# ============================================
echo "📱 Setting up Admin Portal..."

if [ -d "admin-portal/src" ]; then
  echo "⚠️  Admin portal src already exists, skipping..."
else
  cp -r tech-portal/* admin-portal/ 2>/dev/null || true
  
  # Update package.json
  sed -i 's/"name": "tech-portal"/"name": "admin-portal"/' admin-portal/package.json
  sed -i 's/"description": "Tech Portal"/"description": "Admin Portal"/' admin-portal/package.json
  sed -i 's/--port 3000/--port 3001/' admin-portal/package.json
  
  # Update vite.config.ts
  sed -i 's/port: 3000/port: 3001/' admin-portal/vite.config.ts
  
  # Update index.html
  sed -i 's/Tech Portal/Admin Portal/' admin-portal/index.html
  
  echo "✅ Admin Portal configured (port 3001)"
fi

# ============================================
# CUSTOMER PORTAL
# ============================================
echo "📱 Setting up Customer Portal..."

if [ -d "customer-portal/src" ]; then
  echo "⚠️  Customer portal src already exists, skipping..."
else
  cp -r tech-portal/* customer-portal/ 2>/dev/null || true
  
  # Update package.json
  sed -i 's/"name": "tech-portal"/"name": "customer-portal"/' customer-portal/package.json
  sed -i 's/"description": "Tech Portal"/"description": "Customer Portal"/' customer-portal/package.json
  sed -i 's/"dev": "vite"/"dev": "vite --port 3002"/' customer-portal/package.json
  
  # Update vite.config.ts
  cat > customer-portal/vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
EOF
  
  # Update index.html
  sed -i 's/Tech Portal/Customer Portal/' customer-portal/index.html
  
  echo "✅ Customer Portal configured (port 3002)"
fi

# ============================================
# VENDOR PORTAL
# ============================================
echo "📱 Setting up Vendor Portal..."

if [ -d "vendor-portal/src" ]; then
  echo "⚠️  Vendor portal src already exists, skipping..."
else
  cp -r tech-portal/* vendor-portal/ 2>/dev/null || true
  
  # Update package.json
  sed -i 's/"name": "tech-portal"/"name": "vendor-portal"/' vendor-portal/package.json
  sed -i 's/"description": "Tech Portal"/"description": "Vendor Portal"/' vendor-portal/package.json
  sed -i 's/"dev": "vite"/"dev": "vite --port 3003"/' vendor-portal/package.json
  
  # Update vite.config.ts
  cat > vendor-portal/vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
EOF
  
  # Update index.html
  sed -i 's/Tech Portal/Vendor Portal/' vendor-portal/index.html
  
  echo "✅ Vendor Portal configured (port 3003)"
fi

echo ""
echo "============================================"
echo "✅ ALL PORTALS CONFIGURED!"
echo "============================================"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Install dependencies for each portal:"
echo "   cd admin-portal && npm install"
echo "   cd ../customer-portal && npm install"
echo "   cd ../vendor-portal && npm install"
echo ""
echo "2. Start any portal:"
echo "   Tech Portal:     cd tech-portal && npm run dev     (port 3000)"
echo "   Admin Portal:    cd admin-portal && npm run dev    (port 3001)"
echo "   Customer Portal: cd customer-portal && npm run dev (port 3002)"
echo "   Vendor Portal:   cd vendor-portal && npm run dev   (port 3003)"
echo ""
echo "3. Login with demo accounts from DEMO_CREDENTIALS.md"
echo ""
echo "🎉 All 4 portals are ready!"

