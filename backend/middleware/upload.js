const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { env } = require('../config/env');

const uploadDir = path.resolve(process.cwd(), 'uploads', 'resumes');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeOriginal = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeOriginal}`);
  }
});

const allowedExt = new Set(['.pdf', '.doc', '.docx']);

const uploadResume = multer({
  storage,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.has(ext)) {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
      return;
    }
    cb(null, true);
  }
});

module.exports = { uploadResume };
