import express, {
    type Application,
    type Request,
    type Response
} from 'express'
import cors from 'cors'
import { userRoute } from './module/user/user.route.js'
import globalErrorHandler from './middleware/globalerror.js'
import { authRoute } from './module/auth/auth.route.js'
import { issueRoute } from './module/issues/issues.route.js'
import logger from './middleware/logger.js'
import router from './routes/index.js'



const app: Application = express()

// middleware

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)
app.use(cors({
    origin: 'http://localhost:3000'
}))


// root route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Express PostgreSQL Server Running'
    })
})

 app.use('/api', router)

// app.use('/api/auth', userRoute)
// app.use('/api/auth', authRoute)
// app.use('/api/issues', issueRoute)

app.use(globalErrorHandler)

// server
export default app;