import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Background from "../../components/Background";
import Sidebar from "../../components/Sidebar";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import PageHead from "../../components/PageHead";
import TechCard from "../../components/TechCard";
import SectionHeader from "../../components/SectionHeader";
import PannableImage from "../../components/PannableImage";
import TechStackList from "../../components/TechStackList";
import {
  getExperiences,
  getSkills,
  getTechstack,
  REVALIDATE,
  type ExperienceGroup,
  type TechCategory,
  type TechItem,
} from "../../lib/content";

// slide in from the left while fading
const fadeIn = (delay: number, distance: number) => ({
  initial: { left: -distance, opacity: 0 as const },
  animate: { left: 0, opacity: 1 as const },
  transition: { delay, duration: 1 },
});

interface AboutProps {
  techstack: TechCategory[];
  skills: TechItem[];
  experiences: ExperienceGroup[];
}

const About = ({ techstack, skills, experiences }: AboutProps) => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  return (
    <>
      <PageHead title="Daffa Wijaya | About" />

      <main className="h-screen flex fixed w-[15%] h-full z-50">
        <Sidebar />
      </main>

      <main className="h-screen flex fixed w-screen z-10">
        <Background />
      </main>

      {/* content */}
      <div className="snap-y snap-mandatory overflow-scroll h-screen">
        {/* about me */}
        <div className="ml-[15%] relative z-10 h-screen italic snap-start">
          <div className="flex justify-center h-full flex-col p-6">
            <motion.p
              {...fadeIn(0.2, 100)}
              className="text-black dark:text-white text-lg lg:text-2xl relative"
            >
              Hello!, I am
            </motion.p>
            <motion.h1
              {...fadeIn(0, 200)}
              className="relative text-4xl lg:text-6xl font-semibold flex sm:flex-row flex-col sm:items-end items-start"
            >
              <div className="pr-0.5">
                <button className="bg-[url('/aa.png')] bg-cover lg:h-[50px] lg:w-[180px] bg-center w-[110px] h-[32px]"></button>
              </div>

              <span className="text-black dark:text-white pr-2">Yan</span>
              <span className="text-black dark:text-white">Wijaya</span>
            </motion.h1>
            <motion.p
              {...fadeIn(1, 200)}
              className="text-black dark:text-white relative text-lg lg:text-2xl"
            >
              Web Developer | IT & Digitalization Specialist
            </motion.p>
            <div className="relative flex lg:flex-row flex-col items-start lg:space-x-4 w-full pt-4">
              <motion.div
                {...fadeIn(0.4, 200)}
                className="z-10 md:p-4 p-2 relative bg-b-2 dark:bg-opacity-100 bg-opacity-10 mb-4"
              >
                <div className="md:w-[300px] md:h-[300px] w-[150px] h-[150px] bg-[url(/dafanoanting.png)] bg-cover bg-center" />
              </motion.div>
              <motion.div {...fadeIn(1, 200)}>
                <p className="z-0 relative text-black dark:text-a-2 text-md lg:text-2xl pb-4 font-medium w-full lg:w-[70%]">
                  &quot;Passionate about web development, leveraging AI to build responsive, user-friendly websites and solve real-world problems through practical projects.
                </p>
                <a
                  href="https://drive.google.com/file/d/1JJzxZVgSfaoVXRh2cc9ShLaGczQHXJzv/view?usp=sharing"
                  className="z-0 relative text-a-2 dark:text-white text-md lg:text-2xl hover:underline"
                >
                  Download my CV
                </a>
              </motion.div>
            </div>
          </div>
          <motion.h1
            initial={{ bottom: -100, opacity: 0 }}
            animate={{ bottom: 100, opacity: 1 }}
            transition={{
              delay: 1.3,
              duration: 1.5,
            }}
            className="absolute lg:flex hidden text-b-2 text-5xl right-0 bottom-28 -rotate-90 font-bold"
          >
            ABOUT
          </motion.h1>
        </div>

        {/* techstack */}
        <div className="ml-[15%] relative z-10 h-screen italic snap-start">
          <div className="flex lg:flex-row flex-col lg:items-center justify-center h-full w-full p-6 lg:space-x-14">
            <SectionHeader
              subtitle="Professional"
              title="Techstack"
              description="Technologies I use in my work as a web developer. This list continues to grow as I learn, build, and work with new technologies."
            />
            <TechStackList
              categories={techstack}
              hoveredTech={hoveredTech}
              setHoveredTech={setHoveredTech}
            />
          </div>

          <h1 className="absolute lg:flex hidden text-b-2 text-5xl right-0 bottom-40 -rotate-90 font-bold">
            TECHSTACK
          </h1>
        </div>

        {/*other skill */}
        <div className="ml-[15%] relative z-10 h-screen italic snap-start">
          <div className="flex lg:flex-row flex-col lg:items-center justify-center h-full w-full p-6 lg:space-x-14">
            <SectionHeader
              subtitle="Another"
              title="Skills"
              description="These are my additional skills outside of frontend development, covering backend, design, and creative tools."
            />
            <div className="flex flex-col w-full py-5 lg:pr-[20%]">
              <p className="text-black dark:text-white text-lg lg:text-2xl font-semibold pb-1 lg:pb-6">
                Tools &amp; Technologies
              </p>
              <div className="grid lg:grid-cols-5 grid-cols-4 lg:gap-4">
                {skills.map((skill) => (
                  <TechCard
                    key={skill.name}
                    name={skill.name}
                    icon={skill.icon}
                    color={skill.color}
                    hoveredTech={hoveredTech}
                    setHoveredTech={setHoveredTech}
                  />
                ))}
              </div>
            </div>
          </div>
          <h1 className="absolute lg:flex hidden text-b-2 text-5xl right-0 bottom-20 -rotate-90 font-bold">
            OTHER
          </h1>
        </div>

        {/* experience */}
        <div className="ml-[15%] relative z-10 h-screen italic snap-start">
          <div className="flex lg:flex-row flex-col lg:items-center justify-center h-full w-full p-6 lg:space-x-14">
            <SectionHeader
              subtitle="My"
              title="Experiences"
              description="This section highlights my relevant experience and certifications."
            />
            <div className="max-w-full overflow-y-auto flex flex-col space-y-2 lg:space-y-7">
              {experiences.map((category) => (
                <div key={category.title}>
                  <h1 className="pb-1 dark:text-white text-black text-lg lg:text-2xl font-bold">
                    {category.title}
                  </h1>

                  <div className="flex space-x-1 overflow-x-auto">
                    {category.items.map((exp) => (
                      <Link
                        href={exp.url}
                        key={exp.name}
                        className="relative w-full lg:min-w-[240px] min-w-[80px] lg:h-28 h-20 flex items-center overflow-hidden"
                      >
                        <PannableImage
                          src={exp.image}
                          position={exp.image_position || "0% 0%"}
                          rotate={exp.image_rotate || 0}
                          scale={(exp.image_scale || 100) / 100}
                        />
                        <div className="absolute h-full w-full backdrop-brightness-[0.3] hover:backdrop-brightness-[0.5] backdrop-saturate-0 hover:backdrop-saturate-100 backdrop-contrast-[0.8] hover:backdrop-contrast-[1]">
                          <div className="px-2 absolute text-transparent flex flex-col items-center justify-center h-full w-full hover:text-white pt-3 hover:pt-0 duration-300">
                            <p className="font-bold text-xs lg:text-xl capitalize text-center text-white">
                              {exp.name}
                            </p>

                            <p className="text-[7px] lg:text-xs capitalize text-center">
                              {exp.year}
                            </p>
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
      <ThemeSwitcher />
    </>
  );
};

export default About;

export async function getStaticProps() {
  return {
    props: {
      techstack: await getTechstack(),
      skills: await getSkills(),
      experiences: await getExperiences(),
    },
    revalidate: REVALIDATE,
  };
}
