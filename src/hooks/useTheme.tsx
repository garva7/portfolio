import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

/* Theme store. Default is dark; light is opt-in and persisted in localStorage.
   The class on <html> is applied pre-paint by the boot script in index.html
   (so there's no flash), and this provider initializes its state from whatever
   class is already there — keeping React and the DOM in agreement. */

type Theme = "dark" | "light";

type ThemeCtx = { theme: Theme; toggle: () => void };

const Ctx = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

function currentClassTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(currentClassTheme);

  const toggle = useCallback(() => {
    const next = currentClassTheme() === "dark" ? "light" : "dark";

    // The actual mutation: flip the class, persist, and update React state.
    const apply = () => {
      document.documentElement.classList.toggle("light", next === "light");
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* private mode / storage disabled — non-fatal */
      }
      setTheme(next);
    };

    const reduce =
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Preferred path: the View Transitions API snapshots the whole rendered
    // page — colors AND the WebGL galaxy canvas — and cross-fades old -> new,
    // so the hero graphic morphs smoothly instead of snapping. flushSync makes
    // React commit the new theme synchronously inside the captured callback.
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    };
    if (!reduce && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => flushSync(apply));
      return;
    }

    // Fallback (Firefox/Safari, or reduced motion): briefly enable a CSS color
    // transition so at least the palette eases. Skipped under reduced motion.
    if (!reduce) {
      const root = document.documentElement;
      root.classList.add("theme-anim");
      window.setTimeout(() => root.classList.remove("theme-anim"), 380);
    }
    apply();
  }, []);

  // Keep the meta theme-color in sync with the active surface.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#fbfbfd" : "#08080b");
  }, [theme]);

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  return useContext(Ctx);
}
