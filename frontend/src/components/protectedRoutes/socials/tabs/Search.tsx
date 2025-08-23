"use client"
import { Box, Link, LucideMessageCircleDashed, MessageCircle, SearchIcon } from 'lucide-react'
import { Cabin } from 'next/font/google';
import Image from 'next/image'
import React from 'react'

const cabin = Cabin({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});


const Search = () => {
    return (
        <div className=' w-full h-[91%] p-2'>
            <div className='w-4xl mx-auto mt-5 p-2'>
                <div className='flex items-center gap-2 p-2 rounded-md bg-[#e1e1e1]'>
                    <SearchIcon className='text-[#727272]'/>
                    <input className='outline-none flex-1 px-2' placeholder='Search for files, messages, links'/>
                </div>
                <div className='py-2 flex items-center gap-3 mt-2'>
                    <div className=' px-4 py-1 text-[14px] cursor-pointer bg-[#e9e9e9] text-[#282828] rounded-full'>
                        All Results
                    </div>
                    <div className='px-4 py-1 text-[13px] cursor-pointer bg-[#e9e9e9] text-[#282828] rounded-full'>
                        Messages
                    </div>
                    <div className='px-4 py-1 text-[13px] cursor-pointer bg-[#e9e9e9] text-[#282828] rounded-full'>
                        Links
                    </div>
                    <div className='px-4 py-1 text-[13px] cursor-pointer bg-[#e9e9e9] text-[#282828] rounded-full'>
                        Files
                    </div>
                </div>
                <hr className='mt-3 mb-4 w-full text-[#c9c9c9]'/>
                <div className=' mt-3 h-[350px] w-full overflow-auto'>
                    <div>
                        <h2 className='text-[#949494] font-bold capitalize text-[13px]'>TODAY</h2>
                        <div className='flex flex-col items-start gap-y-2 py-2'>

                            <div className='px-2 cursor-pointer  py-2 flex items-center gap-3  w-full'>
                                <div className='p-1 bg-[#e9e9e9] rounded-md'>
                                    <Box className='w-6 h-6' fill='#915404'/>
                                </div>
                                <div>
                                    <div className='mt-4 flex items-center gap-x-2'>
                                        <p className={`text-[18px]  text-[#575757] truncate max-w-[100px] ${cabin.className}`}>text.txt </p>
                                        <p className='text-[#868686] text-[15px]'> - Mazziene</p>
                                    </div>
                                    <p className='text-[13px] text-[#868686]'>"Yeah this is a crazy text file man"</p>
                                </div>
                            </div>

                            <div className='px-2 cursor-pointer py-2 flex items-center gap-3  w-full'>
                                <div className=' relative w-[31px] h-[31px] bg-[#e9e9e9] rounded-md'>
                                    <Image alt='' className='object-cover rounded-md' fill src={'https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg'} />
                                </div>
                                <div className='mt-4'>
                                    <p className={`text-[18px] text-[#575757] ${cabin.className}`}>"Man that was a great hatrick in the champions league"</p>
                                    <p className='text-[13px]  text-[#868686]'> - Ronaldo</p>
                                </div>
                            </div>
                            
                            <div className='px-2 cursor-pointer transition-colors duration-300 hover:bg-[#e0e0e0] py-2 flex items-center gap-3  w-full'>
                                <div className='p-1 bg-[#e9e9e9] rounded-md'>
                                    <Link className='w-6 h-6' fill='#7c7c7c'/>
                                </div>
                                <div>
                                    <div className='mt-4 flex items-center gap-x-2'>
                                        <p className={`text-[18px]  text-[#575757] truncate max-w-[400px] underline ${cabin.className}`}>https://localhost:3000.ae</p>
                                        <p className='text-[#868686] text-[15px]'> - Mazziene</p>
                                    </div>
                                    <p className='text-[13px] text-[#868686] mt-1'>"Yeah this is a crazy text file man"</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search