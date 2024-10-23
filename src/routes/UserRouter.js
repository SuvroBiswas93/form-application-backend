const router = require('express').Router();
const userController = require('../controllers/user');

router.get("/", userController.getUsers);
router.route("/:userId/forms").get(userController.getAllFormsOfUser);
router.get("/:userId", userController.getUserById);

module.exports = router;