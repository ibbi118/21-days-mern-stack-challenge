const express = require("express")
const accountController = require("../controllers/account.controllers")
const authMiddleware = require("../middleware/auth.middleware")


const router = express.Router()

router.post("/",authMiddleware.authMiddleware,accountController.accountCreation)



module.exports = router