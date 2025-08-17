"use client"
import NavBar from '@/components/protectedRoutes/find-partner/call/Navbar';
import socket from '@/components/sockets/socket';
import Send from '@/components/svgs/Send';
import { ArrowBigRightDashIcon, CameraOff, Mic, MicOff, UserRoundPlus, Video, VideoOff, VolumeOff } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'

const ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },
    // {
    //     urls: "turn:your-turn-server.com:3478",
    //     username: "your-username",
    //     credential: "your-credential",
    // },
]

const messages = [
    {user:"me",messages:"messages off the rooof "},
    {user:"you",messages:"this is a long this is a long this is a long this is a long this is a long this is a long this is a long this is a long this is a long this is a long this is a long  "},
    {user:"me",messages:"did that message just work "}
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
    const pendingOffer = useRef<any>(null);
    const pendingAnswer = useRef<any>(null);

    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(true);
    const [remoteAudioEnabled, setRemoteAudioEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const hasCalledAddRecentMatch = useRef(false);

    const roomIdRef = useRef<string | null>(null);

    useEffect(() => {
    setIsMounted(true);
    }, []);

    useEffect(() => {
        roomIdRef.current = roomId;
    }, [roomId]);


    // TODO: Modularize it

    

    useEffect(()=>{

        navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
            localStream.current = stream;
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.muted = true;
                localVideoRef.current.play().catch(e => console.warn("[Local Video] play() error", e));
            }
            setMediaReady(true);
        })

        socket.on("waiting", () => {
            setIsWaiting(true);
        });
        socket.on("partner_found", ({ roomId, partnerId, yourId }) => {
            console.log("partner is found here",partnerId)
            console.log("partner is found here",roomId)
            // Reset the flag when a new partner is found
            hasCalledAddRecentMatch.current = false;
            setRoomId(roomId);
            setPartnerId(partnerId);
            console.log("setting partner finsihed")
            setIsWaiting(false);
        });
        socket.on("offer", ({ offer, from }) => {
            console.log("offer recieved from my end ",offer,from)
            if (from !== currId) {
                if (!pc.current) {
                    pendingOffer.current = offer;
                } else {
                    handleOffer(offer);
                }
            }
        });
        socket.on("answer", ({ answer, from }) => {
            console.log("answer is recieved from here from person who send  offer hehe",answer,from);
            if (from !== currId) {
                if (!pc.current) {
                    pendingAnswer.current = answer;
                } else {
                    handleAnswer(answer);
                }
            }
        });
        socket.on("ice-candidates", async ({ candidate, from }) => {
            if (from !== currId && candidate) {
                if (remoteDescriptionSet.current) {
                    try {
                        await pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
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
        socket.on("video_state_change", ({ enabled, from }) => {
            if (from !== currId) setRemoteVideoEnabled(enabled);
        });
        socket.on("audio_state_change", ({ enabled, from }) => {
            if (from !== currId) {
                setRemoteAudioEnabled(enabled);
                if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
                    const remoteStream = remoteVideoRef.current.srcObject as MediaStream;
                    remoteStream.getAudioTracks().forEach(track => {
                        track.enabled = enabled;
                    });
                }
            }
        });
        socket.on("partner_disconnected", () => {
            console.log("disconnected")
            console.log(partnerId)
            if (pc.current) {
                pc.current.close();
                pc.current = null;
            }
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
            remoteDescriptionSet.current = false;
            pendingCandidates.current = [];
            pendingOffer.current = null;
            pendingAnswer.current = null;
            setPartnerId(null);
            setRoomId(null);
            setIsWaiting(true);
            setRemoteVideoEnabled(true);
            setRemoteAudioEnabled(true);
            setErrorMsg(null);
            setLoading(false);
            socket.emit("find_partner", { type: "normal" });
        });

        return () => {
            socket.off("waiting");
            socket.off("partner_found");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidates");
            socket.off("video_state_change");
            socket.off("audio_state_change");
            socket.off("partner_disconnected");
        }

    },[])

    const handleOffer = async (offer: any) => {
        try {
            await pc.current?.setRemoteDescription(new RTCSessionDescription(offer));
            remoteDescriptionSet.current = true;
            pendingCandidates.current.forEach(async candidate => {
                try {
                    await pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error("[WebRTC] Error handling ICE candidate (drain)", err);
                }
            });
            pendingCandidates.current = [];
            const answer = await pc.current?.createAnswer();
            await pc.current?.setLocalDescription(answer);
            console.log("answer is sent from here from person who recieved it", roomIdRef.current, answer);
            socket.emit("answer", { roomId: roomIdRef.current, answer });
        } catch (err) {
            console.error("[WebRTC] Error handling offer", err);
        }
    };

    const handleAnswer = async (answer: any) => {
        try {
            await pc.current?.setRemoteDescription(new RTCSessionDescription(answer));
            remoteDescriptionSet.current = true;
            pendingCandidates.current.forEach(async candidate => {
                try {
                    await pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error("[WebRTC] Error handling ICE candidate (drain)", err);
                }
            });
            pendingCandidates.current = [];
        } catch (err) {
            console.error("[WebRTC] Error handling answer", err);
        }
    };

    useEffect(() => {
        if (!roomId || !partnerId || !mediaReady || !currId) return;
        pc.current = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => {
                pc.current?.addTrack(track, localStream.current!);
            });
        }
        pc.current.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                remoteVideoRef.current.play().catch(e => console.warn("[Video] play() error", e));
            }
        };
        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidates", { roomId, candidate: event.candidate });
            }
        };

        if (pendingOffer.current) {
            handleOffer(pendingOffer.current);
            pendingOffer.current = null;
        }
        if (pendingAnswer.current) {
            handleAnswer(pendingAnswer.current);
            pendingAnswer.current = null;
        }
        
        if (currId && partnerId && currId > partnerId) {
            pc.current.createOffer().then((offer) => {
                pc.current?.setLocalDescription(offer).then(() => {
                    console.log("offer sent yo you  ",roomId,offer)
                    socket.emit("offer", { roomId, offer });
                });
            }).catch((err) => console.error("[WebRTC] Offer creation error", err));
        }
        return () => {
            pc.current?.close();
            pc.current = null;
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
            pendingOffer.current = null;
            pendingAnswer.current = null;
        };
    }, [roomId, partnerId, currId, mediaReady]);

    useEffect(() => {
        if (searchParams.get("autoFind") === "1" && !emittedRef.current) {
            console.log("we are emitting find partner")
            socket.emit("find_partner", { type: "normal" });
            emittedRef.current = true;
        }
    }, [searchParams]);

    const toggleVideo = async () => {
        if (!localStream.current) return;
        setLoading(true);
        try {
            const videoTrack = localStream.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoEnabled(videoTrack.enabled);

                // if(videoTrack.enabled){
                //     localStream.current.getVideoTracks().forEach((track) => track.stop() );
                //     if(localVideoRef.current){
                //         localVideoRef.current.srcObject = null;
                //     }
                // }else{
                //     const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
                //     localStream.current = stream;
                //     if(localVideoRef.current){
                //         localVideoRef.current.srcObject = stream;
                //     }
                // }

                socket.emit("video_state_change", { roomId, enabled: videoTrack.enabled, from: currId });
            }
        } catch (err: any) {
            setErrorMsg('Video toggle error: ' + (err.message || err));
        }
        setLoading(false);
    };

    const toggleAudio = () => {
        if (!localStream.current) return;
        setLoading(true);
        try {
            const audioTrack = localStream.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setAudioEnabled(audioTrack.enabled);
                socket.emit("audio_state_change", { roomId, enabled: audioTrack.enabled, from: currId });
            }
        } catch (err: any) {
            setErrorMsg('Audio toggle error: ' + (err.message || err));
        }
        setLoading(false);
    };

    const handleSkip = () => {
        if (!hasCalledAddRecentMatch.current && partnerId) {
            socket.emit("add_recent_match", { partnerId });
            hasCalledAddRecentMatch.current = true;
        }
        console.log("we aint skipped")
        setPartnerId(null);
        setRoomId(null);
        setIsWaiting(true);
        console.log("emitting")
        socket.emit("find_partner", { type: "normal" });
        // if(timeoutMatch.current){
        //     clearTimeout(timeoutMatch.current);
        //     timeoutMatch.current = null;
        // }
        // timeoutMatch.current = setTimeout(() => {
        //     socket.emit("find_partner",{type:"immediate"});
        // },20*60*1000)
    }

    const handleBeforeUnload = useCallback(() => {
        if (partnerId && !hasCalledAddRecentMatch.current) {
            socket.emit("add_recent_match", { partnerId });
            hasCalledAddRecentMatch.current = true;
        }
        if (pc.current) {
            pc.current.close();
            pc.current = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
    }, [partnerId]);

    //     const handleBeforeUnload = useCallback(() => {
    //     // Clean up everything for a hard leave (browser/tab close)
    //     roomIdRef.current = null;
    //     if (pc.current) {
    //         pc.current.close();
    //         pc.current = null;
    //     }
    //     if (remoteVideoRef.current) {
    //         remoteVideoRef.current.srcObject = null;
    //     }
    //     setIsWaiting(true); // UserB will see waiting state
    // }, []);


    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [handleBeforeUnload]);

    return (
        <div className='h-screen w-full flex flex-col bg-green-50'>
            <NavBar/>
            <div className='flex flex-row h-full overflow-y-auto'>
                <div className=' p-2 flex-[0.75]'>
                    {errorMsg && (
                        <div className='bg-red-100 text-red-700 px-4 py-2 rounded mb-4'>{errorMsg}</div>
                    )}
                    {isMounted && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 w-full mx-auto max-w-5xl p-6">
                            <div className='bg-black shadow-lg shadow-black/40 border border-gray-600 rounded-md relative flex flex-col items-center justify-center h-64 md:h-80 w-[500px]'>
                                <video ref={localVideoRef} autoPlay className='w-full h-full rounded-md bg-gray-800 object-cover'/>
                                {!videoEnabled && (
                                    <div className="absolute inset-0 rounded-md bg-gradient-to-b from-gray-500 to-gray-600 flex items-center justify-center text-white text-2xl font-bold">
                                        <div className="text-center w-10 h-10">
                                            <CameraOff className='w-full h-full'/>
                                        </div>
                                    </div>
                                )}
                                {!audioEnabled && (
                                    <div className="absolute bottom-2 right-2 border-2 border-red-800 bg-red-600 text-white p-2 rounded-full text-sm">
                                        <VolumeOff/>
                                    </div>
                                )}
                            </div>
                            <div className='bg-gradient-to-b from-gray-700 to-gray-800  rounded-md relative flex flex-col items-center justify-center h-64 md:h-80 w-[500px]'>
                                {!isWaiting ? (
                                    <>
                                        <video ref={remoteVideoRef} autoPlay className='w-full h-full rounded-md bg-gray-800 object-cover'/>
                                        {!remoteVideoEnabled && (
                                            <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800 flex items-center justify-center text-white text-2xl font-bold">
                                                <div className="text-center w-10 h-10">
                                                    <CameraOff className='w-full h-full'/>
                                                </div>
                                            </div>
                                        )}
                                        {!remoteAudioEnabled && (
                                            <div className="absolute bottom-2 right-2 border-2 border-red-800 bg-red-600 text-white p-2 rounded-full text-sm">
                                                <VolumeOff/>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center rounded-md bg-gradient-to-b shadow-lg text-blue-500 shadow-black/40 border border-gray-600 from-gray-700 to-gray-800 justify-center text-xl bg-gray-100">
                                        <div className="relative text-center h-10 w-10">
                                            <Image fill alt='' className='object-contain invert hue-rotate-180 saturate-200' src="/blocks-shuffle-3.svg"/>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className='shadow-[0_4px_6px_rgba(0,0,0,0.5),0_8px_12px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4 mt-15 bg-[#1b1919] p-1 rounded-full max-w-3xl mx-auto border-b-4 border-[#282626]'>
                        <div className='space-x-5 pl-2'>
                            <button 
                                onClick={toggleVideo} 
                                disabled={loading}
                                className={`p-2 cursor-pointer rounded-full font-semibold transition-all h-fit ${
                                    videoEnabled 
                                        ? ' text-[#555555] hover:bg-[#262323]' 
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {videoEnabled ? <Video/> : <VideoOff/>}
                            </button>
                            <button 
                                onClick={toggleAudio} 
                                disabled={loading}
                                className={`p-2 cursor-pointer rounded-full font-semibold transition-all h-fit ${
                                    audioEnabled 
                                    ? ' text-[#555555] hover:bg-[#262323]' 
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {audioEnabled ? <Mic/> : <MicOff/>}
                            </button>
                            <button className='p-2 hover:bg-[#262323] cursor-pointer rounded-full font-semibold transition-all h-fit text-blue-700'>
                                <UserRoundPlus/>
                            </button>
                        </div>
                        <button 
                            onClick={handleSkip} 
                            className='bg-red-700 border-red-900 border-2 shadow-md cursor-pointer hover:bg-red-800 flex items-center text-white px-6 py-2 rounded-full font-semibold transition-all'
                        >
                            Skip <ArrowBigRightDashIcon/>
                        </button>
                    </div>

                </div>
                
                <div className='flex-[0.25] h-full border-l-2 border-[#d1d5dc] overflow-y-auto'>
                    <div className='h-[90%] flex flex-col items-center justify-end gap-3 bg-[#f1f1f1] pb-3'>
                        {messages.map(({user,messages},idx)=>(
                            <div className={`${user == "me" ? "bg-gray-300 text-right border-l-4 border-l-gray-500" : "border-r-4 border-r-blue-500 bg-blue-300"} p-2 text-black w-full`} key={idx}>
                                {messages}
                            </div>
                        ))}
                    </div>
                    <div className='h-[52px] flex flex-row'>
                        <input type='text' placeholder='send a message' className='w-[90%] h-full p-2 focus:outline-0 border-2 border-blue-500'/>
                        <button className='w-[10%] h-full flex items-center justify-center cursor-pointer bg-blue-500 text-white'>
                            <Send/>
                        </button>
                    </div>
                </div>

            </div>
            <div className='w-full h-[51.2px]'/>
        </div>
    )
}

export default page