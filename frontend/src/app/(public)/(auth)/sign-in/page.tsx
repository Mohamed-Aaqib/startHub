"use client"
import { EmailIcon, GoogleIcon, PasswordIcon } from '@/components/svgs/Auth'
import { Cabin } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React from 'react'

const cabin = Cabin({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});


const page = () => {
    const router = useRouter();

    return (
        <div className={`w-full min-h-screen flex flex-col items-center justify-center ${cabin.className}`}>
            <div className="max-w-xs w-full flex flex-col gap-3">
                <h1 className="text-4xl font-bold py-4 text-center">Sign In</h1>
                <div>
                    <label htmlFor="email" className="block mb-1 ml-1 text-sm font-medium text-gray-700 select-none">
                        Email
                    </label>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-gray-300 transition-colors duration-200 focus-within:border-[#298dd4] focus-within:shadow-[0_0_0_2px_#298dd433]">
                        <EmailIcon className="text-gray-400 w-4 h-4" />
                        <input id="email" placeholder='alvingeorge@gmail.com' className="outline-none border-none bg-transparent flex-1 text-base py-1 px-2"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1 ml-1 text-sm font-medium text-gray-700 select-none">
                        Password
                    </label>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-gray-300 transition-colors duration-200 focus-within:border-[#298dd4] focus-within:shadow-[0_0_0_2px_#298dd433]">
                        <PasswordIcon className="text-gray-400 w-4 h-4" />
                        <input id="password" placeholder='*****' type="password" className="outline-none border-none bg-transparent flex-1 text-base py-1 px-2"/>
                    </div>
                </div>
                <button className='bg-black w-full mt-4 mx-auto text-white px-6 py-2 rounded-full cursor-pointer'>
                    Sign In
                </button>
                <p className='text-center py-1'>
                    or
                </p>
                <button className="cursor-pointer w-full text-black flex gap-2 items-center justify-center bg-gray-100 px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200">
                    <GoogleIcon/>
                    Sign In with Google
                </button>
                
                <hr className="border-t border-dashed border-gray-300 mt-2" />
                <p className="text-center text-sm text-gray-500">First time? 
                    <span onClick={() => router.push("/sign-up")} className='ml-2 cursor-pointer text-[#298dd4]'>Sign Up</span>
                </p>

            </div>
        </div>          
    )
}

export default page