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

import { FaVuejs } from "react-icons/fa";

const techstackData = [
  {
    title: "Programming Language",
    items: [
      {
        name: "Javascript",
        icon: SiJavascript,
        color: "#EAD41C",
      },
      {
        name: "Typescript",
        icon: SiTypescript,
        color: "#2F72BC",
      },
    ],
  },
  {
    title: "Frontend Development",
    items: [
      {
        name: "HTML",
        icon: SiHtml5,
        color: "#8000FF",
      },
      {
        name: "CSS",
        icon: SiCss3,
        color: "#2449D8",
      },
      {
        name: "Tailwind",
        icon: SiTailwindcss,
        color: "#39A7A6",
      },
      {
        name: "Chakra UI",
        icon: SiChakraui,
        color: "#6BC0C5",
      },
      {
        name: "Bootstrap",
        icon: SiBootstrap,
        color: "#523A76",
      },
      {
        name: "FramerMotion",
        icon: SiFramer,
        color: "#DC01C2",
      },
      {
        name: "Redux",
        icon: SiRedux,
        color: "#7046B3",
      },
    ],
  },
  {
    title: "Framework",
    items: [
      {
        name: "React JS",
        icon: SiReact,
        color: "#00CDF2",
      },
      {
        name: "Next JS",
        icon: SiNextdotjs,
        color: "#7046B3",
      },
      {
        name: "Vue JS",
        icon: FaVuejs,
        color: "#41b883",
      },
    ],
  },
];

export default techstackData;
