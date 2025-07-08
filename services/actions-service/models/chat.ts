import mongoose, { Document, Schema, Types } from "mongoose";

interface IChat extends Document{
    type:'direct'|'group'|'startup'
    name?:string
    members:Types.ObjectId[]
    lastMessageAt:Date
    groupAdmin:Types.ObjectId
    createdBy?:Types.ObjectId
    avatarUrl?:string
}

const chatSchema = new mongoose.Schema<IChat>({
    type:{
        type:String,
        enum:['direct','group','startup'],
        required:true
    },
    groupAdmin:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    name:{
        type:String,
    },
    avatarUrl:{
        type:String
    },
    lastMessageAt:{
        type:Date
    },
    createdBy:{
        type:Schema.Types.ObjectId
    },
    members:{
        type:[
            {
                type:Schema.Types.ObjectId,
                ref:'User'
            }
        ],
        default:[],
        index:true
    }
},{timestamps:true})

const Chat = mongoose.model<IChat>("Chat",chatSchema)

export default Chat;