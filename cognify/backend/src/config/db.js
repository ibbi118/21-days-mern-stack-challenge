import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv()

export function connecttoDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("database connected sucessfully")
    }).catch((err)=>{
        console.log(err)
    })
}