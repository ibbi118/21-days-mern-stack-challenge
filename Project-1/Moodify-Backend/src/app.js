const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.route")


//Middlewares
app.use(express.json())
app.use(cookieParser())

//Routes
app.use("/api/auth",authRouter)



module.exports = app