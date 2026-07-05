import Link from "next/link";
import { motion } from "framer-motion";

interface WorkItem {
  name: string;
  image: string;
  url: string;
  year: string;
  type?: string;
}

interface WorkListProps {
  worksData: WorkItem[];
}

export default function WorkList({ worksData }: WorkListProps) {
  return (
    <div className="pl-[15%] relative z-10 h-full w-full overflow-y-scroll scrollbar-hide">
      <div className="flex flex-col lg:ml-[16%] space-y-6 italic">
        {worksData.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ top: -400, opacity: 0 }}
            animate={{ top: 0, opacity: 100 }}
            transition={{
              delay: 0.8,
              duration: 1,
            }}
            className="relative"
          >
            {idx % 2 === 0 ? (
              <div className="ml-[20%] relative">
                <Link href={item.url}>
                  <div
                    className="lg:h-64 h-40 flex items-center bg-cover bg-center overflow-hidden"
                    style={{
                      backgroundImage: `url(${item.image})`,
                    }}
                  >
                    <div className="absolute h-full w-full backdrop-brightness-[0.3] hover:backdrop-brightness-[0.5] backdrop-saturate-0 hover:backdrop-saturate-100 backdrop-contrast-[0.8] hover:backdrop-contrast-[1]">
                      <div className="lg:px-[20%] px-[5%] absolute text-transparent flex flex-col items-center justify-center h-full w-full hover:text-white pt-3 hover:pt-0 duration-300">
                        <p className="lg:text-3xl text-xl font-bold capitalize text-left text-white w-full">
                          {item.name}
                        </p>
                        <p className="text-left capitalize w-full lg:text-base text-xs">
                          {item.year}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="mr-[20%] relative">
                <Link href={item.url}>
                  <div
                    className="lg:h-64 h-40 flex items-center bg-cover bg-center overflow-hidden"
                    style={{
                      backgroundImage: `url(${item.image})`,
                    }}
                  >
                    <div className="absolute h-full w-full backdrop-brightness-[0.3] hover:backdrop-brightness-[0.5] backdrop-saturate-0 hover:backdrop-saturate-100 backdrop-contrast-[0.8] hover:backdrop-contrast-[1]">
                      <div className="lg:px-[20%] px-[5%] absolute text-transparent flex flex-col items-center justify-center h-full w-full hover:text-white pt-3 hover:pt-0 duration-300">
                        <p className="font-bold lg:text-3xl text-xl capitalize text-right text-white w-full">
                          {item.name}
                        </p>
                        <p className="text-right capitalize w-full lg:text-base text-xs">
                          {item.year}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
