import {
  SiRedux,
  SiFramer,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiChakraui,
  SiBootstrap,
  SiNextdotjs,
} from "react-icons/si";

const techstackData = [
  {
    title: "Programming Language",
    items: [
      {
        name: "Javascript",
        icon: SiJavascript,
        color: "hover:text-[#EAD41C]",
      },
      {
        name: "Typescript",
        icon: SiTypescript,
        color: "hover:text-[#2F72BC]",
      },
    ],
  },
  {
    title: "Frontend Development",
    items: [
      {
        name: "HTML",
        icon: SiHtml5,
        color: "hover:text-[#D84924]",
      },
      {
        name: "CSS",
        icon: SiCss3,
        color: "hover:text-[#2449D8]",
      },
      {
        name: "Tailwind",
        icon: SiTailwindcss,
        color: "hover:text-[#39A7A6]",
      },
      {
        name: "Chakra UI",
        icon: SiChakraui,
        color: "hover:text-[#6BC0C5]",
      },
      {
        name: "Bootstrap",
        icon: SiBootstrap,
        color: "hover:text-[#523A76]",
      },
      {
        name: "Framer Motion",
        icon: SiFramer,
        color: "hover:text-[#DC01C2]",
      },
      {
        name: "Redux",
        icon: SiRedux,
        color: "hover:text-[#7046B3]",
      },
    ],
  },
  {
    title: "Framework",
    items: [
      {
        name: "React JS",
        icon: SiReact,
        color: "hover:text-[#00CDF2]",
      },
      {
        name: "Next JS",
        icon: SiNextdotjs,
        color: "dark:hover:text-white hover:text-black",
      },
    ],
  },
];

export default techstackData;