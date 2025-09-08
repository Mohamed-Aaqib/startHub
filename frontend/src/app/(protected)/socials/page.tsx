import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({
    weight: ["400", "500", "600"],
    subsets: ["latin"],
});

const page = () => {
    return (
        <div className='flex items-center justify-center h-full bg-gray-50'>
            <div className={`${inter.className} flex flex-col items-center justify-center text-center max-w-md px-6`}>
                
                <div className="mb-8">
                    <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                        
                        <g opacity="0.7">
                            
                            <rect x="20" y="40" width="80" height="45" rx="20" fill="#E5E7EB" />
                            <rect x="30" y="50" width="40" height="3" rx="1.5" fill="#9CA3AF" />
                            <rect x="30" y="58" width="55" height="3" rx="1.5" fill="#9CA3AF" />
                            <rect x="30" y="66" width="35" height="3" rx="1.5" fill="#9CA3AF" />
                                                    
                            <rect x="100" y="70" width="80" height="45" rx="20" fill="#DBEAFE" />
                            <rect x="110" y="80" width="45" height="3" rx="1.5" fill="#93C5FD" />
                            <rect x="110" y="88" width="60" height="3" rx="1.5" fill="#93C5FD" />
                            <rect x="110" y="96" width="30" height="3" rx="1.5" fill="#93C5FD" />
                            
                            
                            <rect x="30" y="100" width="70" height="40" rx="18" fill="#F3F4F6" />
                            <rect x="40" y="110" width="35" height="3" rx="1.5" fill="#9CA3AF" />
                            <rect x="40" y="118" width="45" height="3" rx="1.5" fill="#9CA3AF" />
                            <rect x="40" y="126" width="25" height="3" rx="1.5" fill="#9CA3AF" />
                        </g>
                        
                        
                        <g opacity="0.4">
                            <circle cx="160" cy="30" r="12" fill="#60A5FA" />
                            <path d="M154 26h12v8l-3-2-3 2-3-2-3 2v-8z" fill="white" />
                        </g>
                        
                        
                        <g opacity="0.3">
                            <circle cx="40" cy="20" r="8" fill="#34D399" />
                            <path d="M36 20h8M40 16v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </g>
                        
                        
                        <circle cx="170" cy="120" r="3" fill="#E5E7EB" opacity="0.5" />
                        <circle cx="25" cy="130" r="2" fill="#E5E7EB" opacity="0.6" />
                        <circle cx="180" cy="80" r="2" fill="#E5E7EB" opacity="0.4" />
                    </svg>
                </div>
                
                
                <div className="space-y-3">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Start a conversation
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Select a chat from the sidebar to begin messaging, or start a new conversation with someone.
                    </p>
                </div>
                
                <div className="mt-8 flex items-center justify-center">
                    <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page