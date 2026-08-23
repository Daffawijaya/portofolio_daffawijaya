import { motion } from "framer-motion";
import Link from "next/link";
import { HiOutlineMail } from "react-icons/hi";
import Background from "../../components/Background";
import Sidebar from "../../components/Sidebar";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import PageHead from "../../components/PageHead";
import { getContactLinks, getSettings, REVALIDATE, type ContactLink } from "../../lib/content";
import { getIcon } from "../../lib/icons";

interface ContactProps {
  contacts: ContactLink[];
  settings: Record<string, string>;
}

export default function Contact({ contacts, settings }: ContactProps) {
  return (
    <>
      <PageHead
        title="Contact - Daffa Yan Wijaya"
        description="Hubungi Daffa Yan Wijaya (daffayanwijaya) untuk kolaborasi proyek web & mobile. Email, LinkedIn, Instagram, GitHub, dan alamat di Malang, Indonesia."
        path="/contact"
      />

      <main className="h-screen flex fixed w-[15%] h-full z-50">
        <Sidebar />
      </main>

      <main className="h-screen bg-black dark:bg-white flex fixed w-screen z-10">
        <Background />
      </main>

      {/* content */}
      <div className="h-screen">
        <div className="ml-[15%] relative z-10 h-screen italic scrollbar-hide lg:pr-6">
          <div className="flex xl:flex-row flex-col xl:items-center items-start xl:justify-start justify-center w-full h-full p-6 xl:space-x-14 space-x-0 space-y-14 relative z-20">
            <div className="flex flex-col xl:w-[50%] space-y-1">
              <motion.p
                initial={{ left: -200, opacity: 0 }}
                animate={{ left: 0, opacity: 1 }}
                transition={{ delay: 0, duration: 1 }}
                className="relative text-a-2 text-xl lg:text-3xl font-bold"
              >
                {settings.contact_country}
              </motion.p>
              <motion.p
                initial={{ left: -200, opacity: 0 }}
                animate={{ left: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="relative text-black dark:text-white text-base lg:text-xl"
              >
                {settings.contact_address}
              </motion.p>
              <motion.a
                initial={{ left: -200, opacity: 0 }}
                animate={{ left: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="relative text-[#828282] hover:underline font-medium text-base lg:text-xl"
                href={settings.map_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Map
              </motion.a>
            </div>

            <div className="flex flex-col w-full space-y-10">
              <div className="flex flex-col space-y-1">
                <motion.p
                  initial={{ top: -200, opacity: 0 }}
                  animate={{ top: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="relative text-black dark:text-white lg:text-xl text-base"
                >
                  {"If you're interested in "}
                  <span className="text-a-2 capitalize font-medium">
                    work together
                  </span>{" "}
                  {"with me on a related project, you can contact me at:"}
                </motion.p>
                <motion.div
                  initial={{ top: -200, opacity: 0 }}
                  animate={{ top: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="relative flex space-x-2 flex-row items-center"
                >
                  <HiOutlineMail className="h-5 w-5 text-[#828282]" />
                  <a
                    className="text-[#828282] hover:underline lg:text-xl text-base font-medium"
                    href="https://mail.google.com/mail/u/0/?view=cm&tf=1&fs=1&to=daffayanwijaya@gmail.com"
                  >
                    daffayanwijaya@gmail.com
                  </a>
                </motion.div>
              </div>

              <div className="w-full h-full overflow-y-auto flex flex-col space-y-7">
                <motion.div
                  initial={{ top: -200, opacity: 0 }}
                  animate={{ top: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="relative"
                >
                  <h1 className="text-black dark:text-white text-lg lg:text-2xl font-bold pb-2">
                    Or you can find me at:
                  </h1>
                  <div className="flex flex-row space-x-0.5 lg:space-x-1.5 overflow-x-auto w-full">
                      {contacts.map((item) => {
                        const Icon = getIcon(item.icon);
                        return (
                          <Link
                            href={item.url}
                            key={item.name}
                            style={{ background: item.color || "#222" }}
                            className="w-full min-w-[100px] h-14 lg:h-28 flex items-center"
                          >
                          <div className="h-full w-full backdrop-brightness-[0.3] hover:backdrop-brightness-[0.5] backdrop-contrast-[0.9] hover:backdrop-contrast-[1]">
                            <div className="px-2 space-y-1 lg:space-y-2 absolute text-transparent flex flex-col items-center justify-center h-full w-full hover:text-white pt-4 hover:pt-0 duration-300">
                              <p className="uppercase text-center text-white">
                                <Icon className="lg:h-10 lg:w-10 w-4 h-4" />
                              </p>
                              <p className="text-[7px] md:text-xs text-center">
                                {item.name}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.h1
            initial={{ bottom: -100, opacity: 0 }}
            animate={{ bottom: 100, opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.5 }}
            className="fixed lg:flex hidden text-b-2 text-5xl right-0 bottom-24 -rotate-90 font-bold"
          >
            CONTACT
          </motion.h1>
        </div>
      </div>

      <ThemeSwitcher />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: { contacts: await getContactLinks(), settings: await getSettings() },
    revalidate: REVALIDATE,
  };
}
