import Head from 'next/head'
import Background from '../components/Background'
import Sidebar from '../components/Sidebar'
import { SiPython, SiCsharp, SiArduino, SiAdobephotoshop, SiAdobepremierepro, SiBlender, SiFigma, SiMicrosoftoffice, SiTypescript, SiJavascript, SiReact, SiHtml5, SiCss3, SiTailwindcss, SiChakraui, SiBootstrap, SiNextdotjs } from "react-icons/si";
import { HiPencil } from "react-icons/hi";
import Link from 'next/link';

const techstack = [
    {
        title: "Programming Language",
        item: [
            {
                name: "Javascript",
                icon: <SiJavascript className='h-10 w-10' />,
                color: "hover:text-[#EAD41C]",
            },
            {
                name: "Typescript",
                icon: <SiTypescript className='h-10 w-10' />,
                color: "hover:text-[#2F72BC]",
            },
        ]
    },
    {
        title: "Frontend Development",
        item: [
            {
                name: "HTML",
                icon: <SiHtml5 className='h-10 w-10' />,
                color: "hover:text-[#D84924]",
            },
            {
                name: "CSS",
                icon: <SiCss3 className='h-10 w-10' />,
                color: "hover:text-[#2449D8]",
            },
            {
                name: "Tailwind",
                icon: <SiTailwindcss className='h-10 w-10' />,
                color: "hover:text-[#39A7A6]",
            },
            {
                name: "Chakra UI",
                icon: <SiChakraui className='h-10 w-10' />,
                color: "hover:text-[#6BC0C5]",
            },
            {
                name: "Bootstrap",
                icon: <SiBootstrap className='h-10 w-10' />,
                color: "hover:text-[#523A76]",
            },
        ]
    },
    {
        title: "Framework",
        item: [
            {
                name: "React JS",
                icon: <SiReact className='h-10 w-10' />,
                color: "hover:text-[#00CDF2]",
            },
            {
                name: "Next JS",
                icon: <SiNextdotjs className='h-10 w-10' />,
                color: "hover:text-white",
            },
        ]
    },
]

const skills = [
    {
        name: "Python",
        icon: <SiPython className='h-10 w-10' />,
        color: "hover:text-[#F2B92F]",
    },
    {
        name: "C",
        icon: <SiCsharp className='h-10 w-10' />,
        color: "hover:text-[#045494]",
    },
    {
        name: "Arduino",
        icon: <SiArduino className='h-10 w-10' />,
        color: "hover:text-[#009297]",
    },
    {
        name: "Coreldraw",
        icon: <HiPencil className='h-10 w-10' />,
        color: "hover:text-[#5AA141]",
    },
    {
        name: "Photoshop",
        icon: <SiAdobephotoshop className='h-10 w-10' />,
        color: "hover:text-[#001C33]",
    },
    {
        name: "Premiere",
        icon: <SiAdobepremierepro className='h-10 w-10' />,
        color: "hover:text-[#280031]",
    },
    {
        name: "Blender",
        icon: <SiBlender className='h-10 w-10' />,
        color: "hover:text-[#DE7000]",
    },
    {
        name: "Figma",
        icon: <SiFigma className='h-10 w-10' />,
        color: "hover:text-[#09C47C]",
    },
    {
        name: "Microsoft",
        icon: <SiMicrosoftoffice className='h-10 w-10' />,
        color: "hover:text-[#DF3A01]",
    },
]

const experience = [
    {
        title: "Internship",
        item: [
            {
                name: "Social Economic Accelerator Lab",
                image: "bg-[url(/sipp2.png)]",
                url: "https://sipp-dev.vercel.app",
            },
        ]
    },
    {
        title: "Orgnization",
        item: [
            {
                name: "Ikasti",
                image: "bg-[url(/sipp2.png)]",
                url: "https://sipp-dev.vercel.app",
            },
            {
                name: "OSIS",
                image: "bg-[url(/sipp2.png)]",
                url: "https://sipp-dev.vercel.app",
            },
        ]
    },
    {
        title: "School",
        item: [
            {
                name: "SMA Negeri 3 Unggulan Tenggarong",
                image: "bg-[url(/sipp2.png)]",
                url: "https://sipp-dev.vercel.app",
            },
            {
                name: "Muhammadiyah Malang University",
                image: "bg-[url(/sipp2.png)]",
                url: "https://sipp-dev.vercel.app",
            },
        ]
    },
    {
        title: "Certification",
        item: [
            {
                name: "AWS Academy Cloud Architecting",
                image: "bg-[url(/sipp2.png)]",
                url: "https://sipp-dev.vercel.app",
            },
            {
                name: "IC3 Digital Literacy",
                image: "bg-[url(/sipp2.png)]",
                url: "https://sipp-dev.vercel.app",
            },
        ]
    },
]

const about = () => {
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
            <div className='snap-y snap-mandatory overflow-scroll h-screen'>

                <div className='ml-[15%] relative z-10 h-screen italic snap-start'>
                    <div className='flex justify-center h-full flex-col p-6'>
                        <p className='text-white text-2xl'>Hello!, I am</p>
                        <h1 className='text-a-2 text-7xl font-bold uppercase'>DAFA <span className='text-white'>YAN WIJAYA</span></h1>
                        <p className='text-white text-2xl'>Frontend Developer and Graphic Designer</p>
                        <div className='flex space-x-4 w-full pt-4'>
                            <div className='p-[2%] bg-b-2 saturate-50 hover:saturate-100'>
                                <div className='w-[450px] h-[300px] bg-[url(/dafa2.jpeg)] bg-cover bg-bottom' />
                            </div>
                            <p className='text-a-2 text-2xl font-medium w-[40%]'>I am very interested in the world of programming and graphic design. Loves new challenges, especially looking for problem solving in a project.</p>
                        </div>
                    </div>
                    <h1 className='absolute text-b-2 text-5xl right-0 bottom-28 -rotate-90 font-bold'>ABOUT</h1>
                </div>

                <div className='ml-[15%] relative z-10 h-screen italic snap-start'>
                    <div className='flex items-center w-full h-full p-6 space-x-14'>
                        <div className='flex flex-col w-[50%]'>
                            <p className='text-white text-xl'>Professional</p>
                            <h1 className='text-a-2 text-6xl font-bold uppercase pb-6'>techstacks</h1>
                            <p className='text-white text-xl'>This is a list of technologies that I use in my profession as a frontend developer. Because I am still in the learning stage, in the future this list will continue to be updated.</p>
                        </div>
                        <div className='flex flex-col w-full'>
                            {techstack.map((item: any, idx: number) => (
                                <div className='flex flex-col w-full py-5 pr-[20%]' key={idx}>
                                    <p className='text-white text-2xl font-semibold pb-6'>{item.title}</p>
                                    <div className='grid grid-cols-5 gap-4'>
                                        {item.item.map((item: any, idx: number) => (
                                            <div key={idx} className={`w-20 h-20 flex flex-col items-center justify-center space-y-2 text-[#2D2D2D] ${item.color}`}>
                                                <div>{item.icon}</div>
                                                <div className='text-[#828282]'>{item.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <h1 className='absolute text-b-2 text-5xl right-0 bottom-40 -rotate-90 font-bold'>TECHSTACK</h1>
                </div>

                <div className='ml-[15%] relative z-10 h-screen italic snap-start'>
                    <div className='flex items-center w-full h-full p-6 space-x-14'>
                        <div className='flex flex-col w-[50%]'>
                            <p className='text-white text-xl'>Another</p>
                            <h1 className='text-a-2 text-6xl font-bold uppercase pb-6'>skills</h1>
                            <p className='text-white text-xl'>For a complement or just a hobby, I also use technology outside my professional field and of course it will still be updated in the future.</p>
                        </div>
                        <div className='flex flex-col w-full'>
                            <div className='flex flex-col w-full py-5 pr-[20%]'>
                                <p className='text-white text-2xl font-semibold pb-6'>Here is the List</p>
                                <div className='grid grid-cols-5 gap-4'>
                                    {skills.map((item: any, idx: number) => (
                                        <div key={idx} className={`w-20 h-20 flex flex-col items-center justify-center space-y-2 text-[#2D2D2D] ${item.color}`}>
                                            <div>{item.icon}</div>
                                            <div className='text-[#828282]'>{item.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <h1 className='absolute text-b-2 text-5xl right-0 bottom-20 -rotate-90 font-bold'>OTHER</h1>
                </div>

                <div className='ml-[15%] relative z-10 h-screen italic snap-start'>
                    <div className='items-center flex w-full h-full p-6 space-x-14'>
                        <div className='relative flex flex-col w-[50%]'>
                            <p className='text-white text-xl'>My</p>
                            <h1 className='text-a-2 text-6xl font-bold uppercase pb-6'>Experience</h1>
                            <p className='text-white text-xl'>this is my related experience and also the certification that i have</p>
                        </div>
                        <div className='w-full h-[95%] overflow-y-auto flex flex-col space-y-7'>
                            {experience.map((item: any, idx: number) => (
                                <div key={idx}>
                                    <h1 className='text-white text-2xl font-bold pb-2'>{item.title}</h1>
                                    <div className='flex space-x-1 overflow-x-auto w-[100%]'>
                                        {item.item.map((item: any, idx: number) => (
                                            <Link href={item.url} key={idx} className='w-full min-w-80'>
                                                <div className={`h-28 min-w-80 relative flex items-center ${item.image} bg-cover bg-center overflow-hidden`}>
                                                    <div className='h-full w-full backdrop-brightness-[0.3] hover:backdrop-brightness-[0.5] backdrop-saturate-0 hover:backdrop-saturate-100 backdrop-contrast-[0.8] hover:backdrop-contrast-[1]' >
                                                        <div className='absolute text-white flex items-center justify-center h-full w-full'>
                                                            <p className='font-bold text-xl uppercase text-center'>{item.name}</p>
                                                        </div>
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

            </div>
        </>
    )
}

export default about

