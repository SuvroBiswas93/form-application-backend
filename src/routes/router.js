const router = require('express').Router();


const UserRouter = require('./UserRouter');
const FormRouter = require('./FormRouter');
const ImageRouter = require("./ImageRouter");


router.use('/user', UserRouter);
router.use('/form', FormRouter);
router.use("/images", ImageRouter);


module.exports = router;