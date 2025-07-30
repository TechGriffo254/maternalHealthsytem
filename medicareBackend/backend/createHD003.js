const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Hospital = require('./models/Hospital');

const createHD003 = async () => {
  try {
    // Check if test hospital already exists
    const existingHospital = await Hospital.findOne({ hospitalCode: 'HD003' });
    if (existingHospital) {
      console.log('Test hospital HD003 already exists:', existingHospital);
      return;
    }

    // Create additional test hospital
    const hospital = await Hospital.create({
      name: 'Medi Heal Hospital',
      hospitalCode: 'HD003',
      address: '789 Medical Drive, Kisumu, Kenya',
      phone: '+254700411104',
      email: 'admin@mediheal.co.ke',
      description: 'A modern medical facility specializing in maternal and child health care.'
    });

    console.log('HD003 hospital created successfully:', hospital);
  } catch (error) {
    console.error('Error creating HD003 hospital:', error);
  } finally {
    mongoose.connection.close();
  }
};

createHD003();
