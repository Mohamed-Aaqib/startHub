import {Lobster} from 'next/font/google'
import React from 'react'

const rethinkSans = Lobster({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
})

const Navbar = () => {
    return (
        <nav  className={`border-b-[2px] p-2 border-gray-300 bg-gray-100/80 ${rethinkSans.className}`}>
            <h1 className='text-4xl text-gray-800'> Call Settings</h1>
        </nav>
    )
}

export default Navbar