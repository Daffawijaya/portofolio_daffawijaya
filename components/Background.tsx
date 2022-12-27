import React from 'react'

const Background = () => {
    return (
        <div className='bg-white dark:bg-black w-screen h-screen'>
            <div className="fixed ml-[15%] w-[85%] h-full opacity-20 ">
                <div className='divide-x border-l border-dashed divide-dashed divide-a-2 border-a-2 grid grid-cols-5 w-full h-full '>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div className="fixed z-10 ml-[15%] w-[85%] h-full bg-[url('/daf6.png')] md:bg-[url('/daf5.png')] bg-cover bg-center opacity-20">
                <div className='absolute h-full w-full' />
            </div>
        </div>
    )
}

export default Background