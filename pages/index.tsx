import Head from 'next/head'
import Sidebar from './components/Sidebar'
import Contact from './components/Contact'
import Image from 'next/image'

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
          <button className='lg:h-[290px] lg:w-[400px] h-[220px] w-[300px] duration-300 hover:scale-[102%]'>
            <Image alt='anjay' src={`/dafaaalogo2.png`} width={400} height={400} className="w-full h-full duration-300" />
          </button>
        </div>
      </main>
      <Contact />
    </>
  )
}
