const router = require('express').Router();
const userController = require('../controllers/user');
const authSchemas = require("../validations/authValidation");
const {validate} = require("../middlewares/validator");

router.route("/login")
.post(validate(authSchemas.loginSchema), userController.login);
router.post("/register", validate(authSchemas.registrationSchema) ,userController.register);
module.exports = router;