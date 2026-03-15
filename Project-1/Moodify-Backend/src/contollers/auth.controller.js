const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const redis = require("../config/cache")


async function registerController(req,res){
         const {username,email,password} = req.body
         try{
            const isAlreadyRegister = await userModel.findOne({
               $or:[
                {
                    username
                },
                {
                    email
                }
               ]
            })

            if(isAlreadyRegister){
                return res.status(400).json({
                    message : "User with same email or username already exits"
                })
            }
           
          const hash = await  bcrypt.hash(password,10)

            const user = await userModel.create({
                username,
                email,
                password : hash
            })
           
            const token = jwt.sign({
                id : user._id,
                username : user.username
            },process.env.JWTSECRET,{
                expiresIn : "1d"
            })
            

            res.cookie("token",token)

            res.status(201).json({
                message : "User Register Successfully...",
                user : {
                    id : user._id,
                    username : user.username,
                    email : user.email
                }
            })

         }catch(err){
            console.log(err)
         }
}


async function loginController(req,res){
    const {username,email,password} = req.body

    const checkUserExit = await userModel.findOne({
        $or : [
            {
                username
            },

            {
                email
            }
        ]
    }).select("+password")
    
    if(!checkUserExit){
        return res.status(400).json({
            message : "Invalid Credential"
        })
    }

    const hashPass = await bcrypt.compare(password,checkUserExit.password)

    if(!hashPass){
        return res.status(400).json({
            message : "Invalid Credential"
        })
    }

    const token = jwt.sign({
        id : checkUserExit._id,
        username : checkUserExit.username
    },process.env.JWTSECRET,{
        expiresIn : "1d"
    })

    res.cookie("token",token)

    res.status(201).json({
        message : "User login Successfully",
        user :{
            id : checkUserExit._id,
            username : checkUserExit.username,
            email : checkUserExit.email
        }
    })


}


async function getmeController(req,res){

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message : "User Profile",
        user
    })

}

async function logoutController(req,res){
     const token = req.cookies.token
     res.clearCookie("token")
     await redis.set(token,Date.now().toString(),"EX", 60*60)
     res.status(200).json({
        message : "User Sucessfully Logout"
     })
}


module.exports = {
    registerController,
    loginController,
    getmeController,
    logoutController
}