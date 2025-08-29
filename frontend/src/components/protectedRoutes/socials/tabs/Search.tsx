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
        <div className=' w-full h-[91%] p-3'>
            <div className='max-w-4xl mx-auto mt-4 p-2'>
                <div className='flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 shadow-sm'>
                    <SearchIcon className='w-5 h-5 text-gray-400'/>
                    <input className='flex-1 outline-none text-[15px] text-gray-900 placeholder:text-gray-500' placeholder='Search'/>
                </div>
                <div className='py-2 flex items-center gap-2 md:gap-3 mt-3'>
                    <div className='px-3 py-1 text-xs cursor-pointer bg-white border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm'>
                        All Results
                    </div>
                    <div className='px-3 py-1 text-xs cursor-pointer bg-white border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm'>
                        Messages
                    </div>
                    <div className='px-3 py-1 text-xs cursor-pointer bg-white border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm'>
                        Links
                    </div>
                    <div className='px-3 py-1 text-xs cursor-pointer bg-white border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm'>
                        Files
                    </div>
                </div>
                <hr className='mt-3 mb-4 w-full border-gray-200'/>
                <div className='mt-3 h-[350px] w-full overflow-y-auto'>
                    <div>
                        <h2 className='text-gray-600 font-semibold tracking-wide capitalize text-xs mb-3'>TODAY</h2>
                        <div className='flex flex-col items-start gap-y-3 py-1'>
                            <div className='px-3 cursor-pointer py-2.5 flex items-center gap-3 w-full hover:bg-gray-50 rounded-lg transition-colors'>
                                <div className='p-1.5 bg-gray-100 rounded-lg'>
                                    <Box className='w-5 h-5' fill='#6b7280'/>
                                </div>
                                <div>
                                    <div className='flex items-center gap-x-2'>
                                        <p className={`text-[15px] font-medium text-gray-900 truncate max-w-[280px] ${cabin.className}`}>text.txt</p>
                                        <p className='text-gray-500 text-sm'>@Mazziene</p>
                                    </div>
                                    <p className='text-sm text-gray-600 mt-0.5'>"Yeah this is a crazy text file man"</p>
                                </div>
                            </div>

                            <div className='px-3 cursor-pointer py-2.5 flex items-center gap-3 w-full hover:bg-gray-50 rounded-lg transition-colors'>
                                <div className='relative w-8 h-8 bg-gray-100 rounded-lg'>
                                    <Image alt='' className='object-cover rounded-lg' fill src={'https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg'} />
                                </div>
                                <div>
                                    <p className={`text-[15px] font-medium text-gray-900 ${cabin.className}`}>"Man that was a great hatrick in the champions league"</p>
                                    <p className='text-sm text-gray-500 mt-0.5'>@Ronaldo</p>
                                </div>
                            </div>

                            <div className='px-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50 py-2.5 flex items-center gap-3 w-full rounded-lg'>
                                <div className='p-1.5 bg-gray-100 rounded-lg'>
                                    <Link className='w-5 h-5' fill='#6b7280'/>
                                </div>
                                <div>
                                    <div className='flex items-center gap-x-2'>
                                        <p className={`text-[15px] font-medium text-gray-900 truncate max-w-[420px] underline ${cabin.className}`}>https://localhost:3000.ae</p>
                                        <p className='text-sm text-gray-500'>@Mazziene</p>
                                    </div>
                                    <p className='text-sm text-gray-600 mt-0.5'>"Yeah this is a crazy text file man"</p>
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