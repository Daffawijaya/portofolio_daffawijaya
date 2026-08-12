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
  SiPhp,
  SiPostgresql,
  SiSupabase,
} from "react-icons/si";

import { FaVuejs } from "react-icons/fa";
import { IoLogoLaravel } from "react-icons/io5";

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
      {
        name: "PHP",
        icon: SiPhp,
        color: "#777bb3",
      },
    ],
  },
  {

    title: "Web Development",
    items: [
      {
        name: "React JS",
        icon: SiReact,
        color: "#61DAFB",
      },
      {
        name: "HTML",
        icon: SiHtml5,
        color: "#E34F26",
      },
      {
        name: "CSS",
        icon: SiCss3,
        color: "#1572B6",
      },
      {
        name: "Tailwind",
        icon: SiTailwindcss,
        color: "#06B6D4",
      },
      {
        name: "Chakra UI",
        icon: SiChakraui,
        color: "#319795",
      },
      {
        name: "Bootstrap",
        icon: SiBootstrap,
        color: "#7952B3",
      },
      {
        name: "Framer Motion",
        icon: SiFramer,
        color: "#0055FF",
      },
      {
        name: "Redux",
        icon: SiRedux,
        color: "#764ABC",
      },
      {
        name: "PostgreSQL",
        icon: SiPostgresql,
        color: "#4169E1",
      },
      {
        name: "Supabase",
        icon: SiSupabase,
        color: "#3ECF8E",
      },
    ],
  },
  {
    title: "Framework",
    items: [

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
      {
        name: "Laravel",
        icon: IoLogoLaravel,
        color: "#f63003",
      },
    ],
  },
];

export default techstackData;
