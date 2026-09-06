"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModel = void 0;
const mongoose_1 = require("mongoose");
const statuses = ['Applied', 'Interview', 'Rejected', 'Offer'];
const applicationSchema = new mongoose_1.Schema({
    company: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    role: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    appliedDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Applied date cannot be in the future'
        }
    },
    status: {
        type: String,
        enum: statuses,
        required: true,
        default: 'Applied'
    },
    resumeUrl: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: '',
        maxlength: 2000
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.ApplicationModel = (0, mongoose_1.model)('Application', applicationSchema);
