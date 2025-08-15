"use client"
import { AudioLines, CalendarDays, CreditCard, FolderGit2, Landmark, LayoutDashboard, Lightbulb, ListChecks, MessagesSquare, NotebookPen, Puzzle, Sparkles, User, UserRoundPen, Users } from 'lucide-react'
import React, { useState, useRef } from "react";
import NavIcons from './navbarItems/NavIcons';
import { useRouter } from 'next/navigation';

interface INavElems{
    Icon:React.ElementType;
    route:string;
    routeName:string;
}


const NavBar = () => {

    const navElems:INavElems[] = [
        {
            Icon:LayoutDashboard,
            route:"/dashboard",
            routeName:"dashboard"
        },
        {
            Icon:Users,
            route:"/find-partner",
            routeName:"find your partner"
        },
        {
            Icon:MessagesSquare,
            route:"/socials",
            routeName:"messages"
        },
        {
            Icon:Lightbulb,
            route:"/ideas",
            routeName:"ideas"
        },
        {
            Icon:CreditCard,
            route:"/payments",
            routeName:"payments"
        },
        {
            Icon:Puzzle,
            route:"/integrations",
            routeName:"integrations"
        },
        {
            Icon:FolderGit2,
            route:"/repos",
            routeName:"repos"
        },
        {
            Icon:Landmark,
            route:"/architecture-planning",
            routeName:"architecture planning"
        },
        {
            Icon:CalendarDays,
            route:"/calender",
            routeName:"calender"
        },
        {
            Icon:ListChecks,
            route:"/tasks",
            routeName:"tasks"
        },
        {
            Icon:AudioLines,
            route:"/team-calls",
            routeName:"voice calls"
        },

    ]

    const [hoverStyle, setHoverStyle] = useState({ left: 0, top: 0, width: 0, height: 0, visible: false });
    const containerRef = useRef<HTMLDivElement>(null);
    
    const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const parentRect = containerRef.current!.getBoundingClientRect();

        setHoverStyle({
            left: rect.left - parentRect.left,
            top: rect.top - parentRect.top,
            width: rect.width,
            height: rect.height,
            visible: true,
        });
    };

    const handleLeave = () => {
        setHoverStyle(prev => ({ ...prev, visible: false }));
    };

    const router = useRouter()

    return (
        <nav className='py-1 px-5 fixed bottom-0 w-full'>
            <div className="bg-gray-100/80 w-full py-1 px-3 rounded-md flex items-center justify-between shadow-sm backdrop-blur-sm border-2 border-gray-300">
                <div className="relative flex items-center gap-5 text-gray-600 " ref={containerRef} onMouseLeave={handleLeave}>
                    <div
                        className="absolute bg-[rgb(139,197,238)] rounded transition-all duration-500 ease-[cubic-bezier(0.37,1.95,0.66,0.56)] -z-10"
                        style={{
                            opacity: hoverStyle.visible ? 1 : 0,
                            transform: `translate(${hoverStyle.left}px, ${hoverStyle.top}px)`,
                            width: `${hoverStyle.width}px`,
                            height: `${hoverStyle.height}px`,
                        }}
                    />
                    {navElems.map(({Icon,route,routeName}) => (
                        <NavIcons key={route} Icon={Icon} handleHover={handleHover} route={route} routeName={routeName} />
                    ))}

                </div>
                <div className="max-w-10 max-h-10">
                    <div onClick={() => router.push("/profile")} className='cursor-pointer hover:scale-105 transition-all duration-300 p-2 rounded-full shadow-lg flex items-center justify-center bg-gradient-to-tr from-gray-200 via-gray-400 to-gray-800'>
                        <User className='w-6 h-6 text-gray-900' />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar