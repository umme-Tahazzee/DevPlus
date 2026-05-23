import type { Request, Response } from "express";
import { pool } from "../../db/index.js";
import console from "node:console";

const userLoginIntoDb = async (payload:
    {
        email: string,
        password: string
    }) => {

        const {email, password} = payload

        const userData = await pool.query(`
           SELECT * FROM users WHERE email = $1,
        `, [email])
        
        if(userData.rows.length === 0){
              throw new Error("Invalid Credentials")
        }
        const user = userData.rows[0]
        console.log(user.password)

}

export const authService = {
   
   userLoginIntoDb
};