import TechCard from "./TechCard";
import type { TechCategory } from "../lib/content";

interface TechStackListProps {
  categories: TechCategory[];
  hoveredTech: string | null;
  setHoveredTech: (name: string | null) => void;
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
            <div className="overflow-hidden">
              <div
                className="flex w-max gap-4 hover:[animation-play-state:paused]"
                style={{
                  animation: `marquee-r ${category.items.length * 3}s linear infinite`,
                }}
              >
                {[...category.items, ...category.items].map((tech, i) => (
                  <div
                    // slot seragam agar baris rapi dan loop mulus
                    className="shrink-0 w-24 lg:w-32"
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
