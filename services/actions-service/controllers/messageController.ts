import { NextFunction, Request, Response } from "express"
import Message from "../models/message";
import { ErrorHandler } from "@starthub/err-middleware";
import Chat from "../models/chat";
import mongoose from "mongoose";


export const sendMessage = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {chatId,content} = req.body;
        const newMessage = await Message.create({
            chatId,
            content,
            type:'text',
            sender:req.user?._id
        })

        await Chat.findByIdAndUpdate(chatId,{
            lastMessageAt:new Date()
        })

        const populatedMessage = await Message.findById(newMessage._id).populate("sender","name")

        
        res.status(201).json({message:populatedMessage});


    } catch (error) {
        next(error)
    }
}

export const sendMedia = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {chatId,content} = req.body;
        const newMessage = await Message.create({
            chatId,
            content,
            mediaUrl:'',
            type:'media',
            sender:req.user?._id
        })

        // TODO: media needs to be handled
        await Chat.findByIdAndUpdate(chatId,{
            lastMessageAt:new Date()
        })

        const populatedMessage = await Message.findById(newMessage._id).populate("sender","name")
        
        res.status(201).json({message:populatedMessage});

    } catch (error) {
        next(error)
    }
}



export const updateMessage = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {messageId} = req.params;
        const {content} = req.body;

        if(!mongoose.Types.ObjectId.isValid(messageId)) throw new ErrorHandler("Incorrect message chosen",404);

        const newMessage = await Message.findOneAndUpdate({
            _id:messageId,
            sender:req.user?._id
        },{
            content
        },{new:true})
        if(!newMessage) throw new ErrorHandler("Couldn't update message, please try again",400);

        res.status(200).json({newMessage})

    } catch (error) {
        next(error)
    }
}

export const deleteMessage = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {messageId} = req.params;
        const {userIds} = req.body;

        if(!mongoose.Types.ObjectId.isValid(messageId)) throw new ErrorHandler("Incorrect message chosen",404);
        if(userIds.length <= 0) throw new ErrorHandler("Please choose the users you want to delete",400);

        const newMessage = await Message.findOneAndUpdate({
            _id:messageId,
            sender:req.user?._id
        },{
            $addToSet:{
                deletedFor:{
                    $each:userIds
                }
            }
        },{new:true})
        if(!newMessage) throw new ErrorHandler("Couldn't delete message, please try again",400);

        res.status(200).json({newMessage})
        
    } catch (error) {
        next(error)
    }
}
