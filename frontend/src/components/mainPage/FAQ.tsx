"use client"
import { Minus, Plus } from 'lucide-react';
import { Inter } from 'next/font/google';
import React, { useState } from 'react'

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    display: 'swap',
});



const FAQ = () => {
    const [currSelected,setCurrSelected] = useState<number|null>(null);
    const faqData = [
        {
            question: "What is this app?",
            answer: "Yes! Our platform supports integration with popular third-party tools including analytics, payment processors, email marketing services, and more."
        },
        {
            question: "How does it work?",
            answer: "No, you don't need any coding skills. Our builder is designed to be intuitive and easy to use, even for beginners. Just drag, drop, and customize!"
        },
        {
            question: "What makes this special?",
            answer: "With our free plan, you can create up to 3 websites. For unlimited websites and advanced features, consider upgrading to our premium plans."
        },
        {
            question: "Will my website be mobile-friendly?",
            answer: "Nah! All websites created with our platform are not automatically optimized for mobile devices and responsive across either screen sizes."
        },
    ]

    return (
        <div className='h-screen w-full px-[30px] pt-[50px] pb-[30px] flex items-center justify-center'>
            <div className='w-full h-full bg-[#aed6f3] rounded-b-2xl flex items-start justify-center px-9 py-14'>
                <div className='max-w-7xl w-full flex gap-32 items-start'>

                    <div className='flex-1'>
                        <h2 className='text-6xl font-bold text-black leading-tight' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                            Frequently Asked Questions
                        </h2>
                    </div>
                    
                    <div className='flex-1 space-y-4'>
                        {faqData.map((faq, index) => (
                            <div key={index} className={`bg-white rounded-lg p-6 ${currSelected !== index && "pb-[9px]!"} shadow-sm border-2 border-[#e9e9e9] overflow-hidden`}>
                                <div className='flex items-start justify-between'>
                                    <div className='flex-1'>
                                        <h3 className={`text-lg font-semibold text-black mb-3 ${inter.className} `}>
                                            {faq.question}
                                        </h3>
                                        <div 
                                            className={`transition-all duration-500 ease-in-out ${
                                                currSelected === index 
                                                    ? 'max-h-96 opacity-100 transform translate-y-0' 
                                                    : 'max-h-0 opacity-0 transform -translate-y-4'
                                            }`}
                                        >
                                            <p className={`text-base text-gray-700 ${inter.className} pb-2`}>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='ml-4 cursor-pointer' onClick={() => {
                                        if(currSelected == index){
                                            setCurrSelected(null)
                                        }else{
                                            setCurrSelected(index);
                                        }
                                    }}>
                                        <div className='w-6 h-6 transition-transform duration-300 ease-in-out'>
                                            {currSelected === index ? (
                                                <Minus/>
                                            ): (
                                                <Plus/>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FAQ