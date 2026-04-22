const express = require("express")
const routes = express.Router()
const authController = require("../controllers/auth.contollers")

routes.post("/register",authController.userRegister)
routes.post("/login",authController.userLogin)


module.exports = routes