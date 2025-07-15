"use client"
import socket from '@/components/sockets/socket';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react'

const ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },
    // {
    //     urls: "turn:your-turn-server.com:3478",
    //     username: "your-username",
    //     credential: "your-credential",
    // },
]

const page = () => {

    const searchParams = useSearchParams();

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const pc = useRef<RTCPeerConnection | null>(null);

    const [roomId,setRoomId] = useState<string | null>(null);
    const [partnerId,setPartnerId] = useState<string | null>(null);
    const currId = useMemo(() => searchParams.get("testId"),[searchParams])
    const [isWaiting,setIsWaiting] = useState<boolean>(true)

    const timeoutMatch = useRef<NodeJS.Timeout|null>(null);

    const [isMounted, setIsMounted] = useState(false);
    const emittedRef = useRef(false);
    const [mediaReady, setMediaReady] = useState(false);

    const pendingCandidates = useRef<any[]>([]);
    const remoteDescriptionSet = useRef<boolean>(false);

    useEffect(() => {
    setIsMounted(true);
    }, []);


    useEffect(()=>{

        navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
            localStream.current = stream;
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
                // Always mute local video to avoid echo
                localVideoRef.current.muted = true;
                localVideoRef.current.play().catch(e => console.warn("[Local Video] play() error", e));
            }
            setMediaReady(true);
        })

        socket.on("waiting",() => {
            setIsWaiting(true);
        })

        socket.on("partner_found",({roomId,partnerId,yourId})=>{
            if(timeoutMatch.current){
                clearTimeout(timeoutMatch.current);
                timeoutMatch.current = null;
            }


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
        if(!roomId || !partnerId || !mediaReady || !currId) return;
        pc.current = new RTCPeerConnection({iceServers:ICE_SERVERS});

        if (localStream.current) {
            localStream.current.getTracks().forEach((track)=>{
                pc.current?.addTrack(track,localStream.current!);
            });
        }

        pc.current.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                // Log tracks and their state
                const videoTracks = event.streams[0].getVideoTracks();
                const audioTracks = event.streams[0].getAudioTracks();
                if (videoTracks.length > 0) {
                    console.log("[TRACKS TO CHECK] Remote video track label:", videoTracks[0].label, "enabled:", videoTracks[0].enabled, "muted:", videoTracks[0].muted);
                } else {
                    console.log("[TRACKS TO CHECK] No remote video tracks found!");
                }
                if (audioTracks.length > 0) {
                    console.log("[TRACKS TO CHECK] Remote audio track label:", audioTracks[0].label, "enabled:", audioTracks[0].enabled, "muted:", audioTracks[0].muted);
                } else {
                    console.log("[TRACKS TO CHECK] No remote audio tracks found!");
                }
                remoteVideoRef.current.play().then(() => console.log("[Video] remote video playing")).catch(e => console.warn("[Video] play() error", e));
            } else {
                console.log("[TRACKS TO CHECK] remoteVideoRef.current is null!");
            }
        }

        pc.current.onicecandidate = (event) => {
            if(event.candidate){
                socket.emit("ice-candidates", { roomId, candidate: event.candidate });
            }
        }

        socket.on("offer", async ({ offer, from }) => {
            if (from !== currId) {
                try {
                    await pc.current?.setRemoteDescription(new RTCSessionDescription(offer));
                    remoteDescriptionSet.current = true;
                    pendingCandidates.current.forEach(candidate => {
                        pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
                    });
                    pendingCandidates.current = [];
                    const answer = await pc.current?.createAnswer();
                    await pc.current?.setLocalDescription(answer);
                    socket.emit("answer", { roomId, answer });
                } catch (err) {
                    console.error("[WebRTC] Error handling offer", err);
                }
            }
        });

        socket.on("answer", async ({ answer, from }) => {
            if (from !== currId) {
                try {
                    await pc.current?.setRemoteDescription(new RTCSessionDescription(answer));
                    remoteDescriptionSet.current = true;
                    pendingCandidates.current.forEach(candidate => {
                        pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
                    });
                    pendingCandidates.current = [];
                } catch (err) {
                    console.error("[WebRTC] Error handling answer", err);
                }
            }
        });

        socket.on("ice-candidates", async ({ candidate, from }) => {
            if (from !== currId && candidate) {
                if (remoteDescriptionSet.current) {
                    try {
                        pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (err) {
                        console.error("[WebRTC] Error handling ICE candidate", err);
                    }
                } else {
                    pendingCandidates.current.push(candidate);
                }
            } else if (from === currId) {
                console.log("[Socket] Ignored ICE candidate from self", { from, currId });
            }
        });

        if (currId && partnerId && currId > partnerId) {
            pc.current.createOffer().then((offer) => {
                pc.current?.setLocalDescription(offer).then(() => {
                    socket.emit("offer", { roomId, offer });
                });
            }).catch((err) => console.error("[WebRTC] Offer creation error", err));
        }

        return () => {
            if(partnerId) socket.emit("add_recent_match",{partnerId});
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidates");
            pc.current?.close();
            pc.current = null;
            if(remoteVideoRef.current){
                remoteVideoRef.current.srcObject = null;
            }
        }

    },[roomId,partnerId,currId,mediaReady])

    useEffect(() => {
        if (searchParams.get("autoFind") === "1" && !emittedRef.current) {
            socket.emit("find_partner", { type: "normal" });
            emittedRef.current = true;
        }
    }, [searchParams]);

    const toggleVideo = () => {
        const videoTrack = localStream.current?.getVideoTracks()[0];
        if(videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }

    const toggleAudio = () => {
        const audioTrack = localStream.current?.getAudioTracks()[0];
        if(audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }

    const handleSkip = () => {
        setPartnerId(null);
        setRoomId(null);
        setIsWaiting(true);
        socket.emit("find_partner",{type:"normal"});
        if(timeoutMatch.current){
            clearTimeout(timeoutMatch.current);
            timeoutMatch.current = null;
        }
        timeoutMatch.current = setTimeout(() => {
            socket.emit("find_partner",{type:"immediate"});
        },2*60*1000)
    }

    return (
        <div className='h-screen w-screen'>
            <h1 className='font-extrabold md:text-4xl text-xl block text-center py-5'>Did you find your associate?</h1>
            <h2>room id : {roomId}</h2>
            {isMounted && (                    
                <div className="rounded-md max-w-[400px] flex p-10 md:max-w-5xl mx-auto w-full flex-col md:flex-row items-center justify-between gap-3  bg-green-800">
                    <div className='bg-black rounded-md'>
                        <video ref={localVideoRef} autoPlay className='w-full h-full rounded-xl bg-gray-800'/>
                    </div>

                    <div className='bg-white rounded-md'>
                        <video ref={remoteVideoRef} autoPlay className={`w-full h-full rounded-xl bg-gray-800`}/>
                        {isWaiting && (
                            <div className="w-full h-full flex items-center justify-center text-black text-2xl">Finding partner...</div>
                        )}
                        <div className='w-full h-full flex flex-col items-center justify-center gap-y-4'>
                            <button onClick={toggleVideo} className='bg-green-600 text-black p-3 rounded-md cursor-pointer border-2'>Toggle Video</button>
                            <button onClick={toggleAudio} className='bg-green-600 text-black p-3 rounded-md cursor-pointer border-2'>Toggle Audio</button>
                            <button onClick={handleSkip} className='bg-black text-green-600 p-3 rounded-md cursor-pointer border-2 mb-2'>Toggle Skip</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default page