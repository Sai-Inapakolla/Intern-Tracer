const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Application = require('../models/Application');
const { isCloudinaryConfigured, uploadToCloudinary } = require('../config/cloudinary');

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function notFound(message) {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

function validateObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw badRequest('Invalid application id');
  }
}

async function listApplications(req, res, next) {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    next(error);
  }
}

async function getApplication(req, res, next) {
  try {
    validateObjectId(req.params.id);
    const application = await Application.findById(req.params.id);
    if (!application) throw notFound('Application not found');
    res.json(application);
  } catch (error) {
    next(error);
  }
}

async function createApplication(req, res, next) {
  try {
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
}

async function updateApplication(req, res, next) {
  try {
    validateObjectId(req.params.id);
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!application) throw notFound('Application not found');
    res.json(application);
  } catch (error) {
    next(error);
  }
}

async function deleteApplication(req, res, next) {
  try {
    validateObjectId(req.params.id);
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) throw notFound('Application not found');
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function uploadApplicationResume(req, res, next) {
  try {
    if (!req.file) throw badRequest('Resume file is required');

    let resumeUrl = '';

    if (isCloudinaryConfigured) {
      const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      resumeUrl = result.secure_url;
    } else {
      const uploadDir = path.resolve(process.cwd(), 'uploads', 'resumes');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const safeOriginal = req.file.originalname.replace(/\s+/g, '_');
      const filename = `${Date.now()}-${safeOriginal}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      resumeUrl = `/uploads/resumes/${filename}`;
    }

    res.status(201).json({ resumeUrl });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  uploadApplicationResume
};

