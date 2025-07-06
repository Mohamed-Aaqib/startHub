import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { ErrorHandler, errorHandler } from "@starthub/err-middleware"
import userRouter from "./routes/user"
import authRouter from "./routes/auth"
import Redis from "ioredis"

dotenv.config({
    path:"../../.env"
})


const app = express();

app.use(cors({
    origin:process.env.ORIGIN
}))
app.use(cookieParser())

app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({extended:true}))
app.use(errorHandler)

const redisClient = () => {
    if(process.env.REDIS_URL){
        console.log("redis is connected")
        return process.env.REDIS_URL
    }
    throw new Error('Redis connection failed')
}

export const redis = new Redis(redisClient())

app.use("/v1/user",userRouter)
app.use("/v1/auth",authRouter)


app.all("/{*any}",(req:Request,res:Response,next:NextFunction)=>{
    next(new ErrorHandler(`Route ${req.originalUrl} not found`,404));
})


const PORT = process.env.PORT_AUTH ||4000

mongoose.connect(process.env.MONGODB_URI_AUTH as string).then(()=>{
    console.log("mongodb is connected for auth");
}).catch((error) => {
    console.log("mongoose error has occured: ",error)
})

app.listen(PORT,() => {
    console.log("auth service works as exprected");
})
