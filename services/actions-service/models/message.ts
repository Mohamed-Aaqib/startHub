import mongoose, { Document, Schema, Types } from "mongoose";


interface IMessage extends Document{
    content?:string
    mediaUrl?:string
    sender:Types.ObjectId
    chatId:string
    type:"text" | "media"
    deletedFor?:Types.ObjectId[];
}

// TODO: Remember to populate all the Controllers 
const messageSchema = new mongoose.Schema<IMessage>({
    content:{
        type:String,
    },
    mediaUrl:{
        type:String,
    },
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chatId:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["text","media"],
        required:true
    },
    deletedFor:{
        type:[
            {
                type:Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        default:[]
    }
},{timestamps:true})


const Message = mongoose.model<IMessage>("Message",messageSchema)
export default Message;