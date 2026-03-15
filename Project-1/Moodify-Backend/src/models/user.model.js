const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true,"username is required"],
        unique : [true,"username must be unique"]

    },

    email :{
         type : String,
        required : [true,"username is required"],
        unique : [true,"username must be unique"]
    },

    password : {
        type : String,
        required : [true, "password must be requires"],
        select : false
    }


})


const userModel = mongoose.model("User",userSchema)

module.exports = userModel