import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile } from "../content";
import { useMagnetic } from "../hooks/useMagnetic";

const links = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
];

export default function Navbar() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("#work");
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const cta = useMagnetic<HTMLAnchorElement>(0.35);

  // Scroll state + reading-progress bar (one passive listener, transform-only paint).
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScrolled(window.scrollY > 24);
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently crossing the upper third.
  useEffect(() => {
    const els = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* reading-progress hairline */}
      <div className="fixed inset-x-0 top-0 z-[70] h-px bg-transparent">
        <div
          className="h-full origin-left bg-gradient-to-r from-accent-deep via-accent to-accent-bright"
          style={{ transform: `scaleX(${progress})`, width: "100%" }}
        />
      </div>

      <motion.header
        initial={reduce ? false : { y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-[80] flex justify-center px-4 pt-5"
      >
        <nav
          className={`flex h-16 w-full max-w-[1180px] items-center justify-between rounded-full pl-6 pr-3 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            scrolled ? "glass" : "bg-white/[0.02] backdrop-blur-sm"
          }`}
        >
          <a
            href="#top"
            className="group flex items-center gap-2.5 text-[15px] font-medium"
          >
            <span className="chroma-text text-lg transition-transform duration-500 group-hover:rotate-90">
              &#9672;
            </span>
            <span className="font-display font-semibold tracking-tight">
              {profile.name}
            </span>
          </a>

          <div
            onMouseLeave={() => setHovered(null)}
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
          >
            {links.map((l, i) => {
              const lit = (hovered ?? active) === l.href;
              return (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setActive(l.href)}
                  onMouseEnter={() => setHovered(l.href)}
                  initial={reduce ? false : { opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.35 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative rounded-full px-5 py-2.5 text-[15px] transition-colors duration-300 ${
                    lit ? "text-fg" : "text-fg-dim hover:text-fg"
                  }`}
                >
                  {lit && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.09] ring-1 ring-white/10"
                    />
                  )}
                  {l.label}
                </motion.a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <a
              ref={cta}
              href="#contact"
              className="chroma-edge hidden rounded-full bg-white/5 px-5 py-2.5 text-[15px] font-medium text-fg transition-colors hover:bg-white/10 active:scale-[0.97] md:inline-flex"
            >
              Get in touch
            </a>

            {/* mobile hamburger -> X morph */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 md:hidden"
            >
              <span
                className={`absolute h-px w-5 bg-fg transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "rotate-45" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-px w-5 bg-fg transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  open ? "-rotate-45" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[75] flex flex-col justify-center px-8 md:hidden"
            style={{
              background: "rgba(8,8,11,0.82)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
            }}
          >
            <nav className="flex flex-col gap-2">
              {[...links, { label: "Get in touch", href: "#contact" }].map(
                (l, i) => (
                  <div key={l.href} className="overflow-hidden">
                    <motion.a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      initial={reduce ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      exit={reduce ? undefined : { y: "110%" }}
                      transition={{
                        duration: 0.6,
                        delay: 0.06 + i * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="font-display block py-2 text-4xl font-medium tracking-tight text-fg"
                    >
                      {l.label}
                    </motion.a>
                  </div>
                )
              )}
            </nav>
            <p className="mt-12 font-mono text-xs uppercase tracking-[0.3em] text-fg-faint">
              {profile.role}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
