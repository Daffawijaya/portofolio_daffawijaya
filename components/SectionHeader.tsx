interface SectionHeaderProps {
  subtitle: string;
  title: string;
  description: string;
}

export default function SectionHeader({
  subtitle,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col lg:w-[40%]">
      <p className="text-black dark:text-white text-lg lg:text-xl">
        {subtitle}
      </p>

      <h1 className="text-a-2 text-4xl lg:text-6xl font-bold capitalize lg:pb-6 pb-3">
        {title}
      </h1>

      <p className="text-black dark:text-white lg:text-xl text-sm max-w-xl">
        {description}
      </p>
    </div>
  );
}