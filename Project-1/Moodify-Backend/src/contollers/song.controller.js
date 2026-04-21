const songModel = require("../models/song.model")
const id3 = require("node-id3")  // song file ko detail get ky liya
const storageService = require("../services/storage.service")

async function uploadSong(req,res){

    const {mood} = req.body

const songBuffer = req.file.buffer
 const tag = id3.read(songBuffer)
  console.log(tag)

  const songFile = await storageService.uploadFile({
    buffer : songBuffer,
    filename : tag.title + "mp3",
    folder : "/moodify/songs"
  })

   const posterFile = await storageService.uploadFile({
    buffer : tag.image.imageBuffer,
    filename : tag.title + "jpeg",
    folder : "/moodify/poster"
  })

const song = await songModel.create({
    url : songFile.url,
    posterUrl : posterFile.url,
    title : tag.title,
    mood
})

res.status(201).json({
    message : "Song created successfully",
    song
})


}




module.exports = {
    uploadSong
}