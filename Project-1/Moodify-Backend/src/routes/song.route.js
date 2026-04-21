const express = require("express")
const router = express.Router()
const songController = require("../contollers/song.controller")
const apload = require("../middleware/song.middleware")


router.post("/", apload.single("song") ,songController.uploadSong)


module.exports = router