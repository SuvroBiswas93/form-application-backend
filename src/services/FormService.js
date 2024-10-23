const mongoose = require("mongoose");
const FormModel = require('../model/Form');
const UserModel = require('../model/User');
const QuestionModel = require('../model/Question');
const ResponseModel = require('../model/Response');
const AnswerModel = require('../model/Answer');
const { ApiError } = require('../utils/ApiError');
const { ValidationError } = require("yup");

module.exports = {
    getAllForms: async () => {
        return await FormModel.find()
            .populate('createdBy', 'name email')
            .populate('questions')
            .lean();
    },

    getFormsByUserId: async (userId) => {
        return await FormModel.find({ createdBy: userId })
            .populate('createdBy', 'name email')
            .lean();
    },
    createForm: async (formData) => {
        const { createdBy, name, description, questions } = formData;

        // Verify if the user exists
        const user = await UserModel.findById(createdBy);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Create the form first
        const newForm = new FormModel({ createdBy, name, description });
        await newForm.save();

        // Bulk insert questions and associate them with the form
        const createdQuestions = await QuestionModel.insertMany(
            questions.map((q) => ({ ...q, form: newForm._id }))
        );

        // Update the form with question references
        newForm.questions = createdQuestions.map((q) => q._id);
        await newForm.save();

        // Add the form to the user's createdForms list
        user.createdForms.push(newForm._id);
        await user.save();

        return newForm;
    },

    getFormById: async (formId) => {
        const form = await FormModel.findById(formId)
            .populate('questions')
            .populate('createdBy', 'name email')
            .lean();

        if (!form) {
            throw new ApiError(404, 'Form not found');
        }

        return form;
    },

    deleteFormById: async (formId) => {
        // Step 1: Fetch all questions related to the form
        const questions = await QuestionModel.find({ form: formId });
    
        // Collect all related question IDs
        const questionIds = questions.map(q => q._id);
    
        // Step 2: Delete all answers associated with the questions
        await AnswerModel.deleteMany({ question: { $in: questionIds } });
    
        // Step 3: Delete all responses associated with the form
        await ResponseModel.deleteMany({ form: formId });
    
        // Step 4: Delete the questions associated with the form
        await QuestionModel.deleteMany({ _id: { $in: questionIds } });
    
        // Step 5: Delete the form itself
        return await FormModel.deleteOne({ _id: formId });
    },
    updateFormById: async (formId, data) => {
        const { questions = [], ...formData } = data;
    
        // Update the form (without questions)
        const updatedForm = await FormModel.findByIdAndUpdate(formId, formData, { new: true });
    
        // Fetch existing questions for this form
        const existingQuestions = await QuestionModel.find({ form: formId });
    
        // Separate new and existing questions by validating the ID
        const newQuestions = questions.filter(q => !mongoose.Types.ObjectId.isValid(q._id));
        const existingQuestionUpdates = questions.filter(q => mongoose.Types.ObjectId.isValid(q._id));
    
        // Perform bulk updates for existing questions
        if (existingQuestionUpdates.length > 0) {
            await QuestionModel.bulkWrite(
                existingQuestionUpdates.map(q => ({
                    updateOne: {
                        filter: { _id: q._id },
                        update: { $set: q }
                    }
                }))
            );
        }
    
        // Insert new questions
        const addedQuestions = await QuestionModel.insertMany(
            newQuestions.map(q => ({ ...q, form: formId }))
        );
    
        // Identify and remove questions that are not part of the update request
        const inputQuestionIds = existingQuestionUpdates.map(q => q._id.toString());
        const questionsToRemove = existingQuestions.filter(
            q => !inputQuestionIds.includes(q._id.toString())
        );
    
        if (questionsToRemove.length > 0) {
            await QuestionModel.deleteMany({ _id: { $in: questionsToRemove.map(q => q._id) } });
        }
    
        // Update form with the latest question IDs
        updatedForm.questions = [...inputQuestionIds, ...addedQuestions.map(q => q._id)];
        await updatedForm.save();
    
        return updatedForm;
    },
    
    getFromResponsesByFormId: async (formId) => {
        return await ResponseModel.find({ form: formId })
            .populate({
                path: 'answers',
                populate: { path: 'question', select: 'text' },
            })
            .populate('user', 'name email')
            .lean();
    },

    saveFormResponse : async (formId, data) => {
        const { userId, responses } = data;
    
        if (!Array.isArray(responses) || responses.length < 1) {
            throw new ApiError(400, 'Response should not be empty');
        }
    
        // Fetch the questions for the form
        const questions = await QuestionModel.find({ form: formId });
    
        if (!questions || questions.length < 1) {
            throw new ApiError(404, 'No questions found for the form');
        }
    
        // Map required and answered questions
        const requiredQuestions = questions.filter(q => q.required);
        const answeredQuestions = responses.map(res => res.questionId);
    
        // Collect missing required questions as key-value pairs
        const missingRequiredQuestions = requiredQuestions
            .filter(q => !answeredQuestions.includes(q._id.toString()))
            .reduce((acc, q) => {
                acc[q._id.toString()] = `${q.text} is required`;
                return acc;
            }, {});
    
        if (Object.keys(missingRequiredQuestions).length > 0) {
            throw new ApiError(400, missingRequiredQuestions)
            
        }
    
        // Create the response
        const newResponse = new ResponseModel({ form: formId, user: userId });
        await newResponse.save();
    
        // Bulk create answers
        const answers = responses.map(res => ({
            response: newResponse._id,
            question: res.questionId,
            answer: res.answer,
        }));
    
        const savedAnswers = await AnswerModel.insertMany(answers);
    
        // Associate the answers with the response
        newResponse.answers = savedAnswers.map(an => an._id.toString());
        await newResponse.save();
    
        return newResponse;
    },

    getAllFormResponses: async () => {
        return await ResponseModel.find()
            .populate('form', 'name')
            .populate('user', 'name email')
            .populate({
                path: 'answers',
                populate: { path: 'question' },
            })
            .lean();
    },
};