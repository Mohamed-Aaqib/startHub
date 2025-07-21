"use client"
import React from 'react'
import { Rethink_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';

const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

interface INavIcons{
    Icon:React.ElementType;
    handleHover: (e:React.MouseEvent<HTMLDivElement>) => void;
    route:string;
    routeName:string;
}

const NavIcons = ({Icon,handleHover,routeName,route}:INavIcons) => {
    const router = useRouter();
    return (
        <div
            onClick={() => router.push(route)}
            className={"relative group cursor-pointer hover:text-[#111cb6] p-2 rounded " + rethinkSans.className}
            onMouseEnter={handleHover}
        >
            {<Icon/>}
            <div className='absolute whitespace-nowrap text-center bottom-0 left-1/2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 translate-y-0 group-hover:-translate-y-[45px] group-hover:scale-100 transition-all duration-200 bg-zinc-800 text-white text-sm px-2 py-1 rounded shadow-lg z-50 pointer-events-none'>
                <p className='font-bold'>{routeName}</p>
                <div className="absolute left-1/2 translate-x-[-50%] top-[80%] w-2 h-2 bg-zinc-800 rotate-45" />
            </div>
        </div>
    )
}

export default NavIcons