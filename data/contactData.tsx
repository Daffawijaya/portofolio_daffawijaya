export interface ContactLink {
  name: string;
  image: string; // tailwind bg-[url(...)] class
  icon: string; // react-icons name, resolved via lib/icons.ts
  color: string;
  url: string;
}

export const contactLinksData: ContactLink[] = [
  {
    name: "Daffa Wijaya",
    image: "bg-[url(/icon/li.png)]",
    icon: "SiLinkedin",
    color: "hover:text-[#EAD41C]",
    url: "https://www.linkedin.com/in/daffa-wijaya-621a04255/",
  },
  {
    name: "@daffawijayaaa",
    image: "bg-[url(/icon/ig.jpg)]",
    icon: "SiInstagram",
    color: "hover:text-[#EAD41C]",
    url: "https://www.instagram.com/daffawijayaaa/",
  },
  {
    name: "Daffawijaya",
    image: "bg-[url(/icon/gh.png)]",
    icon: "SiGithub",
    color: "hover:text-[#2F72BC]",
    url: "https://github.com/Daffawijaya",
  },
];
