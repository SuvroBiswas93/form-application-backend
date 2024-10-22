const yup = require("yup");

const schemas = {
  loginSchema: yup.object({
    body: yup.object({
      email: yup.string().email().required(),
      password: yup.string().min(1).max(128).required(),
    })
  }),
  registrationSchema: yup.object({
    body: yup.object({
        email: yup.string().email().required(),
        password: yup.string().min(1).max(128).required(),
        name:yup.string().min(3).max(35).required()
    })
})
}
 
module.exports = schemas