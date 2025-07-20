"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Rethink_Sans } from 'next/font/google';
import { Cabin } from 'next/font/google';
import User from '../svgs/User';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

const cabin = Cabin({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

type NavBarState = 'default' | 'scrolled' | 'hidden';

const NavBar = () => {

    const lastScrollRef = useRef<number>(0);
    const [navbarState,setNavbarState] = useState<NavBarState>('default');
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            const currScroll = window.scrollY;

            if(currScroll == 0){
                setNavbarState("default");
                lastScrollRef.current = currScroll;
                return;
            }

            const isScrollDown = currScroll > lastScrollRef.current;

            if(isScrollDown && currScroll > 100){
                setNavbarState("hidden");
            }else if(!isScrollDown){
                setNavbarState("scrolled")
            }
            lastScrollRef.current = currScroll;
            
        }
        window.addEventListener("scroll",handleScroll);
        return () => window.removeEventListener("scroll",handleScroll);

    },[])

    return (
        <nav className='fixed p-3 w-full z-50'>
            <div
                className={clsx(
                    "flex gap-3 max-w-6xl mx-auto items-center justify-between px-1 py-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform will-change-opacity",
                    navbarState == "default" && "border-none",
                    navbarState == "hidden" && "-translate-y-[100px] opacity-0 pointer-events-none",
                    navbarState == "scrolled" && "translate-y-0 opacity-100 rounded-md bg-white/60 backdrop-blur-md shadow-lg border border-white/30"
                )}
            >
                <h2 className={`font-bold cursor-pointer text-xl relative ml-5 `+ rethinkSans.className} onClick={() => router.push("/")}>
                    <span className="absolute -top-0 z-[1] -left-1 w-3 h-3">
                        <span className="block w-full h-[3px] bg-[#111cb6] absolute top-0 left-0"></span>
                        <span className="block h-full w-[3px] bg-[#111cb6] absolute top-0 left-0"></span>
                    </span>
                    Start
                    <span className='text-[#111cb6] rounded-br-none border-b-[1px] border-r-[1px] ml-[2px] px-[1px] rounded-sm bg-[#ffffff]'>
                        Hub
                    </span>
                </h2>

                <section className={'flex items-center gap-16 group justify-between font-bold ' + rethinkSans.className}>
                    <p className='nav-items'>Features</p>
                    <p className='nav-items'>Pricing</p>
                    <p className='nav-items'>About</p>
                    <p className='nav-items'>Contact</p>
                </section>

                <section>
                    {true ? (
                        <div className={" flex items-center gap-6 justify-between pr-2 "+ cabin.className}>
                            <p className='font-bold cursor-pointer underline-animate' onClick={() => router.push("/sign-up")}>
                                Sign Up
                            </p>
                            <button className="Btn flex items-center gap-2" onClick={() => router.push("/sign-in")}>
                                Log In <User className="w-5 h-5" style={{color: '#f3f4f6', fill: '#f3f4f6'}} />
                            </button>
                        </div>

                    ):(
                        <>
                            {/* {user} */}
                        </>
                    )}
                </section>
            
            </div>
        </nav>
    )
}

export default NavBar