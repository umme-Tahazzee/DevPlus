import type { NextFunction, Request, Response } from "express";
import { isuessService } from "./issues.service.js";



const createIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reporter_id = req.user.id;
        const result = await isuessService.createIssuesIntodb(
            req.body,
            reporter_id
        );
        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

const getAllIssue = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const result = await isuessService.getAllIsuessFromDb();
        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: result.rows,
        });
    } catch (error) {
        next(error);
    }


}

export const issuesController = {
    createIssues,
    getAllIssue
}