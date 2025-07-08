import { ErrorHandler } from "@starthub/err-middleware";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Chat from "../models/chat";


export const isAdmin = async (req:Request,res:Response,next:NextFunction) => {
    const {chatId} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(chatId)) throw new ErrorHandler("Chat doesnt exist please try again",400);
        const chat = await Chat.findById(chatId)
        if(!chat) throw new ErrorHandler("Chat doesnt exist, please try again",400);

        if(!chat.groupAdmin.equals(req.user?._id as string)) throw new ErrorHandler("You are not the admin, you cant perform this action",400);

        next()        
    } catch (error) {   
        next(error)
    }
}