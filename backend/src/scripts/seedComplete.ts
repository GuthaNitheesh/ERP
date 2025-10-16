import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import Tenant from '../models/Tenant';
import TenantRole from '../models/TenantRole';
import logger from '../config/logger';

dotenv.config();

/**
 * Complete Production-Ready Seed Script
 * Creates all 4 portals with tenants, roles, and demo users
 */

const seedCompleteData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/euroasiangroup_erp';
    
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected for seeding');

    // Clear existing data (optional - comment out in production)
    await User.deleteMany({});
    await Tenant.deleteMany({});
    await TenantRole.deleteMany({});
    logger.info('Cleared existing data');

    // ========================================
    // STEP 1: Create Tech Tenant & Users
    // ========================================
    logger.info('\n📱 Creating Tech Portal...');
    
    const techTenant = await Tenant.create({
      name: 'euroasiann-tech-team',
      type: 'tech',
      organizationName: 'EuroAsianNGroup Tech Team',
      email: 'tech@euroasiangroup.com',
      phone: '+1-800-TECH-001',
      address: {
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94105',
      },
      isActive: true,
      metadata: { description: 'Platform Development Team' },
      createdBy: new mongoose.Types.ObjectId() as any, // Temporary
    });

    logger.info(`✅ Tech Tenant created: ${techTenant.name}`);

    // Create Tech Super Admin (no role - full access)
    const techAdmin = await User.create({
      email: 'tech@euroasiangroup.com',
      password: 'TechAdmin123!',
      firstName: 'Tech',
      lastName: 'Administrator',
      phone: '+1-800-TECH-001',
      globalRole: 'tech',
      tenantId: techTenant._id,
      tenantRoleId: null, // Tenant admin - full access
      isActive: true,
    });

    logger.info(`✅ Tech Admin created: ${techAdmin.email}`);

    // Update tenant createdBy
    techTenant.createdBy = techAdmin._id as any;
    await techTenant.save();

    // Create Tech Roles
    const serverWatchkeeperRole = await TenantRole.create({
      name: 'server-watchkeeper',
      displayName: 'Server Watchkeeper',
      tenantId: techTenant._id,
      permissions: [
        'view_system_logs',
        'monitor_servers',
        'view_metrics',
        'restart_services',
        'view_alerts',
      ],
      description: 'Monitor and maintain server health',
      isActive: true,
      createdBy: techAdmin._id,
    });

    const maintainerRole = await TenantRole.create({
      name: 'maintainer',
      displayName: 'Maintainer',
      tenantId: techTenant._id,
      permissions: [
        'deploy_code',
        'manage_infrastructure',
        'update_dependencies',
        'configure_services',
        'backup_restore',
      ],
      description: 'Deploy and maintain platform infrastructure',
      isActive: true,
      createdBy: techAdmin._id,
    });

    const developerRole = await TenantRole.create({
      name: 'developer',
      displayName: 'Developer',
      tenantId: techTenant._id,
      permissions: [
        'write_code',
        'review_code',
        'debug_issues',
        'access_dev_env',
        'view_logs',
      ],
      description: 'Develop and debug platform features',
      isActive: true,
      createdBy: techAdmin._id,
    });

    logger.info(`✅ Tech Roles created: ${serverWatchkeeperRole.name}, ${maintainerRole.name}, ${developerRole.name}`);

    // Create Tech Users with Roles
    const techWatchkeeper = await User.create({
      email: 'watchkeeper@euroasiangroup.com',
      password: 'Watch123!',
      firstName: 'Server',
      lastName: 'Watchkeeper',
      phone: '+1-800-TECH-002',
      globalRole: 'tech',
      tenantId: techTenant._id,
      tenantRoleId: serverWatchkeeperRole._id,
      isActive: true,
      createdBy: techAdmin._id,
    });

    const techMaintainer = await User.create({
      email: 'maintainer@euroasiangroup.com',
      password: 'Maintain123!',
      firstName: 'System',
      lastName: 'Maintainer',
      phone: '+1-800-TECH-003',
      globalRole: 'tech',
      tenantId: techTenant._id,
      tenantRoleId: maintainerRole._id,
      isActive: true,
      createdBy: techAdmin._id,
    });

    logger.info(`✅ Tech Users created: ${techWatchkeeper.email}, ${techMaintainer.email}`);

    // ========================================
    // STEP 2: Create Admin Tenant & Users
    // ========================================
    logger.info('\n🏢 Creating Admin Portal...');

    const adminTenant = await Tenant.create({
      name: 'euroasiann-admin',
      type: 'admin',
      organizationName: 'EuroAsianNGroup Administration',
      email: 'admin@euroasiangroup.com',
      phone: '+1-800-ADMIN-001',
      address: {
        street: '456 Business Ave',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
      },
      isActive: true,
      metadata: { description: 'Platform Business Administration' },
      createdBy: techAdmin._id,
    });

    logger.info(`✅ Admin Tenant created: ${adminTenant.name}`);

    // Create Admin Portal Admin (no role - full access)
    const adminUser = await User.create({
      email: 'admin@euroasiangroup.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'Administrator',
      phone: '+1-800-ADMIN-001',
      globalRole: 'admin',
      tenantId: adminTenant._id,
      tenantRoleId: null, // Tenant admin - full access
      isActive: true,
      createdBy: techAdmin._id,
    });

    logger.info(`✅ Admin user created: ${adminUser.email}`);

    // Create Admin Roles
    const salesManagerRole = await TenantRole.create({
      name: 'sales-manager',
      displayName: 'Sales Manager',
      tenantId: adminTenant._id,
      permissions: [
        'view_all_tenants',
        'create_tenants',
        'edit_tenants',
        'view_analytics',
        'manage_sales_team',
        'approve_deals',
      ],
      description: 'Manage customer/vendor onboarding and sales',
      isActive: true,
      createdBy: adminUser._id,
    });

    await TenantRole.create({
      name: 'sales-executive',
      displayName: 'Sales Executive',
      tenantId: adminTenant._id,
      permissions: [
        'view_tenants',
        'create_tenants',
        'view_reports',
        'contact_customers',
      ],
      description: 'Execute sales and customer onboarding',
      isActive: true,
      createdBy: adminUser._id,
    });

    const supportStaffRole = await TenantRole.create({
      name: 'support-staff',
      displayName: 'Support Staff',
      tenantId: adminTenant._id,
      permissions: [
        'view_tenants',
        'view_users',
        'view_support_tickets',
        'respond_tickets',
        'view_rfqs',
        'view_quotes',
      ],
      description: 'Provide customer support',
      isActive: true,
      createdBy: adminUser._id,
    });

    await TenantRole.create({
      name: 'operations-manager',
      displayName: 'Operations Manager',
      tenantId: adminTenant._id,
      permissions: [
        'view_all_tenants',
        'view_all_users',
        'view_analytics',
        'manage_operations',
        'view_rfqs',
        'view_quotes',
      ],
      description: 'Oversee platform operations',
      isActive: true,
      createdBy: adminUser._id,
    });

    logger.info(`✅ Admin Roles created: 4 roles`);

    // Create Admin Users with Roles
    const salesManager = await User.create({
      email: 'sales.manager@euroasiangroup.com',
      password: 'Sales123!',
      firstName: 'John',
      lastName: 'Sales Manager',
      phone: '+1-800-ADMIN-002',
      globalRole: 'admin',
      tenantId: adminTenant._id,
      tenantRoleId: salesManagerRole._id,
      isActive: true,
      createdBy: adminUser._id,
    });

    const supportStaff = await User.create({
      email: 'support@euroasiangroup.com',
      password: 'Support123!',
      firstName: 'Emma',
      lastName: 'Support',
      phone: '+1-800-ADMIN-003',
      globalRole: 'admin',
      tenantId: adminTenant._id,
      tenantRoleId: supportStaffRole._id,
      isActive: true,
      createdBy: adminUser._id,
    });

    logger.info(`✅ Admin Users created: ${salesManager.email}, ${supportStaff.email}`);

    // ========================================
    // STEP 3: Create Customer Tenant & Users
    // ========================================
    logger.info('\n🚢 Creating Customer Portal (ABC Shipping)...');

    const customerTenant = await Tenant.create({
      name: 'abc-shipping-company',
      type: 'customer',
      organizationName: 'ABC Shipping Company Ltd',
      email: 'contact@abcshipping.com',
      phone: '+1-555-SHIP-001',
      address: {
        street: '789 Harbor Drive',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        postalCode: '33101',
      },
      isActive: true,
      metadata: { 
        description: 'International Ship Management Company',
        fleetSize: 25,
        industry: 'Maritime',
      },
      createdBy: adminUser._id,
    });

    logger.info(`✅ Customer Tenant created: ${customerTenant.name}`);

    // Create Customer Admin (no role - full access to their tenant)
    const customerAdmin = await User.create({
      email: 'admin@abcshipping.com',
      password: 'Customer123!',
      firstName: 'James',
      lastName: 'Wilson',
      phone: '+1-555-SHIP-001',
      globalRole: 'customer_admin',
      tenantId: customerTenant._id,
      tenantRoleId: null, // Tenant admin - full access
      isActive: true,
      createdBy: adminUser._id,
    });

    logger.info(`✅ Customer Admin created: ${customerAdmin.email}`);

    // Create Customer Roles
    const fleetManagerRole = await TenantRole.create({
      name: 'fleet-manager',
      displayName: 'Fleet Manager',
      tenantId: customerTenant._id,
      permissions: [
        'view_rfqs',
        'create_rfqs',
        'edit_rfqs',
        'approve_rfqs',
        'view_quotes',
        'compare_quotes',
        'select_quotes',
        'manage_team',
      ],
      description: 'Manage fleet and procurement',
      isActive: true,
      createdBy: customerAdmin._id,
    });

    const procurementOfficerRole = await TenantRole.create({
      name: 'procurement-officer',
      displayName: 'Procurement Officer',
      tenantId: customerTenant._id,
      permissions: [
        'view_rfqs',
        'create_rfqs',
        'edit_rfqs',
        'view_quotes',
        'compare_quotes',
      ],
      description: 'Create and manage purchase requests',
      isActive: true,
      createdBy: customerAdmin._id,
    });

    await TenantRole.create({
      name: 'technical-superintendent',
      displayName: 'Technical Superintendent',
      tenantId: customerTenant._id,
      permissions: [
        'view_rfqs',
        'comment_rfqs',
        'view_technical_specs',
        'review_quotes',
      ],
      description: 'Technical review and specifications',
      isActive: true,
      createdBy: customerAdmin._id,
    });

    await TenantRole.create({
      name: 'viewer',
      displayName: 'Viewer (Read-only)',
      tenantId: customerTenant._id,
      permissions: [
        'view_rfqs',
        'view_quotes',
      ],
      description: 'Read-only access to RFQs and quotes',
      isActive: true,
      createdBy: customerAdmin._id,
    });

    logger.info(`✅ Customer Roles created: 4 roles`);

    // Create Customer Users with Roles
    const fleetManager = await User.create({
      email: 'fleet.manager@abcshipping.com',
      password: 'Fleet123!',
      firstName: 'Michael',
      lastName: 'Roberts',
      phone: '+1-555-SHIP-002',
      globalRole: 'customer_admin',
      tenantId: customerTenant._id,
      tenantRoleId: fleetManagerRole._id,
      isActive: true,
      createdBy: customerAdmin._id,
    });

    const procurementOfficer = await User.create({
      email: 'procurement@abcshipping.com',
      password: 'Procure123!',
      firstName: 'Sarah',
      lastName: 'Chen',
      phone: '+1-555-SHIP-003',
      globalRole: 'customer_admin',
      tenantId: customerTenant._id,
      tenantRoleId: procurementOfficerRole._id,
      isActive: true,
      createdBy: customerAdmin._id,
    });

    logger.info(`✅ Customer Users created: ${fleetManager.email}, ${procurementOfficer.email}`);

    // ========================================
    // STEP 4: Create Vendor Tenant & Users
    // ========================================
    logger.info('\n🔧 Creating Vendor Portal (XYZ Marine Parts)...');

    const vendorTenant = await Tenant.create({
      name: 'xyz-marine-parts',
      type: 'vendor',
      organizationName: 'XYZ Marine Parts Supplier Ltd',
      email: 'contact@xyzmarineparts.com',
      phone: '+1-555-PART-001',
      address: {
        street: '321 Industrial Blvd',
        city: 'Houston',
        state: 'TX',
        country: 'USA',
        postalCode: '77001',
      },
      isActive: true,
      metadata: { 
        description: 'Marine Spare Parts Supplier',
        specialization: 'Engine Parts, Electronics',
        yearsInBusiness: 15,
      },
      createdBy: adminUser._id,
    });

    logger.info(`✅ Vendor Tenant created: ${vendorTenant.name}`);

    // Create Vendor Admin (no role - full access to their tenant)
    const vendorAdmin = await User.create({
      email: 'admin@xyzmarineparts.com',
      password: 'Vendor123!',
      firstName: 'Robert',
      lastName: 'Martinez',
      phone: '+1-555-PART-001',
      globalRole: 'vendor_admin',
      tenantId: vendorTenant._id,
      tenantRoleId: null, // Tenant admin - full access
      isActive: true,
      createdBy: adminUser._id,
    });

    logger.info(`✅ Vendor Admin created: ${vendorAdmin.email}`);

    // Create Vendor Roles
    const vendorSalesManagerRole = await TenantRole.create({
      name: 'sales-manager',
      displayName: 'Sales Manager',
      tenantId: vendorTenant._id,
      permissions: [
        'view_rfqs',
        'view_rfq_details',
        'create_quotes',
        'edit_quotes',
        'submit_quotes',
        'approve_quotes',
        'view_quote_history',
        'manage_pricing',
        'manage_team',
      ],
      description: 'Manage sales and quotes',
      isActive: true,
      createdBy: vendorAdmin._id,
    });

    const vendorSalesExecutiveRole = await TenantRole.create({
      name: 'sales-executive',
      displayName: 'Sales Executive',
      tenantId: vendorTenant._id,
      permissions: [
        'view_rfqs',
        'view_rfq_details',
        'create_quotes',
        'edit_quotes',
        'submit_quotes',
      ],
      description: 'Create and submit quotes to customers',
      isActive: true,
      createdBy: vendorAdmin._id,
    });

    await TenantRole.create({
      name: 'technical-specialist',
      displayName: 'Technical Specialist',
      tenantId: vendorTenant._id,
      permissions: [
        'view_rfqs',
        'view_rfq_details',
        'view_technical_specs',
        'review_quotes',
        'add_technical_notes',
      ],
      description: 'Technical review and specifications',
      isActive: true,
      createdBy: vendorAdmin._id,
    });

    await TenantRole.create({
      name: 'viewer',
      displayName: 'Viewer (Read-only)',
      tenantId: vendorTenant._id,
      permissions: [
        'view_rfqs',
        'view_quotes',
      ],
      description: 'Read-only access to RFQs and quotes',
      isActive: true,
      createdBy: vendorAdmin._id,
    });

    logger.info(`✅ Vendor Roles created: 4 roles`);

    // Create Vendor Users with Roles
    const vendorSalesManager = await User.create({
      email: 'sales.manager@xyzmarineparts.com',
      password: 'VSales123!',
      firstName: 'David',
      lastName: 'Thompson',
      phone: '+1-555-PART-002',
      globalRole: 'vendor_admin',
      tenantId: vendorTenant._id,
      tenantRoleId: vendorSalesManagerRole._id,
      isActive: true,
      createdBy: vendorAdmin._id,
    });

    const vendorSalesExec = await User.create({
      email: 'sales@xyzmarineparts.com',
      password: 'VSalesExec123!',
      firstName: 'Linda',
      lastName: 'Anderson',
      phone: '+1-555-PART-003',
      globalRole: 'vendor_admin',
      tenantId: vendorTenant._id,
      tenantRoleId: vendorSalesExecutiveRole._id,
      isActive: true,
      createdBy: vendorAdmin._id,
    });

    logger.info(`✅ Vendor Users created: ${vendorSalesManager.email}, ${vendorSalesExec.email}`);

    // ========================================
    // Summary
    // ========================================
    logger.info('\n' + '='.repeat(60));
    logger.info('🎉 COMPLETE SEED SUCCESSFUL!');
    logger.info('='.repeat(60));
    logger.info('\n📊 SUMMARY:');
    logger.info(`✅ Tenants created: 4`);
    logger.info(`✅ Tenant Roles created: 16`);
    logger.info(`✅ Users created: 12`);
    logger.info('\n' + '='.repeat(60));
    logger.info('🔐 PORTAL CREDENTIALS:');
    logger.info('='.repeat(60));
    
    logger.info('\n📱 TECH PORTAL (http://localhost:3000)');
    logger.info('  Tenant Admin:');
    logger.info('    Email: tech@euroasiangroup.com');
    logger.info('    Password: TechAdmin123!');
    logger.info('  Server Watchkeeper:');
    logger.info('    Email: watchkeeper@euroasiangroup.com');
    logger.info('    Password: Watch123!');
    logger.info('  Maintainer:');
    logger.info('    Email: maintainer@euroasiangroup.com');
    logger.info('    Password: Maintain123!');

    logger.info('\n🏢 ADMIN PORTAL (http://localhost:3001)');
    logger.info('  Tenant Admin:');
    logger.info('    Email: admin@euroasiangroup.com');
    logger.info('    Password: Admin123!');
    logger.info('  Sales Manager:');
    logger.info('    Email: sales.manager@euroasiangroup.com');
    logger.info('    Password: Sales123!');
    logger.info('  Support Staff:');
    logger.info('    Email: support@euroasiangroup.com');
    logger.info('    Password: Support123!');

    logger.info('\n🚢 CUSTOMER PORTAL (http://localhost:3002)');
    logger.info('  Tenant Admin:');
    logger.info('    Email: admin@abcshipping.com');
    logger.info('    Password: Customer123!');
    logger.info('  Fleet Manager:');
    logger.info('    Email: fleet.manager@abcshipping.com');
    logger.info('    Password: Fleet123!');
    logger.info('  Procurement Officer:');
    logger.info('    Email: procurement@abcshipping.com');
    logger.info('    Password: Procure123!');

    logger.info('\n🔧 VENDOR PORTAL (http://localhost:3003)');
    logger.info('  Tenant Admin:');
    logger.info('    Email: admin@xyzmarineparts.com');
    logger.info('    Password: Vendor123!');
    logger.info('  Sales Manager:');
    logger.info('    Email: sales.manager@xyzmarineparts.com');
    logger.info('    Password: VSales123!');
    logger.info('  Sales Executive:');
    logger.info('    Email: sales@xyzmarineparts.com');
    logger.info('    Password: VSalesExec123!');

    logger.info('\n' + '='.repeat(60));

    await mongoose.connection.close();
    logger.info('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Seed error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedCompleteData();

