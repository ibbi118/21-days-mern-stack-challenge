import express from 'express'
import {handleError} from "./middleware/error.middleware.js"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"
const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use("/api/auth",authRoutes)



app.use(handleError)

export default app;