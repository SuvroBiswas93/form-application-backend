
exports.PORT  = parseInt(process.env.PORT || 3000);

exports.MONGO_URL = process.env.MONGO_URL;

exports.SECRET_KEY = process.env.SECRET_KEY || "secrets858585";
//cloudinary env
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || ""
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || ""
exports.CLOUDINARY_SECRET_KEY = process.env.CLOUDINARY_SECRET_KEY || ""