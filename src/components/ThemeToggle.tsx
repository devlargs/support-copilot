import { useTheme } from "../hooks/useTheme";
import { MoonIcon, SunIcon } from "./icons";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <SunIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
}
