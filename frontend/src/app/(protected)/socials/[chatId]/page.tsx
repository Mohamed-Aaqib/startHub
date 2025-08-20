import ChatClientWrapper from '@/components/protectedRoutes/socials/ChatClientWrapper'
import ChatTabs from '@/components/protectedRoutes/socials/ChatTabs'
import MainChat from '@/components/protectedRoutes/socials/MainChat'
import React from 'react'

const page = async () => {
    return (
        <div className='w-full h-full'>
            <ChatClientWrapper/>
        </div>
    )
}

export default page