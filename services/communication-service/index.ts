import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import {Server, Socket} from "socket.io"
import http from "http"
import { addRecentMatch, findAnyPartner, findEligiblePartner } from "./libs/matchingHelper"
import {Redis} from "ioredis"

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

const redisClient = () => {
    try {
        if(process.env.REDIS_URL){
            console.log("redis is connected")
            return process.env.REDIS_URL
        }
        throw new Error('Redis connection failed')    
    } catch (error) {
        console.log("couldn't connect to redis, please try again")
        return "";
    }
}

export const redis = new Redis(redisClient())

const PORT = process.env.PORT_COMM || 6000

const userRoomMap:Map<string,string> = new Map<string,string>();
const socketUserMap:Map<string,string> = new Map<string,string>()
const userSocketMap:Map<string,string> = new Map<string,string>()

const waitingUsers:string[] = [];
let timedMap:Map<string,Map<string,number>> = new Map();
const cooldown = 15*60*1000;

function notifyFriends(userId:string,status:"green"|"offline",friends:string[]){
    friends.forEach((friendId) => {
        const friendSocketId = userSocketMap.get(friendId);
        if(friendSocketId){
            io.to(friendSocketId).emit("user_status",{userId,status})
        }
    })
}

io.on("connection",(socket:Socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on("register_user",({userId,isChat}) => {
        
        socketUserMap.set(socket.id,userId)
        userSocketMap.set(userId,socket.id)
        if(!isChat){
            const previousRoom = userRoomMap.get(userId);
            
            if(previousRoom){
                const previousRoomSocket = io.sockets.adapter.rooms.get(previousRoom)
                if(previousRoomSocket){
                    socket.join(previousRoom);
                    socket.to(previousRoom).emit("partner_reconnected",{
                        userId,
                        socketId:socket.id
                    })
                }
            }
        }
    })

    socket.on("find_partner",({type}:{type:"normal"|"immediate"}) => {
        const userId = socketUserMap.get(socket.id);
        if(!userId) return;

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
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if(partnerSocket){
                partnerSocket.join(roomId)
                socket.join(roomId)

                userRoomMap.set(partnerId,roomId)
                userRoomMap.set(userId,roomId)

                io.to(roomId).emit("partner_found",{
                    roomId,partnerId,yourId:socket.id
                })
                
                console.log(`Paired ${socket.id} with ${partnerId} in room ${roomId}`);
            }else{
                waitingUsers.unshift(socket.id);
            }
        }
    })

    socket.on("add_recent_match",({partnerId}:{partnerId:string})=>{
        addRecentMatch(socket.id,partnerId,timedMap);

        const rooms = io.sockets.adapter.sids.get(socket.id);
        if(rooms){
            for(const roomId of rooms){
                // we are always in one room
                if(roomId !== socket.id){
                    socket.leave(roomId);
                    socket.to(roomId).emit("partner_disconnected")

                    const partnerSocketIds = io.sockets.adapter.rooms.get(roomId);
                    if(partnerSocketIds){
                        partnerSocketIds.forEach((peerIds)=>{
                            if(peerIds !== socket.id){
                                const partnerSocket = io.sockets.sockets.get(peerIds);
                                if(partnerSocket) partnerSocket.leave(roomId);

                                const peerUserId = socketUserMap.get(peerIds);
                                if (peerUserId) {
                                    userRoomMap.delete(peerUserId);
                                    userSocketMap.delete(peerUserId);
                                    socketUserMap.delete(peerIds);   
                                }

                            }
                        })
                    }

                    const userId = socketUserMap.get(socket.id);
                    if(userId){
                        userSocketMap.delete(userId);
                        userRoomMap.delete(userId);
                        socketUserMap.delete(socket.id);
                    }

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

    socket.on("user_status",async ({userId,chatId,status,friends})=>{
        if(status === "in_chat" && chatId){
            await redis.set(`user:in_chat:${userId}`,"true","EX",30)
            socket.join(chatId);
            socket.to(chatId).emit("user_status",{userId,status:"purple"})
        }else{
            await redis.set(`user:online:${userId}`,"true","EX",30)
            notifyFriends(userId,"green",friends)
        }
    })

    socket.on("get_online_friends",async ({userId,friends}) => {
        const onlineStatuses = [];
        for(const friendId of friends){
            // more efficient way of us
            const isOnline = await redis.get(`user:online:${friendId}`);
            if(isOnline) onlineStatuses.push({ userId: friendId, status: "green" });
        }
        socket.emit("online_friends_list",onlineStatuses)
    })

    socket.on("heartbeat",async ({userId})=>{
        if(!userId) return;
        await redis.set(`user:online:${userId}`,"true","EX",30)
    })

    socket.on("typing",({chatId}) => {
        const userId = socketUserMap.get(socket.id);
        socket.to(chatId).emit("user_typing",{
            chatId,
            userId
        })
    })

    socket.on("join_chat",({chatId}) => {
        if(!chatId) return;
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined chat ${chatId}`);
    })

    socket.on("send_message",({chatId,message,userId})=>{
        if(!userId || !chatId) return;
        io.to(chatId).emit("new_message",{
            chatId,
            message,
            senderId:userId,
            timestamp:Date.now()
        })
    })


    socket.on("disconnect",()=>{
        console.log(`User disconnected ${socket.id} - 10s grace period`);
        const userId = socketUserMap.get(socket.id);
        if(!userId) return;

        setTimeout(async ()=> {            

            const currSocket = userSocketMap.get(userId!);
            
            if(!currSocket || currSocket === socket.id){

                await redis.del(`user:online:${userId}`)

                const index = waitingUsers.indexOf(socket.id);
                if(index !== -1) waitingUsers.splice(index,1);
                
                const rooms = io.sockets.adapter.sids.get(socket.id);
                if(rooms){
                    rooms.forEach((roomId)=>{
                        if(socket.id !== roomId){
                            socket.to(roomId).emit("partner_disconnected")

                            const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
                            if(socketsInRoom){
                                socketsInRoom.forEach((peerSocketId) => {
                                    const peerSocket = io.sockets.sockets.get(peerSocketId);
                                    const peerUserId = socketUserMap.get(peerSocketId);

                                    if(peerSocket) peerSocket.leave(roomId);

                                    if(peerUserId){
                                        userRoomMap.delete(peerUserId);
                                        userSocketMap.delete(peerUserId);
                                        socketUserMap.delete(peerUserId);
                                    }

                                })
                            }

                        }
                    })
                }

                socketUserMap.delete(socket.id);
                userSocketMap.delete(userId)
            }

        },10*10*10*10)

    })

})


server.listen(PORT,()=>{
    console.log("comm service is working")
})