import type { NextFunction, Request, Response } from "express";
import { isuessService } from "./issues.service.js";


//    POST /api/issues

const createIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // JWT থেকে reporter_id নাও (auth middleware সেট করে দেয়)
        const reporter_id = req.user.id;

        const result = await isuessService.createIssuesIntodb(req.body, reporter_id);

        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


//  GET /api/issues (/api/issues?sort=oldest&type=bug&status=open)


const getAllIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sort, type, status } = req.query;

        const result = await isuessService.getAllIsuessFromDb(
            sort as string,
            type as string,
            status as string
        );

        res.status(200).json({
            success: true,
            message: "Issues retrieved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


//   GET /api/issues/:id

const getSingleIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await isuessService.getSingleIsuues(req.params.id as string);

        res.status(200).json({
            success: true,
            message: "Issue retrieved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


//   PATCH /api/issues/:id

const updateIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const requesterId = req.user.id; 
        // console.log(requesterId)

        const result = await isuessService.getUpdateIssueFromDB(
            req.body,
            Number(id),
            requesterId  
        );

        res.status(200).json({
            success: true,
            message: 'Issue updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};


//  DELETE /api/issues/:id

const deleteIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const requesterId = req.user.id; 
        

        const result = await isuessService.deleteIssueFromDB(Number(id), requesterId );


        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const issuesController = {
    createIssues,
    getAllIssue,
    getSingleIssue,
    updateIssues,
    deleteIssues,
};