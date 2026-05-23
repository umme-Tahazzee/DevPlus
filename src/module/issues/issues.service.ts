import type { Request } from "express";
import { pool } from "../../db/index.js";
import type { Iissues } from "./issues.interface.js";

const createIssuesIntodb = async (
    payload: Iissues,
    reporter_id: number
) => {
    const { title, description, type, status } = payload;


    const result = await pool.query(
        `
         INSERT INTO issues(
         title,
         description,
         type,
         status,
         reporter_id
         )
       VALUES($1, $2, $3, COALESCE($4, 'open'), $5)
       RETURNING *
       `,
        [title, description, type, status, reporter_id],
    )
    return result
}

const getAllIsuessFromDb = async () => {
    const result = await pool.query(`
            SELECT * FROM issues
            ORDER BY id DESC
           
        `)



    return result
}

export const isuessService = {
    createIssuesIntodb,
    getAllIsuessFromDb
}