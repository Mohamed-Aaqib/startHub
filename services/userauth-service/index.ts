import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config({
    path:"../../.env"
})


const app = express();

app.use(cors({
    origin:process.env.ORIGIN
}))
app.use(cookieParser())

app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({extended:true}))

const PORT = process.env.PORT_AUTH ||4000

mongoose.connect(process.env.MONGODB_URI_AUTH as string).then(()=>{
    console.log("mongodb is connected for auth");
}).catch((error) => {
    console.log("mongoose error has occured: ",error)
})

app.listen(PORT,() => {
    console.log("auth service works as exprected");
})
