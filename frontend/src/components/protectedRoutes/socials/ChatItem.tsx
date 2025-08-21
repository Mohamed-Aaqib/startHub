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
        <div className='flex items-center cursor-pointer gap-3 max-w-[350px] ' onClick={() => router.push("/socials/testingtheendpoint")} >
            <div className='w-[50px] h-[50px] relative rounded-full'>
                <Image src={"https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg"} className='object-cover rounded-full' fill alt=''/>
            </div>
            <div className='flex flex-col gap-[6px] items-center w-[80%]'>
                <div className='flex items-center justify-between w-full'>
                    <h1 className={`${rethinkSans.className} font-[500]`}>{name ?? "Name of user"}</h1>
                    <div className='w-fit text-[12px] text-[#363636]'>   
                        9:52 pm
                    </div>
                </div>
                <div className='flex-1 w-full text-[14px] space-x-3 flex items-center justify-between text-[#494949]'>
                    <p className='max-w-[200px]  truncate'>
                        {message}
                    </p>
                    {type == "startup" ? (
                        <div className='w-3 h-3 p-[9px] font-bold text-[10px] text-center flex items-center justify-center rounded-full bg-amber-300 text-amber-600'>
                            S
                        </div>
                    ): type == "group" && (
                        <div className=' w-3 h-3 p-[9px] font-bold text-[10px] text-center flex items-center justify-center rounded-full bg-blue-300 text-blue-600'>
                            G
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ChatItem