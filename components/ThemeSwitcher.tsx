import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { HiMoon, HiSun } from "react-icons/hi";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  // next-themes: theme is undefined until mounted, render placeholder to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      className="hover:scale-105 duration-300 flex fixed z-50 right-6 bottom-6"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="flex space-x-2 flex-row items-center bg-black dark:bg-a-2 p-3 rounded-full">
        {/* first paint always shows sun (same as SSR), swap after mount to avoid hydration mismatch */}
        {!mounted || theme !== "light" ? (
          <HiSun className="duration-300 h-7 w-7 dark:text-white text-a-2" />
        ) : (
          <HiMoon className="h-7 w-7 dark:text-white text-a-2 duration-300" />
        )}
      </div>
    </button>
  );
}
