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
    const { email, password } = req.body

    const user = await userModel.findOne({ email }).select("+password")
    if(!user) return res.status(400).json({ message:"Invalid Credential" })

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) return res.status(400).json({ message:"Invalid Credential" })

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWTSECRET, { expiresIn:"1d" })

    res.cookie("token", token, { httpOnly:true, sameSite:"lax", maxAge:24*60*60*1000 })

    res.status(200).json({
        message:"User login Successfully",
        user: { id:user._id, username:user.username, email:user.email }
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