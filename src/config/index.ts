import dotenv from 'dotenv'
import path from 'path'


dotenv.config({
    path: path.join(process.cwd(), '.env')

})

const config = {
    connectionString: process.env.DATABASE_URL as string,
    port: Number(process.env.PORT),
    // secret: process.env.JWT_SECRET,
    // refresh_secrect: process.env.JWT_REFRESH_SECRET
}

export default config;
