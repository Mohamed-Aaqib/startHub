import {Fira_Sans, Rethink_Sans} from 'next/font/google'
import React from 'react'

const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
})

const Navbar = () => {
    return (
        <nav  className={`border-b-[2px] p-2 border-gray-300 bg-gray-100/80 ${rethinkSans.className}`}>
            <h1 className='text-2xl text-black font-bold'> Call Settings</h1>
        </nav>
    )
}

export default Navbar