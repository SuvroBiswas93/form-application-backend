const yup = require("yup");

const schemas = {
  createFormSchema: yup.object({
    body: yup.object({
      createdBy: yup.string().required(),
      name: yup.string().min(4).required(),
      description: yup.string().max(100).optional(),
    })
  }),
  getFormById: yup.object({
    params: yup.object({
        formId: yup.string().min(20).required(),
    })
  }),
  deleteForm: yup.object({
    params: yup.object({
        formId: yup.string().min(20).required(),
        userId: yup.string().min(20).required()
    })
  })
  
}
 
module.exports = schemas;