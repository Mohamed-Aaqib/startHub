"use client"
import NavBar from '@/components/protectedRoutes/find-partner/Navbar';
import socket from '@/components/sockets/socket';
import { Binoculars, CameraOff, Info, Tag, Video, VideoOff, X } from 'lucide-react';
import { Cabin, Rethink_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'


const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});
const cabin = Cabin({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});


const page = () => {
    const router = useRouter();
    const [userId,setUserId] = useState<string|null>(null)
    const streamRef = useRef<MediaStream|null>(null)
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const [isCameraOn,setIsCameraOn] = useState(true);

    const [videoDevices,setVideoDevices] = useState<MediaDeviceInfo[]>([])
    const [audioDevices,setAudioDevices] = useState<MediaDeviceInfo[]>([])

    const [selectedVideo,setSelectedDeviceID] = useState<string|null>(null)
    const [selectedAudio,setSelectedAudioID] = useState<string|null>(null)

    // --- Added refs for audio context and animation frame ---
    const audioContextRef = useRef<AudioContext | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const endCamera = () => {

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.enabled = false);
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
    }



    useEffect(()=>{
        setUserId(crypto.randomUUID())
    },[])

    useEffect(() => {
        const fetchedDevices = async ()=> {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoInputs = devices.filter((d) => d.kind === "videoinput");
            const audioInputs = devices.filter((d) => d.kind === "audioinput");
            setAudioDevices(audioInputs)
            setVideoDevices(videoInputs)
            setSelectedDeviceID(videoInputs[0]?.deviceId||null)
            setSelectedAudioID(audioInputs[0].deviceId||null)
        };
        fetchedDevices();
    },[])

    useEffect(()=>{
        if(!socket.connected){
            socket.connect()
        }

        socket.emit("register_user",{userId:userId,isChat:false});

        navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
            streamRef.current = stream; 
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
            }
            setUpMic(stream)
        })

        const handleBeforeUnload = () => endCamera();
        window.addEventListener("beforeunload",handleBeforeUnload);


        return () => {
            endCamera();
            window.removeEventListener("beforeunload",handleBeforeUnload)
        }

    },[userId])

    useEffect(() => {
        const handlePopState = () => endCamera();
        
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            endCamera();
        };
    }, []);
    

    const findPartner  = () => {
        router.push(`/find-partner/call?testId=${userId}&autoFind=1`)
    }

    const setUpMic = async (stream: MediaStream) => {

        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext; 

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);

        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const canvas = document.getElementById("mic-visualizer") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        const draw = () => {
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                return;
            }
            animationFrameRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            const volume = dataArray.reduce((a, b) => a + b,0) / dataArray.length;
            if(ctx && canvas){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "limegreen";
                ctx.fillRect(0, 0, volume * 2, canvas.height); // volume bar
            }
        }
        draw();
    }

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        streamRef.current = stream;
        if(localVideoRef.current){
            localVideoRef.current.srcObject = stream;
        }
        setUpMic(stream)
        setIsCameraOn(true)
    }

    const stopCamera = () => {
        streamRef.current?.getVideoTracks().forEach(track => track.stop());
        if(localVideoRef.current){
            localVideoRef.current.srcObject = null;
        }
        setIsCameraOn(false)
    }

    const toggleCamera = () => {
        if(isCameraOn){
            stopCamera();
        }else{
            startCamera();
        }
    }

    const switchCamera = async (deviceId?: string) => {

        const targetDeviceId = deviceId || selectedVideo;
        if(!targetDeviceId) return;

        if(streamRef.current){
            streamRef.current.getTracks().forEach(track => track.stop())
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video:{deviceId:{exact:targetDeviceId}},
            audio:true,
        })

        streamRef.current = stream;
        if(localVideoRef.current){
            localVideoRef.current.srcObject = stream;
        }

        // setUpMic(stream)
        setIsCameraOn(true);
    }

    const switchAudio = async (deviceId?: string) => {
        const targetDeviceId = deviceId || selectedAudio;
        if(!targetDeviceId) return;

        const stream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:{deviceId:{exact:targetDeviceId}}
        })

        streamRef.current = stream;
        if(localVideoRef.current){
            localVideoRef.current.srcObject = stream;
        }
        setUpMic(stream)
    }


    return (
        <div className='h-screen flex flex-col'>
            
            <NavBar/>

            <div className='flex flex-row overflow-y-scroll flex-1 h-full'>
                <div className='flex-[0.5]  h-full w-full px-1 py-2 space-y-2 '>

                    <div className='relative'>
                        <div className={`h-[300px] w-[60%] relative block mx-auto rounded-2xl mt-10 overflow-hidden border-2 border-[#b6b6b6] shadow-sm ${!isCameraOn && "hidden"}`}>
                            <div className={` ${rethinkSans.className} backdrop-blur-md font-medium text-[12px] absolute left-3 text-[#f1f1f1] rounded-md px-2 py-[2px] bg-[#272727]/60 top-3`}>
                                Mohamed Aaqib
                            </div>
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                className={`w-full h-full object-cover rounded-2xl overflow-hidden`}/>
                        </div>
                        {!isCameraOn && (
                            <div className={`h-[300px] w-[60%] bg-gradient-to-b from-gray-500 to-gray-700 flex items-center justify-center mx-auto rounded-2xl mt-10 overflow-hidden border-2 border-[#b6b6b6] shadow-sm ${rethinkSans.className}`}>
                                <div className='p-3 font-bold text-3xl text-gray-900 '>
                                    Camera Is Off
                                </div>                            
                            </div>
                        )}
                        <button onClick={toggleCamera} className={`${isCameraOn ? "bg-gray-600 border-gray-800" :  "border-red-800 bg-red-600"} absolute bottom-0 left-1/2 -translate-x-1/2 border-2 transition-all duration-200 ease-linear cursor-pointer rounded-full my-2 p-2 block mx-auto text-white bg-blue-600 font-bold text-2xl`}>
                            {isCameraOn ? <Video/> : <VideoOff/> }
                        </button>

                    </div>

                    <div className='w-full flex flex-row items-center justify-between px-10 gap-6 mt-12 mb-5'>
                        {videoDevices.length > 1 && (
                            <div className='flex-1 text-center'>
                                <label className='block text-[#666] text-[14px] font-medium mb-2'>Camera</label>
                                <select className="media-select block w-full p-3 border border-[#e0e0e0] rounded-lg bg-white text-[#1a1a1a] focus:outline-none focus:border-[#c0c0c0] transition-colors" value={selectedVideo || " "} onChange={(e) => {
                                    setSelectedDeviceID(e.target.value);
                                    switchCamera(e.target.value);
                                }}>
                                    {videoDevices.map((device,idx) => (
                                        <option key={device.deviceId || idx} value={device.deviceId}>
                                            {device.label || `Camera ${idx + 1}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        {audioDevices.length > 1 && (
                            <div className='flex-1 text-center'>
                                <label className='block text-[#666] text-[14px] font-medium mb-2'>Microphone</label>
                                <select className="media-select block w-full p-3 border border-[#e0e0e0] rounded-lg bg-white text-[#1a1a1a] focus:outline-none focus:border-[#c0c0c0] transition-colors" value={selectedAudio || " "} onChange={(e) => {
                                    setSelectedAudioID(e.target.value);
                                    switchAudio(e.target.value);
                                }}>
                                    {audioDevices.map((device,idx) => (
                                        <option key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Microphone ${idx+1}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    
                    <button onClick={findPartner} className={`${rethinkSans.className} mx-auto looking-btn mt-10 cursor-pointer border-none outline-none bg-gradient-to-br from-[#f9f9fb] to-[#e3e6eb] [box-shadow:0_4px_10px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)] transition-all duration-200 ease-in-out text-[#4a5568] flex items-center gap-2 px-5 py-2 rounded-full text-base font-bold`} >
                        Start Looking
                        <Binoculars/>
                    </button>

                    <canvas id='mic-visualizer' className=' hidden w-full h-[20px] bg-black rounded-lg mt-2'/>
                </div>


                <div className='h-full w-full flex-[0.5] p-1'>
                    <div className='h-full w-full bg-gray-100 rounded-md p-2'>
                        <h1 className={`text-4xl ${rethinkSans.className} mx-auto w-fit font-black`}>Match Settings</h1>
                        <div className={`pb-2 px-2 pt-4 h-[60%] ${cabin.className} space-y-3 pt-10`}>
                            <div className='space-y-3'>
                                <label htmlFor='ideal-user' className='text-gray-600 block font-bold'>
                                    Describe your ideal User
                                </label>
                                <textarea 
                                    id="ideal-user"
                                    className='w-full p-4 rounded-lg border border-[#e0e0e0] focus:outline-none focus:border-[#c0c0c0] focus:shadow-md transition-all duration-200 bg-white text-[#1a1a1a] placeholder:text-[#999] shadow-sm'
                                    placeholder='I want to match someone who is good in php and java, and can play some games... '
                                    rows={2}
                                />
                            </div>
                            <div className='flex flex-row items-center h-[160px]'>
                                <div className='space-y-2 flex-[0.4] h-full'>
                                    <label htmlFor='tags' className='text-gray-600 block font-bold'>
                                        Tags to identify the user
                                    </label>
                                    <div className='bg-white border border-[#e0e0e0] rounded-lg w-fit flex items-center shadow-sm'>
                                        <input id='tags' type='text' className='w-[90%] text-[#1a1a1a] placeholder:text-[#999] p-3 rounded-l-lg outline-none transition-all duration-200 focus:border-[#c0c0c0] bg-transparent' placeholder='add tags'/>
                                        <div className='flex items-center gap-2 px-2 '>
                                            <div className='flex items-center justify-center bg-[#e5e5e5] rounded-md py-[2px] pl-[6px] pr-[4px] space-x-2'>
                                                <span className='text-black font-medium'>React</span>
                                                <X className='text-[#a2a2a2] cursor-pointer transition-colors duration-200 ease-linear hover:bg-[#dadada] rounded-md h-5 w-5 p-[2px]' strokeWidth={3}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>  
                        <div className={`${cabin.className} relative w-[90%] mx-auto h-fit mt-0 border-l-4 p-6 rounded-lg border-red-700 bg-red-600 text-white shadow-sm`}>
                            <p className='pb-3 pt-8 text-[15px] leading-relaxed font-medium'>
                                Your account needs to be fully completed so the system can recognize you as a verified user. This usually means filling in all required details such as your name, email, and profile information.
                            </p>
                            <div className='flex items-center gap-2 text-red-100 absolute top-4 left-4'>
                                <Info className='w-6 h-6' strokeWidth={2.5}/>
                                <h1 className='text-[21px] font-bold'>Important Note</h1>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>

            {/* covers the reverse NavBar height  */}
            <div className='h-[51.2px] w-full'/>
        </div>
    )
}

export default page