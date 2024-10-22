const multer = require("multer");
const path = require("path");
const {uploadImageBufferToCloudinary} = require("../lib/cloudinary");


const isDev = process.env.NODE_ENV === "development" || process.env.NODE_ENV == "develop"


const publicFolderPath = path.join(__dirname, "../../public");

// Filter for allowed file types (e.g., more image types like bmp, webp, svg)
const fileFilter = (_, file, cb) => {
  // Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|bmp|webp|svg/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif, bmp, webp, svg)"));
  }
};

//multer config
const getStorage = ()=> {
  if(isDev) {
    return multer.diskStorage({
      destination: publicFolderPath,
      filename(req, file, cb) {
        cb(null, "google-form-content-questions-" + Date.now() + path.extname(file.originalname));
      },
    });
  }
  return multer.memoryStorage();
  
}


const imageUploader = multer({
  storage: getStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

const isMulterError = (err) => {
    if (err instanceof multer.MulterError) { 
        return true;
    }
    return false;
}

const uploadSingleImage = async (imageName, req,res)=> {
  return new Promise((resolve, reject)=> {
    imageUploader.single(imageName)(req,res, async function(error) {
        if(error) {
            if(isMulterError(error)) {
                return reject(new ApiError(400, error.message));
            }
            return reject(new ApiError(500, error.message));
         }
         try {
            if(isDev) {
              return resolve(req.file.filename);
            }
            const uploadedImage = await uploadImageBufferToCloudinary(req.file);
            return resolve(uploadedImage.secure_url);
         } catch(error) {
            return reject(error);
         }
    });
})
}

module.exports  = {
    imageUploader,
    isMulterError,
    uploadSingleImage
};