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
    const applications = await Application.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    next(error);
  }
}

async function getApplication(req, res, next) {
  try {
    validateObjectId(req.params.id);
    const application = await Application.findOne({ _id: req.params.id, userId: req.user.id });
    if (!application) throw notFound('Application not found');
    res.json(application);
  } catch (error) {
    next(error);
  }
}

async function createApplication(req, res, next) {
  try {
    const application = await Application.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
}

async function updateApplication(req, res, next) {
  try {
    validateObjectId(req.params.id);
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
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
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!application) throw notFound('Application not found');
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function uploadApplicationResume(req, res, next) {
  try {
    if (!req.file) throw badRequest('Resume file is required');

    if (!isCloudinaryConfigured) {
      throw badRequest('Cloudinary is not configured. Please provide CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    res.status(201).json({ resumeUrl: result.secure_url });
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


