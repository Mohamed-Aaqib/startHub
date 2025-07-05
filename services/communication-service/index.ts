import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config({
    path:"../../.env"
})

const app = express();
app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit:"50mb"
}))
app.use(express.urlencoded())
app.use(cookieParser())

const PORT = process.env.PORT_COMM || 6000

app.listen(PORT,()=>{
    console.log("comm service is working")
})