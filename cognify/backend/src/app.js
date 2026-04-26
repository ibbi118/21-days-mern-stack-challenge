import express from 'express'
import {handleError} from "./middleware/error.middleware.js"
import authRoutes from "./routes/auth.routes.js"
const app = express()

app.use(express.json())
app.use("/api/auth",authRoutes)

app.get('/',(req,res)=>{
    res.send("hello")
})

app.use(handleError)

export default app;