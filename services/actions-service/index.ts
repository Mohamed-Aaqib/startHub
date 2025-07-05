import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"

dotenv.config({path:"../../.env"});

const app = express();

app.use(cors({
    origin:[process.env.ORIGIN as string],
    credentials:true
}))
app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const PORT = process.env.PORT || 3000;

app.get("/",() => {
    console.log("we are here together !")
})

mongoose.connect(process.env.MONGODB_URI as string).then(()=>{
    console.log("connected to mongodb")
}).catch((err)=>{
    console.log("Error connecting to mongodb: ",err)
})

app.listen(PORT ,()=>{
    console.log(`server running on PORT: ${PORT}`)
})