import { Inter } from 'next/font/google';
import Image from 'next/image';
import React from 'react'

interface MessageItemI{
    content:string;
    showAvatar:boolean;
    uid:string;
    media: {
        url: string;
        type: "image" | "video" | "audio" | "file";
        metadata: Record<string, any>;
    } | undefined;
    user:string;
}

const interFont = Inter({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-inter',
});
const MessageItem = ({content,uid,media,user,showAvatar}:MessageItemI) => {
    const myId = "64f8a1d2c9f3b2a1b1234569";

    return (
        <div className={`w-full flex items-start gap-3 ${myId === user && "flex-row-reverse!"} ${showAvatar && "mt-4"}`}>
            <div className='w-10 h-10 relative'>
                {showAvatar && (
                    <Image alt='' fill className='object-cover rounded-full' src={"https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg"}/>
                )}
            </div>
            <div className='flex flex-col  w-[80%]'>
                {showAvatar && (
                    <p className={`max-w-[80%] truncate ${myId === user && "ml-auto"} text-[11px] md:text-xs font-semibold tracking-wide text-gray-500`}>{user}</p>
                )}
                <div className={`${interFont.className} ${showAvatar && "mt-2 mb-3"}  rounded-md flex-wrap text-gray-800 text-sm md:text-[14px] leading-6 ${myId == uid && "text-black! ml-auto"}`}>
                    {content != "" ? content : <div/>}
                    {media && (
                        <div className='w-full relative max-w-fit'>
                            <Image src={media.url} alt='' className='object-contain w-full h-auto rounded-sm' width={100} height={100}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessageItem