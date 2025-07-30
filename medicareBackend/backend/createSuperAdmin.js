// Create Default Super Admin Script
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { USER_ROLES } = require('./utils/constants');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: USER_ROLES.SUPER_ADMIN });
    
    if (existingSuperAdmin) {
      console.log('Super Admin already exists:');
      console.log('Email:', existingSuperAdmin.email);
      console.log('Name:', existingSuperAdmin.name);
      return;
    }

    // Create default super admin
    const defaultSuperAdmin = {
      name: 'MHAAS Super Administrator',
      email: 'superadmin@mhaas.ke',
      password: 'SuperAdmin@2025',
      role: USER_ROLES.SUPER_ADMIN,
      phoneNumber: '+254700000000'
    };

    const superAdmin = await User.create(defaultSuperAdmin);
    
    console.log('✅ Default Super Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: superadmin@mhaas.ke');
    console.log('🔑 Password: SuperAdmin@2025');
    console.log('👤 Name: MHAAS Super Administrator');
    console.log('📱 Phone: +254700000000');
    console.log('🛡️ Role: Super Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createSuperAdmin();
