import React from 'react'
import Image from 'next/image'
import SidebarMenu from './SideBarMenu';

const Sidebar = () => {

    return (
        <main className='bg-black h-full w-full p-6 flex flex-col justify-between items-center'>
            <div className='absolute h-[80px] w-[180px] left-20 top-6'>
                <Image alt='anjay' src={`/dafalogo.png`} width={1000} height={1000} className="w-full h-full duration-300" />
            </div>
            <div>
            </div>
            <button>
                <SidebarMenu />
            </button>
            <div>
            </div>
        </main>
    )
}

export default Sidebar