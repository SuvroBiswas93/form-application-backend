const router = require('express').Router();
const userController = require('../controllers/user');

router.get("/", userController.getUsers);
router.route("/:userId/forms").get(userController.getAllFormsOfUser);

module.exports = router;