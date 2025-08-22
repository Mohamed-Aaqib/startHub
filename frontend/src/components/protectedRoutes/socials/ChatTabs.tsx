"use client"
import { SOCIAL_DATA } from '@/dummy-data/SocialData'
import { ChartScatter, Cog, MessageCircle, Search } from 'lucide-react';
import { Rethink_Sans } from 'next/font/google';
import Image from 'next/image'
import React, { useState } from 'react'


const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});


export type TabType = 'Chat'|'Search'|'Settings'

const ChatTabs = ({setTabType,tabType}:{setTabType:(tab:TabType) => void,tabType:TabType}) => {
    const chat = SOCIAL_DATA.chats[1];
    const mainTabs = [
        {
            name:"Chat",
            Icon:MessageCircle
        },
        {
            name:"Search",
            Icon:Search
        },
        {
            name:"Settings",
            Icon:Cog
        }
    ]
    const tab = chat.type === "direct" ? mainTabs.filter((tb) => tb.name == "Chat" || tb.name == "Search") : mainTabs;

    return (
        <div className=' w-full h-[9%] border-b-2 flex items-center justify-between py-1 px-2 border-gray-300 '>
            <div className={`flex items-center gap-x-3 ${rethinkSans.className}`}>
                <div className='relative flex items-center w-10 h-10 rounded-full'>
                    <Image alt='' src={chat.avatarUrl!} fill className='object-cover rounded-full'/>
                </div>
                <div className='flex flex-col -space-y-[2px]'>
                    <h1 className='text-xl font-bold'>{chat.name}</h1>
                    <p className='text-[#8d8d8d] text-[12px]'>3 members</p>
                </div>

            </div>

            <div className='pr-5 flex items-center gap-x-6 text-center h-full'>
                {tab.map((tb) => (
                    <h1 className={`${tb.name === tabType && "bg-blue-600 text-white"} transition-colors flex items-center justify-center duration-200 ease-linear  cursor-pointer p-1 rounded-md `} onClick={()=>setTabType(tb.name as TabType)} key={tb.name}>
                        {<tb.Icon/>}
                    </h1>
                ))}
            </div>

        </div>
    )
}

export default ChatTabs