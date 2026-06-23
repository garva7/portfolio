import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight, Circle } from "@phosphor-icons/react";
import Reveal from "./Reveal";
import { projects, type Project } from "../content";

gsap.registerPlugin(ScrollTrigger);

const TOTAL = String(projects.length).padStart(2, "0");

function ProjectPanel({
  p,
  index,
  stacked,
}: {
  p: Project;
  index: number;
  stacked?: boolean;
}) {
  return (
    <article
      className={`group glass relative flex shrink-0 flex-col overflow-hidden rounded-[var(--radius-glass)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 ${
        stacked ? "h-auto w-full" : "h-full w-[86vw] md:w-[60vw] lg:w-[46vw]"
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden ${
          stacked ? "h-48 sm:h-56" : "h-[44%]"
        }`}
        style={p.imageFit === "contain" ? { background: p.imageBg } : undefined}
      >
        <img
          src={p.image}
          alt={`${p.name} — ${p.tag}`}
          loading="lazy"
          className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05] ${
            p.imageFit === "contain"
              ? "object-contain p-6 sm:p-7"
              : "object-cover opacity-80"
          }`}
        />
        {p.imageFit === "cover" && (
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        )}
        {/* Badges sit in dark pills so they stay legible over any tile (a light
            logo tile or a dark banner). */}
        <span className="absolute left-5 top-5 rounded-full bg-ink/55 px-3 py-1 font-mono text-xs tracking-[0.28em] text-fg backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
          <span className="text-fg/55"> / {TOTAL}</span>
        </span>
        <span className="absolute right-5 top-5 rounded-full bg-ink/55 px-3 py-1 font-mono text-[11px] text-fg backdrop-blur-sm">
          {p.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7 md:p-9">
        <h3 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
          {p.name}
        </h3>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-fg-dim">
          {p.blurb}
        </p>

        {p.metric && (
          <div className="mt-6 flex items-baseline gap-3">
            <span className="chroma-text font-mono text-3xl font-medium">
              {p.metric.value}
            </span>
            <span className="text-sm text-fg-dim">{p.metric.label}</span>
          </div>
        )}

        <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {p.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-fg-dim">
              <Circle
                size={6}
                weight="fill"
                className="mt-1.5 shrink-0 text-accent"
              />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-8">
          {p.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg-dim"
            >
              {s}
            </span>
          ))}
        </div>

        {p.live && (
          <a
            href={p.live}
            target="_blank"
            rel="noreferrer"
            className="group/cta mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white/5 py-2.5 pl-5 pr-2.5 text-sm font-medium text-fg ring-1 ring-line transition-colors hover:bg-white/10"
          >
            Visit live site
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5">
              <ArrowUpRight size={14} weight="bold" />
            </span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Init synchronously so phones render the vertical stack on the first paint
  // and never instantiate the desktop ScrollTrigger pin.
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
  );

  // Phones get a vertical stack; the pinned horizontal scroll hijacks touch.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const stacked = reduce || isMobile;

  useEffect(() => {
    if (stacked || !wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      const getDistance = () =>
        track.current!.scrollWidth - window.innerWidth + 48;
      gsap.to(track.current, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, [stacked]);

  const Header = (
    <div className="flex shrink-0 flex-col justify-center md:w-[32vw] md:pr-12">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
        Selected work
      </span>
      <h2 className="font-display mt-5 text-balance text-4xl font-medium tracking-tight md:text-6xl">
        Products I built, end to end.
      </h2>
      <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-fg-dim">
        An AI music recommender and a real-time API health dashboard, each shipped
        from idea to live.
      </p>
      {!stacked && (
        <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
          <span className="h-px w-8 bg-line-strong" />
          Scroll to explore
        </span>
      )}
    </div>
  );

  // Phones + reduced motion: clean vertical stack, no pin.
  if (stacked) {
    return (
      <section id="work" className="mx-auto w-full max-w-[1200px] px-6 py-24 md:py-28">
        <div className="mb-12 md:mb-14">
          <Reveal>{Header}</Reveal>
        </div>
        <div className="flex flex-col gap-8">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProjectPanel p={p} index={i} stacked />
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="work" ref={wrap} className="relative overflow-hidden">
      <div ref={track} className="flex h-[100dvh] items-center gap-7 px-6">
        {Header}
        {projects.map((p, i) => (
          <div key={p.id} className="h-[80vh] py-2">
            <ProjectPanel p={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
