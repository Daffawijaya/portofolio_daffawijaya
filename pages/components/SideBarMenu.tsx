import React from 'react'
import { HiMenu } from "react-icons/hi";
import { useState } from 'react'
import { useRouter } from 'next/router';
import { SiInstagram, SiLinkedin, SiGithub } from "react-icons/si";
import Link from 'next/link';

const icon = [
    {
        icon: <SiLinkedin className='h-4 w-4' />,
        url: "https://www.linkedin.com/in/daffa-wijaya-621a04255/"
    },
    {
        icon: <SiInstagram className='h-4 w-4' />,
        url: "https://www.instagram.com/daffawijayaaa/"
    },
    {
        icon: <SiGithub className='h-4 w-4' />,
        url: "https://github.com/Daffawijaya"
    },
]

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
            <button onClick={() => setShow(true)} className="hover:scale-105 duration-300 lg:rotate-0 rotate-90 mb-32 lg:mb-0">
                <HiMenu className='text-a-2 h-10 w-10' />
            </button>

            {
                show &&
                <div onClick={() => setShow(false)} className='bg-black fixed top-0 left-0 h-screen w-screen z-50 backdrop-blur-sm bg-opacity-50'>
                    <div onClick={(e) => e.stopPropagation()} className='bg-a-2 h-full w-[75%] lg:w-[67%] px-[5%] lg:px-[10%] flex flex-col items-start justify-between py-8'>
                        <div></div>
                        <div className='font-bold text-5xl lg:text-7xl text-start'>
                            {menu.map((item: any, idx: number) => (
                                <Link key={idx} href={item.url} >
                                    <h1 className={`my-1 hover:text-black duration-300 italic  ${router.pathname === item.url ? "text-black" : "text-white"}`}>{item.name}</h1>
                                </Link>
                            ))}
                        </div>
                        <div className='flex space-x-4 justify-end flex w-full'>
                            {icon.map((item: any, idx: number) => (
                                <Link href={item.url} key={idx}>
                                    <div className='text-transparent flex flex-col items-center justify-center'>
                                        <p className='font-bold text-xl uppercase text-center text-white hover:text-black duration-300'>{item.icon}</p>
                                    </div>
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