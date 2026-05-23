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


const getSingleIssue = async (req: Request, res: Response) => {

    try {

        const { id } = req.params


        const result = await isuessService.getSignleUserFromDB(id as string)

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateIssues = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { title, description, type } = req.body


        const result = await isuessService.getUpdateIssueFromDB(req.body, Number(id))
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Issues not found'
            })
        }


        res.status(200).json({
            success: true,
            message: 'Issues updated successfully',
            data: result.rows[0]
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const issuesController = {
    createIssues,
    getAllIssue,
    getSingleIssue,
    updateIssues

}