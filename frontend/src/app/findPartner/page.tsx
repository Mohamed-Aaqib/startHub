"use client"
import socket from '@/components/sockets/socket';
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'

const page = () => {
    const router = useRouter();
    const userId = useMemo(() => crypto.randomUUID() ,[])
    const streamRef = useRef<MediaStream|null>(null)
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const [isCameraOn,setIsCameraOn] = useState(true);

    const [videoDevices,setVideoDevices] = useState<MediaDeviceInfo[]>([])
    const [audioDevices,setAudioDevices] = useState<MediaDeviceInfo[]>([])

    const [selectedVideo,setSelectedDeviceID] = useState<string|null>(null)
    const [selectedAudio,setSelectedAudioID] = useState<string|null>(null)


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
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream;
            }
        })
    },[userId])

    const findPartner  = () => {
        socket.emit("find_partner",{type:"normal"});
        router.push("/findPartner/call")
    }

    const setUpMic = async (stream:MediaStream) => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        source.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const canvas = document.getElementById("mic-visualizer") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        const draw = () => {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            const volume = dataArray.reduce((a, b) => a + b,0) / dataArray.length;

            if(ctx && canvas){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "limegreen";
                ctx.fillRect(0, 0, volume * 2, canvas.height); // volume bar
            }

        }
        draw()

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
        streamRef.current?.getTracks().forEach(track => track.stop());
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

        const stream = await navigator.mediaDevices.getUserMedia({
            video:{deviceId:{exact:selectedVideo}},
            audio:true,
        })

        streamRef.current = stream;
        if(localVideoRef.current){
            localVideoRef.current.srcObject = stream;
        }

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
        <div className='h-screen'>
            <h1 className='md:text-5xl text-2xl font-extrabold text-center'>
                This is where the magic happens
            </h1>
            <div className='mx-auto mt-10 max-w-[450px] md:max-w-3xl w-full p-1 space-y-2 bg-green-700 min-h-[400px]'>
                
                <video ref={localVideoRef} muted autoPlay playsInline className={`${!isCameraOn && "hidden" } max-w-[300px] h-full block mx-auto rounded-2xl`}/>
                {!isCameraOn && (
                    <div className='max-w-[300px] w-full mx-auto h-[350px] flex items-center justify-center bg-black text-white rounded-2xl'>
                    Camera is off / Loading...
                    </div>
                )}

                <button onClick={findPartner} className="block p-2 mx-auto my-2 rounded-md bg-green-500 cursor-pointer border-black border-t-2 border-l-2" >
                    Find Someone
                </button>
                <button onClick={toggleCamera} className='cursor-pointer rounded-md my-2 p-2 block mx-auto text-black bg-red-600 font-bold text-2xl'>
                    {isCameraOn ? "Turn camera off" : "Turn camera on" }
                </button>
                {videoDevices.length > 1 && (
                    <select className="block mx-auto p-2 rounded bg-white text-black" value={selectedVideo || " "} onChange={(e) => setSelectedDeviceID(e.target.value)}>
                        {videoDevices.map((device,idx) => (
                            <option key={device.deviceId || idx} value={device.deviceId}>
                                {device.label || `Camera ${idx + 1}`}
                            </option>
                        ))}
                    </select>
                )}
                {audioDevices.length > 1 && (
                    <select className="block mx-auto p-2 rounded bg-white text-black" value={selectedAudio || " "} onChange={(e) => setSelectedAudioID(e.target.value)}>
                        {audioDevices.map((device,idx) => (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label || `Microphone ${idx+1}`}
                            </option>
                        ))}
                    </select>
                )}
                <h2 className='text-center'>Video Selected {selectedVideo}</h2>
                <button onClick={switchCamera} className='mt-2 p-2 bg-blue-500 text-white rounded-md block mx-auto'>
                    Switch Camera
                </button>
                <h2 className='text-center'>Audio Selected {selectedAudio}</h2>
                <button onClick={switchAudio} className='mt-2 p-2 bg-amber-500 text-white rounded-md block mx-auto'>
                    Switch Audio
                </button>

                <canvas id='mic-visualizer' className='w-full h-[20px] bg-black rounded-lg mt-2'/>
            </div>
        </div>
    )
}

export default page