"use client"
import Image from 'next/image'
import React from 'react'

interface IntegrationCardI{
    name:string;
    src:string;
    desc:string;
}

const IntegrationCard = ({name,src,desc}:IntegrationCardI) => {
    return (
        <div className='h-full max-h-[200px] flex flex-col  w-full max-w-[480px] border-[2px] border-[#c8c8c8] rounded-xl p-2 py-3'>
            <div className='flex-1 flex flex-row gap-6'>
                <div className=' rounded-xl max-h-[70px] w-full h-full max-w-[70px] relative border-2 border-[#c8c8c8]'>
                    <Image alt='' src={`/assets/${src}`} className='object-contain p-2' fill/>
                </div>
                <div className='flex flex-col items-start gap-1 overflow-y-auto'>
                    <h2 className='font-bold text-[18px]'>{name}</h2>
                    <p className='text-[14px] font-semibold text-[#646464]'>
                        {desc}
                    </p>
                </div>
            </div>  
            <div className='w-full flex items-center justify-end px-4 py-2'>
                <button onClick={() => {}} className=' font-bold cursor-pointer px-2 py-[1px] border-2 border-[#050db5] text-[#ffffff] outline-none rounded-md bg-[#1e4efa]'>
                    Connect
                </button>
            </div>
        </div>
    )
}

export default IntegrationCard