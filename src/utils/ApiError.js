class ApiError extends Error {
    constructor (
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;


        // Only include the stack trace in non-production environments

        if (process.env.NODE_ENV !== 'production') {
            this.stack = stack || Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError}