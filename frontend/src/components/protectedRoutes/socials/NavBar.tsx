import { Rethink_Sans } from 'next/font/google'
import React from 'react'

const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
})


const NavBar = () => {
    return (
        <nav className={`${rethinkSans.className} border-b-2 p-2 border-gray-300 bg-gray-100/80 `}>
            <h1 className='text-black font-bold text-2xl'>
                Socials
            </h1>
        </nav>
    )
}

export default NavBar