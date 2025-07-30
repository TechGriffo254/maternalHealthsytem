// config/cloudinary.js

const cloudinary = require('cloudinary').v2;
const configureCloudinary = () => {
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log(' Cloudinary Configured');
  } else {
    console.warn('⚠️Cloudinary environment variables missing.');
  }
};

module.exports = {
  configureCloudinary,
  cloudinary, // Exported in case you want to use cloudinary.uploader in other files
};
