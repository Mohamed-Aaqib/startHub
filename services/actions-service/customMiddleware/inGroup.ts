import { ErrorHandler } from "@starthub/err-middleware";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Chat from "../models/chat";

export const inGroup = async (req:Request,res:Response,next:NextFunction) => {
    const {chatId} = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(chatId)) throw new ErrorHandler("Chat is not available",400);
        const chat = await Chat.findOne({
            _id:chatId,
            members:String(req.user?._id)
        })
        if(!chat) throw new ErrorHandler("You have no access to this chat",400)
        next()

    } catch (error) {
        next(error)
    }
    
}