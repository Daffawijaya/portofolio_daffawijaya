import { getIcon } from "../lib/icons";

interface TechCardProps {
  name: string;
  icon: string; // react-icons name, resolved via lib/icons.ts
  color: string;
  hoveredTech: string | null;
  setHoveredTech: (name: string | null) => void;
  className?: string; // override lebar default (w-20), dipakai baris marquee
  // identitas unik untuk hover; default = name. Wajib beda kalau tech yang
  // sama muncul di lebih dari satu kategori (mis. Supabase di Web & Mobile)
  id?: string;
}

export default function TechCard({
  name,
  icon,
  color,
  hoveredTech,
  setHoveredTech,
  className = "w-20",
  id,
}: TechCardProps) {
  const Icon = getIcon(icon);
  const hid = id ?? name;

  return (
    <div
      className={`h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2 cursor-pointer ${className}`}
      onMouseEnter={() => setHoveredTech(hid)}
      onMouseLeave={() => setHoveredTech(null)}
    >
      <Icon
        className="lg:h-10 lg:w-10 h-8 w-8 transition-colors duration-200"
        style={{ color: hoveredTech === hid ? color : "#2D2D2D" }}
      />
      <div className="text-[#828282] text-[8px] lg:text-base">{name}</div>
    </div>
  );
}
