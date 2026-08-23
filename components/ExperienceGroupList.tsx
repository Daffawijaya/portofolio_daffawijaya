import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import type { ExperienceGroup } from "../lib/content";

// satu grup experience (Works/Education/dll) yang bisa diminimize
export default function ExperienceGroupList({ group }: { group: ExperienceGroup }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pb-1 w-full text-left"
      >
        <HiChevronDown
          className={`shrink-0 transition-transform duration-300 ${
            open ? "" : "-rotate-90"
          }`}
        />
        <h1 className="dark:text-white text-black text-lg lg:text-2xl font-bold">
          {group.title}
        </h1>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex space-x-1 overflow-x-auto pt-2">
              {group.items.map((exp) => (
                <Link
                  href={exp.url}
                  key={exp.name}
                  className="w-full lg:min-w-[240px] min-w-[80px] lg:h-28 h-20 flex items-center bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${exp.image})`,
                  }}
                >
                  <div className="h-full w-full backdrop-brightness-[0.3] hover:backdrop-brightness-[0.5] backdrop-saturate-0 hover:backdrop-saturate-100 backdrop-contrast-[0.8] hover:backdrop-contrast-[1]">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
