import { ErrorHandler } from "@starthub/err-middleware";
import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user";
import { redis } from "..";
import mongoose from "mongoose";

export const getUser = async (req:Request,res:Response,next:NextFunction) => {
    const {id} = req.params
    try {

        if(!mongoose.Types.ObjectId.isValid(id)) throw new ErrorHandler("invalid id, please try again",400)

        let mainUser;
        mainUser = await redis.get(id);
        if(mainUser){
            const user = JSON.parse(mainUser) as IUser
            const {provider,friends,password,...finalUser} = user;
            res.status(200).json({user:finalUser});
            return;
        }

        mainUser = await User.findById(id).select('-password -provider -friends')
        if(!mainUser) throw new ErrorHandler("No such user found please try again",404);

        res.status(200).json({user:mainUser})

    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req:Request,res:Response,next:NextFunction) => {
    const {id} = req.params;
    const {field,role,description} = req.body;
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new ErrorHandler("Invalid id",404);
        if(id != String(req.user?._id)) throw new ErrorHandler("You can only edit your own profile, please try again",404);

        // TODO: Should've used zod but too late now, implement it later on.
        if (!field || typeof field !== "string" || field.trim() === "") {
            throw new ErrorHandler("Field is required", 400);
        }
        if (!role || typeof role !== "string" || role.trim() === "") {
            throw new ErrorHandler("Role is required", 400);
        }
        if (!description || typeof description !== "string" || description.trim() === "") {
            throw new ErrorHandler("Description is required", 400);
        }

        const user = await User.findByIdAndUpdate(id,{
            $set:{
                field,
                role,
                description
            }
        },{new:true})

        if(!user) throw new ErrorHandler("Couldnt update the user, please try again",400);

        const ttl = await redis.ttl(String(req.user?._id));
        await redis.set(String(req.user?._id),JSON.stringify(user));

        if(ttl > 0){
            await redis.expire(String(req.user?._id),ttl)
        }

        res.status(201).json({message:"user successfully updated"})

    } catch (error) {
        next(error)
    }
}

export const getFriends = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const user = await redis.get(String(req.user?._id));
        if(user){
            const mainUser = JSON.parse(user) as IUser;
            const {friends} = mainUser;
            res.status(200).json({friends})
            return;
        }

        const finalUser = await User.findById(String(req.user?._id)).select('friends');
        if(!finalUser) throw new ErrorHandler("user doesn't exist",400)
        res.status(200).json({friends:finalUser.friends})
        
    } catch (error) {
        next(error)
    }
}

export const addFriend = async (req:Request,res:Response,next:NextFunction) => {
    const {id} = req.params; 
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new ErrorHandler("id is incorrect",404);

        const existingUser = req.user?.friends || [];
        const alreadyAdded = existingUser.some((friendsId) => friendsId.toString() === id);
        if(alreadyAdded) throw new ErrorHandler("user is already your friend",404);

        const updatedUser = await User.findByIdAndUpdate(String(req.user?._id),{
            $push:{
                friends:id
            }
        },{new:true})
        if(!updatedUser) throw new ErrorHandler("no user found please try again",404);

        const ttl = await redis.ttl(String(req.user?._id))
        await redis.set(String(req.user?._id),JSON.stringify(updatedUser))
        if(ttl > 0){
            await redis.expire(String(req.user?._id),ttl)
        }

        res.status(201).json({message:"Friend Added Successfully"})

    } catch (error) {
        next(error)
    }
}

export const removeFriend = async (req:Request,res:Response,next:NextFunction) => {
    const {id} = req.params; 
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new ErrorHandler("id is incorrect",404);

        const existingUser = req.user?.friends || [];
        const exist = existingUser.some((friendsId) => friendsId.toString() === id);
        if(!exist) throw new ErrorHandler("user is not you friend",404);

        const updatedUser = await User.findByIdAndUpdate(String(req.user?._id),{
            $pull:{
                friends:id
            }
        },{new:true})
        if(!updatedUser) throw new ErrorHandler("no user found please try again",404);

        const ttl = await redis.ttl(String(req.user?._id))
        await redis.set(String(req.user?._id),JSON.stringify(updatedUser))
        if(ttl > 0){
            await redis.expire(String(req.user?._id),ttl)
        }

        res.status(201).json({message:"Friend Removed Successfully"})

    } catch (error) {
        next(error)
    }
}