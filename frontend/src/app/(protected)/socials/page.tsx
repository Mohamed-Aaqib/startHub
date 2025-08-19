import { Roboto } from 'next/font/google'
import React from 'react'


const robotoBlack = Roboto({
    weight: "900", // equivalent to Helvetica Black
    subsets: ["latin"],
});  

const page = () => {
    return (
        <div className='flex items-center justify-center h-full'>
            <div className={`${robotoBlack.className} px-3 py-2 w-xl h-[500px] flex items-start justify-center  bg-[#AED6F3] rounded-sm`}>
                <div className='flex items-center flex-col'>
                    <div className='flex items-start flex-col gap-y-2 w-md px-4'>
                        <div className='flex items-center gap-3 text-3xl'>
                            <h1>CLICK TO</h1>
                            <h1 className='ml-10'>CHAT</h1>
                        </div>
                        {[...Array(4)].map((_,idx) => (
                            <div key={idx} className='flex items-center gap-3 text-3xl'>
                                <h1>CLICK TO</h1>
                                <h1>CHAT</h1>
                            </div>
                        ))}
                    </div>
                    <div className='flex items-center flex-col -space-y-2 w-[480px] mt-10'>
                        {[...Array(4)].map((_,idx)=>(
                            <div key={idx} className='flex items-center w-full justify-between text-xl'>
                                <h2>Any/Chat</h2>
                                <h2>Any/Chat</h2>
                            </div>
                        ))}
                        <div className='flex items-center flex-col -space-y-4 w-[480px] '>
                            <div className='flex items-center w-full justify-between text-xl'>
                                <h2>Any/Chat</h2>
                                <h2>Any/Chat</h2>
                            </div>
                            <div className='flex items-center w-full justify-between text-xl'>
                                <h2>Any/Chat</h2>
                                <h2>Any/Chat</h2>
                            </div>
                            <div className='flex items-center w-full justify-between text-xl'>
                                <h2>Any/Chat</h2>
                                <h2>Any/Chat</h2>
                            </div>
                        </div>
                        {[...Array(4)].map((_,idx)=>(
                            <div key={idx} className='flex items-center w-full justify-between text-xl'>
                                <h2>Any/Chat</h2>
                                <h2>Any/Chat</h2>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default page