import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import {generateAccessTokenJWT,generateRefreshTokenJWT,accessTokenOptions,refreshTokenOptions} from "@starthub/ref-acc-token"


declare global{
    namespace Express{
        interface Request{
            user?:any;
        }
    }
}



export const updateAccessToken = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const decode = jwt.verify(refresh_token,process.env.REFRESH_TOKEN||"") as JwtPayload
        if(!decode){
            throw new Error("Time to logout!");
        }

        // const accessToken = generateAccessTokenJWT(user)
        // const refreshToken = generateRefreshTokenJWT(user)
        // req.user = 'aaa'

        // res.cookie("access_token",accessToken,accessTokenOptions)
        // res.cookie("refresh_token",refreshToken,refreshTokenOptions)


    } catch (error) {
        next(error)
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
                //updateAccessToken
            } catch (error) {   
                throw new Error("Couldnt update tokens")
            }
        }else{
            req.user = JSON.parse("/")
        }

        next()

    } catch (error) {
        next(error)    
    }
}