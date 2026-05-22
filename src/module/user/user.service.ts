import { pool } from "../../db/index.js"
import type { IUser } from "./user.interface.js"
import bcrypt from "bcryptjs"

const createUserIntoDB = async (payload: IUser) => {
    const { name, email, password, role } = payload

    const hashPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
        `INSERT INTO 
          users(name, email, password, role) 
          VALUES($1, $2, $3, $4)
          RETURNING *` ,
        [name, email, hashPassword, role]

    )
    delete result.rows[0].password
    return result
}



export const userService = {
    createUserIntoDB,

}