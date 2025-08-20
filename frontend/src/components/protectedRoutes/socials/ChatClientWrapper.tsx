"use client"
import React, { useState } from 'react'
import ChatTabs from './ChatTabs'
import MainChat from './MainChat'

const ChatClientWrapper = () => {
    const [tabType,setTabType] = useState<'Chat'|'Search'|'Settings'>("Chat");
    return (
        <div className='w-full h-full'>
            <ChatTabs setTabType={setTabType} tabType={tabType}/>
            <MainChat tabType={tabType}/>
        </div>
    )
}

export default ChatClientWrapper