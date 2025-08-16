"use client"
import NavBar from '@/components/protectedRoutes/find-partner/Navbar';
import socket from '@/components/sockets/socket';
import { CameraOff, Info, Video, VideoOff } from 'lucide-react';
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
        router.push(`/findPartner/call?testId=${userId}&autoFind=1`)
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

    const switchCamera = async () => {

        if(!selectedVideo) return;

        if(streamRef.current){
            streamRef.current.getTracks().forEach(track => track.stop())
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video:{deviceId:{exact:selectedVideo}},
            audio:true,
        })

        streamRef.current = stream;
        if(localVideoRef.current){
            localVideoRef.current.srcObject = stream;
        }

        setUpMic(stream)
        setIsCameraOn(true);
    }

    const switchAudio = async () => {
        if(!selectedAudio) return;

        const stream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:{deviceId:{exact:selectedAudio}}
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
                        <div className={`h-[300px] p-[2px] w-[60%] block mx-auto rounded-2xl mt-10 overflow-hidden ${!isCameraOn && "hidden"}`}>
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                className={`w-full h-full object-cover rounded-2xl overflow-hidden`}/>
                        </div>
                        {!isCameraOn && (
                            <div className={`h-[300px] p-[2px] w-[60%] bg-gradient-to-b from-gray-500 to-gray-700  flex items-center justify-center mx-auto rounded-2xl mt-10 overflow-hidden ${rethinkSans.className}`}>
                                <div className='p-3 font-bold text-3xl text-gray-900 '>
                                    Camera Is Off
                                </div>                            
                            </div>
                        )}
                        <button onClick={toggleCamera} className={`${isCameraOn ? "bg-gray-600 border-gray-800" :  "border-red-800 bg-red-600"} absolute bottom-0 left-1/2 -translate-x-1/2 border-2 transition-all duration-200 ease-linear cursor-pointer rounded-full my-2 p-2 block mx-auto text-white bg-blue-600 font-bold text-2xl`}>
                            {isCameraOn ? <Video/> : <VideoOff/> }
                        </button>

                    </div>

                    <div className='w-full flex flex-row items-center justify-start px-10 gap-10 mt-15 mb-5'>
                        {videoDevices.length > 1 && (
                            <select className="media-select block w-full" value={selectedVideo || " "} onChange={(e) => setSelectedDeviceID(e.target.value)}>
                                {videoDevices.map((device,idx) => (
                                    <option key={device.deviceId || idx} value={device.deviceId}>
                                        {device.label || `Camera ${idx + 1}`}
                                    </option>
                                ))}
                            </select>
                        )}
                        <button onClick={switchCamera} className='px-3 py-1 bg-gray-500 text-gray-800 font-bold cursor-pointer border-gray-600 border-2 rounded-full block'>
                            Switch 
                        </button>
                    </div>

                    <div className='w-full flex flex-row items-center justify-start px-10 gap-10 my-5'>
                        {audioDevices.length > 1 && (
                            <select className="media-select block" value={selectedAudio || " "} onChange={(e) => setSelectedAudioID(e.target.value)}>
                                {audioDevices.map((device,idx) => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Microphone ${idx+1}`}
                                    </option>
                                ))}
                            </select>
                        )}
                        <button onClick={switchAudio} className='px-3 py-1 bg-gray-500 text-gray-800 font-bold cursor-pointer border-gray-600 border-2 rounded-full block'>
                            Switch
                        </button>
                    </div>

                    <canvas id='mic-visualizer' className=' hidden w-full h-[20px] bg-black rounded-lg mt-2'/>
                </div>


                <div className='h-full w-full flex-[0.5] p-1'>
                    <div className='h-[90%] w-full bg-gray-100 rounded-md p-2'>
                        <h1 className={`text-4xl ${rethinkSans.className} mx-auto w-fit font-black`}>Match Settings</h1>
                        <div className={`pb-2 pt-4 h-[70%] ${cabin.className} space-y-3 pt-10`}>
                            <textarea 
                                className=' w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:outline-none focus:border-blue-600  transition duration-300 bg-gray-200 text-gray-700 placeholder-gray-400'
                                placeholder='Describe your target user'
                                rows={4}
                            />
                            <input type='text' className='bg-gray-200 border-gray-300 border-2 text-gray-700 placeholder-gray-400 p-2 rounded-md ring-0 transition duration-300 focus:ring-0 focus:outline-none focus:border-blue-600' placeholder='add tags'/>
                            <div className='flex flex-wrap gap-2 items-center w-full p-2 rounded-md'>
                                <div className='cursor-pointer max-w-40 truncate hover:bg-red-600 transition duration-200 bg-black text-white font-medium rounded-full px-2 py-1'>
                                    Name
                                </div>
                                <div className='bg-black text-white font-medium rounded-full px-2 py-1'>
                                    Name
                                </div>
                                <div className='bg-black text-white font-medium rounded-full px-2 py-1'>
                                    Name
                                </div>
                            </div>
                        </div>  
                        <div className={` ${cabin.className} relative mx-auto w-[80%] h-fit my-2 border-l-8 p-4 rounded-md border-[#b91c1c] bg-[#7f1d1d] text-white font-bold`}>
                            <p>
                                your account needs to be fully completed so the system can recognize you as a verified user. This usually means filling in all required details such as your name, email, and profile information
                            </p>
                            <div className='rounded-full text-[#b91c1c] absolute bottom-2 right-2 '>
                                <Info/>
                            </div>
                        </div>
                    </div>


                    <button onClick={findPartner} className={`${rethinkSans.className} block p-2 mx-auto my-2 font-bold rounded-full transition-colors duration-200 ease-linear hover:bg-[#587f9d] bg-[#8ec3eb] cursor-pointer text-[#031d31]  border-[1px]`} >
                        Start Looking
                    </button>
                </div>
                
            </div>

            {/* covers the reverse NavBar height  */}
            <div className='h-[51.2px] w-full'/>
        </div>
    )
}

export default page