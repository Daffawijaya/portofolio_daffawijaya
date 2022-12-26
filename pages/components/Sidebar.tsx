import React from 'react'
import Image from 'next/image'
import SidebarMenu from './SideBarMenu';
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

const Sidebar = () => {

    return (
        <main className='bg-black h-full w-full px-6 py-8 flex flex-col justify-between items-center'>
            <button className='lg:rotate-0 rotate-90 lg:absolute lg:h-[80px] lg:w-[180px] w-24 h-10 left-20 top-6 hover:translate-x-1 duration-300'>
                <Image alt='anjay' src={`/dafalogo.png`} width={1000} height={1000} className="w-full h-full duration-300" />
            </button>
            <div>
            </div>
            <div>
                <SidebarMenu />
            </div>
            <div className='flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4'>
                {icon.map((item: any, idx: number) => (
                    <Link href={item.url} key={idx}>
                        <div className='text-transparent flex flex-col items-center justify-center'>
                            <p className='font-bold text-xl uppercase text-center text-[#2D2D2D] hover:text-[#828282] duration-300'>{item.icon}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    )
}

export default Sidebar