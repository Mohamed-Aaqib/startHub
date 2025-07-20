"use client"
import React from 'react'
import { Cabin } from 'next/font/google';
import { ConfirmPasswordIcon, EmailIcon, GoogleIcon, NameIcon, PasswordIcon } from '@/components/svgs/Auth';
import { useRouter } from 'next/navigation';

const cabin = Cabin({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

const page = () => {

    const router = useRouter();

    return (
        <div className={`w-full min-h-screen flex flex-col items-center justify-center ${cabin.className}`}>
            <div className="max-w-xs w-full flex flex-col gap-3 pb-20">
                <h1 className="text-4xl font-bold py-4 text-center mt-20">Sign Up</h1>
                <div>
                    <label htmlFor="name" className="block mb-1 ml-1 text-sm font-medium text-gray-700 select-none">
                        Name
                    </label>
                    <div className="flex items-center px-3 py-1 rounded-lg bg-white border border-gray-300 transition-colors duration-200 focus-within:border-[#298dd4] focus-within:shadow-[0_0_0_2px_#298dd433]">
                        <NameIcon className="text-gray-400 w-7 h-7 -mr-1" />
                        <input id="name" placeholder='alvin' className="outline-none border-none bg-transparent flex-1 text-base py-1 px-2"/>
                    </div>
                </div>
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
                <div>
                    <label htmlFor="confirmPass" className="block mb-1 ml-1 text-sm font-medium text-gray-700 select-none">
                        Confirm Password
                    </label>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-gray-300 transition-colors duration-200 focus-within:border-[#298dd4] focus-within:shadow-[0_0_0_2px_#298dd433]">
                        <ConfirmPasswordIcon className="text-gray-400 w-4 h-4" />
                        <input id="confirmPass" placeholder='*****' type="password" className="outline-none border-none bg-transparent flex-1 text-base py-1 px-2"/>
                    </div>
                </div>
                <button className='bg-black w-full mt-4 mx-auto text-white px-6 py-2 rounded-full cursor-pointer'>
                    Sign Up
                </button>
                <p className='text-center py-1'>
                    or
                </p>
                <button className="cursor-pointer w-full text-black flex gap-2 items-center justify-center bg-gray-100 px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200">
                    <GoogleIcon/>
                    Sign up with Google
                </button>
                
                <hr className="border-t border-dashed border-gray-300 mt-2" />
                <p className="text-center text-sm text-gray-500">Already have an account? 
                    <span onClick={() => router.push("/sign-in")} className='ml-2 cursor-pointer text-[#298dd4]'>Sign In</span>
                </p>

            </div>
        </div>      
    )
}

export default page