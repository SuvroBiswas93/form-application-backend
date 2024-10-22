const router = require('express').Router()
const {createForm, formsGet, getFormById, deleteForm, editForm, allResponses, submitResponse, getResponse} = require('../controllers/form')
const {validate} = require("../middlewares/validator");
const formSchemas = require("../validations/formValidation");

router.route("/").post( validate(formSchemas.createFormSchema),createForm);
router.route("/").get(formsGet);
router.route("/:formId").get(validate(formSchemas.getFormById),getFormById);
router.route("/:formId/:userId").delete(validate(formSchemas.deleteForm),deleteForm);
router.route("/:formId").put( validate(formSchemas.editFormSchema), editForm);
router.route("/responses").post(submitResponse);
router.route("/responses").get(allResponses);

router.route("/:formId/responses").get(getResponse);


module.exports = router;