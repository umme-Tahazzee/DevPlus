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

const getAllIsuessFromDb = async (sort?: string, type?: string, status?: string) => {

    // step 1: issues (filter/sort)
    let sqlQuery = `SELECT * FROM issues WHERE 1=1`
    const values: any[] = []
    let idx = 1

    // type filter 
    if (type) {
        sqlQuery += ` AND type = $${idx}`
        values.push(type)
        idx++
    }

    // status filter 
   if(status){
      sqlQuery += `AND type = $${idx}`
      values.push(status)
      idx++

   }

    // sort — default 
    if (sort === 'oldest') {
        sqlQuery += ` ORDER BY created_at ASC`
    } else {
        sqlQuery += ` ORDER BY created_at DESC`
    }

    const issuesResult = await pool.query(sqlQuery, values)
    const issues = issuesResult.rows

    // empty issues return null array
    if (issues.length === 0) return []


    // step 2: find reporter_id from issues 
    const reporterIds =  [...new Set(issues.map((issues:any)=>issues.reporter_id))]

    
    const usersResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
        [reporterIds]
    )


    // ধাপ ৩: users data কে সহজে খোঁজার জন্য একটা object বানাও
    // যেমন: { 1: {id:1, name:'John', role:'contributor'}, 2: {...} }
    const userMap: any = {}
    usersResult.rows.forEach((user: any) => {
        userMap[user.id] = {
            id: user.id,
            name: user.name,
            role: user.role
        }
    })

    
    const result = issues.map((issue: any) => {
        return {
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter: userMap[issue.reporter_id],  
            created_at: issue.created_at,
            updated_at: issue.updated_at
        }
    })

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