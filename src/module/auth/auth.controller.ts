import type { Request, Response } from "express";
import { authService } from "./auth.service.js";

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.userLoginIntoDb(req.body)
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,

        })
    }
}

export const authController = {
    loginUser
}