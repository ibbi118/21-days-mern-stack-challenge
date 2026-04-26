import express from "express"
import { register } from "../controllers/auth.controllers.js";
import { registerValidator } from "../vaildator/auth.validator.js";


const authRoutes = express.Router()

authRoutes.post("/register",registerValidator,register)


export default authRoutes;