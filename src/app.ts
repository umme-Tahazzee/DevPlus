import express, {
    type Application,
    type Request,
    type Response
} from 'express'
import cors from 'cors'
import { userRoute } from './module/user/user.route.js'
import globalErrorHandler from './middleware/globalerror.js'



const app: Application = express()

// middleware

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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



app.use('/api/users', userRoute)
app.use(globalErrorHandler)

// server
export default app;