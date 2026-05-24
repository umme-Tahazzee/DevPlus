import type { Request, Response, NextFunction } from "express";
import { userService } from "./user.service.js";

const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const result = await userService.createUserIntoDB(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0],
        });

    } catch (error) {
        next(error);
    }
};

export const userController = {
    createUser,
};