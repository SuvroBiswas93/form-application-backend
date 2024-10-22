const JSONresponseFormatter = (req, res, next) => {
    
    const originalJson = res.json.bind(res);

    const response = (data) => ({
        status: res.statusCode < 400 ? 'success' : 'error',
        ...(res.statusCode < 400 && data ? {data: data} : {}),
        ...( res.statusCode >= 400 && data ? {errors: data} : {}), // Conditionally add the errors field
        ...(res.message ? { message: res.message }: {}) // Conditionally add the message field
    });

    res.json = function (data) {
        try {
            const formattedResponse = response(data);
            originalJson(formattedResponse);
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to format json response'});
        }
    };
    next();
};
  
  module.exports = {JSONresponseFormatter};