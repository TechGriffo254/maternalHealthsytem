const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Hospital = require('./models/Hospital');

const createTestHospital = async () => {
  try {
    // Check if test hospital already exists
    const existingHospital = await Hospital.findOne({ hospitalCode: 'HD001' });
    if (existingHospital) {
      console.log('Test hospital HD001 already exists:', existingHospital);
      return;
    }

    // Create test hospital
    const hospital = await Hospital.create({
      name: 'Central Maternal Health Clinic',
      hospitalCode: 'HD001',
      address: '123 Health Avenue, Nairobi, Kenya',
      phone: '+254712345678',
      email: 'admin@centralmaternalhealth.ke',
      description: 'A leading maternal health facility providing comprehensive care for expectant mothers.'
    });

    console.log('Test hospital created successfully:', hospital);
  } catch (error) {
    console.error('Error creating test hospital:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestHospital();
