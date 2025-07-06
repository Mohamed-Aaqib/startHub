import express from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config({
    path:"../../.env"
})


const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '5',10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '3',10);

interface ITokenOptions{
    expires:Date;
    maxAge:number;
    httpOnly:boolean;
    sameSite:'lax'|'strict'|'none'|undefined;
    secure?:boolean;
}

export const accessTokenOptions:ITokenOptions = {
    expires:new Date(Date.now()+(accessTokenExpire*60*60*1000)),
    maxAge:accessTokenExpire*60*60*1000,
    httpOnly:true,
    sameSite:'lax',
}

export const refreshTokenOptions:ITokenOptions = {
    expires:new Date(Date.now()+(refreshTokenExpire*24*60*60*1000)),
    maxAge:refreshTokenExpire*24*60*60*1000,
    httpOnly:true,
    sameSite:'lax',
}

export const generateAccessTokenJWT = (user:any) => {
    return jwt.sign({id:user._id},process.env.ACCESS_TOKEN ||'',{
        expiresIn:"5m"
    })
}

export const generateRefreshTokenJWT = (user:any) => {
    return jwt.sign({id:user._id},process.env.REFRESH_TOKEN ||'',{
        expiresIn:"3d"
    })
}