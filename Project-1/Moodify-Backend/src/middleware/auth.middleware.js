
const jwt = require("jsonwebtoken")
const redis = require("../config/cache")



 async function userAuth(req,res,next){

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message : "Unauthorized"
        })
    }

    const blackList = await redis.get(token)

    if(blackList){
          return res.status(401).json({
            message : "Unauthorized"
        })
    }
  
   try{

    const decode = jwt.verify(token,process.env.JWTSECRET)
    req.user = decode
    next()

   } catch(error){
      return res.status(401).json({
         message:"Invalid Token"
      })
   }


}


// async function userAuth(req,res,next){
//     const token = req.cookies.token

//     if(!token){
//         return res.status(400).json({
//             message : "Unauthorized"
//         })
//     }

//     const blackList = await redis.get(token)

//     if(blackList){
//             return res.status(400).json({
//             message : "Unauthorized"
//           })   
//     }

//     try{
//         const decode = jwt.verify(token,process.env.JWTSECRET)
//         req.user = decode
//         next()
//     }catch(err){
//         return res.status(401).json({
//             message : "Invalid token"
//         })
//     }
// }

module.exports = userAuth