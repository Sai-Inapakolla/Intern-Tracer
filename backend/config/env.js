require('dotenv').config();

const env = {
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internship-tracker',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 5),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  cloudinaryUrl: process.env.CLOUDINARY_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'internship_tracker_super_secret_jwt_key_2026_sai',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

module.exports = { env };
