"use client"
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image'
import React from 'react'

interface IntegrationCardI{
    name:string;
    src:string;
    desc:string;
}

const IntegrationCard = ({name,src,desc}:IntegrationCardI) => {
    return (
        <div className='h-full max-h-[200px] flex flex-col  w-full max-w-[480px] border border-[#c9c9c9] rounded-md p-4'>
            <div className='flex-1 flex flex-row gap-6'>
                <div className=' rounded-lg max-h-[70px] w-full h-full max-w-[70px] relative border border-[#c9c9c8]'>
                    <Image alt='' src={`/assets/${src}`} className='object-contain p-2' fill/>
                </div>
                {/* TODO: Add a max-h over here to account for the overflow-y-auto */}
                <div className='flex flex-col items-start gap-1 overflow-y-auto'>
                    <h2 className='font-bold text-[18px]'>{name}</h2>
                    <p className='text-[14px] font-semibold text-[#838383]'>
                        {desc}
                    </p>
                </div>
            </div>  
            <div className='w-full flex items-center justify-end px-4 py-2'>
                <button onClick={() => {}} className='text-base font-medium cursor-pointer px-3 py-[4px] text-[#4e4e4e] outline-none rounded-md bg-white border border-[#c9c9c9] transition-all duration-300 ease-linear hover:border-[#7d7d7d] hover:bg-gray-50 hover:shadow-sm flex items-center gap-2 group'>
                    <span>Connect</span>
                    <MoveUpRight className='w-4 h-4 transition-transform duration-300 ease-linear group-hover:translate-x-1 group-hover:-translate-y-1'/>
                </button>
            </div>
        </div>
    )
}

export default IntegrationCard