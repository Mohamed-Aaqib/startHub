import { PlusCircle, SquareArrowOutUpRight, Users, Building2, Calendar } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const page = () => {
    return (
        <div className='w-full overflow-y-auto flex flex-col items-center p-2 h-screen'>
            <section className='flex-[0.3] max-w-5xl bg-white border-b border-[#e5e5e5] w-full'>
                <div className='flex flex-col gap-6 px-8 py-6'>
                    <div className='flex items-start gap-6'>
                        <div className='w-[100px] h-[100px] relative rounded-full flex-shrink-0'>
                            <Image alt='Profile Picture' src="https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg" fill className='object-cover rounded-full'/>
                        </div>
                        <div className='flex flex-col items-start gap-3 flex-1'>
                            <div className='flex items-center gap-3'>
                                <h1 className='text-[#1a1a1a] text-[24px] font-bold'>Ronaldo</h1>
                                <div className='flex items-center relative rounded-md w-[25px] h-[25px]'>
                                    <Image alt='Associations' src={"https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg"} fill className='object-cover rounded-md' />
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <button className='px-5 py-2 border border-[#e0e0e0] bg-white text-[#666] rounded-lg font-medium text-[14px] hover:bg-gray-50 transition-colors'>
                                    Message
                                </button>
                                <button className='px-5 py-2 bg-blue-600 text-white rounded-lg font-medium text-[14px] hover:bg-blue-700 transition-colors'>
                                    Share profile
                                </button>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-6 ml-auto mt-2'>
                            <div className='flex items-center gap-2'>
                                <Users className='w-4 h-4 text-[#666]' />
                                <span className='text-[#666] text-[12px]'>23 Friends</span>
                            </div>
                            
                            <div className='flex items-center gap-2'>
                                <Building2 className='w-4 h-4 text-[#666]' />
                                <span className='text-[#666] text-[12px]'>1 Startup</span>
                            </div>
                            
                            <div className='flex items-center gap-2'>
                                <Calendar className='w-4 h-4 text-[#666]' />
                                <span className='text-[#666] text-[12px]'>19th Feb 2019</span>
                            </div>
                        </div>

                    </div>
                    <div className='bg-[#f8f8f8] border border-[#e0e0e0] rounded-lg p-4'>
                        <p className='text-[#666] max-h-[121.1px] overflow-y-auto text-[15px] leading-relaxed'>
                            This is the text area where things happens and happena and happenthings happens and happena and happenthings happens and happena and happen
                            This is the text area where things happens and happena and happenthings happens and happena and happenthings happens and happena and happen
                            This is the text area where things happens and happena and happenthings happens and happena and happenthings happens and happena and happen
                        </p>
                    </div>
                </div>
            </section>
            <section className='flex-[0.7] w-full max-w-5xl pt-7 px-8 bg-white'>
                <div className='w-full'>
                    <div className='w-full'>
                        <h2 className='text-[20px] font-bold text-[#1a1a1a] mb-4'>Tags</h2>
                        <div className='flex flex-wrap gap-3'>
                            <div className='px-4 py-2 bg-white border border-[#e0e0e0] rounded-lg text-[#666] text-[14px] font-medium'>
                                AI Development
                            </div>
                            <div className='px-4 py-2 bg-white border border-[#e0e0e0] rounded-lg text-[#666] text-[14px] font-medium'>
                                Cloud Engineering
                            </div>
                            <div className='px-4 py-2 bg-white border border-[#e0e0e0] rounded-lg text-[#666] text-[14px] font-medium'>
                                Full Stack Development
                            </div>
                            <div className='px-4 py-2 bg-white border border-[#e0e0e0] rounded-lg text-[#666] text-[14px] font-medium'>
                                DevOps
                            </div>
                            <div className='px-4 py-2 bg-white border border-[#e0e0e0] rounded-lg text-[#666] text-[14px] font-medium'>
                                Machine Learning
                            </div>
                        </div>
                        
                        <div className='mt-4'>
                            <div className='flex items-center w-fit gap-2 flex-wrap min-h-[40px] px-3 py-2 border border-[#e0e0e0] rounded-lg bg-white focus-within:border-[#c0c0c0] transition-colors'>
                                <input 
                                    className='flex-1 min-w-[120px] outline-none text-[#1a1a1a] placeholder:text-[#999] text-[14px] bg-transparent' 
                                    placeholder='Add a tag...'
                                />
                                <button className='p-1 text-[#666] hover:text-[#1a1a1a] transition-colors'>
                                    <PlusCircle className='w-4 h-4'/>
                                </button>
                            </div>
                        </div>
                    </div>        
                </div>
                <hr className='w-full border-t border-[#e5e5e5] my-8'/>
                <div className='mb-4'>
                    <h2 className='text-[#333333] text-[20px] font-bold'>Social Links</h2>
                </div>
                <div className='flex items-center gap-16 w-full'>
                    <div className='flex items-center cursor-pointer px-4 py-3 border border-[#e5e5e5] gap-3 max-w-[250px] w-full bg-white rounded-lg transition-all duration-200 ease-linear hover:border-[#c9c9c9] hover:shadow-sm'>
                        <div className='relative h-6 w-6'>
                            <Image alt='LinkedIn' src="/assets/linkedInLogo.png" fill className='object-cover'/>
                        </div>
                        <h2 className='font-medium text-[#4e4e4e] truncate flex-1'>mobambahr7</h2>
                        <SquareArrowOutUpRight className='text-[#4e4e4e] w-4 h-4'/>
                    </div>
                    <div className='flex items-center cursor-pointer px-4 py-3 border border-[#e5e5e5] gap-3 max-w-[250px] w-full bg-white rounded-lg transition-all duration-200 ease-linear hover:border-[#c9c9c9] hover:shadow-sm'>
                        <div className='relative h-6 w-6'>
                            <Image alt='GitHub' src="/assets/githubLogo.svg" fill className='object-cover'/>
                        </div>
                        <h2 className='font-medium text-[#4e4e4e] truncate flex-1'>mobambahr7</h2>
                        <SquareArrowOutUpRight className='text-[#4e4e4e] w-4 h-4'/>
                    </div>
                    <div className='flex items-center cursor-pointer px-4 py-3 border border-[#e5e5e5] gap-3 max-w-[250px] w-full bg-white rounded-lg transition-all duration-200 ease-linear hover:border-[#c9c9c9] hover:shadow-sm'>
                        <div className='relative h-6 w-6'>
                            <Image alt='Twitter' src="/assets/Xlogo.png" fill className='object-cover'/>
                        </div>
                        <h2 className='font-medium text-[#4e4e4e] truncate flex-1'>mobambahr7</h2>
                        <SquareArrowOutUpRight className='text-[#4e4e4e] w-4 h-4'/>
                    </div>
                </div>
                <hr className='w-full border-t border-[#e5e5e5] my-8'/>
            </section>
            
            <div className='h-[51.2px]'/>
        </div>
    )
}

export default page