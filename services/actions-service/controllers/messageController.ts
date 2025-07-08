import { NextFunction, Request, Response } from "express"


export const sendMessage = (req:Request,res:Response,next:NextFunction) => {
    try {
        console.log("this is a test")
    } catch (error) {
        next(error)
    }
}

export const updateMessage = (req:Request,res:Response,next:NextFunction) => {
    try {
        console.log("this is a test")
    } catch (error) {
        next(error)
    }
}

export const deleteMessage = (req:Request,res:Response,next:NextFunction) => {
    try {
        console.log("this is a test")
    } catch (error) {
        next(error)
    }
}

export const sendMedia = (req:Request,res:Response,next:NextFunction) => {
    try {
        console.log("this is a test")
    } catch (error) {
        next(error)
    }
}

