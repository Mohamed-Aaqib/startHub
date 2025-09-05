import IntegrationCard from '@/components/protectedRoutes/integrations/IntegrationCard';
import { Inter, Noto_Sans } from 'next/font/google';
import React from 'react'


const notoSansFont = Noto_Sans({ 
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-noto-sans',
});  


const interFont = Inter({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-inter',
});



const page = () => {
    return (
        <div className={`w-full h-full flex flex-col ${notoSansFont.className} `}>
            <div className='flex-1 w-full h-full flex flex-col p-2'>
                <div className={`${interFont.className} p-5 flex-1 grid grid-cols-3 gap-10`}>
                    <IntegrationCard 
                        desc='Connect your GitHub to link repos with tasks, track activity, and view analytics with your startups — all in one place.'
                        name='GitHub'
                        src='githubLogo.svg'
                    />
                    <IntegrationCard
                        desc='Split payments, track transactions, and manage group payouts effortlessly.'
                        name='Stripe'
                        src='stripeLogo.png'
                    />
                </div>
            </div>
            <div className='w-full h-[51.2px]'/>
        </div>
    )
}

export default page