import Head from 'next/head'
import Background from '../components/Background'
import Sidebar from '../components/Sidebar'
import { SiPython, SiCsharp, SiArduino, SiAdobephotoshop, SiAdobepremierepro, SiBlender, SiFigma, SiMicrosoftoffice, SiTypescript, SiJavascript, SiReact, SiHtml5, SiCss3, SiTailwindcss, SiChakraui, SiBootstrap, SiNextdotjs } from "react-icons/si";
import { HiPencil } from "react-icons/hi";
import Link from 'next/link';
import Contact from '../components/Contact';
import { motion } from 'framer-motion';

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
                name: "MBKM × Social Economic Accelerator Lab",
                image: "bg-[url(/experience/seal2.png)]",
                url: "https://seal.or.id/",
                year: "August 2022 - December 2022"
            },
        ]
    },
    {
        title: "Organization",
        item: [
            {
                name: "Ikasti",
                image: "bg-[url(/experience/ikasto.png)]",
                url: "https://www.instagram.com/ikastiofficial/",
                year: "August 2020 - Present"
            },
            {
                name: "OSIS",
                image: "bg-[url(/experience/osis.jpg)]",
                url: "https://www.instagram.com/ospk_smagatgr/",
                year: "July 2017 - July 2018"
            },
        ]
    },
    {
        title: "Education",
        item: [
            {
                name: "Muhammadiyah Malang University",
                image: "bg-[url(/experience/umm.png)]",
                url: "https://www.umm.ac.id/",
                year: "August 2019 - Present"
            },
            {
                name: "SMA Negeri 3 Unggulan Tenggarong",
                image: "bg-[url(/experience/smaga.png)]",
                url: "http://www.sman3tenggarong.sch.id/",
                year: "June 2016 - June 2019"
            },
        ]
    },
    {
        title: "Certification",
        item: [
            {
                name: "SEAL Internship Graduate",
                image: "bg-[url(/experience/seal2.png)]",
                url: "https://drive.google.com/file/d/1kA6ukvDQoVK4PAAmr2n_N-OeKnwLoxuw/view?usp=sharing",
                year: "December 2022"
            },
            {
                name: "AWS Academy Cloud Architecting",
                image: "bg-[url(/experience/aws.jpg)]",
                url: "https://www.credly.com/badges/1c7ecf10-0045-4431-9791-d43ec0e1ac0c/linked_in_profile",
                year: "November 2022"
            },
            {
                name: "IC3 Digital Literacy",
                image: "bg-[url(/experience/IC3.png)]",
                url: "https://drive.google.com/file/d/1FiavmAuL1vkFKUZi4xMWKIjpFSNKOimw/view",
                year: "November 2019"
            },
        ]
    },
]

const About = () => {
    return (
        <>
            <Head>
                <title>Daffa Wijaya | About</title>
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
                        <motion.p
                            initial={{ left: -100, opacity: 0 }}
                            animate={{ left: 0, opacity: 100 }}
                            transition={{
                                delay: 0.2,
                                duration: 1,
                            }}
                            className='text-white text-lg lg:text-2xl relative'>Hello!, I am</motion.p>
                        <motion.h1
                            initial={{ left: -200, opacity: 0 }}
                            animate={{ left: 0, opacity: 100 }}
                            transition={{
                                delay: 0,
                                duration: 1,
                            }}
                            className='relative text-a-2 text-5xl lg:text-7xl font-bold uppercase'>DAFA <span className='text-white'>YAN WIJAYA</span></motion.h1>
                        <motion.p
                            initial={{ left: -200, opacity: 0 }}
                            animate={{ left: 0, opacity: 100 }}
                            transition={{
                                delay: 1,
                                duration: 1,
                            }}
                            className='text-white relative text-lg lg:text-2xl'>Frontend Developer and Graphic Designer</motion.p>
                        <div className='relative flex lg:flex-row flex-col lg:space-x-4 w-full pt-4'>
                            <motion.div
                                initial={{ left: -200, opacity: 0 }}
                                animate={{ left: 0, opacity: 100 }}
                                transition={{
                                    delay: 0.4,
                                    duration: 1,
                                }}
                                className='z-10 p-4 relative bg-b-2 saturate-50 hover:saturate-100 mb-4'>
                                <div className='lg:w-[450px] lg:h-[300px] w-full h-[250px] bg-[url(/dafa2.jpeg)] bg-cover bg-bottom' />
                            </motion.div>
                            <motion.p
                                initial={{ left: -200, opacity: 0 }}
                                animate={{ left: 0, opacity: 100 }}
                                transition={{
                                    delay: 1,
                                    duration: 1,
                                }}
                                className='z-0 relative text-a-2 text-lg lg:text-2xl font-medium w-full lg:w-[40%]'>I am very interested in the world of programming and graphic design. Loves new challenges, especially looking for problem solving in a project.</motion.p>
                        </div>
                    </div>
                    <motion.h1
                        initial={{ bottom: -100, opacity: 0 }}
                        animate={{ bottom: 100, opacity: 100 }}
                        transition={{
                            delay: 1.3,
                            duration: 1.5,
                        }}
                        className='absolute lg:flex hidden text-b-2 text-5xl right-0 bottom-28 -rotate-90 font-bold'>ABOUT</motion.h1>
                </div>

                <div className='ml-[15%] relative z-10 h-screen italic snap-start'>
                    <div className='flex lg:flex-row flex-col lg:items-center justify-center h-full w-full p-6 lg:space-x-14'>
                        <div className='flex flex-col lg:w-[50%]'>
                            <p className='text-white md:text-xl text-sm'>Professional</p>
                            <h1 className='text-a-2 text-4xl lg:text-6xl font-bold uppercase lg:pb-6 pb-3'>techstacks</h1>
                            <p className='text-white text-sm lg:text-xl pb-3'>This is a list of technologies that I use in my profession as a frontend developer. Because I am still in the learning stage, in the future this list will continue to be updated.</p>
                        </div>
                        <div className='flex flex-col w-full'>
                            {techstack.map((item: any, idx: number) => (
                                <div className='flex flex-col w-full lg:py-5 py-1 lg:py-2 lg:pr-[20%]' key={idx}>
                                    <p className='text-white text-lg lg:text-2xl font-semibold pb-1 lg:pb-6'>{item.title}</p>
                                    <div className='grid lg:grid-cols-5 grid-cols-3 lg:gap-4'>
                                        {item.item.map((item: any, idx: number) => (
                                            <div key={idx} className={`w-20 h-20 flex flex-col items-center justify-center space-y-2 text-[#2D2D2D] ${item.color}`}>
                                                <div>{item.icon}</div>
                                                <div className='text-[#828282] text-xs lg:text-base'>{item.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <h1 className='absolute lg:flex hidden text-b-2 text-5xl right-0 bottom-40 -rotate-90 font-bold'>TECHSTACK</h1>
                </div>

                <div className='ml-[15%] relative z-10 h-screen italic snap-start'>
                    <div className='flex lg:flex-row flex-col lg:items-center justify-center h-full w-full p-6 lg:space-x-14'>
                        <div className='flex flex-col lg:w-[50%]'>
                            <p className='text-white text-lg lg:text-xl'>Another</p>
                            <h1 className='text-a-2 text-4xl lg:text-6xl font-bold uppercase lg:pb-6 pb-3'>skills</h1>
                            <p className='text-white lg:text-xl text-sm'>For a complement or just a hobby, I also use technology outside my professional field and of course it will still be updated in the future.</p>
                        </div>
                        <div className='flex flex-col w-full'>
                            <div className='flex flex-col w-full py-5 lg:pr-[20%]'>
                                <p className='text-white text-lg lg:text-2xl font-semibold pb-1 lg:pb-6'>Here is the List</p>
                                <div className='grid lg:grid-cols-5 grid-cols-3 lg:gap-4'>
                                    {skills.map((item: any, idx: number) => (
                                        <div key={idx} className={`w-20 h-20 flex flex-col items-center justify-center space-y-2 text-[#2D2D2D] ${item.color}`}>
                                            <div>{item.icon}</div>
                                            <div className='text-[#828282] text-xs lg:text-base'>{item.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <h1 className='absolute lg:flex hidden text-b-2 text-5xl right-0 bottom-20 -rotate-90 font-bold'>OTHER</h1>
                </div>

                <div className='ml-[15%] relative z-10 h-screen italic snap-start'>
                    <div className='flex lg:flex-row flex-col lg:items-center justify-center h-full w-full p-6 lg:space-x-14'>
                        <div className='relative flex flex-col lg:w-[50%] pb-3'>
                            <p className='text-white text-sm lg:text-xl'>My</p>
                            <h1 className='text-a-2 text-4xl lg:text-6xl font-bold uppercase pb-3 lg:pb-6'>Experiences</h1>
                            <p className='text-white text-sm lg:text-xl'>This is my related experience and also the certification that i have.</p>
                        </div>
                        <div className='w-full overflow-y-auto flex flex-col space-y-2 lg:space-y-7'>
                            {experience.map((item: any, idx: number) => (
                                <div key={idx}>
                                    <h1 className='text-white text-lg lg:text-2xl font-bold pb-2'>{item.title}</h1>
                                    <div className='flex space-x-1 overflow-x-auto w-full'>
                                        {item.item.map((item: any, idx: number) => (
                                            <Link href={item.url} key={idx} className={`w-full lg:min-w-[240px] min-w-[80px] lg:h-28 h-20 flex items-center ${item.image} bg-cover bg-center w-full`}>
                                                <div className='h-full w-full backdrop-brightness-[0.3] hover:backdrop-brightness-[0.5] backdrop-saturate-0 hover:backdrop-saturate-100 backdrop-contrast-[0.8] hover:backdrop-contrast-[1]' >
                                                    <div className='px-2 absolute text-transparent flex flex-col items-center justify-center h-full w-full hover:text-white pt-3 hover:pt-0 duration-300'>
                                                        <p className='font-bold text-xs lg:text-xl uppercase text-center text-white'>{item.name}</p>
                                                        <p className='text-[7px] lg:text-xs capitalize text-center '>{item.year}</p>
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
            <Contact />
        </>
    )
}

export default About

