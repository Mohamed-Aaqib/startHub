import React from 'react'
import ChatList from './ChatList'
import SocialSidebarFooter from './SocialSidebarFooter'

const SocialSidebar = async () => {
    
    return (
        <div className='h-full border-l-2 border-gray-300 bg-[#fdfdfd] flex flex-col'>
            <ChatList/>
            <SocialSidebarFooter/>
        </div>
    )
}

export default SocialSidebar