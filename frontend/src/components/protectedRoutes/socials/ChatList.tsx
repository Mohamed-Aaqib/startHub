"use client"
import { Cabin } from 'next/font/google';
import React, { useState } from 'react'
import ChatItem from './ChatItem';
import { SOCIAL_DATA } from '@/dummy-data/SocialData';

const rethinkSans = Cabin({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});


const ChatList = () => {

    const [activeTab,setActiveTab] = useState<'all'|'direct'|'groups'|'startup'>('all');
    const tabs = ["all","direct","group","startup"];

    return (
        <div className='p-2 h-full flex-[0.9]'>
            <div className={`flex items-center justify-between mt-3 px-2 gap-2 ${rethinkSans.className}`}>
                {tabs.map((tab) => (
                    <div key={tab} 
                        onClick={() => setActiveTab(tab as any)} 
                        className={`transition-colors duration-300 ease-in-out text-center w-[70px] px-2 py-1 cursor-pointer border-b-2 `}
                        style={{
                            borderColor:activeTab == tab ? "#bbbbbb" : "transparent",
                            color:activeTab == tab ? "#383838" : "black",
                        }}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            <hr className='text-[#d2d2d2]'/>
            <div className='overflow-auto space-y-10 py-3 pt-10'>
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