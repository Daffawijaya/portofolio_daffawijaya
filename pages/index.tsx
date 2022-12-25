import Head from 'next/head'
import Sidebar from './components/Sidebar'

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favico.png" />
      </Head>

      <main className='h-screen flex fixed w-[15%] h-full z-50'>
                <Sidebar />
            </main>

      <main className='w-[85%] h-screen bg-black flex ml-[15%]'>
        <div className="absolute  w-[85%] h-full bg-[url('/daf.jpg')] bg-cover bg-center saturate-0">
          <div className='absolute backdrop-brightness-[0.3] h-full w-full' />
        </div>
        <div className="w-full h-full relative flex flex-col items-center justify-center">
          <h1 className='text-7xl font-bold text-a-2 italic'>D A F F A</h1>
          <h1 className='text-7xl font-bold text-a-2 italic'>W I J A Y A</h1>
          <p className='text-xl text-white pt-5 italic'>FRONTEND WEB DEVELOPER</p>
        </div>
      </main>
    </>
  )
}
