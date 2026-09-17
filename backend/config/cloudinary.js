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

async function uploadToCloudinary(fileBuffer, originalFilename) {
  return new Promise((resolve, reject) => {
    const safeName = (originalFilename || 'resume').replace(/[^a-zA-Z0-9._-]/g, '_');
    const publicId = `${Date.now()}-${safeName}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'internship-tracker/resumes',
        resource_type: 'auto',
        public_id: publicId,
        use_filename: true,
        unique_filename: true
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
