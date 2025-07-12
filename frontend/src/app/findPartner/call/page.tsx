"use client"
import socket from '@/components/sockets/socket';
import React, { useEffect, useMemo, useRef, useState } from 'react'

const ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },
    {
        urls: "turn:your-turn-server.com:3478",
        username: "your-username",
        credential: "your-credential",
    },
]

const page = () => {

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const pc = useRef<RTCPeerConnection | null>(null);

    const [roomId,setRoomId] = useState<string | null>(null);
    const [partnerId,setPartnerId] = useState<string | null>(null);
    const currId = useMemo(() => crypto.randomUUID(),[])
    const [isWaiting,setIsWaiting] = useState<boolean>(true)

    useEffect(()=>{

        navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
            localStream.current = stream;
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
            }
        })

        socket.on("waiting",() => {
            setIsWaiting(true);
        })

        socket.on("partner_found",({roomId,partnerId,yourId})=>{
            setRoomId(roomId)
            setPartnerId(partnerId)
            setIsWaiting(false)
        })

        return () => {
            socket.off("waiting")
            socket.off("partner_found")
        }

    },[])

    useEffect(()=>{
        if(!roomId || !partnerId || !localStream.current || !currId) return;
        pc.current = new RTCPeerConnection({iceServers:ICE_SERVERS});

        localStream.current.getTracks().forEach((track)=>{
            pc.current?.addTrack(track,localStream.current!);
        })

        pc.current.ontrack = (event) => {
            if(remoteVideoRef.current){
                remoteVideoRef.current.srcObject = event.streams[0]; 
            }
        }

        pc.current.onicecandidate = (event) => {
            if(event.candidate){
                socket.emit("ice-candidates",{roomId,candidate:event.candidate})
            }
        }

        socket.on("offer",async ({offer,from}) => {
            if(from === partnerId){
                await pc.current?.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.current?.createAnswer();
                await pc.current?.setLocalDescription(answer)
                socket.emit("answer",{roomId,answer});
            }
        })

        socket.on("answer",async ({answer,from}) => {
            if(from === partnerId){
                await pc.current?.setRemoteDescription(new RTCSessionDescription(answer))
            }
        })

        socket.on("candidates",async ({candidate,from}) => {
            if(from === partnerId && candidate){
                pc.current?.addIceCandidate(new RTCIceCandidate(candidate))
            }
        })

        if(currId > partnerId){
            pc.current.createOffer().then((offer)=> pc.current?.setLocalDescription(offer).then(()=>{
                socket.emit("offer",{roomId,offer})
            })).catch((err) => console.error("unknown error please try again",err.message))
        }

        return () => {
            if(partnerId) socket.emit("add_recent_match",{partnerId});
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidates");
            pc.current?.close();
            pc.current = null;
            //remoteRef.current.srcObject as well should probably go
        }

    },[roomId,partnerId,currId])


    return (
        <div className='h-screen w-screen'>
            <h1 className='font-extrabold md:text-4xl text-xl block text-center py-5'>Did you find your associate?</h1>
            <h2>room id : {roomId}</h2>
            <div className="rounded-md max-w-[400px] flex p-10 md:max-w-5xl mx-auto w-full flex-col md:flex-row items-center justify-between gap-3  bg-green-800">
                <div className='bg-black rounded-md'>
                    <video ref={localVideoRef} autoPlay className='w-full h-full rounded-xl bg-gray-800'/>
                </div>

                <div className='bg-white rounded-md'>
                    <video ref={remoteVideoRef} className={`${isWaiting && "hidden"} w-full h-full rounded-xl bg-gray-800`}/>
                    {isWaiting && (
                        <div className="w-full h-full flex items-center justify-center text-black text-2xl">Finding partner...</div>
                    )}
                    <div className='w-full h-full flex flex-col items-center justify-center gap-y-4'>
                        <button className='bg-green-600 text-black p-3 rounded-md cursor-pointer border-2'>Toggle Video</button>
                        <button className='bg-green-600 text-black p-3 rounded-md cursor-pointer border-2'>Toggle Audio</button>
                        <button className='bg-black text-green-600 p-3 rounded-md cursor-pointer border-2 mb-2'>Toggle Skip</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page