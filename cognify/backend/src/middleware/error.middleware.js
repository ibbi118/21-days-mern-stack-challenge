import { configDotenv } from "dotenv";
configDotenv()

export function handleError(err,req,res,next){
    if(process.env.NODE_ENV == 'DEVELOPMENT'){
        return res.status(err.statusCode).json({
            message : err.message,
            stack : err.stack
        })
    }else{
        return res.status(err.statusCode).json({
            message : err.message
    })
}
}