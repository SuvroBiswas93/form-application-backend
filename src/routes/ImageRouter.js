const router = require('express').Router();
const imageController = require("../controllers/image");


router.get("/", imageController.getImages);
router.post("/",imageController.uploadSingleImage);

module.exports = router;