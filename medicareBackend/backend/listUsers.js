// List All Users Script
const mongoose = require('mongoose');
const User = require('./models/User');
const Hospital = require('./models/Hospital');
require('dotenv').config();

const listUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find().populate('hospital', 'name').select('-password');
    
    console.log('📊 MHAAS System Users:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (users.length === 0) {
      console.log('No users found in the system.');
      return;
    }

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🛡️ Role: ${user.role}`);
      if (user.phoneNumber) console.log(`   📱 Phone: ${user.phoneNumber}`);
      if (user.hospital) console.log(`   🏥 Hospital: ${user.hospital.name}`);
      if (user.specialty) console.log(`   👨‍⚕️ Specialty: ${user.specialty}`);
    });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Users: ${users.length}`);
    
    // Count by role
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📈 Users by Role:');
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`   ${role}: ${count}`);
    });
    
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the script
listUsers();
