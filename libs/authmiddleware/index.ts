import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import {generateAccessTokenJWT,generateRefreshTokenJWT,accessTokenOptions,refreshTokenOptions} from "@starthub/ref-acc-token"
import Redis from "ioredis"

const redisClient = () => {
    try {
        if(process.env.REDIS_URL){
            console.log("redis is connected")
            return process.env.REDIS_URL
        }
        throw new Error('Redis connection failed')    
    } catch (error) {
        console.error("ioredis error has occured: ",error)
        return ""
    }
}

export const redis = new Redis(redisClient())


export const updateAccessToken = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const decode = jwt.verify(refresh_token,process.env.REFRESH_TOKEN||"") as JwtPayload
        if(!decode){
            throw new Error("Time to logout!");
        }

        const user = await redis.get(decode.id);
        if(!user) throw new Error("Please login for resources");
        
        const mainUser = JSON.parse(user);
        const accessToken = generateAccessTokenJWT(user)
        const refreshToken = generateRefreshTokenJWT(user)
        req.user = mainUser

        res.cookie("access_token",accessToken,accessTokenOptions)
        res.cookie("refresh_token",refreshToken,refreshTokenOptions)

        await redis.set(mainUser._id,JSON.stringify(mainUser),"EX",604800)
        res.status(201)

    } catch (error:any) {
        res.status(400).json({message:`error: ${error.message}`})
    }
}

export const isAuthenticated = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const access_token = req.cookies.access_token as string;
        if(!access_token){
            throw new Error("Access token is missing")
        }

        const decodedToken = jwt.decode(access_token) as JwtPayload;
        if(!decodedToken){
            throw new Error("Access token is not valid")
        }

        if(decodedToken.exp && decodedToken.exp <= Date.now()/1000){
            try {
                updateAccessToken(req,res,next);
            } catch (error) {   
                throw new Error("Couldnt update tokens")
            }
        }else{
            const user = await redis.get(decodedToken.id)
            if(!user) throw new Error("user not found")
            req.user = JSON.parse(user)
        }

        next()

    } catch (error:any) {
        res.status(400).json({message:`error: ${error.message}`})
    }
}