const createError = require('http-errors');

class ApiError {
    /**
     * Custom API Error Wrapper around http-errors.
     * @param {number} statusCode - HTTP status code (e.g., 400, 500).
     * @param {string|object|Array|number} message - Error message or payload.
     */
    constructor(statusCode = 500, message = '', errors = null) {
        // Format the message to ensure it’s always a string
        const formattedMessage = 
            typeof message === 'object' ? JSON.stringify(message) : String(message);

        // Create an error using http-errors
        const error = createError(statusCode, formattedMessage);

        // Assign the error properties to the instance
        this.name = error.name;
        this.message = error.message;
        this.errors = errors;
        this.status = error.status;
        this.stack = error.stack;
    }
}

module.exports = { ApiError };