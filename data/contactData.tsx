import { SiInstagram, SiLinkedin, SiGithub } from "react-icons/si";

export const contact = [
    {
        title: "Or you can find me at:",
        item: [
            {
                name: "Daffa Wijaya",
                image: "bg-[url(/icon/li.png)]",
                icon: <SiLinkedin className='lg:h-10 lg:w-10 w-4 h-4' />,
                color: "hover:text-[#EAD41C]",
                url: "https://www.linkedin.com/in/daffa-wijaya-621a04255/"
            },
            {
                name: "@daffawijayaaa",
                image: "bg-[url(/icon/ig.jpg)]",
                icon: <SiInstagram className='lg:h-10 lg:w-10 w-4 h-4' />,
                color: "hover:text-[#EAD41C]",
                url: "https://www.instagram.com/daffawijayaaa/"
            },
            {
                name: "Daffawijaya",
                image: "bg-[url(/icon/gh.png)]",
                icon: <SiGithub className='lg:h-10 lg:w-10 w-4 h-4' />,
                color: "hover:text-[#2F72BC]",
                url: "https://github.com/Daffawijaya"
            },
        ]
    },
]