import { Response } from "express";
import { IUser } from "../models/user";
import { accessTokenOptions, generateAccessTokenJWT, generateRefreshTokenJWT, refreshTokenOptions } from "@starthub/ref-acc-token";
import dotenv from "dotenv"
import { redis } from "..";

dotenv.config({
    path:"../../../.env"
})
export const sendToken = (user:IUser,statusCode:number,res:Response) => {

    const accessToken = generateAccessTokenJWT(user);
    const refreshToken = generateRefreshTokenJWT(user);

    redis.set(user._id as string,JSON.stringify(user));

    if(process.env.NODE_ENV == 'production'){
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true;
        accessTokenOptions.sameSite = 'strict';
        refreshTokenOptions.sameSite = 'strict';
    }

    res.cookie('access_token',accessToken,accessTokenOptions);
    res.cookie('refresh_token',refreshToken,refreshTokenOptions);
    res.status(statusCode).json({user,ok:true})

}