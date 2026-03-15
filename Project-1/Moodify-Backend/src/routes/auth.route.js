const express = require("express")
const authRouter = express.Router()
const authController = require("../contollers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")


authRouter.post("/register",authController.registerController)
authRouter.post("/login",authController.loginController)
authRouter.get("/get-me",authMiddleware,authController.getmeController)
authRouter.get("/logout",authMiddleware,authController.logoutController)


module.exports = authRouter
