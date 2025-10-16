import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import logger from '../config/logger';

dotenv.config();

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/euroasiangroup_erp';
    
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected for seeding');

    // Check if tech user already exists
    const existingTech = await User.findOne({ globalRole: 'tech' });
    if (existingTech) {
      logger.info('Tech user already exists, skipping seed');
      await mongoose.connection.close();
      return;
    }

    // Create Tech super-admin user
    const techUser = await User.create({
      email: 'tech@euroasiangroup.com',
      password: 'TechAdmin123!',
      firstName: 'Tech',
      lastName: 'Administrator',
      phone: '+1234567890',
      globalRole: 'tech',
      isActive: true,
    });

    logger.info('✅ Tech user created successfully!');
    logger.info(`Email: ${techUser.email}`);
    logger.info('Password: TechAdmin123!');
    logger.info('Role: tech (super-admin)');

    // Create a sample admin user
    const adminUser = await User.create({
      email: 'admin@euroasiangroup.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567891',
      globalRole: 'admin',
      isActive: true,
      createdBy: techUser._id,
    });

    logger.info('✅ Admin user created successfully!');
    logger.info(`Email: ${adminUser.email}`);
    logger.info('Password: Admin123!');
    logger.info('Role: admin');

    await mongoose.connection.close();
    logger.info('Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Seed error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();

