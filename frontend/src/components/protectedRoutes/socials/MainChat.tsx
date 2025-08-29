import { SOCIAL_DATA } from '@/dummy-data/SocialData'
import React from 'react'
import MessageItem from './messages/MessageItem';
import { TabType } from './ChatTabs';
import Search from './tabs/Search';
import Settings from './tabs/Settings';
import { ImageUp, SendHorizontal } from 'lucide-react';

const MainChat = ({tabType}:{tabType:TabType}) => {

    if(tabType === 'Search') return <Search/>
    if(tabType === 'Settings') return <Settings/>

    return (
        <div className='w-full h-[91%]'>
            <div className='max-h-[calc(540px*0.9)] overflow-y-scroll px-5 py-10  flex flex-col items-start justify-start'>
                {SOCIAL_DATA.chats[1].messages.map((chat,idx) => {
                    const prevMsg = SOCIAL_DATA.chats[1].messages[idx - 1];
                    const showAvatar = !prevMsg || prevMsg.sender != chat.sender;
                    return <MessageItem showAvatar={showAvatar} key={idx} content={chat.content ?? ""} media={chat.media} user={chat.sender} uid={chat.sender} />
                })}
            </div>
            <div className='max-h-[calc(540px*0.15)] px-4 md:px-6 py-2 w-full bg-white'>
                <div className='max-w-[780px] mx-auto bg-[#e0e0e0] border border-[#cfcfcf] px-4 md:px-5 flex items-center justify-between w-full h-[42px] rounded-full'>
                    <div className='h-full flex-[0.9]'>
                        <input className='w-full h-full outline-0 bg-transparent text-[13.5px] md:text-[14px] text-[#2b2b2b] placeholder:text-[#7a7a7a] focus:outline-none focus:ring-0' placeholder='Write a message…'/>
                    </div>
                    <div className='flex-[0.1] flex items-center gap-2 justify-end'>
                        <ImageUp className='cursor-pointer text-[#6b6b6b] hover:text-[#4a4a4a] transition-colors'/>
                        <SendHorizontal className='cursor-pointer text-[#6b6b6b] -mr-1.5 ml-3 hover:text-[#4a4a4a] transition-colors'/>
                    </div>
                </div>
            </div>
        </div>    
    )
}

export default MainChat