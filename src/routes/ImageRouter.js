const router = require('express').Router();
const ImageService = require("../services/ImageService");


router.get("/", ImageService.getImages);
router.post("/",ImageService.uploadSingleImage);

module.exports = router;