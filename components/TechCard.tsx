import { IconType } from "react-icons";

interface TechCardProps {
  name: string;
  icon: IconType;
  color: string;
  hoveredTech: string | null;
  setHoveredTech: (name: string | null) => void;
}

export default function TechCard({
  name,
  icon: Icon,
  color,
  hoveredTech,
  setHoveredTech,
}: TechCardProps) {
  return (
    <div
      className="w-20 h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2 cursor-pointer"
      onMouseEnter={() => setHoveredTech(name)}
      onMouseLeave={() => setHoveredTech(null)}
    >
      <Icon
        className="lg:h-10 lg:w-10 h-8 w-8 transition-colors duration-200"
        style={{
          color: hoveredTech === name ? color : "#2D2D2D",
        }}
      />

      <div className="text-[#828282] text-[8px] lg:text-base">{name}</div>
    </div>
  );
}
