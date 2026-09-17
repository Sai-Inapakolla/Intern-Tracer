const path = require('path');
const multer = require('multer');
const { env } = require('../config/env');

const storage = multer.memoryStorage();

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

