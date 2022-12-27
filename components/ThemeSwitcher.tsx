import React from 'react'
import { useTheme } from "next-themes"
import { HiMoon, HiSun } from 'react-icons/hi'

const ThemeSwitcher = () => {

    const { theme, setTheme } = useTheme()
    return (
        <div>
            <button
                className='hover:scale-105 duration-300 flex fixed z-50 right-6 bottom-6'
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                <div className='flex space-x-2 flex-row items-center bg-black dark:bg-a-2 p-3 rounded-full'>
                    <div>{theme === 'light' ? <HiMoon className='h-7 w-7 dark:text-white text-a-2' /> : <HiSun className='h-7 w-7 dark:text-white text-a-2' />}</div>
                </div>
            </button>
        </div>
    )
}

export default ThemeSwitcher