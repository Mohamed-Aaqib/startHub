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

// TODO: rate limiting

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
            return process.env.REDIS_URL
        }
        throw new Error('Redis connection failed')    
    } catch (error) {
        console.log("couldn't connect to redis, please try again")
        return "";
    }
}

export const redis = new Redis(redisClient(),{
    retryStrategy(times){
        const delay = Math.min(times * 50,5000)
    }
})

redis.on("connect", () => {
    console.log("Redis connected ✅");
});
redis.on("error", (err) => {
    console.error("Redis connection error ❌:", err.message);
});



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

        console.log(` \n Socket ${socket.id} is looking for partner`);
        const userId = socketUserMap.get(socket.id);
        console.log(`User on the other hand ${userId} is looking for partner \n`);
        if(!userId) return;

        console.log(`User ${socket.id} is looking for partner`);
        
        let partnerId:string | null;
        if(type === "normal"){
            partnerId = findEligiblePartner(userId,waitingUsers,timedMap,cooldown);
            console.log("partner id is : ", partnerId)
        }else{
            partnerId = findAnyPartner(waitingUsers);
        }
        console.log("\n","partnerID list updated",partnerId ,"\n")
        if(!partnerId){
            if(!waitingUsers.includes(userId)){
                waitingUsers.push(userId);
            }
            socket.emit("waiting");
            return;
        }else{
            const partnerSocketId = userSocketMap.get(partnerId)
            if(!partnerSocketId) return;

            const roomId = `room_${partnerId}_${userId}`
            const partnerSocket = io.sockets.sockets.get(partnerSocketId);
            if(partnerSocket){
                partnerSocket.join(roomId)
                socket.join(roomId)

                userRoomMap.set(partnerId,roomId)
                userRoomMap.set(userId,roomId)

                socket.to(roomId).emit("partner_found", {
                    roomId,
                    partnerId: userId,  
                    yourId: partnerId       
                });

                socket.emit("partner_found", {
                    roomId,
                    partnerId: partnerId,
                    yourId: userId          
                });
                
                console.log(`Paired ${socket.id} with ${partnerId} in room ${roomId}`);
            }else{
                waitingUsers.unshift(userId);
            }
        }
    })

    socket.on("add_recent_match",({partnerId}:{partnerId:string})=>{
        const userId = socketUserMap.get(socket.id);
        console.log("adding recent match ", userId)
        if(!userId) return;
        addRecentMatch(userId,partnerId,timedMap);

        const rooms = io.sockets.adapter.sids.get(socket.id);
        // console.log(timedMap);
        // console.log(rooms);

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

                                // Clean up only userRoomMap for the peer
                                const peerUserId = socketUserMap.get(peerIds);
                                if (peerUserId) {
                                    userRoomMap.delete(peerUserId);
                                //     userSocketMap.delete(peerUserId);
                                //     socketUserMap.delete(peerIds);   // <-- REMOVE THIS LINE

                                }
                            }
                        })
                    }

                    const userId = socketUserMap.get(socket.id);
                    if(userId){
                        // userSocketMap.delete(userId);
                        // socketUserMap.delete(socket.id);
                        userRoomMap.delete(userId);
                    }

                }
            }
        }
    })

    socket.on("offer",({roomId,offer}) => {
        const userSocketId = socketUserMap.get(socket.id);
        socket.to(roomId).emit("offer",{offer,from:userSocketId})
    })

    socket.on("answer",({roomId,answer})=> {
        const userSocketId = socketUserMap.get(socket.id);
        socket.to(roomId).emit("answer",{answer,from:userSocketId})
    })

    socket.on("ice-candidates",({roomId,candidate})=> {
        const userSocketId = socketUserMap.get(socket.id);
        socket.to(roomId).emit("ice-candidates",{candidate,from:userSocketId})
    })

    socket.on("video_state_change", ({ roomId, enabled, from }) => {
        socket.to(roomId).emit("video_state_change", { enabled, from });
    });

    socket.on("audio_state_change", ({ roomId, enabled, from }) => {
        socket.to(roomId).emit("audio_state_change", { enabled, from });
    });

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
        console.log("why ",userId)
        if(!userId) return;

        setTimeout(async ()=> {            

            const currSocket = userSocketMap.get(userId!);
            
            if(!currSocket || currSocket === socket.id){

                try {
                    await redis.del(`user:online:${userId}`)
                } catch (error) {
                    console.error("Failed to delete key from Redis");
                }

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

                                    // Only delete mappings for the disconnecting user, not the remaining peer
                                    if(peerUserId){
                                        userRoomMap.delete(peerUserId);
                                        // userSocketMap.delete(peerUserId);
                                        // socketUserMap.delete(peerSocketId);
                                    }

                                })
                            }

                        }
                    })
                }

                userRoomMap.delete(userId);
            }

        },10*10*10*10)

    })

})


server.listen(PORT,()=>{
    console.log("comm service is working")
})