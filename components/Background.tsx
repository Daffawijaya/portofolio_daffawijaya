import React from 'react'

const Background = () => {
    return (
        <div className='bg-white dark:bg-black w-screen h-screen'>
            <div className="fixed w-screen h-screen inset-0 opacity-20 ">
                <div className='divide-x border-dashed divide-dashed dark:divide-a-2 divide-gray-400 grid grid-cols-6 w-full h-full '>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div className="fixed w-screen h-screen inset-0 z-10 bg-[url('/daf6.png')] md:bg-[url('/daf5.png')] bg-cover bg-center opacity-20">
                <div className='absolute h-full w-full' />
            </div>
        </div>
    )
}

export default Background