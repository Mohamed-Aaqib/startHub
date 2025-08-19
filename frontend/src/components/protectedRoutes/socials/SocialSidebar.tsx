import React from 'react'
import ChatList from './ChatList'
import SocialSidebarFooter from './SocialSidebarFooter'

const SocialSidebar = async () => {
    
    return (
        <div className='h-full border-l-2 border-gray-300 bg-gray-100/80 flex flex-col'>
            <ChatList/>
            <SocialSidebarFooter/>
        </div>
    )
}

export default SocialSidebar