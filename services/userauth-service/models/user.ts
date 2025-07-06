import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    profileCompleted:boolean,
    field?:"cs"|"science"|"business"|"engineer"|"media",
    role?:string,
    provider:"email"|"google",
    intrests?:string[],
    description?:string,
    friends?:Types.ObjectId[]
    github?:{
        accessToken:string,
        username:string,
    }
}

const userSchema = new mongoose.Schema<IUser>({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profileCompleted:{
        type:Boolean,
        default:false
    },
    field:{
        type:String,
        enum:["cs","science","business","engineer","media"]
    },
    role:{
        type:String
    },
    provider:{
        type:String,
        enum:["email","google"],
        required:true
    },
    intrests:{
        type:[String],
        default:[]
    },
    description:{
        type:String
    },
    friends:{
        type:[
            {
                type:Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        default:[]
    },
    github:{
        accessToken:String,
        username:String
    }
},{
    timestamps:true
})

userSchema.pre("save",async function(next:any){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8);
    };
    next();
})

const User = mongoose.model<IUser>("User",userSchema)

export default User;