import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";
import { ErrorHandler } from "@starthub/err-middleware";
import bcrypt from "bcryptjs";
import { sendToken } from "../helpers/sendToken";
import { redis } from "..";

declare global{
    namespace Express{
        interface Request{
            user?:IUser;
        }
    }
}


export const registerUser = async (req:Request,res:Response,next:NextFunction) => {
    const {name,email,password} = req.body;
    try{
        const user = await User.findOne({email})
        if(user) throw new ErrorHandler("Email already exists",400);

        //email
        const mainUser = await User.create({
            name,
            email,
            password,
            provider:"email"
        }); 

        res.status(200).json({message:"successfully logged in"})
    }catch(err){
        next(err);
    }

}


export const activateUser = async (req:Request,res:Response,next:NextFunction) => {
    console.log("testing")
}


export const signInUser = async (req:Request,res:Response,next:NextFunction) => {

    const {email,password} = req.body;

    try{

        const user = await User.findOne({
            email:email
        })
        if(!user) throw new ErrorHandler("No user found please try again",400);

        const hashedPass = await bcrypt.compare(password,user.password);
        if(!hashedPass) throw new ErrorHandler("Incorrect password please try again",400)

        sendToken(user,200,res);

    }catch(err){
        next(err);
    }


}


export const signInGoogleUser = async (req:Request,res:Response,next:NextFunction) => {

    try{
        console.log("testing function rapid 1")
    }catch(err){
        next(err);
    }


}

export const logout = async (req:Request,res:Response,next:NextFunction) => {

    try {
        res.cookie("access_token","",{maxAge:1});
        res.cookie("refresh_token","",{maxAge:1});
        const userId = req.user?._id || '';
        if(!userId) throw new ErrorHandler("Failed to logout,unauthorized",404);
        
        redis.del(userId as string);
        res.status(201).json({message:"successfully logged out"});

    } catch (error) {
        next(error);
    }

}