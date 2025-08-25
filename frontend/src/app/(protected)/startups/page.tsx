import { ImageUp } from 'lucide-react';
import { Noto_Sans } from 'next/font/google';
import Image from 'next/image';
import React from 'react'

const notoSansFont = Noto_Sans({ 
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-noto-sans',
});  


const page = () => {
    return (
        <div className={`flex flex-col h-full w-full ${notoSansFont.className}`}>
            <div className='flex-1 flex flex-col p-2'>
                <div className='font-semibold text-3xl p-5'>
                    <h1>Startup</h1>
                </div>
                <div className='flex-1 p-5 h-full overflow-y-auto flex flex-col bg-amber-700 max-h-[552px]'>
                    <div className='w-full flex justify-center items-center'>
                        <div className='w-[150px] h-[150px] relative rounded-full cursor-pointer'>
                            {/* <Image 
                                alt='' 
                                src={"https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg"} 
                                className='object-cover rounded-full' 
                                fill
                            /> */}
                            <div className='w-full h-full flex border-dashed border-2 border-[#838383] items-center justify-center bg-[#bebebe] rounded-full'>
                                <ImageUp className='text-[#4e4e4e] h-[60px] w-[60px]'/>
                            </div>
                        </div>
                        <input hidden type=''/>
                    </div>
                    <div className='flex-1 flex flex-col items-center gap-10 py-5 justify-start '>
                        <div className='flex items-start gap-16  min-w-2xl '>
                            <div className='flex flex-col max-w-[200px] w-full'>
                                <h2 className='text-[20px]'>Name</h2>
                                <p className='text-[#848484] text-[15px] '>This would be your websites name</p>
                            </div>
                            <input className='outline-none px-3 py-2 border-[1px] w-full border-[#474747] rounded-md' placeholder='Startup Name'/>
                        </div>
                        <input className='outline-none px-3 py-[2px]' placeholder='enter startup domain'/>
                        <input className='outline-none px-3 py-[2px]' placeholder='enter startup name'/>
                        <input className='outline-none px-3 py-[2px]' placeholder='enter startup domain'/>
                        <input className='outline-none px-3 py-[2px]' placeholder='enter startup name'/>
                        <input className='outline-none px-3 py-[2px]' placeholder='enter startup domain'/>
                        <input className='outline-none px-3 py-[2px]' placeholder='enter startup name'/>
                        <input className='outline-none px-3 py-[2px]' placeholder='enter startup domain'/>
                        <input className='outline-none px-3 py-[2px]' placeholder='enter startup name'/>
                    </div>
                </div>
            </div>
            <div className='h-[51.2px]'/>
        </div>
    )
}

export default page