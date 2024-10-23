const formService = require("../services/FormService");
const userService = require("../services/UserService");
const { ApiError } = require("../utils/ApiError");

module.exports = {
    formsGet: async (req, res) => {
        const forms = await formService.getAllForms();
        return res.status(200).json(forms);
    },

    createForm: async (req, res) => {
        const formData = {
            createdBy: req.body.createdBy,
            name: req.body.name,
            description: req.body.description,
            questions: req.body.questions,
        };

        const form = await formService.createForm(formData);
        return res.status(201).json(form);
    },

    getFormById: async (req, res) => {
        const formId = req.params.formId;
        const form = await formService.getFormById(formId);
        if (!form) {
            throw new ApiError(404, "Form not found");
        }
        return res.status(200).json(form);
    },

    deleteForm: async (req, res) => {
        const formId = req.params.formId;
        const userId = req.params.userId;
       
        const form = await formService.getFormById(formId);
       console.log(form, form.createdBy._id.toString())
        if (form && form.createdBy._id.toString() === userId) {
            await formService.deleteFormById(formId);
            return res.status(200).json(null);
        }

        return res.status(400).json({ message: "Invalid request" });
    },

    editForm: async (req, res) => {
        const formId = req.params.formId;
        const data = req.body;
        const updatedForm = await formService.updateFormById(formId, data);
        return res.status(200).json(updatedForm);
    },

    submitResponse: async (req, res) => {
        const formId = req.params.formId;
        if(!formId) {
            throw new ApiError(400, "formId is required on path params");
        }
        const data = {
            userId: req.body.userId,
            responses: req.body.responses,
        };
        const formResponse = await formService.saveFormResponse(formId, data);
        return res.status(200).json(formResponse);
    },

    allResponses: async (req, res) => {
        const responses = await formService.getAllFormResponses();
        return res.status(200).json(responses);
    },

    getResponse: async (req, res) => {
        const formId = req.params.formId;
        const responses = await formService.getFromResponsesByFormId(formId);
        return res.status(200).json(responses);
    },
};