import Link from "next/link";
import { motion } from "framer-motion";
import type { WorkItem } from "../lib/content";

interface WorkListProps {
  worksData: WorkItem[];
}

export default function WorkList({ worksData }: WorkListProps) {
  return (
    <div className="pl-[15%] relative z-10 h-full w-full overflow-y-scroll scrollbar-hide">
      <div className="flex flex-col lg:ml-[16%] space-y-6 italic">
        {worksData.map((item, idx) => {
          const isEven = idx % 2 === 0;
          // image_position holds pan offsets ("x% y%", translate % of the layer);
          // clamped so the oversized layer never exposes gaps
          const [panX = 0, panY = 0] = String(item.image_position || "")
            .split(" ")
            .map((v) => parseFloat(v) || 0);
          const zoom = (item.image_scale || 100) / 100;
          const panLimit = Math.max(0, (75 * zoom - 50) / 1.5);
          const clampPan = (v: number) =>
            Math.max(-panLimit, Math.min(panLimit, v));

          return (
            <motion.div
              key={item.url}
              initial={{ top: -400, opacity: 0 }}
              animate={{ top: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="relative"
            >
              <div className={`${isEven ? "ml-[20%]" : "mr-[20%]"} relative`}>
                <Link href={item.url}>
                  {/* -inset-1/4: layer gambar lebih besar dari kartu supaya
                      sudutnya tetap tertutup saat dirotasi */}
                  <div className="lg:h-64 h-40 relative flex items-center overflow-hidden">
                    <div
                      className="absolute -inset-1/4 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        transform: `translate(${clampPan(panX)}%, ${clampPan(panY)}%) rotate(${item.image_rotate || 0}deg) scale(${zoom})`,
                      }}
                    />
                    <div className="absolute h-full w-full backdrop-brightness-[0.3] hover:backdrop-brightness-[0.5] backdrop-saturate-0 hover:backdrop-saturate-100 backdrop-contrast-[0.8] hover:backdrop-contrast-[1]">
                      <div className="lg:px-[20%] px-[5%] absolute text-transparent flex flex-col items-center justify-center h-full w-full hover:text-white pt-3 hover:pt-0 duration-300">
                        <p
                          className={`font-bold lg:text-3xl text-xl capitalize text-white w-full ${
                            isEven ? "text-left" : "text-right"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`capitalize w-full lg:text-base text-xs ${
                            isEven ? "text-left" : "text-right"
                          }`}
                        >
                          {item.year}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
