import { Pool } from "pg"
import config from "../config/index.js"


// database connection
export const pool = new Pool({
    connectionString: config.connectionString
})

// initialize database
export const initDB = async () => {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,
        role VARCHAR(10) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
`)

        //     await pool.query(`
        // CREATE TABLE IF NOT EXISTS profile(
        //     id SERIAL PRIMARY KEY,
        //     user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        //     bio TEXT,
        //     address TEXT,
        //     phone VARCHAR(15),
        //     gender VARCHAR(10),

        //     created_at TIMESTAMP DEFAULT NOW(),
        //     updated_at TIMESTAMP DEFAULT NOW()
        // )
        //     `)

        console.log('Database connected successfully')
    } catch (error) {
        console.log('Database Error:', error)
    }
}
