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
  
    const errorMessage = error.errors
      ? Object.values(error.errors)
          .map((error) => error.message)
          .join(" ")
      : error.message;
  
    return res.status(error.statusCode).json({
      success: false,
      message: errorMessage,
    });
  };
  
  export {errorMiddleware};