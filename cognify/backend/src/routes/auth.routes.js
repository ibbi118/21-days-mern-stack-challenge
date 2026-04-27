import express from "express"
import { register, verifyEmail,login,getMe } from "../controllers/auth.controllers.js";
import { registerValidator,loginValidator } from "../vaildator/auth.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const authRoutes = express.Router()

authRoutes.post("/register",registerValidator,register)
authRoutes.post("/login",loginValidator,login)
authRoutes.get("/verify-email",verifyEmail)
authRoutes.get("/getMe",authMiddleware,getMe)


export default authRoutes;