const cloudinary = require('cloudinary').v2;
const streamifier = require("streamifier");
const {CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_SECRET_KEY} = require("../config/environment");
const { ApiError } = require('../utils/ApiError');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
});

const uploadImageBufferToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const { buffer } = file;
    if(! buffer instanceof Buffer) {
      throw new ApiError(500, "Buffer expected" );
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' }, // Set resource type to 'image'
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
    // Write the buffer to the upload stream
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = {cloudinary, uploadImageBufferToCloudinary}