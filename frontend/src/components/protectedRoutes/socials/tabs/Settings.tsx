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
        <div className='w-full h-[91%] p-2'>
            <div className='w-4xl mx-auto mt-5'>
                <div className='w-full flex items-end justify-between'>
                    <div className=' w-fit mt-5 flex items-start gap-2'>
                        <div className='w-20 h-20 rounded-md relative'>
                            <Image src={"https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg"} alt='' className='rounded-md object-cover' fill/>
                        </div>
                        <div className=' '>
                            <h1 className={`${rethinkSans.className} text-[35px] font-bold`}>TheWeekend</h1>
                            <div className='w-full flex items-center justify-between'>
                                <p className='text-[#595959]'>3 members</p>

                            </div>
                        </div>
                    </div>
                    <div className={`${rethinkSans.className} flex flex-col items-end  justify-between`}>
                        <div className='px-2 py-[2px] mb-3 transform capitalize rounded-md bg-amber-300 text-amber-600'>
                            Startup
                        </div>
                        <p className='text-[#777777]'>
                            Created At: 2025/04/01
                        </p>
                    </div>
                </div>
            </div>
            <div className='max-h-[350px] mt-5 w-fit mx-auto overflow-auto flex flex-col justify-start py-4 '>
                {Array(4).fill(" ").map((_,idx) => (
                    <div key={idx} className=' rounded-md w-2xl mt-2 mx-auto px-4 py-[10px] flex items-center'>
                        <div className='flex items-center gap-3'>
                            <div className='w-9 h-9 rounded-full relative'>
                                <Image alt='' src={"https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg"} fill className='object-cover rounded-full' />
                            </div>
                            <h2 className='text-black text-[18px] font-[550]'>cr7</h2>
                        </div>
                        <div className='flex justify-start items-center gap-x-3 pl-3'>
                            <Crown className='w-5 h-5 text-yellow-400'/>
                            <Handshake className='w-5 h-5 text-blue-600'/>
                        </div>
                        <div className='ml-auto p-2 cursor-pointer hover:bg-[#ddd] transition-colors duration-200 rounded-md'>
                            <EllipsisVertical className='w-4 h-4'/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Settings