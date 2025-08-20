"use client"
import { SOCIAL_DATA } from '@/dummy-data/SocialData'
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
    const tab = chat.type === "direct" ? ['Chat','Search'] : ['Chat','Search','Settings'];

    return (
        <div className=' w-full h-[9%] border-b-2 flex items-center justify-between py-1 px-2 border-gray-300 '>
            <div className={`flex items-center gap-x-3 ${rethinkSans.className}`}>
                <div className='relative flex items-center w-10 h-10 rounded-full'>
                    <Image alt='' src={chat.avatarUrl!} fill className='object-cover rounded-full'/>
                </div>
                <h1 className='text-xl font-bold'>{chat.name}</h1>
            </div>

            <div className='pr-5 flex items-center gap-x-3 text-center h-full'>
                {tab.map((tb) => (
                    <h1 className={`${tb === tabType && "bg-blue-600 text-white"} transition-colors duration-200 ease-linear   text-[#565656] cursor-pointer px-2 py-1  w-[80px] rounded-md `} onClick={()=>setTabType(tb as TabType)} key={tb}>
                        {tb}
                    </h1>
                ))}
            </div>

        </div>
    )
}

export default ChatTabs