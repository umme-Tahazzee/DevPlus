import { pool } from "../../db/index.js";
import type { Iissues } from "./issues.interface.js";


// Issue create

const createIssuesIntodb = async (payload: Iissues, reporter_id: number) => {

    const { title, description, type, status } = payload;

    const result = await pool.query(
        `INSERT INTO issues (title, description, type, status, reporter_id)
         VALUES ($1, $2, $3, COALESCE($4, 'open'), $5)
         RETURNING *`,
        [title, description, type, status, reporter_id]
    );

    return result.rows[0];
};


//get all issues 

const getAllIsuessFromDb = async (sort?: string, type?: string, status?: string) => {

    // শুরুতে base query — WHERE 1=1 মানে সব row আনবে
    // পরে filter যোগ হলে AND দিয়ে যুক্ত হবে
    let sqlQuery = `SELECT * FROM issues WHERE 1=1`;
    const values: any[] = [];
    let idx = 1;

    // type filter: ?type=bug অথবা ?type=feature_request
    if (type) {
        sqlQuery += ` AND type = $${idx}`;
        values.push(type);
        idx++;
    }

    // status filter: ?status=open, in_progress, resolved
    if (status) {
        sqlQuery += ` AND status = $${idx}`;
        values.push(status);
        idx++;
    }

    // sort: ?sort=oldest → পুরনো আগে, default → নতুন আগে
    if (sort === "oldest") {
        sqlQuery += ` ORDER BY created_at ASC`;
    } else {
        sqlQuery += ` ORDER BY created_at DESC`;
    }

    // Step 1: সব issue আনো
    const issuesResult = await pool.query(sqlQuery, values);
    const issues = issuesResult.rows;

    // কোনো issue না থাকলে খালি array ফেরত দাও
    if (issues.length === 0) return [];

    // Step 2: issues থেকে unique reporter_id গুলো বের করো
    // যেমন: [1, 1, 2, 3] → [1, 2, 3]  (duplicate বাদ)
    const reporterIds = [...new Set(issues.map((issue: any) => issue.reporter_id))];

    // Step 3: সেই id গুলো দিয়ে users টেবিল থেকে একবারেই data আনো
    const usersResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
        [reporterIds]
    );

    // Step 4: users data কে map এ রাখো — দ্রুত খোঁজার জন্য
    // যেমন: { 1: {id:1, name:'John', role:'contributor'} }
    const userMap: any = {};
    usersResult.rows.forEach((user: any) => {
        userMap[user.id] = {
            id: user.id,
            name: user.name,
            role: user.role,
        };
    });

    // Step 5: প্রতিটা issue এ reporter object বসিয়ে দাও
    return issues.map((issue: any) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: userMap[issue.reporter_id],
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }));
};


// get single issues

const getSingleIsuues = async (id: string) => {

    
    const issueResult = await pool.query(
        `SELECT * FROM issues WHERE id = $1`,
        [id]
    );
    const issue = issueResult.rows[0];

 
    if (!issue) {
        throw new Error("Issue not found");
    }

    
    const userResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [issue.reporter_id]
    );
    const reporter = userResult.rows[0];

   
    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: {
            id: reporter.id,
            name: reporter.name,
            role: reporter.role,
        },
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    };
};


// Issue update 

const getUpdateIssueFromDB = async (payload: Partial<Iissues>, id: number) => {

    const { title, description, type, status } = payload;

    const result = await pool.query(
        `UPDATE issues
         SET
           title       = COALESCE($1, title),
           description = COALESCE($2, description),
           type        = COALESCE($3, type),
           status      = COALESCE($4, status),
           updated_at  = NOW()
         WHERE id = $5
         RETURNING *`,
        [title, description, type, status, id]
    );

    return result;
};


// Issue ডিলিট করো

const deleteIssueFromDB = async (id: number) => {

    const result = await pool.query(
        `DELETE FROM issues WHERE id = $1 RETURNING *`,
        [id]
    );

    return result;
};

export const isuessService = {
    createIssuesIntodb,
    getAllIsuessFromDb,
    getSingleIsuues,
    getUpdateIssueFromDB,
    deleteIssueFromDB,
};