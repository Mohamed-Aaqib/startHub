"use client"
import socket from '@/components/sockets/socket';
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

    const toggleVideo = () => {
        if (!localStream.current) return;
        setLoading(true);
        try {
            const videoTrack = localStream.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoEnabled(videoTrack.enabled);
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
        <div className='h-screen w-screen flex flex-col items-center justify-center bg-green-50'>
            <h1 className='font-extrabold md:text-4xl text-xl block text-center py-5'>Did you find your associate?</h1>
            <h2>room id : {roomId}</h2>
            <h2>userId : {currId}</h2>
            {errorMsg && (
                <div className='bg-red-100 text-red-700 px-4 py-2 rounded mb-4'>{errorMsg}</div>
            )}
            {isMounted && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl p-6 bg-green-800 rounded-lg shadow-lg">
                    <div className='bg-black rounded-md relative flex flex-col items-center justify-center h-64 md:h-80'>
                        <video ref={localVideoRef} autoPlay className='w-full h-full rounded-xl bg-gray-800 object-cover'/>
                        {!videoEnabled && (
                            <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-2xl font-bold">
                                <span className="flex flex-col items-center"><span>📹</span>Camera Off</span>
                            </div>
                        )}
                        {!audioEnabled && (
                            <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm">
                                🔇 Muted
                            </div>
                        )}
                    </div>
                    <div className='bg-white rounded-md relative flex flex-col items-center justify-center h-64 md:h-80'>
                        {!isWaiting ? (
                            <>
                                <video ref={remoteVideoRef} autoPlay className='w-full h-full rounded-xl bg-gray-800 object-cover'/>
                                {!remoteVideoEnabled && (
                                    <div className="absolute inset-0 bg-black flex items-center justify-center text-black text-2xl font-bold">
                                        <span className="flex flex-col items-center"><span>👤</span>Camera Off</span>
                                    </div>
                                )}
                                {!remoteAudioEnabled && (
                                    <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm">
                                        🔇 Muted
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-black text-xl bg-gray-100 rounded-xl">
                                <div className="text-center">
                                    <div className="animate-spin text-3xl mb-2">⏳</div>
                                    <div>Finding partner...</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className='flex justify-center gap-4 mt-6'>
                <button 
                    onClick={toggleVideo} 
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                        videoEnabled 
                            ? 'bg-gray-600 text-white hover:bg-gray-700' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {videoEnabled ? '📹 Camera On' : '📹 Camera Off'}
                    {loading && <span className="ml-2 animate-spin">⏳</span>}
                </button>
                <button 
                    onClick={toggleAudio} 
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                        audioEnabled 
                            ? 'bg-gray-600 text-white hover:bg-gray-700' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {audioEnabled ? '🎤 Mic On' : '🔇 Mic Off'}
                    {loading && <span className="ml-2 animate-spin">⏳</span>}
                </button>
                <button 
                    onClick={handleSkip} 
                    className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all'
                >
                    ⏭️ Skip
                </button>
            </div>
        </div>
    )
}

export default page