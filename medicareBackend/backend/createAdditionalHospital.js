const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Hospital = require('./models/Hospital');

const createAdditionalHospital = async () => {
  try {
    // Check if test hospital already exists
    const existingHospital = await Hospital.findOne({ hospitalCode: 'HD002' });
    if (existingHospital) {
      console.log('Test hospital HD002 already exists:', existingHospital);
      return;
    }

    // Create additional test hospital
    const hospital = await Hospital.create({
      name: 'District Maternal Care Center',
      hospitalCode: 'HD002',
      address: '456 Care Street, Mombasa, Kenya',
      phone: '+254722345678',
      email: 'admin@districtmaternalcare.ke',
      description: 'A district-level maternal health facility serving the coastal region.'
    });

    console.log('Additional test hospital created successfully:', hospital);
  } catch (error) {
    console.error('Error creating additional test hospital:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdditionalHospital();
