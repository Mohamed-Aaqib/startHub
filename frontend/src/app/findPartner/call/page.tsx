"use client"
import React from 'react'

const page = () => {
    return (
        <div className='h-screen w-screen'>
            <h1 className='font-extrabold md:text-4xl text-xl block text-center py-5'>Did you find your associate?</h1>
            <div className="rounded-md max-w-[400px] flex p-10 md:max-w-5xl mx-auto w-full flex-col md:flex-row items-center justify-between gap-3  bg-green-800">
                <div className='bg-black rounded-md'>
                    <video className=''/>
                </div>

                <div className='bg-white rounded-md'>
                    <video className=''/>
                </div>
            </div>
        </div>
    )
}

export default page