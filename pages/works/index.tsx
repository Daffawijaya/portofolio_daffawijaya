import { useState } from "react";
import { motion } from "framer-motion";
import Background from "../../components/Background";
import Sidebar from "../../components/Sidebar";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import PageHead from "../../components/PageHead";
import WorkList from "../../components/WorkList";
import ButtonWorks from "../../components/ButtonWorks";
import { getWorks, REVALIDATE, type WorkItem } from "../../lib/content";

const tabs = [
  { label: "Frontend Developer", value: "frontend" },
  { label: "Fullstack Developer", value: "fullstack" },
  { label: "UI/UX Designer", value: "uiux" },
];

interface WorksProps {
  works: WorkItem[];
}

export default function Works({ works }: WorksProps) {
  const [activeTab, setActiveTab] = useState("frontend");

  return (
    <>
      <PageHead title="Daffa Wijaya | Works" />

      <main className="h-screen flex fixed w-[15%] h-full z-50">
        <Sidebar />
      </main>

      <main className="h-screen bg-black dark:bg-white flex fixed w-screen z-10">
        <Background />
      </main>

      <div className="relative h-screen z-20">
        <div className="relative z-20 flex flex-col justify-center h-full">
          {/* title */}
          <div className="ml-[17%] lg:py-6 pb-3 lg:fixed relative z-20 italic lg:h-full">
            <div className="flex justify-center h-full flex-col">
              <motion.h1
                initial={{ left: -200, opacity: 0 }}
                animate={{ left: 0, opacity: 1 }}
                transition={{ delay: 0, duration: 1 }}
                className="relative text-a-2 text-5xl lg:text-7xl font-bold pb-2 capitalize"
              >
                my Works
              </motion.h1>
              <motion.div
                initial={{ left: -200, opacity: 0 }}
                animate={{ left: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="relative flex flex-col gap-2 mt-4"
              >
                {tabs.map(({ label, value }) => (
                  <ButtonWorks
                    key={value}
                    label={label}
                    value={value}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          {/* content */}
          {tabs.map(
            ({ value }) =>
              activeTab === value && (
                <WorkList
                  key={value}
                  worksData={works.filter((work) =>
                    work.category.includes(value)
                  )}
                />
              )
          )}
        </div>
      </div>

      <ThemeSwitcher />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: { works: await getWorks() },
    revalidate: REVALIDATE,
  };
}
