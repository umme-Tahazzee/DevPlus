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


const getSignleUserFromDB = async (id: string) => {

    const result = await pool.query(
        `
            SELECT * FROM issues
            WHERE id = $1
            `,
        [id]
    )

    return result
}

const getUpdateIssueFromDB = async (
    payload: Partial<Iissues>,
    id: number
) => {

    const { title, description, type } = payload;

    const result = await pool.query(
        `
    UPDATE issues
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      updated_at = NOW()
    WHERE id = $4
    RETURNING *
    `,
        [title, description, type, id]
    );

    return result;
};

const deleteIssueFromDB = async (id: number) => {
    const result = await pool.query(`
            DELETE FROM issues
            WHERE id = $1
            RETURNING *
           `,
        [id]
    )
    return result

}


export const isuessService = {
    createIssuesIntodb,
    getAllIsuessFromDb,
    getSignleUserFromDB,
    getUpdateIssueFromDB,
    deleteIssueFromDB
}