import { PlusCircle, SquareArrowOutUpRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const page = () => {
    return (
        <div className='w-full h-full flex flex-col items-center p-2'>
            <div className='flex-[0.3] max-w-5xl bg-blue-500 w-full'>
                <div className='flex flex-col gap-3 px-8'>
                    <div className='flex items-center gap-4 pt-4'>
                        <div className='w-[80px] h-[80px] relative rounded-full'>
                            <Image alt='' src="https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg" fill className='object-cover rounded-full'/>
                        </div>
                        <div className='flex flex-col items-start gap-2'>
                            <h1 className='text-white text-[16px] font-semibold'>Ronaldo</h1>
                            <div className='flex flex-row items-center gap-2'>
                                <div className='w-[30px] h-[30px] relative rounded-md cursor-pointer'>
                                    <Image alt='' src="https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg" fill className='object-cover rounded-md'/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='overflow-y-auto h-[100px] pb-2 pt-1 my-1 text-white'>
                        This is the text area where things happens and happena and happenthings happens and happena and happenthings happens and happena and happen
                        This is the text area where things happens and happena and happenthings happens and happena and happenthings happens and happena and happen
                        This is the text area where things happens and happena and happenthings happens and happena and happenthings happens and happena and happen
                    </div>
                </div>
            </div>
            <div className='flex-[0.7] w-full max-w-5xl pt-7 px-5 bg-[#e2e2e2]'>
                <div className='flex flex-row  items-start gap-16'>
                    <div>
                        <h2 className='font-bold text-[#8a8a8a]'>TAGS</h2>
                        <div className='flex items-center gap-2 mt-3 max-w-[250px] flex-wrap'>
                            <div className='capitalize font-bold text-[12px] text-white rounded-sm py-[3px] px-2 bg-[#505050]'>
                                AI
                            </div>
                            <div className='capitalize font-bold text-[12px] text-white rounded-sm py-[3px] px-2 bg-[#505050]'>
                                Cloud Engineer
                            </div>
                        </div>
                        <div className='flex items-center justify-end gap-2 mt-3 rounded-full border-[2px] border-[#959595]'>
                            <input className='outline-none w-[100px] px-2' placeholder='add a tag'/>
                            <PlusCircle className='text-[#959595]'/>
                        </div>
                    </div>

                    <div>
                        <h2 className='font-bold text-[#8a8a8a]'>JOINED</h2>
                        <p className='mt-3 text-[#565656]'>February 2nd, 2019</p>
                    </div>

                    <div className='text-center'>
                        <h2 className='font-bold text-[#8a8a8a]'>FRIENDS</h2>
                        <p className='mt-3 text-[#565656]'>23</p>
                    </div>

                    <div className='text-center'>
                        <h2 className='font-bold text-[#8a8a8a]'>STARTUPS</h2>
                        <p className='mt-3 text-[#565656]'>1</p>
                    </div>

                </div>
                <hr className='w-full border-t-2 border-[#a2a2a2] my-8'/>
                <div className='flex items-center gap-16 w-full'>
                    <div className='flex items-center px-2 py-[9px] border-2 cursor-pointer gap-2 max-w-[250px] w-full border-[#b3b3b3]'>
                        <div className='relative h-6 w-6'>
                            <Image alt='' src="/assets/linkedInLogo.png" fill className='object-cover'/>
                        </div>
                        <h2 className='font-semibold  text-[#484848] pl-2 truncate flex-1'>mobambahr7</h2>
                        <SquareArrowOutUpRight className='text-[#484848] w-[18px] h-[18px]'/>
                    </div>
                    <div className='flex items-center px-2 py-[9px] border-2 gap-2 max-w-[250px] w-full border-[#b3b3b3]'>
                        <div className='relative h-6 w-6'>
                            <Image alt='' src="/assets/githubLogo.svg" fill className='object-cover'/>
                        </div>
                        <h2 className='font-semibold  text-[#484848] pl-2 truncate flex-1'>mobambahr7</h2>
                        <SquareArrowOutUpRight className='text-[#484848] w-[18px] h-[18px]'/>
                    </div>
                    <div className='flex items-center px-2 py-[9px] border-2 gap-2 max-w-[250px] w-full border-[#b3b3b3]'>
                        <div className='relative h-6 w-6'>
                            <Image alt='' src="/assets/Xlogo.png" fill className='object-cover'/>
                        </div>
                        <h2 className='font-semibold  text-[#484848] pl-2 truncate flex-1'>mobambahr7</h2>
                        <SquareArrowOutUpRight className='text-[#484848] w-[18px] h-[18px]'/>
                    </div>

                </div>
                <hr className='w-full border-t-2 border-[#a2a2a2] my-8'/>
                
            </div>
            <div className='h-[51.2px]'/>
        </div>
    )
}

export default page