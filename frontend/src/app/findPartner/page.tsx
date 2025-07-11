"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const router = useRouter();
    return (
        <div className='h-screen'>
            <h1 className='md:text-5xl text-2xl font-extrabold text-center'>
                This is where the magic happens
            </h1>
            <div className='mx-auto mt-10 max-w-3xl w-full p-1 space-y-2 bg-green-700 max-h-[400px]'>
                <video className='block mx-auto rounded-2xl bg-red-300'/>
                <button onClick={() => router.push("/findPartner/call")} className="block p-2 mx-auto my-2 rounded-md bg-green-500 cursor-pointer border-black border-t-2 border-l-2" >Find Someone</button>
            </div>
        </div>
    )
}

export default page