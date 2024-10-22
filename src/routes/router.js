const router = require('express').Router();

const UserRouter = require('./UserRouter');
const FormRouter = require('./FormRouter');
const ImageRouter = require("./ImageRouter");
const AuthRouter = require("./AuthRotuer");


router.use("/auth", AuthRouter)
router.use('/users', UserRouter);
router.use('/forms', FormRouter);
router.use("/images", ImageRouter);


module.exports = router;