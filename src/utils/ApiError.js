const createError = require('http-errors');

class ApiError extends createError.HttpError {
    /**
     * Custom API Error Wrapper around http-errors.
     * @param {number} statusCode - HTTP status code (e.g., 400, 500).
     * @param {string|object|Array|number} message - Error message or payload.
     */
    constructor(statusCode = 500, message = '') {
        // Format the message to ensure it’s always a string
        const formattedMessage = 
            typeof message === 'object' ? JSON.stringify(message) : String(message);

        // Use http-errors to create the error object
        super(statusCode, formattedMessage);
    }
}

module.exports = {ApiError};