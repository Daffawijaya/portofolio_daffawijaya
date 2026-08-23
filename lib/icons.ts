import type { IconType } from "react-icons";
import {
  SiJavascript, SiTypescript, SiPhp, SiReact, SiHtml5, SiCss3,
  SiTailwindcss, SiChakraui, SiBootstrap, SiFramer, SiRedux,
  SiPostgresql, SiSupabase, SiNextdotjs, SiPython, SiCsharp,
  SiArduino, SiFigma, SiCanva, SiAdobephotoshop, SiAdobepremierepro,
  SiSketchup, SiBlender, SiLinkedin, SiInstagram, SiGithub, SiExpo,
  SiFlutter, SiDart, SiKotlin, SiSwift, SiAndroid, SiIos, SiApple,
  SiFirebase, SiIonic, SiGradle,
} from "react-icons/si";
import { FaVuejs, FaReact } from "react-icons/fa";
import { IoLogoLaravel } from "react-icons/io5";
import { RiFileExcel2Fill, RiFileWord2Fill } from "react-icons/ri";
import { HiPencil } from "react-icons/hi";

// DB rows store the icon as its name string; resolve to a component here.
export const ICONS: Record<string, IconType> = {
  SiJavascript, SiTypescript, SiPhp, SiReact, SiHtml5, SiCss3,
  SiTailwindcss, SiChakraui, SiBootstrap, SiFramer, SiRedux,
  SiPostgresql, SiSupabase, SiNextdotjs, SiPython, SiCsharp,
  SiArduino, SiFigma, SiCanva, SiAdobephotoshop, SiAdobepremierepro,
  SiSketchup, SiBlender, SiLinkedin, SiInstagram, SiGithub, SiExpo,
  SiFlutter, SiDart, SiKotlin, SiSwift, SiAndroid, SiIos, SiApple,
  SiFirebase, SiIonic, SiGradle,
  // tidak ada di react-icons v4 -> alias icon paling representatif
  SiNativewind: SiTailwindcss, // NativeWind = Tailwind untuk React Native
  SiReactnative: FaReact,      // React Native pakai logo React
  FaVuejs, IoLogoLaravel, RiFileExcel2Fill, RiFileWord2Fill, HiPencil,
};

export function getIcon(name: string): IconType {
  return ICONS[name] ?? SiReact;
}
