const yup = require("yup");

const option = {
  optionText: yup.string().min(2).max(100).required(),
  optionImage: yup.string().url().min(4).max(150).optional()
};

const question = {
  _id: yup.string().min(20).max(50).optional(),
  text: yup.string().min(4).max(150).required(),
  type: yup
      .string()
      .oneOf(['text', 'checkbox', 'radio', 'color']) // Ensure type is valid
      .required(),
  required: yup.boolean().default(false),
  options: yup.array()
      .of(yup.object(option))
      .when('type', {
          is: (type) => ['checkbox', 'radio'].includes(type),
          then: (schema) => schema.required('Options are required for checkbox or radio types'),
          otherwise: (schema) => schema.notRequired()
      })
};


const response = {
  questionId: yup.string().min(20).required(),
  answer: yup.string().min(2).max(200).required(),
};

const schemas = {
  createFormSchema: yup.object({
    body: yup.object({
      createdBy: yup.string().required(),
      name: yup.string().min(4).required(),
      description: yup.string().max(100).optional(),
      questions: yup.array().of(yup.object(question)).required(),
      isActive: yup.boolean().optional().default(true),
    })
  }),

  editFormSchema: yup.object({
    body: yup.object({
      name: yup.string().min(4).required(),
      description: yup.string().max(100).optional(),
      questions: yup.array().of(yup.object(question)).required(),
      isActive: yup.boolean().optional().default(true),
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
  }),
  submitResponse: yup.object({
    body:yup.object({
      userId: yup.string().min(20).required(),
      responses: yup.array().of(yup.object(response)).required()
    })
  })
};
 
module.exports = schemas;