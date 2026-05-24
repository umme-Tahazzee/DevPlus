
import { pool } from "../../db/index.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import config from "../../config/index.js";

const userLoginIntoDb = async (payload:
    {
        email: string,
        password: string,
           
    }) => {

    const { email, password } = payload

    const userData = await pool.query(`
           SELECT * FROM users WHERE email = $1
        `, [email])

    if (userData.rows.length === 0) {
        throw new Error("Invalid Credentials")
    }
    const user = userData.rows[0]
    const isPassWord = await bcrypt.compare(password, user.password)
    if (!isPassWord) {
        throw new Error("Invalid Credentials")
    }
    const jwtPlayload = {
        id: user.id,
        name: user.name,
        role: user.role
    }
    //genrate token 
    const accessToken = jwt.sign(jwtPlayload, config.secret as string, {
        expiresIn: '7d',
    })

    return { token: accessToken, user }

}


export const authService = {

    userLoginIntoDb
};