const { ValidationError } = require("yup");

const validate = (schema) => async (req, _, next) => {
  try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      },
      {abortEarly: false}
    );
    
    next();
  } catch (error) {
    // Format errors by field name
    const formattedErrors = error.inner.reduce((acc, curr) => {
      if (!acc[curr.path]) {
        acc[curr.path] = []; // Initialize array if not already present
      }
      acc[curr.path].push(curr.message); // Push error message to the respective field
      return acc;
    }, {});

    const validationError = new ValidationError('Validation error');
    validationError.errors = formattedErrors; // Attach formatted errors to the error object
    next(validationError); // Pass formatted error to the error middleware
  }
};
  module.exports = { validate };