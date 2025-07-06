import { NextFunction, Request, Response } from "express";

export const getUser = async (req:Request,res:Response,next:NextFunction) => {
    try {
        console.log("testing")
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req:Request,res:Response,next:NextFunction) => {
    try {
        console.log("testing")
    } catch (error) {
        next(error)
    }
}

export const getFriends = async (req:Request,res:Response,next:NextFunction) => {
    try {
        console.log("testing")
    } catch (error) {
        next(error)
    }
}

export const addFriend = async (req:Request,res:Response,next:NextFunction) => {
    try {
        console.log("testing")
    } catch (error) {
        next(error)
    }
}

export const removeFriend = async (req:Request,res:Response,next:NextFunction) => {
    try {
        console.log("testing")
    } catch (error) {
        next(error)
    }
}