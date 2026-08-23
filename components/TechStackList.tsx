import { useEffect, useRef, useState } from "react";
import TechCard from "./TechCard";
import type { TechCategory } from "../lib/content";

interface TechStackListProps {
  categories: TechCategory[];
  hoveredTech: string | null;
  setHoveredTech: (name: string | null) => void;
}

const GAP = 16; // gap-4, sama dengan grid

// ukur lebar kontainer + jumlah kolom efektif (4 mobile, 5 desktop)
function useContainerColumns() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ width: 0, cols: 5 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setState({
        width: el.getBoundingClientRect().width,
        cols: mq.matches ? 5 : 4,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    mq.addEventListener("change", update);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);
  return { ref, ...state };
}

// baris auto-geser: lebar slot dihitung persis seperti kolom grid,
// jadi ujung kanan-kirinya sejajar dengan baris Another Skills
function SlidingRow({
  items,
  hoveredTech,
  setHoveredTech,
}: {
  items: TechCategory["items"];
  hoveredTech: string | null;
  setHoveredTech: (name: string | null) => void;
}) {
  const { ref, width, cols } = useContainerColumns();
  const slot =
    width > 0 ? Math.floor((width - (cols - 1) * GAP) / cols) : 128;

  return (
    <>
      {/* padding kiri di desktop -> ada ruang kosong sebelum kartu pertama */}
      <div className="lg:pl-[8%]">
        <div ref={ref} className="overflow-hidden">
          <div
            className="flex w-max hover:[animation-play-state:paused]"
            style={{
              gap: GAP,
              animation: `marquee-r ${items.length * 3}s linear infinite`,
            }}
          >
            {[...items, ...items].map((tech, i) => (
              <div
                className="shrink-0"
                style={{ width: slot }}
                key={`${tech.name}-${i}`}
              >
                <TechCard
                  className="w-full"
                  name={tech.name}
                  icon={tech.icon}
                  color={tech.color}
                  hoveredTech={hoveredTech}
                  setHoveredTech={setHoveredTech}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// seksi techstack yang konsisten:
// - <= 5 item  -> grid (persis seperti Another Skills)
// - > 5 item   -> satu baris auto-geser ke kanan, slot kartu seragam,
//                 lebar area tetap sama dengan grid (tidak menggeser layout)
export default function TechStackList({
  categories,
  hoveredTech,
  setHoveredTech,
}: TechStackListProps) {
  return (
    <div className="flex flex-col w-full">
      {categories.map((category) => (
        <div
          className="flex flex-col w-full lg:py-5 lg:pr-[20%]"
          key={category.title}
        >
          <p className="text-black dark:text-white text-lg lg:text-2xl font-semibold pb-1 lg:pb-6">
            {category.title}
          </p>

          {category.items.length > 5 ? (
            <SlidingRow
              items={category.items}
              hoveredTech={hoveredTech}
              setHoveredTech={setHoveredTech}
            />
          ) : (
            <div className="grid grid-cols-4 lg:grid-cols-5 lg:gap-4">
              {category.items.map((tech) => (
                <TechCard
                  key={tech.name}
                  name={tech.name}
                  icon={tech.icon}
                  color={tech.color}
                  hoveredTech={hoveredTech}
                  setHoveredTech={setHoveredTech}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
