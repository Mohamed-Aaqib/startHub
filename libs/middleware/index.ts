import express, { NextFunction, Request, Response } from "express"

export class ErrorHandler extends Error{
    statusCode:number;

    constructor(msg:string,statusCode:number){
        super(msg)
        this.statusCode = statusCode
        Error.captureStackTrace(this,this.constructor)
    }
}

export const errorHandler = async (err:any,req:Request,res:Response,next:NextFunction) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal error";

    console.log(err.name)

    if(err.name == "CastError"){
        const message = `Resource not found ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    if(err.name == "JsonWebTokenError"){
        const message = `Json web token is invalid please try again`;
        err = new ErrorHandler(message,400);
    }

    if(err.name == "TokenExpiredError"){
        const message = `Json web token has expired, try again`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode as number).json({message:err.message,ok:false})

}