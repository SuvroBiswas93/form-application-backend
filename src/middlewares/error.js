
const { ValidationError } = require("yup");
const { ApiError } = require("../utils/ApiError");

const errorHandler = (err, _, res, __) => {
  let convertedError = err;
  if(convertedError instanceof ValidationError) {
    res.message = convertedError.message || "Validation failed";
    return res.status(400).json(convertedError.errors)
  }
  if(convertedError instanceof ApiError) {
    res.message = convertedError.message;
    return res.status(convertedError.status).json(null);
  }
  
  res.message = "Internal server error"
  return res.status(500).json(null);
};

module.exports= {errorHandler};