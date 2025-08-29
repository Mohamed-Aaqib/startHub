import { Crown, EllipsisVertical, Handshake } from 'lucide-react';
import { Rethink_Sans } from 'next/font/google';
import Image from 'next/image'
import React from 'react'

const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});


const Settings = () => {
    return (
        <div className='w-full h-[91%] p-3'>
            <div className='max-w-4xl mx-auto mt-4'>
                <div className='w-full flex items-end justify-between'>
                    <div className='w-fit mt-2 flex items-start gap-3'>
                        <div className='w-20 h-20 rounded-md relative'>
                            <Image src={"https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg"} alt='' className='rounded-md object-cover' fill/>
                        </div>
                        <div>
                            <h1 className={`${rethinkSans.className} text-[28px] md:text-[32px] font-bold leading-tight`}>TheWeekend</h1>
                            <div className='w-full flex items-center gap-2 mt-1'>
                                <p className='text-[#595959] text-sm'>3 members</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${rethinkSans.className} flex flex-col items-end justify-between`}>
                        <div className='px-2 py-[2px] mb-2 capitalize rounded-md bg-amber-300/70 text-amber-700 text-xs'>
                            Startup
                        </div>
                        <p className='text-[#777777] text-sm'>
                            Created At: 2025/04/01
                        </p>
                    </div>
                </div>
            </div>
            <div className='max-w-[800px] mx-auto max-h-[350px] mt-8 gap-y-4 overflow-auto flex flex-col justify-start py-2'>
                {Array(4).fill(" ").map((_,idx) => (
                    <div key={idx} className='w-full mt-1 px-2 md:px-3 py-2 rounded-md flex items-center hover:bg-gray-100 transition-colors'>
                        <div className='flex items-center gap-3'>
                            <div className='w-9 h-9 rounded-full relative'>
                                <Image alt='' src={"https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg"} fill className='object-cover rounded-full' />
                            </div>
                            <h2 className='text-black text-[16px] md:text-[17px] font-semibold'>cr7</h2>
                        </div>
                        <div className='flex justify-start items-center gap-x-3 pl-3'>
                            <Crown className='w-5 h-5 text-yellow-500'/>
                            <Handshake className='w-5 h-5 text-blue-600'/>
                        </div>
                        <div className='ml-auto p-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200 rounded-md'>
                            <EllipsisVertical className='w-4 h-4 text-gray-700'/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Settings