const cloudinary = require('cloudinary').v2;
const { env } = require('./env');

const isCloudinaryConfigured = Boolean(
  env.cloudinaryUrl || 
  (env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret)
);

if (isCloudinaryConfigured) {
  if (env.cloudinaryUrl) {
    // CLOUDINARY_URL format handles configuration automatically
  } else {
    cloudinary.config({
      cloud_name: env.cloudinaryCloudName,
      api_key: env.cloudinaryApiKey,
      api_secret: env.cloudinaryApiSecret,
      secure: true
    });
  }
}

const path = require('path');

async function uploadToCloudinary(fileBuffer, originalFilename) {
  return new Promise((resolve, reject) => {
    const ext = path.extname(originalFilename || '').toLowerCase() || '.pdf';
    const baseName = path.basename(originalFilename || 'resume', ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filenameWithExt = `${Date.now()}-${baseName}${ext}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'internship-tracker/resumes',
        resource_type: 'raw',
        public_id: filenameWithExt
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary
};
