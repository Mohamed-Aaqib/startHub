"use client"
import { Rethink_Sans } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

interface ChatItemI{
    name:null | string;
    message:null | string;
    type:'direct'|'group'|'startup';
    avatarUrl:null | string;
    lastMessageAt:string
}


const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});



const ChatItem = ({avatarUrl,lastMessageAt,message,name,type}:ChatItemI) => {
    const router = useRouter();

    return (
        <div className='flex items-center cursor-pointer gap-4 max-w-[350px] ' onClick={() => router.push("/socials/testingtheendpoint")} >
            <div className='w-[55px] h-[55px] relative rounded-full'>
                <Image src={"https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg"} className='object-cover rounded-full' fill alt=''/>
            </div>
            <div className='flex flex-col gap-2 items-center w-[80%]'>
                <div className='flex items-center justify-between w-full'>
                    <h1 className={`${rethinkSans.className} font-[500]`}>{name ?? "Name of user"}</h1>
                    {type == "startup" ? (
                        <div className='py-[1px] px-[6px] text-[10px] text-center rounded-sm border-[1px] border-amber-600 bg-amber-300 text-amber-600'>
                            StartUp
                        </div>
                    ): type == "group" && (
                        <div className='py-[1px] px-[6px] text-[10px] border-[1px] border-blue-600 text-center rounded-sm bg-blue-300 text-blue-600'>
                            Group
                        </div>
                    )}
                </div>
                <div className='flex-1 w-full text-[14px] space-x-3 flex items-center text-[#494949]'>
                    <p className='max-w-[200px] truncate'>
                        {message}
                    </p>
                    <div className='w-fit rounded-md '>   
                        2025
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatItem