const yup = require("yup");

const schemas = {
  createFormSchema: yup.object({
    body: yup.object({
      createdBy: yup.string().required(),
      name: yup.string().min(4).required(),
      description: yup.string().max(100).optional(),
    })
  }),
  editFormSchema: yup.object({
    body: yup.object({
      name: yup.string().min(4).required(),
      description: yup.string().max(100).optional(),
      started: yup.boolean().default(false),
      questions: yup.array().of(yup.object({
        open: yup.boolean().required(),
        questionText: yup.string().min(6).max(150).required(),
        questionImage: yup.string().url().min(4).max(150).optional(),
        options: yup.array().of(yup.object({
          optionText: yup.string().min(4).max(100).required(),
          optionImage: yup.string().url().min(4).max(150).optional()
        })).optional(),
      })).optional()
    }),
    params: yup.object({
      formId: yup.string().min(20).required()
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