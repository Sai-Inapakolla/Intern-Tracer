"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: Number(process.env.PORT || 3000),
    mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internship-tracker',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 5)
};
