const FormModel = require('../model/Form')
const UserModel = require('../model/User')
const ResponseModel = require('../model/Response');
const { ApiError } = require('../utils/ApiError');

module.exports = {
    getAllForms: async()=> {
        return await FormModel.find().lean();
    },

    createForm: async(formData)=> {
        const data = {
            createdBy : formData.createdBy,
            name: formData.name,
            description: formData.description
         }
        const form = new FormModel(data);
        const newForm =  await form.save();
        await UserModel.updateOne({
            _id: data.createdBy
        },
        { $push: { createdForms: newForm._id}});

        return newForm;
    },
    getFormById: async(formId)=>{
       return await FormModel.findOne({_id: formId});    
    },
    
    deleteFormById: async(formId)=>{
        return await FormModel.deleteOne({_id: formId});
    },
    updateFormById: async (formId, data) => {
        return await FormModel.findByIdAndUpdate(formId, data ,{new: true});
    },
    getFormsByIds: async (formIds)=> {
        formIds = formIds.map((id)=> id && id.toString ? id.toString() : id);
        const forms = await FormModel.find().where('_id').in(formIds).exec();
        return forms;
    },
    getFromResponsesByFormId : async(formId)=> {
        return await ResponseModel.find({formId: formId}).lean();
    },
    saveFormResponse: async(formId, data) => {
        const responseData = {
            formId: formId,
            userId: data.userId,
            response: data.response
        };
        if(!Array.isArray(data.response) || data.rsponse.length < 1) {
            throw new ApiError(400, "Response should not be empty");
        }
        var newResponse = new ResponseModel(responseData);
        return await newResponse.save();
    },

    getAllFormResponses:async()=> {
       return await ResponseModel.find().lean();
    }
}


