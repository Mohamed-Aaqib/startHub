"use client"
import { Rethink_Sans } from 'next/font/google';
import React, { useEffect, useState } from 'react'
import StockVideo from './StockVideo';

const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

export interface IHeroCards{
    img:string
    className:string
}


const heroSmCards: IHeroCards[] = [
    {
        img:"stock-img1.jpg",
        className:"absolute bottom-[550px] left-1/2 -translate-x-1/2 z-40"
    },
    {
        img:"stock-img2.jpg",
        className:"absolute bottom-[400px] left-[50px] z-40"
    },
    {
        img:"stock-img3.jpg",
        className:"absolute bottom-[800px] right-[70px] z-40"
    },
    {
        img:"stock-img4.jpg",
        className:"absolute bottom-20 left-[200px] z-10"
    },    
    {
        img:"stock-img5.jpg",
        className:"absolute bottom-20 right-[250px] z-10"
    },    
    {
        img:"stock-img6.jpg",
        className:"absolute bottom-[1100px] left-[200px] z-10"
    },    
    {
        img:"stock-img7.jpg",
        className:"absolute bottom-[1200px] left-1/2 z-40"
    },    

];

const Hero = () => {

    const [scrollY,setScrollY] = useState<number>(0);
    const [stopSticky,setStopSticky] = useState<boolean>(false);

    useEffect(() => {

        const handleScroll = () => {
            setScrollY(window.scrollY);
            setStopSticky(window.scrollY > window.innerHeight * 2.95)
        }

        window.addEventListener("scroll",handleScroll);
        return () => window.removeEventListener("scroll",handleScroll);
    },[])

    return (
        <main className="bg-[rgb(139,197,238)] min-h-[400vh] pt-20 relative">

            <div className="absolute top-10 left-10 w-52 h-60 bg-[#298dd4]  rounded-full opacity-60 blur-[50px] pointer-events-none" />
            <div className="absolute bottom-20 right-20 w-56 h-56 bg-[#298dd4] rounded-full opacity-50 blur-3xl pointer-events-none" />
            <div className="absolute top-10 right-20 w-72 h-72 bg-[#298dd4] rounded-full opacity-60 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-10 left-20 w-32 h-32 bg-[#298dd4] rounded-full opacity-30 blur-[45px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/3 w-52 h-32 bg-[#298dd4] rounded-md opacity-40 blur-[50px] pointer-events-none"/>
            <div className="absolute inset-0 bg-white/30 backdrop-blur-lg z-10 pointer-events-none" />

            {/* //TODO: we could use client rect to get offset and calculate it easier from there.  */}
            <div className={` ${stopSticky ? "relative mt-[320vh]" : "sticky top-[275px]"}  z-20 text-center mx-auto max-w-5xl mt-[200px] flex flex-col items-center gap-5 ` + rethinkSans.className}>
                <h1 className="text-7xl text-center font-bold tracking-tight text-black">
                    Connect. Build. Launch.
                </h1>
                <p className="text-[#111cb6] font-medium max-w-xl">
                    Meet minds like yours, brainstorm startup ideas, and turn real-time conversations into real-world ventures.
                </p>
            </div>
            {heroSmCards.map(({className,img},idx) => (
                <StockVideo key={idx} className={className} scrollY={scrollY} img={img} />
            ))}
            <div
                className="absolute bottom-0 left-1/2 border-b-0 z-20 -translate-x-1/2 w-20 h-10 bg-black rounded-t-full border-t-4 border-x-4 border-[#111cb6]"
            />
        </main>
    )
}

export default Hero