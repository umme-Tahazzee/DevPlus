import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const auth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const token = req.headers.authorization;

    if (!token) {
      throw new Error("You are not authorized");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    req.user = decoded;

    next();

  } catch (error) {

    next(error);

  }
};

export default auth;