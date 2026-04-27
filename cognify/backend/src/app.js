import express from 'express'
import {handleError} from "./middleware/error.middleware.js"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes)



app.use(handleError)

export default app;