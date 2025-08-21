"use client"
import { Cabin } from 'next/font/google';
import React, { useState } from 'react'
import ChatItem from './ChatItem';
import { SOCIAL_DATA } from '@/dummy-data/SocialData';
import { BriefcaseBusiness, GraduationCapIcon, LayoutGrid, User, UserRoundSearch, Users } from 'lucide-react';

const rethinkSans = Cabin({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});


const ChatList = () => {

    const [activeTab,setActiveTab] = useState<'all'|'direct'|'groups'|'startup'>('all');
    const tabs = [
        {name:"all",icon:LayoutGrid},
        {name:"direct",icon:User},
        {name:"group",icon:Users},
        {name:"startup",icon:BriefcaseBusiness},
    ]


    return (
        <div className='p-2 h-full flex-[0.9]'>
            <div className={`flex items-center justify-between mt-0 px-2 gap-2 ${rethinkSans.className}`}>
                {tabs.map((tab) => (
                    <div key={tab.name} 
                        onClick={() => setActiveTab(tab.name as any)} 
                        className={`transition-colors duration-300 flex flex-col items-center text-[13px] ease-in-out text-center w-[70px] px-2 py-1 cursor-pointer `}
                        style={{
                            color:activeTab == tab.name ? "#0062ff" : "black",
                        }}
                    >
                        {<tab.icon/>}
                        {tab.name}
                    </div>
                ))}
            </div>
            {/* <hr className='text-[#d2d2d2]'/> */}
            <div className='overflow-auto space-y-10 py-3 pt-10'>
                <div className='w-full h-fit bg-[#dedede] space-x-3 -mt-2 px-3 rounded-md flex items-center'>
                    <UserRoundSearch className='w-5 h-5 text-[#858585]'/>
                    <input className='flex-1 h-10 outline-none p-1' placeholder='search by name'/>
                </div>
                {SOCIAL_DATA.chats.map((chat,idx) => (
                    <ChatItem 
                        key={idx} 
                        avatarUrl={chat.avatarUrl} 
                        lastMessageAt={chat.lastMessageAt} 
                        message={chat.messages[0].content!} 
                        name={chat.name}
                        type={chat.type}
                    />
                ))}
            </div>
        </div>    
)
}

export default ChatList