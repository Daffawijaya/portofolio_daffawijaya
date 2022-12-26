import Head from 'next/head'
import Sidebar from './components/Sidebar'
import Contact from './components/Contact'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <>
      <Head>
        <title>Daffa Wijaya</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favico.png" />
      </Head>

      <main className='h-screen flex fixed w-[15%] h-full z-50'>
        <Sidebar />
      </main>

      <main className='w-[85%] h-screen bg-black flex ml-[15%]'>
        <div className="absolute z-0 w-[85%] h-full bg-[url('/daf8.png')] bg-cover bg-center">
          <div className='absolute backdrop-brightness-[0.3] h-full w-full' />
        </div>
        <div className="relative z-20 w-full h-full relative flex flex-col items-center justify-center">
          <motion.button
            initial={{ bottom: -100, opacity: 0 }}
            animate={{ bottom: 0, opacity: 100 }}
            transition={{
              delay: 0,
              duration: 1.5,
            }}
            className='relative lg:h-[290px] lg:w-[400px] sm:h-[220px] sm:w-[300px] h-[180px] w-[240px]'>
            <Image alt='anjay' src={`/dafaaalogo2.png`} width={400} height={400} className="w-full h-full duration-300" />
          </motion.button>
        </div>
      </main>
      <Contact />
    </>
  )
}

