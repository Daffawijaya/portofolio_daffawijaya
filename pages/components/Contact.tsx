import React from 'react'
import { MdEmail } from "react-icons/md";

const Contact = () => {
    return (
        <a className='hover:scale-105 duration-300 flex fixed z-50 right-6 bottom-6' href='https://mail.google.com/mail/u/0/?view=cm&tf=1&fs=1&to=daffayanwijaya@gmail.com'>
            <div className='flex space-x-2 flex-row items-center bg-a-2 p-3 rounded-full'>
                <div><MdEmail className='h-7 w-7 text-white' /></div>
            </div>
        </a>
    )
}

export default Contact