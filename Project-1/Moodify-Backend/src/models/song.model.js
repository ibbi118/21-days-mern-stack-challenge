const mongooe = require("mongoose")

const songSchema = new mongooe.Schema({
    url : {
        type : String,
        required : true
    },

    posterUrl : {
        type : String,
        required : true
    },

    title : {
        type : String,
        requried : true
    },
    mood : {
        type : String,
        enum : {
            values : ["happy","sad","surprised"]
        }
    }
})

const songModel = mongooe.model("songs",songSchema)

module.exports = songModel