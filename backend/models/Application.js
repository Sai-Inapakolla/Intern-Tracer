const mongoose = require('mongoose');

const statuses = ['Applied', 'Interview', 'Rejected', 'Offer'];

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
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
      required: true
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
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Application', applicationSchema);
