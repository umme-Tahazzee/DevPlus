import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type UserPayload = {
  id: number;
  name: string;
  role: string;
};

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    
    if (!authHeader) {
      throw new Error("You are not authorized")
    }

    const token = authHeader;
      
    if (!token) {
      throw new Error("Invalid token format")
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded as UserPayload;
    
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;