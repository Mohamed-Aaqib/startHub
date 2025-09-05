import React from 'react'
import { Rethink_Sans } from 'next/font/google';
import { GitHubIcon, InstagramIcon, LinkedInIcon, TwitterXIcon } from '../svgs/SocialMedia';
import Link from 'next/link';

const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

export default function Footer() {
    return (
        <footer className={` w-full h-[420px] flex flex-col relative py-5 px-7 justify-between bg-white ${rethinkSans.className}`}>
            
            <div className='flex items-start justify-between'>
                <div className='grid grid-cols-2 gap-x-10'>
                    <p className='font-bold text-gray-800'>Information</p>
                    <p className='font-bold text-gray-800'>Motivation</p>

                    <Link href={""} className='col-start-1 text-gray-600 hover:text-gray-800 transition-colors'>
                        Contact
                    </Link>
                    <Link href={""} className='col-start-1 text-gray-600 hover:text-gray-800 transition-colors'>
                        Status
                    </Link>
                    <Link href={""} className='col-start-1 text-gray-600 hover:text-gray-800 transition-colors'>
                        Features
                    </Link>
                    <Link href={""} className='col-start-1 text-gray-600 hover:text-gray-800 transition-colors'>
                        About
                    </Link>

                    <Link href={""} className='col-start-2 row-start-2 text-gray-600 hover:text-gray-800 transition-colors'>
                        Manifesto
                    </Link>
                    <Link href={""} className='col-start-2 row-start-3 text-gray-600 hover:text-gray-800 transition-colors'>
                        Future
                    </Link>
                    
                </div>
                <ul className="flex items-center gap-4">
                    <li className="icon-content">
                        <a href="https://linkedin.com/mohamedaaqibcs" aria-label="LinkedIn" data-social="linkedin">
                            <div className="filled"></div>
                            <LinkedInIcon/>
                        </a>
                    </li>
                    
                    <li className="icon-content">
                        <a href="https://www.github.com/" aria-label="GitHub" data-social="github">
                            <div className="filled"></div>
                            <GitHubIcon/>
                        </a>
                    </li>
                    
                    <li className="icon-content">
                        <a href="https://www.instagram.com/aaqib_75" aria-label="Instagram" data-social="instagram">
                            <div className="filled"></div>
                            <InstagramIcon/>
                        </a>
                    </li>
                    <li className="icon-content">
                        <a href="https://twitter.com/" aria-label="Twitter" data-social="twitter">
                            <div className="filled"></div>
                            <TwitterXIcon/>
                        </a>
                    </li>
                </ul>
            </div>

            <div className='h-[450px]  text-center overflow-hidden capitalize font-bold'>
                <h1 className='text-[350px] -mt-[80px] text-gray-200'>
                    StartHub
                </h1>
            </div>
            
            <div className='flex items-center justify-between w-full mt-3'>
                <div className='text-gray-600'>
                    @ 2025 - StartHub
                </div>
                <div className='flex items-center gap-5'>
                    <p className='text-gray-700 hover:text-gray-800 transition-colors cursor-pointer'>Terms of Service</p>
                    <p className='text-gray-700 hover:text-gray-800 transition-colors cursor-pointer'>Privacy Notes</p>
                </div>
            </div>

        </footer>
    );
}