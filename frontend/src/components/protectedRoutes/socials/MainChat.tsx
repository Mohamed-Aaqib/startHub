import { SOCIAL_DATA } from '@/dummy-data/SocialData'
import React from 'react'
import MessageItem from './messages/MessageItem';
import { TabType } from './ChatTabs';
import Search from './tabs/Search';
import Settings from './tabs/Settings';
import { ImageUp } from 'lucide-react';

const MainChat = ({tabType}:{tabType:TabType}) => {

    if(tabType === 'Search') return <Search/>
    if(tabType === 'Settings') return <Settings/>

    return (
        <div className='w-full h-[91%]'>
            <div className='max-h-[calc(540px*0.9)] overflow-y-scroll px-5 py-10   gap-2 flex flex-col items-start'>
                {SOCIAL_DATA.chats[1].messages.map((chat,idx) => {
                    const prevMsg = SOCIAL_DATA.chats[1].messages[idx - 1];
                    const showAvatar = !prevMsg || prevMsg.sender != chat.sender;
                    return <MessageItem showAvatar={showAvatar} key={idx} content={chat.content ?? ""} media={chat.media} user={chat.sender} uid={chat.sender} />
                })}
            </div>
            <div className='max-h-[calc(540px*0.15)] px-[100px] py-1 w-full bg-white'>
                <div className='bg-[#cfcfcf] px-5 flex items-center justify-between w-full h-[45px] rounded-full'>
                    <div className='h-full flex-[0.9] py-1'>
                        <input className='w-full h-full outline-0' placeholder='Write a message...'/>
                    </div>
                    <div className='flex-[0.1] flex items-center justify-end'>
                        <ImageUp className='cursor-pointer text-[#393939]'/>
                    </div>
                </div>
            </div>
        </div>    
    )
}

export default MainChat