import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:6000"

// intresting cached or use the closure pattern with a "let socket"
const socket:Socket = io(SOCKET_URL,{
    transports:["websocket"],
    autoConnect:false,
})

export default socket;