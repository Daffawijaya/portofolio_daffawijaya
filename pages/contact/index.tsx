import Head from 'next/head'
import Background from '../components/Background'
import Sidebar from '../components/Sidebar'
import { SiInstagram, SiLinkedin, SiGithub } from "react-icons/si";
import { HiOutlineMail } from "react-icons/hi";
import Link from 'next/link';
import Contacts from '../components/Contact';

const contact = [
    {
        title: "Or you can find me at:",
        item: [
            {
                name: "Daffa Wijaya",
                image: "bg-[url(/icon/li.png)]",
                icon: <SiLinkedin className='h-10 w-10' />,
                color: "hover:text-[#EAD41C]",
                url: "https://www.linkedin.com/in/daffa-wijaya-621a04255/"
            },
            {
                name: "@daffawijayaaa",
                image: "bg-[url(/icon/ig.jpg)]",
                icon: <SiInstagram className='h-10 w-10' />,
                color: "hover:text-[#EAD41C]",
                url: "https://www.instagram.com/daffawijayaaa/"
            },
            {
                name: "Daffawijaya",
                image: "bg-[url(/icon/gh.png)]",
                icon: <SiGithub className='h-10 w-10' />,
                color: "hover:text-[#2F72BC]",
                url: "https://github.com/Daffawijaya"
            },
        ]
    },
]

const Contact = () => {
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

            {/* content */}
            <div className='overflow-scroll h-screen'>

                <div className='ml-[15%] relative z-10 h-screen italic'>
                    <div className='flex items-center w-full h-full p-6 space-x-14'>
                        <div className='flex flex-col w-[50%] space-y-1'>
                            <p className='text-a-2 text-3xl font-bold'>Indonesia</p>
                            <p className='text-white text-xl'>Dusun Rambaan 31, Landungsari, Dau, Malang Regency, East Java</p>
                            <a className='text-[#828282] hover:underline font-medium' href='https://goo.gl/maps/NBknBQpL43MXpbrb9'>View Map</a>
                        </div>

                        <div className='flex flex-col w-full space-y-10'>
                            <div className='flex flex-col  space-y-1'>
                                <p className='text-white text-xl '>If you interest to <span className='text-a-2 capitalize font-medium'>work together</span> with me on a related project you can contact me at:</p>
                                <div className='flex space-x-2 flex-row items-center'>
                                    <p><HiOutlineMail className='h-5 w-5 text-[#828282]' /></p>
                                    <a className='text-[#828282] hover:underline font-medium' href='https://mail.google.com/mail/u/0/?view=cm&tf=1&fs=1&to=daffayanwijaya@gmail.com'>daffayanwijaya@gmail.com</a>
                                </div>
                            </div>
                            <div className='w-full h-[100%] overflow-y-auto flex flex-col space-y-7'>
                                {contact.map((item: any, idx: number) => (
                                    <div key={idx}>
                                        <h1 className='text-white text-2xl font-bold pb-2'>{item.title}</h1>
                                        <div className='flex space-x-1.5 overflow-x-auto w-full'>
                                            {item.item.map((item: any, idx: number) => (
                                                <Link href={item.url} key={idx} className={`w-full min-w-[240px] h-28 flex items-center ${item.image} bg-cover bg-center w-full`}>
                                                    <div className='h-full w-full backdrop-brightness-[0.3] hover:backdrop-brightness-[0.5] backdrop-contrast-[0.9] hover:backdrop-contrast-[1]' >
                                                        <div className='px-2 space-y-2 absolute text-transparent flex flex-col items-center justify-center h-full w-full hover:text-white pt-4 hover:pt-0 duration-300'>
                                                            <p className='font-bold text-xl uppercase text-center text-white'>{item.icon}</p>
                                                            <p className='text-xs text-center'>{item.name}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <h1 className='absolute text-b-2 text-5xl right-0 bottom-24 -rotate-90 font-bold'>CONTACT</h1>
                </div>

            </div>
            <Contacts />
        </>
    )
}

export default Contact
