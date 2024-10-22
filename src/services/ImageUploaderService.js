const multer = require("multer");
const path = require("path");


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
const storage = multer.diskStorage({
  destination: publicFolderPath,
  filename(req, file, cb) {
    cb(null, "google-form-content-questions-" + Date.now() + path.extname(file.originalname));
  },
});


const imageUploader = multer({
  storage: storage,
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
const handleMulterError = ( res, err) => {
    // Handle Multer errors (e.g., file too large)
    if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Maximum size allowed is 5 MB." });
    }
    return res.status(400).json({ error: err.message });
}


module.exports  = {
    imageUploader,
    isMulterError,
    handleMulterError
};