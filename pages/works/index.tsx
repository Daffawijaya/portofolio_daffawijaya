import Head from 'next/head'
import Background from '../components/Background'
import Sidebar from '../components/Sidebar'
import Link from 'next/link'

const projects = [
    {
        type: 1,
        name: "SIPP",
        image: "bg-[url(/sipp2.png)]",
        url: "https://sipp-dev.vercel.app",
    },

    {
        type: 2,
        name: "UMMRN Reengineering",
        image: "bg-[url(/ummrn.png)]",
        url: "http://ummrn-daffacindy.vercel.app/",
    },
    {
        
        type: 1,
        name: "SEAL TodoList",
        image: "bg-[url(/seal.png)]",
        url: "https://mini-project-todolist-seal-5.vercel.app",
    },
]

const works = () => {
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

            <main className='h-screen bg-black flex fixed w-screen z-10'>
                <Background />
            </main>

            <div className='ml-[17%] py-6 fixed z-20 italic'>
                <div className='flex justify-center h-full fixed flex-col'>
                    <h1 className='text-a-2 text-7xl font-bold pb-2 uppercase'>My Works</h1>
                    <p className='text-white w-40 text-2xl'>Here is a list of projects Ive worked on</p>
                </div>
            </div>

            <div className='ml-[15%] py-6 relative z-10'>
                <div className='flex flex-col ml-[16%] space-y-6 italic'>
                    {projects.map((item: any, idx: number) => (
                        <div key={idx}>
                            {item.type === 2 ?
                                <Link href={item.url}>
                                    <div className={`relative mr-[20%] h-64 flex items-center ${item.image} bg-cover bg-center overflow-hidden justify-end`}>
                                        <div className='absolute inset-0 h-full backdrop-brightness-[0.3] hover:backdrop-brightness-[0.5] backdrop-saturate-0 hover:backdrop-saturate-100 backdrop-contrast-[0.8] hover:backdrop-contrast-[1]' />
                                        <div className='mx-[20%] relative text-white mt-7'>
                                            <h1 className='font-bold text-3xl uppercase'>{item.name}</h1>
                                        </div>
                                    </div>
                                </Link>
                                :
                                <Link href={item.url}>
                                    <div className={`relative ml-[20%] h-64 flex items-center ${item.image} bg-cover bg-center overflow-hidden`}>
                                        <div className='absolute inset-0 h-full backdrop-brightness-[0.3] hover:backdrop-brightness-[0.5] backdrop-saturate-0 hover:backdrop-saturate-100 backdrop-contrast-[0.8] hover:backdrop-contrast-[1]' />
                                        <div className='mx-[20%] relative text-white mt-7'>
                                            <h1 className='font-bold text-3xl uppercase'>{item.name}</h1>
                                        </div>
                                    </div>
                                </Link>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default works

