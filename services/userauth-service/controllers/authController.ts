import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";
import { ErrorHandler } from "@starthub/err-middleware";
import bcrypt from "bcryptjs";
import { sendToken } from "../helpers/sendToken";
import { redis } from "..";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { publishQueue } from "../rabbit/publisher";

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

        const currUser:{name:string,email:string,password:string} = {
            email,
            name,
            password
        }

        const activationCode = Math.floor((Math.random() * 8000)+1000).toString();
        const token = jwt.sign({currUser,activationCode},process.env.ACTIVATION_SECRET || '',{
            expiresIn:"5m"
        })

        const emailData = {
            currUser:{
                name:currUser.name
            },
            activationCode
        }
        try {
            await publishQueue({
                email:currUser.email,
                subject:"Activate your account",
                template:"activation-email.ejs",
                data:emailData
            })
        } catch (error) {
            next(error)
        }
        
        res.status(201).json({message:"Please check your email for the verification code",activationCode,token})

    }catch(err){
        next(err);
    }

}


export const activateUser = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {activation_code,activation_token} = req.body;
        const verifyToken:any = jwt.verify(activation_token,process.env.ACTIVATION_SECRET || '')
    
        if(verifyToken.activationCode != activation_code) throw new ErrorHandler("Invalid activation code",400);

        const {email,password,name} = verifyToken.currUser
        let existsUser = await User.findOne({
            email
        })

        if(existsUser) throw new ErrorHandler("User already exists, please try again",404)
        
        existsUser = await User.create({
            name,
            email,
            password,
            provider:"email"
        })

        res.status(201).json({ok:true})

    } catch (error) {
        next(error)
    }
}


export const signInUser = async (req:Request,res:Response,next:NextFunction) => {

    const {email,password} = req.body;

    try{

        const user = await User.findOne({
            email:email
        })
        if(!user) throw new ErrorHandler("No user found please try again",400);

        const hashedPass = await bcrypt.compare(password,user?.password as string);
        if(!hashedPass) throw new ErrorHandler("Incorrect password please try again",400)

        sendToken(user,200,res);

    }catch(err){
        next(err);
    }


}


export const signInGoogleUser = async (req:Request,res:Response,next:NextFunction) => {

    const {id_token} = req.body

    try{
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        const ticket = await client.verifyIdToken({
            idToken:id_token,
            audience:process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload();
        if(!payload) throw new ErrorHandler("Invalid google login",404);

        const {sub:googleId,email,name,picture} = payload
        
        let user = await User.findOne({
            email
        })

        if(!user){
            user = await User.create({
                email,
                name,
                provider:"google",
                googleId
            })
        }

        sendToken(user,201,res);

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