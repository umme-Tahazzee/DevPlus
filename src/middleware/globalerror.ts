import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let statusCode = 500;
  let message = "Something went wrong";

  //  duplicate error
  if (error.code === "23505") {
    statusCode = 409;
    message = "Email already exists";
  }



  //  null violation
  else if (error.code === "23502") {
    statusCode = 400;
    message = "Required field is missing";
  }

  // JWT error example
  else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  // Custom error message
  else if (error.message) {
    message = error.message;
  }
  else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
}
  else if (error.message === "You are not authorized") {
    statusCode = 401;
    message = "You are not authorized";
}


  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error : undefined,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export default globalErrorHandler;