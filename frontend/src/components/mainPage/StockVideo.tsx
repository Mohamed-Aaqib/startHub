import { Rethink_Sans } from 'next/font/google';
import { MicIcon, UserPlus, VideoIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

interface IStockVideo{
    img:string
    scrollY:number
    className:string

}

const StockVideo = ({className,img,scrollY}:IStockVideo) => {
    return (
        <div className={`bg-blue-600/20 rounded-sm gap-1 h-[200px] overflow-hidden flex flex-col items-center justify-between backdrop-blur-lg p-1 w-[300px] ${className}`} style={{
            transform:`translateY(-${scrollY*0.3}px)`
        }}> 
            <div className='px-1 py-[2px] w-full'>
                <div className='bg-red-600 ml-auto animate-pulse duration-500 rounded-full w-2 h-2'/>
            </div>
            <div className='w-full flex-1 relative'>
                <Image
                    src={`/assets/${img}`}
                    alt="test"
                    fill
                    className="rounded object-cover"
                />
            </div>
            <div className='w-full flex items-center justify-between p-2'>
                <div className='flex items-center gap-2'>
                    <div className='gap-1 bg-white text-black rounded-full px-2 py-1'>
                        <MicIcon className='w-5 h-5' strokeWidth={2} />
                    </div>
                    <div className='gap-1 bg-white text-black rounded-full px-2 py-1'>
                        <VideoIcon className='w-5 h-5' strokeWidth={2} />
                    </div>
                </div>
                <div className={`flex items-center gap-1 rounded-full px-[7px] py-[2px] bg-blue-600 ${rethinkSans.className}`}>
                    <UserPlus className='w-4 h-4 text-white' strokeWidth={2.5} />
                    <span className='text-white font-semibold'>Add</span>
                </div>
            </div>
        </div>
    )
}

export default StockVideo