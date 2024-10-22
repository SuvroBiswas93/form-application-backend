const router = require('express').Router();
const UserService = require('../services/UserService');
const authSchemas = require("../validations/authValidation");
const {validate} = require("../middlewares/validator");

router.route("/login")
.post(validate(authSchemas.loginSchema), UserService.login);
router.post("/register", validate(authSchemas.registrationSchema) ,UserService.register);
router.get("/all", UserService.getUsers)

module.exports = router;