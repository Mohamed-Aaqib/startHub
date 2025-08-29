"use client"
import { AudioLines, BriefcaseBusiness, CalendarDays, ChartNetwork, CreditCard, FolderGit2, Landmark, LayoutDashboard, Lightbulb, ListChecks, MessagesSquare, NotebookPen, Pencil, Puzzle, Sparkles, User, UserRoundPen, Users } from 'lucide-react'
import React, { useState, useRef, useEffect } from "react";
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
            Icon:MessagesSquare,
            route:"/socials",
            routeName:"messages"
        },
        {
            Icon:Users,
            route:"/find-partner",
            routeName:"find your partner"
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
            Icon:Pencil,
            route:"/draw",
            routeName:"draw"
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
        {
            Icon:BriefcaseBusiness,
            route:"/startups",
            routeName:"startups"
        },
        {
            Icon:ChartNetwork,
            route:"/website-analysis",
            routeName:"website analysis"
        },
    ]

    const [hoverStyle, setHoverStyle] = useState({ left: 0, top: 0, width: 0, height: 0, visible: false });
    const [selectedGroup, setSelectedGroup] = useState<string>("Select Group");
    const containerRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLLabelElement>(null);
    
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

    const handleGroupSelect = (groupName: string) => {
        console.log(`Selected group: ${groupName}`);
        setSelectedGroup(groupName);
        const checkbox = document.querySelector('.popup input[type="checkbox"]') as HTMLInputElement;
        if (checkbox) {
            checkbox.checked = false;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                const checkbox = document.querySelector('.popup input[type="checkbox"]') as HTMLInputElement;
                if (checkbox && checkbox.checked) {
                    checkbox.checked = false;
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const router = useRouter()

    return (
        <nav className=' fixed bottom-0 w-full'>
            <div className="bg-white w-full py-1 pl-6 pr-1 flex items-center justify-between shadow-sm backdrop-blur-sm border-2 border-gray-200">
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
                <div className='flex items-center gap-10 justify-between'>
                    
                    <label className="popup" ref={popupRef}>
                        <input type="checkbox" />
                        <div className={`burger ${selectedGroup !== "Select Group" ? "selected" : ""}`} tabIndex={0}>
                            <span className="font-[400]">
                                {selectedGroup}
                            </span>
                        </div>
                        <nav className="popup-window">
                            <legend>Select Group</legend>
                            <ul>
                                <li>
                                    <button onClick={() => handleGroupSelect('Frontend Team')}>
                                        <span>Frontend Team</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleGroupSelect('Backend Team')}>
                                        <span>Backend Team</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </label>
                    
                    <div className="max-w-10 max-h-10">
                        <div onClick={() => router.push("/profile")} className='cursor-pointer hover:scale-105 transition-all duration-300 p-2 rounded-full shadow-lg flex items-center justify-center bg-gradient-to-tr from-gray-200 via-gray-400 to-gray-800'>
                            <User className='w-6 h-6 text-gray-900' />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar