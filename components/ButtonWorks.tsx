interface ButtonWorksProps {
  label: string;
  value: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ButtonWorks({
  label,
  value,
  activeTab,
  setActiveTab,
}: ButtonWorksProps) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`italic text-left transition-all duration-300 ${
        activeTab === value
          ? "font-bold text-a-2"
          : "text-black dark:text-white opacity-60 hover:opacity-100 hover:translate-x-1"
      }`}
    >
      {label}
    </button>
  );
}