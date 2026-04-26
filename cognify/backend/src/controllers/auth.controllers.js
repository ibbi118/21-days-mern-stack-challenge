import userModel from "../models/user.models.js";
import { sendRegistrationMail } from "../services/email.services.js";


export async function register(req,res,next){
    try{
      const{username,email,password} = req.body
      const isExists = await userModel.findOne({
        $or : [{
            email
        },{
            username
        }]
      })
    
      if(isExists){
        return res.status(400).json({
            message : "This email or username already Exit"
        })
      }

      const user = await userModel.create({
        email,username,password
      })

      sendRegistrationMail(user)
    

    }catch(err){
       err.statusCode = 400;
       next(err)
    }
}


// export async function login(req,res,next){

// }