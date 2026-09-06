require('dotenv').config();

const env = {
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internship-tracker',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 5)
};

module.exports = { env };
