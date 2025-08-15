import { MessageCircleDashed, PhoneCall } from 'lucide-react'
import React from 'react'

const HelperBar = () => {
    return (
        <div className="flex flex-col items-center space-y-7 py-4 px-1 border-l-[2px] border-gray-300 bg-gray-100/80">
            <div className="cursor-pointer p-2 text-blue-600 hover:bg-blue-300 transition-colors ease-linear duration-200 rounded-md">
                <MessageCircleDashed/>
            </div>
            <div  className="cursor-pointer p-2 text-green-600 hover:bg-green-300 transition-colors ease-linear duration-200 rounded-md">
                <PhoneCall/>
            </div>
        </div>
)
}

export default HelperBar