"use client"
import { UserRoundPlus, Users } from 'lucide-react'
import React from 'react'

const SocialSidebarFooter = () => {
    return (
        <div className='w-full  flex-[0.1] p-2 flex items-end justify-between px-4 bg-[#f9f9f9]'>
            <button className='socialsb-footer-button h-9 w-9 flex items-center justify-center rounded-md border border-blue-200 hover:border-blue-300 bg-white text-blue-600 hover:bg-gray-100 transition-colors' onClick={() => console.log("we outta here")}>
                <UserRoundPlus className='h-4 w-4'/>
            </button>

            <button className='socialsb-footer-button h-9 px-3 flex text-blue-600 items-center gap-2 rounded-md border border-blue-200 hover:border-blue-300 bg-white  text-sm font-medium hover:bg-gray-100 transition-colors'>
                <span>Create Group</span> <Users className='h-4 w-4'/>
            </button>
        </div>
    )
}

export default SocialSidebarFooter