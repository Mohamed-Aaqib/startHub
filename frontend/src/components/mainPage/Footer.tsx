import React from 'react'
import { Rethink_Sans } from 'next/font/google';
import { GitHubIcon, InstagramIcon, LinkedInIcon, TwitterXIcon } from '../svgs/SocialMedia';

const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

export default function Footer() {
    return (
        <footer className={`footer-card ${rethinkSans.className}`}>
            <svg className="wave-svg wave1" viewBox="0 0 1200 200" preserveAspectRatio="none">
                <path d="M0,60 C300,140 900,-20 1200,60 L1200,200 L0,200 Z" />
            </svg>
            <svg className="wave-svg wave2" viewBox="0 0 1200 200" preserveAspectRatio="none">
                <path d="M0,80 C300,160 900,0 1200,80 L1200,200 L0,200 Z" />
            </svg>
            <svg className="wave-svg wave3" viewBox="0 0 1200 200" preserveAspectRatio="none">
                <path d="M0,70 C300,120 900,10 1200,70 L1200,200 L0,200 Z" />
            </svg>
            <svg className="wave-svg wave4" viewBox="0 0 1200 200" preserveAspectRatio="none">
                <path d="M0,50 C300,110 900,-10 1200,50 L1200,200 L0,200 Z" />
            </svg>
            <div className="z-20 p-2 absolute inset-0 ">
                <div className='flex items-center justify-between py-3'>
                    <h2 className={`font-bold text-xl relative ml-5 `}>
                        @StartHub_2025
                    </h2>
                    <div>
                        <ul className="example-2 flex items-center justify-center gap-5">
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
                </div>
                <div className='grid grid-cols-3 mt-5 text-center gap-5 font-bold w-full'>
                    <p className='footerSmTexts'>Features</p>
                    <p className='footerSmTexts'>Pricing</p>
                    <p className='footerSmTexts'>About</p>
                    <p className='col-span-3 footerSmTexts'>Contact</p>
                </div>
            </div>
        </footer>
    );
}