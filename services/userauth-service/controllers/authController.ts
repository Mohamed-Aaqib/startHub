import { NextFunction, Request, Response } from "express";


export const registerUser = async (req:Request,res:Response,next:NextFunction) => {

    try{
        console.log("testing function rapid 1")
    }catch(err){
        next(err);
    }


}


export const signInUser = async (req:Request,res:Response,next:NextFunction) => {

    try{
        console.log("testing function rapid 1")
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
        console.log("heavy!")
    } catch (error) {
        next(error);
    }

}