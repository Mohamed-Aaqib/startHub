import { NextFunction, Request, Response } from "express";
import Chat from "../models/chat";
import { ErrorHandler } from "@starthub/err-middleware";
import Message from "../models/message"
import mongoose from "mongoose";


export const getAllChats = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const chats = await Chat.find({
            members:req.user?._id
        }).sort({
            lastMessageAt:-1
        })

        res.status(200).json({chats})

    } catch (error) {   
        next(error)
    }
}

export const getChatInfo = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {chatId} = req.params;
        const chat = await Chat.findById(chatId)
        if(!chat) throw new ErrorHandler("No chat found, please try again",400)

        res.status(200).json({chat})
        
    } catch (error) {   
        next(error)
    }
}

export const getMessages = async (req:Request,res:Response,next:NextFunction) => {
    // TODO: pagination
    try {
        const {chatId} = req.params;
        const messages = await Message.find({
            chatId
        }).sort({
            createdAt:-1
        });

        res.status(200).json({messages});

    } catch (error) {   
        next(error)
    }
}

export const createGroupChat = async (req:Request,res:Response,next:NextFunction) => {
    try {
        // TODO: avatar url
        const {name,members,type} = req.body;

        if(members.length <= 1) throw new ErrorHandler("More than one person is needed to create a group",400);
        const allMembers = [...new Set([String(req.user?._id),...members])]

        const newChat = await Chat.create({
            name,
            type,
            groupAdmin:req.user?._id,
            createdBy:req.user?._id,
            members:allMembers,
            lastMessageAt:new Date()
        })

        res.status(201).json({newChat})

    } catch (error) {   
        next(error)
    }
}

export const createChat = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {userId} = req.params

        if(!mongoose.Types.ObjectId.isValid(userId)) throw new ErrorHandler("you cannot create a chat with this user",400)
        const allMembers = [String(req.user?._id),userId]

        const existingChats = await Chat.findOne({
            type:'direct',
            members:{
                $all:allMembers
            }
        }).lean();

        if(existingChats) throw new ErrorHandler("chat already exists, please try again",400);

        const newChat = await Chat.create({
            type:'direct',
            createdBy:req.user?._id,
            lastMessageAt:new Date(),
            members:allMembers
        })
        if(!newChat) throw new ErrorHandler("failed to create a chat",400)

        res.status(201).json({newChat})


    } catch (error) {   
        next(error)
    }
}

export const addMember = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {chatId} = req.params;
        const {userId} = req.body;

        if(!mongoose.Types.ObjectId.isValid(userId)) throw new ErrorHandler("Invalid user to add",400);

        const newChat = await Chat.findByIdAndUpdate(chatId,{
            // add only if its not in array to avoid duplicates
            $addToSet:{
                members:userId
            }
        },{new:true})  
        if(!newChat) throw new ErrorHandler("Coudldn't add user, please try again",400);

        res.status(201).json({chat:newChat})

    } catch (error) {   
        next(error)
    }
}

export const removeMember = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {chatId} = req.params;
        const {userId} = req.body;

        if(!mongoose.Types.ObjectId.isValid(userId)) throw new ErrorHandler("Invalid user to delete",400);

        const newChat = await Chat.findOneAndUpdate({
            _id:chatId,
            members:userId
        },{
            // add only if its not in array to avoid duplicates
            lastMessageAt:new Date(),
            $pull:{
                members:userId
            }
        },{new:true})  
        if(!newChat) throw new ErrorHandler("Coudldn't delete user, please try again",400);

        res.status(201).json({chat:newChat})
    } catch (error) {   
        next(error)
    }
}

export const promoteMember = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {chatId} = req.params;
        const {userId} = req.body;

        if(!mongoose.Types.ObjectId.isValid(userId)) throw new ErrorHandler("Cant promote an invalid user",400);
        
        const newChat = await Chat.findOneAndUpdate({
            _id:chatId,
            members:userId
        },{
            groupAdmin:userId
        },{new:true})

        if(!newChat) throw new ErrorHandler("Couldn't promote user, please try again",400);

        res.status(200).json({chat:newChat});


    } catch (error) {   
        next(error)
    }
}
