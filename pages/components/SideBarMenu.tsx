import React from 'react'
import { HiMenu } from "react-icons/hi";
import { useState } from 'react'
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

const menu = [
    {
        name: "HOME",
        url: "/"
    },
    {
        name: "ABOUT",
        url: "/about"
    },
    {
        name: "WORKS",
        url: "/works"
    },
    {
        name: "CONTACT",
        url: "/contact"
    },
]

const SidebarMenu = () => {

    const router = useRouter()
    const [show, setShow] = useState(false)

    return (
        <>
            <div onClick={() => setShow(true)}>
                <HiMenu className='text-a-2 h-10 w-10' />
            </div>

            {
                show &&
                <div onClick={() => setShow(false)} className='bg-black fixed top-0 left-0 h-screen w-screen z-50 backdrop-blur-sm bg-opacity-50'>
                    <div onClick={(e) => e.stopPropagation()} className='bg-a-2 h-full w-[67%] px-[10%] flex flex-col items-start justify-center'>
                        <div className='font-bold text-7xl text-start'>
                            {menu.map((item: any, idx: number) => (
                                <Link key={idx} href={item.url} >
                                    <h1 className={`my-1 hover:text-black duration-300 italic  ${router.pathname === item.url ? "text-black" : "text-white"}`}>{item.name}</h1>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            }

        </>
    )
}

export default SidebarMenu