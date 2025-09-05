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
        <div className='h-full max-h-[200px] flex flex-col w-full max-w-[480px] bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200'>
            <div className='flex-1 flex flex-row gap-6'>
                <div className='rounded-xl max-h-[70px] w-full h-full max-w-[70px] relative bg-gray-50 border border-gray-200 shadow-sm'>
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
                <button onClick={() => {}} className='text-base font-medium cursor-pointer px-4 py-2 text-gray-700 outline-none rounded-lg bg-gray-50 border border-gray-200 transition-all duration-300 ease-linear hover:border-gray-300 hover:bg-gray-100 hover:shadow-sm flex items-center gap-[6px] group'>
                    <span>Connect</span>
                    <MoveUpRight className='w-4 h-4 transition-transform duration-300 ease-linear group-hover:translate-x-[2px] group-hover:-translate-y-[2px]'/>
                </button>
            </div>
        </div>
    )
}

export default IntegrationCard