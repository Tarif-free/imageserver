import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
    let error = err;

    if (!(err instanceof ApiError)) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        error = new ApiError(statusCode, message, err.errors);
    }

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        error = new ApiError(400, message);
    }

    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again!`;
        error = new ApiError(400, message);
    }

    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is expired, Try again!`;
        error = new ApiError(400, message);
    }

    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`;
        error = new ApiError(400, message);
    }

    
    const errorMessage = error.errors.length > 0
        ? error.errors.map(err => err.message).join(" ")
        : error.message || "An error occurred";

   // console.error(err); //Log the error for debugging

    return res.status(error.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export { errorMiddleware };
