import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import {Server, Socket} from "socket.io"
import http from "http"
import { addRecentMatch, findAnyPartner, findEligiblePartner } from "./libs/matchingHelper"

dotenv.config({
    path:"../../.env"
})

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:process.env.ORIGIN,
        methods:["GET","POST"],
        credentials:true
    }
})

app.use(cors({
    origin:process.env.ORIGIN,
    methods:["GET","POST"],
    credentials:true,
}))

app.use(express.json({
    limit:"50mb"
}))
app.use(express.urlencoded())
app.use(cookieParser())

const PORT = process.env.PORT_COMM || 6000

const waitingUsers:string[] = [];
let timedMap:Map<string,Map<string,number>> = new Map();
const cooldown = 15*60*1000;

io.on("connection",(socket:Socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on("find_partner",({type}:{type:"normal"|"immidiate"}) => {
        console.log(`User ${socket.id} is looking for partner`);
        
        //TODO: after 10 minutes from the frontend
        let partnerId:string | null;
        if(type === "normal"){
            partnerId = findEligiblePartner(socket.id,waitingUsers,timedMap,cooldown);
        }else{
            partnerId = findAnyPartner(waitingUsers);
        }

        if(!partnerId){
            waitingUsers.push(socket.id);
            socket.emit("waiting");
            return;
        }else{
            const roomId = `room_${partnerId}_${socket.id}`
            socket.join(roomId);
            const partnerSocket = io.sockets.sockets.get(partnerId);
            
            if(partnerSocket){
                partnerSocket.join(roomId)
                io.to(roomId).emit("partner_found",{
                    roomId,partnerId,yourId:socket.id
                })
                console.log(`Paired ${socket.id} with ${partnerId} in room ${roomId}`);
            }else{
                waitingUsers.unshift(socket.id);
            }
        }
        // handle persisting maybe the user on refresh
    })

    socket.on("add_recent_match",({partnerId}:{partnerId:string})=>{
        addRecentMatch(socket.id,partnerId,timedMap);

        const rooms = io.sockets.adapter.sids.get(socket.id);
        if(rooms){
            for(const roomId in rooms){
                // we are always in one room
                if(roomId !== socket.id){
                    socket.leave(roomId);
                    socket.to(roomId)
                }
            }
        }
    })

    socket.on("offer",({roomId,offer}) => {
        socket.to(roomId).emit("offer",{offer,from:socket.id})
    })

    socket.on("answer",({roomId,answer})=> {
        socket.to(roomId).emit("answer",{answer,from:socket.id})
    })

    socket.on("ice-candidates",({roomId,candidate})=> {
        socket.to(roomId).emit("ice-candidates",{candidate,from:socket.id})
    })

    socket.on("disconnect",()=>{
        console.log(`User disconnected ${socket.id}`);

        const index = waitingUsers.indexOf(socket.id);
        if(index !== -1) waitingUsers.splice(index,1);

        const rooms = io.sockets.adapter.sids.get(socket.id);
        if(rooms){
            rooms.forEach((roomId)=>{
                if(socket.id !== roomId){
                    socket.to(roomId).emit("partner_disconnected")
                }
            })
        }
    })

})


server.listen(PORT,()=>{
    console.log("comm service is working")
})