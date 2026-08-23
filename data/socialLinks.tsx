import type { IconType } from "react-icons";
import { SiGithub, SiInstagram, SiLinkedin } from "react-icons/si";

export interface SocialLink {
  name: string;
  icon: IconType;
  url: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    icon: SiLinkedin,
    url: "https://www.linkedin.com/in/daffa-wijaya-621a04255/",
  },
  {
    name: "Instagram",
    icon: SiInstagram,
    url: "https://www.instagram.com/daffawijayaaa/",
  },
  {
    name: "GitHub",
    icon: SiGithub,
    url: "https://github.com/Daffawijaya",
  },
];
