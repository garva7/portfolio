import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, DownloadSimple } from "@phosphor-icons/react";
import { profile } from "../content";
import { useMagnetic } from "../hooks/useMagnetic";
import { useTheme } from "../hooks/useTheme";

const ChromaticScene = lazy(() => import("./ChromaticScene"));

const NAME_WORDS = profile.name.split(" ");

export default function Hero() {
  const reduce = useReducedMotion();
  const { theme } = useTheme();
  const root = useRef<HTMLElement>(null);
  const magnet = useMagnetic<HTMLAnchorElement>(0.5);

  // Readability vignette: dark wash behind the light text in dark mode, light
  // wash behind the dark text in light mode. Same shape, inverted base color.
  const v = theme === "light" ? "251,251,253" : "8,8,11";

  // Defer the heavy WebGL galaxy until the browser is idle. The opaque loader
  // covers the hero for ~3.5s, so the scene is never visible during this gap —
  // but deferring its init keeps the main thread free during the open
  // animation, which is where the occasional jank came from. Nothing about the
  // final look or motion changes; the galaxy is ready well before the reveal.
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    const ric = window.requestIdleCallback;
    if (ric) {
      const id = ric(() => setShow3D(true), { timeout: 800 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setShow3D(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.set(".hero-word", { yPercent: 120 });
      gsap.set(".hero-rise", { autoAlpha: 0, y: 26 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
      tl.to(".hero-word", { yPercent: 0, duration: 1.15, stagger: 0.1 });
      tl.to(
        ".hero-rise",
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09 },
        "-=0.75"
      );
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      {/* 3D centerpiece: full-bleed particle field. Top/bottom edges feather into
          the background; a vignette keeps the text readable over it. */}
      <div aria-hidden className="absolute inset-0 z-0">
        {/* Light mode only: a soft cool disc anchors the dark particles so the
            galaxy reads as a designed element rather than dust on white. */}
        {theme === "light" && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(42rem 32rem at 72% 40%, rgba(58,102,120,0.16), rgba(58,102,120,0.05) 45%, transparent 70%)",
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 14%, #000 76%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 14%, #000 76%, transparent 100%)",
          }}
        >
          <Suspense fallback={null}>
            {show3D && <ChromaticScene theme={theme} />}
          </Suspense>
        </div>
        {/* readability vignette: dark behind the text (left) and below it (bottom) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              `linear-gradient(to right, rgba(${v},0.94), rgba(${v},0.5) 36%, transparent 66%),` +
              `linear-gradient(to top, rgba(${v},0.92), rgba(${v},0.35) 30%, transparent 56%)`,
          }}
        />
        {/* melt the bottom edge into the next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink" />
        {/* extra overall darken on phones so text stays legible over the field */}
        <div className="pointer-events-none absolute inset-0 bg-ink/45 md:bg-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        <div className="max-w-4xl">
          <p className="hero-rise font-mono text-xs uppercase tracking-[0.34em] text-accent">
            {profile.role}
          </p>

          <h1 className="font-display mt-6 text-[clamp(2.4rem,6.6vw,5rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
            {NAME_WORDS.map((word, i) => (
              <span key={word} className="block overflow-hidden pb-[0.06em]">
                <span
                  className={`hero-word inline-block will-change-transform ${
                    i === NAME_WORDS.length - 1 ? "chroma-text" : "text-fg"
                  }`}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-rise mt-8 max-w-[44ch] text-2xl font-medium leading-snug text-fg md:text-3xl">
            I build and ship AI and web products.
          </p>

          <p className="hero-rise mt-5 max-w-[50ch] text-lg leading-relaxed text-fg/75">
            CS student who ships production AI and web apps, and builds sites for
            small premium service businesses.
          </p>

          <div className="hero-rise mt-10 flex flex-wrap items-center gap-3">
            <a
              ref={magnet}
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-fg py-3.5 pl-6 pr-3.5 text-sm font-medium text-ink transition-transform active:scale-[0.97]"
            >
              View work
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
                <ArrowDownRight size={15} weight="bold" />
              </span>
            </a>
            <a
              href="#contact"
              className="chroma-edge inline-flex items-center gap-2 rounded-full bg-white/5 px-6 py-3.5 text-sm font-medium text-fg transition-colors hover:bg-white/10 active:scale-[0.97]"
            >
              Get in touch
              <ArrowUpRight size={15} weight="bold" />
            </a>
            <a
              href="/garv-arora-resume.pdf"
              download="Garv-Arora-Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-fg-dim transition-colors hover:text-fg active:scale-[0.97]"
            >
              Download CV
              <DownloadSimple size={15} weight="bold" />
            </a>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="hero-rise pointer-events-none absolute bottom-7 left-1/2 z-10 -translate-x-1/2 md:left-6 md:translate-x-0">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-faint">
          Scroll
        </span>
      </div>
    </section>
  );
}
