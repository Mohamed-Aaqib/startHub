import { Cabin, Rethink_Sans } from 'next/font/google';
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

const cabin = Cabin({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});


const MessageItem = ({content,uid,media,user,showAvatar}:MessageItemI) => {
    const myId = "64f8a1d2c9f3b2a1b1234569";

    return (
        <div className={`w-full flex items-start gap-3 ${myId === user && "flex-row-reverse!"}`}>
            <div className='w-10 h-10 relative'>
                {showAvatar && (
                    <Image alt='' fill className='object-cover rounded-full' src={"https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/02EF/production/_99115700_ronaldo_getty4.jpg"}/>
                )}
            </div>
            <div className={`${cabin.className} rounded-md max-w-[400px] flex-wrap  py-2 px-3 text-[#373737] bg-[#ebebeb] ${myId == uid && "text-black! bg-[#d3d3d3] ml-auto"}`}>
                <div className={`w-full flex items-center justify-between py-[4px] text-[10px] text-[#999999] ${myId == uid && "text-[#646464]!"}`}>
                    <p className='max-w-[60%] truncate'>{user}</p>
                </div>
                {content != "" ? content : <div/>}
                {media && (
                    <div className='w-full relative'>
                        <Image src={media.url} alt='' className='object-contain w-full h-auto rounded-sm' width={100} height={100}/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MessageItem