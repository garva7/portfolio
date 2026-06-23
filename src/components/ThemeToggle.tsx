import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "../hooks/useTheme";

/* Dark/light toggle. 44px hit area, announces state, and swaps the icon to the
   mode it will switch TO (sun when dark, moon when light). */

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`relative flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-fg-dim ring-1 ring-white/10 transition-colors hover:text-fg active:scale-[0.95] ${className}`}
    >
      {isDark ? (
        <Sun size={17} weight="bold" />
      ) : (
        <Moon size={17} weight="bold" />
      )}
    </button>
  );
}
