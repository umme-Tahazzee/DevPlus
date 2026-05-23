import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";

const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const result = await authService.userLoginIntoDb(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });

    } catch (error) {

        next(error);

    }
};

export const authController = {
    loginUser,
};