import { ImageUp, Save, SquarePen } from 'lucide-react';
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
                <div className='font-semibold text-3xl p-5 flex items-start justify-between'>
                    <button className='text-base outline-none cursor-pointer border border-[#c9c9c9] ml-auto mr-10 bg-white text-[#4e4e4e] gap-2 font-medium rounded-md py-1 px-4 w-fit flex items-center transition-all duration-300 ease-linear hover:border-[#7d7d7d] hover:bg-gray-50 hover:shadow-sm'>
                        Create <SquarePen className='w-5 h-5'/>
                    </button>
                </div>
                <div className='flex-1 p-5 h-full gap-16 overflow-y-auto flex flex-col max-h-[552px]'>
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
                    <div className='flex-1 flex flex-col items-center gap-16 py-5 justify-start '>
                        <div className='flex items-start gap-16  min-w-3xl '>
                            <div className='flex flex-col max-w-[200px] w-full'>
                                <h2 className='text-[20px] font-semibold'>Name</h2>
                                <p className='text-[#848484] text-[15px] '>Name of your startup</p>
                            </div>
                            <input className='outline-none px-4 py-3 border border-[#e5e5e5] w-full transition-all duration-200 ease-linear focus:border-[#c9c9c9] focus:shadow-sm bg-white rounded-lg text-[#4e4e4e] placeholder:text-[#a0a0a0]' placeholder='Startup Name'/>
                        </div>
                        <div className='flex items-start gap-16  min-w-3xl '>
                            <div className='flex flex-col max-w-[200px] w-full'>
                                <h2 className='text-[20px] font-semibold'>Description</h2>
                                <p className='text-[#848484] text-[15px] '>Detailed description of your startup</p>
                            </div>
                            <textarea rows={3} className='outline-none px-4 py-3 border border-[#e5e5e5] w-full transition-all duration-200 ease-linear focus:border-[#c9c9c9] focus:shadow-sm bg-white rounded-lg text-[#4e4e4e] placeholder:text-[#a0a0a0] resize-none' placeholder='Startup Description'/>
                        </div>
                        <div className='flex items-start gap-16  min-w-3xl '>
                            <div className='flex flex-col max-w-[200px] w-full'>
                                <h2 className='text-[20px] font-semibold'>Domain Name</h2>
                                <p className='text-[#848484] text-[15px] '>Your websites domain name</p>
                            </div>
                            <input className='outline-none px-4 py-3 border border-[#e5e5e5] w-full transition-all duration-200 ease-linear focus:border-[#c9c9c9] focus:shadow-sm bg-white rounded-lg text-[#4e4e4e] placeholder:text-[#a0a0a0]' placeholder='Domain Name'/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-[51.2px]'/>
        </div>
    )
}

export default page