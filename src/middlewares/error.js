
const { ValidationError } = require("yup");

const errorHandler = (err, req, res, next) => {
  let convertedError = err;
  if (convertedError instanceof ValidationError) {
      const response = {
        error: err?.errors?.join(', ') || 'Validations have failed',
      }
      return res.status(400).json(response);
  }
  
  return res.status(500).josn({error: "something went wrong"})
};

module.exports= {errorHandler};