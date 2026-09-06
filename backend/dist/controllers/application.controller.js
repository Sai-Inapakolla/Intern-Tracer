"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listApplications = listApplications;
exports.getApplication = getApplication;
exports.createApplication = createApplication;
exports.updateApplication = updateApplication;
exports.deleteApplication = deleteApplication;
exports.uploadApplicationResume = uploadApplicationResume;
const mongoose_1 = __importDefault(require("mongoose"));
const Application_1 = require("../models/Application");
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
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw badRequest('Invalid application id');
    }
}
function getIdParam(req) {
    return Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
}
async function listApplications(_req, res, next) {
    try {
        const applications = await Application_1.ApplicationModel.find().sort({ createdAt: -1 });
        res.json(applications);
    }
    catch (error) {
        next(error);
    }
}
async function getApplication(req, res, next) {
    try {
        const id = getIdParam(req);
        validateObjectId(id);
        const application = await Application_1.ApplicationModel.findById(id);
        if (!application) {
            throw notFound('Application not found');
        }
        res.json(application);
    }
    catch (error) {
        next(error);
    }
}
async function createApplication(req, res, next) {
    try {
        const application = await Application_1.ApplicationModel.create(req.body);
        res.status(201).json(application);
    }
    catch (error) {
        next(error);
    }
}
async function updateApplication(req, res, next) {
    try {
        const id = getIdParam(req);
        validateObjectId(id);
        const application = await Application_1.ApplicationModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!application) {
            throw notFound('Application not found');
        }
        res.json(application);
    }
    catch (error) {
        next(error);
    }
}
async function deleteApplication(req, res, next) {
    try {
        const id = getIdParam(req);
        validateObjectId(id);
        const application = await Application_1.ApplicationModel.findByIdAndDelete(id);
        if (!application) {
            throw notFound('Application not found');
        }
        res.json({ message: 'Application deleted successfully' });
    }
    catch (error) {
        next(error);
    }
}
async function uploadApplicationResume(req, res, next) {
    try {
        if (!req.file) {
            throw badRequest('Resume file is required');
        }
        const resumeUrl = `/uploads/resumes/${req.file.filename}`;
        res.status(201).json({ resumeUrl });
    }
    catch (error) {
        next(error);
    }
}
