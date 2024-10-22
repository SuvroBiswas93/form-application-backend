
const { ValidationError } = require("yup");
const { ApiError } = require("../utils/ApiError");
const isDev = ["development", "dev", "develop"].includes(process.env.NODE_ENV ?? "");
const errorHandler = (err, _, res, __) => {
  let convertedError = err;
  if(isDev) {
    console.error(err);
  }
  if(convertedError instanceof ValidationError) {
    res.message = convertedError.message || "Validation failed";
    return res.status(400).json(convertedError.errors)
  }
  if(convertedError instanceof ApiError) {
    res.message = convertedError.message;
    return res.status(convertedError.status).json(null);
  }
  
  res.message = isDev? convertedError.message : "Internal server error";
  const stack = isDev? convertedError.stack : null;
  return res.status(500).json(stack);
};

module.exports= {errorHandler};