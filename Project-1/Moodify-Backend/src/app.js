const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.route")
const songRouter = require("./routes/song.route")


//Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

//Routes
app.use("/api/auth",authRouter)
app.use("/api/songs",songRouter)



module.exports = app