"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadResume = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const env_1 = require("../config/env");
const uploadDir = path_1.default.resolve(process.cwd(), 'uploads', 'resumes');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const safeOriginal = file.originalname.replace(/\s+/g, '_');
        cb(null, `${Date.now()}-${safeOriginal}`);
    }
});
const allowedExt = new Set(['.pdf', '.doc', '.docx']);
exports.uploadResume = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: env_1.env.maxFileSizeMb * 1024 * 1024
    },
    fileFilter: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (!allowedExt.has(ext)) {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
            return;
        }
        cb(null, true);
    }
});
