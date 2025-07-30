const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Hospital = require('./models/Hospital');

const createMultipleHospitals = async () => {
  try {
    const hospitalsToCreate = [
      {
        name: 'Central Maternal Health Clinic',
        hospitalCode: 'HD001',
        address: '123 Health Avenue, Nairobi, Kenya',
        phone: '+254712345678',
        email: 'admin@centralmaternalhealth.ke',
        description: 'A leading maternal health facility providing comprehensive care for expectant mothers.'
      },
      {
        name: 'District Maternal Care Center',
        hospitalCode: 'HD002',
        address: '456 Care Street, Mombasa, Kenya',
        phone: '+254722345678',
        email: 'admin@districtmaternalcare.ke',
        description: 'A district-level maternal health facility serving the coastal region.'
      },
      {
        name: 'Rural Health Clinic Kisumu',
        hospitalCode: 'HD003',
        address: '789 Rural Road, Kisumu, Kenya',
        phone: '+254732345678',
        email: 'admin@ruralkisumu.ke',
        description: 'Serving rural communities in the Kisumu region with quality maternal healthcare.'
      },
      {
        name: 'Community Health Center Eldoret',
        hospitalCode: 'HD004',
        address: '321 Community Lane, Eldoret, Kenya',
        phone: '+254742345678',
        email: 'admin@eldoretcommunity.ke',
        description: 'Community-focused maternal health services in Eldoret and surrounding areas.'
      },
      {
        name: 'Urban Maternal Clinic Nakuru',
        hospitalCode: 'HD005',
        address: '654 Urban Street, Nakuru, Kenya',
        phone: '+254752345678',
        email: 'admin@nakurumaternal.ke',
        description: 'Modern maternal health facility serving urban and peri-urban communities in Nakuru.'
      }
    ];

    for (const hospitalData of hospitalsToCreate) {
      const existingHospital = await Hospital.findOne({ hospitalCode: hospitalData.hospitalCode });
      if (!existingHospital) {
        const hospital = await Hospital.create(hospitalData);
        console.log(`Created hospital: ${hospital.name} (${hospital.hospitalCode})`);
      } else {
        console.log(`Hospital ${hospitalData.hospitalCode} already exists`);
      }
    }

    console.log('Hospital creation completed!');
  } catch (error) {
    console.error('Error creating hospitals:', error);
  } finally {
    mongoose.connection.close();
  }
};

createMultipleHospitals();
