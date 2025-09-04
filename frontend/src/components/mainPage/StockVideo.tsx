import { Rethink_Sans } from 'next/font/google';
import { MicIcon, UserPlus, Volume2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { motion, MotionValue, useTransform } from 'framer-motion';

const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

interface IStockVideo{
    img:string
    className:string
    index?:number
    smoothY:MotionValue<number>
}

const StockVideo = ({className, img, index = 0, smoothY}: IStockVideo) => {
    
    const y = useTransform(smoothY, (val) => -val * (0.15 + index * 0.02));
    const rotate = useTransform(smoothY, (val) => (val * 0.001) * (index % 2 === 0 ? 1 : -1));

    return (
        <motion.div 
            className={`rounded-2xl overflow-hidden flex flex-col justify-between backdrop-blur-xl bg-white/10 shadow-lg border border-white/20 h-[240px] w-[360px] ${className}`}
            style={{ y, rotate }}
            whileHover={{ 
                scale: 1.05,
                rotate: 0.5,
                boxShadow: "0px 8px 25px rgba(0,0,0,0.2), 0 0 20px rgba(59,130,246,0.3)",
                transition: { duration: 0.3 }
            }}
        >
            <div className="relative w-full h-[200px]">
                <Image
                    src={`/assets/${img}`}
                    alt="preview"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Clean Control Bar */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg w-48">
                <div className="flex items-center justify-around gap-2 px-2 py-[5px]">
                    <div className='flex itesm-center gap-2'>
                        <motion.button 
                            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-1.5 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <MicIcon className="w-3.5 h-3.5" strokeWidth={2} />
                        </motion.button>
                        <motion.button 
                            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-1.5 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Volume2 className="w-3.5 h-3.5" strokeWidth={2} />
                        </motion.button>
                    </div>
                    <motion.button 
                        className={`flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${rethinkSans.className}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <UserPlus className="w-3 h-3" strokeWidth={2.5} />
                        Add
                    </motion.button>
                </div>
            </div>

            {/* ✨ Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        </motion.div>
    )
}

export default StockVideo