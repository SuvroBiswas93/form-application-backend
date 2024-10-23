const router = require('express').Router()
const {createForm, formsGet, getFormById, deleteForm, editForm, allResponses, submitResponse, getResponse} = require('../controllers/form')
const {validate} = require("../middlewares/validator");
const formSchemas = require("../validations/formValidation");


// Form responses (specific formId)
router.route("/:formId/responses")
    .post(validate(formSchemas.submitResponse), submitResponse)
    .get(getResponse);

// All responses (without specific formId)
router.route("/responses").get(allResponses);

// CRUD operations for a specific form
router.route("/:formId")
    .get(validate(formSchemas.getFormById), getFormById)
    .put(validate(formSchemas.editFormSchema), editForm);

// Delete form with both formId and userId (more specific route)
router.route("/:formId/:userId")
    .delete(validate(formSchemas.deleteForm), deleteForm);

// Create and fetch all forms (generic routes at the bottom)
router.route("/")
    .post(validate(formSchemas.createFormSchema), createForm)
    .get(formsGet);

module.exports = router;