const router = require('express').Router()
const {createForm, formsGet, getFormById, deleteForm, editForm, getAllFormsOfUser, allResponses, submitResponse, getResponse} = require('../services/FormService')
const {validate} = require("../middlewares/validator");
const formSchemas = require("../validations/formValidation");

router.route("/create").post( validate(formSchemas.createFormSchema),createForm);
router.route("/forms").get(formsGet);
router.route("/form/:formId").get(validate(formSchemas.getFormById),getFormById);
router.route("/deleteform/:formId/:userId").delete(validate(formSchemas.deleteForm),deleteForm);
router.route("/editform").put(editForm);
router.route("/getuserforms/:userId").get(getAllFormsOfUser);

router.route("/addresponse").post(submitResponse);
router.route("/responses").get(allResponses);

router.route("/getresponse/:formId").get(getResponse);



module.exports = router;