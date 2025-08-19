"use client"
import { UserRoundPlus, Users } from 'lucide-react'
import React from 'react'

const SocialSidebarFooter = () => {
    return (
        <div className='w-full flex-[0.1] p-2 flex items-end justify-between px-4'>
            <div className='socialsb-footer-button' onClick={() => console.log("we outta here")}>
                <UserRoundPlus/>
            </div>

            <button className='socialsb-footer-button flex items-center gap-3'>
                Create Group <Users/>
            </button>
        </div>
    )
}

export default SocialSidebarFooter