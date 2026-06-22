import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "motion/react";
import { profile } from "../content";

/* Full-screen preloader.
   - Counts 0 -> 100 on a fixed timeline (never waits on the 3D canvas, so it
     can't hang), reveals the name with a masked rise, then wipes upward to
     uncover the page mounted behind it.
   - Reduced motion: jumps to 100 and unmounts almost immediately.
   - Locks body scroll while active and always restores it on cleanup. */

const NAME_WORDS = profile.name.split(" ");

export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (reduce) {
      setCount(100);
      const t = window.setTimeout(() => {
        document.body.style.overflow = "";
        onDone();
      }, 450);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = "";
      };
    }

    const ctx = gsap.context(() => {
      const num = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          document.body.style.overflow = "";
          onDone();
        },
      });

      tl.from(".loader-word", {
        yPercent: 115,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
      });
      tl.to(
        num,
        {
          v: 100,
          duration: 1.7,
          ease: "power2.inOut",
          onUpdate: () => setCount(Math.round(num.v)),
        },
        0
      );
      tl.to(".loader-meta", { opacity: 0, duration: 0.4 }, "-=0.2");
      tl.to(".loader-word", { yPercent: -115, duration: 0.7, stagger: 0.08 }, "-=0.15");
      tl.to(root.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.3");
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [reduce, onDone]);

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-8 md:px-12 md:py-12"
    >
      <div className="loader-meta flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.32em] text-fg-faint">
        <span>{profile.role}</span>
        <span className="hidden sm:inline">Portfolio &mdash; 2026</span>
      </div>

      <div className="flex flex-col">
        <h1 className="font-display text-[11vw] font-semibold leading-[0.95] tracking-[-0.02em] md:text-[7vw]">
          {NAME_WORDS.map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <span
                className={`loader-word inline-block will-change-transform ${
                  i === NAME_WORDS.length - 1 ? "chroma-text" : "text-fg"
                }`}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>
      </div>

      <div className="loader-meta flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <span className="font-mono text-sm uppercase tracking-[0.3em] text-fg-faint">
            Loading
          </span>
          <span className="font-mono text-5xl font-medium tabular-nums text-fg md:text-6xl">
            {count}
            <span className="text-fg-faint">%</span>
          </span>
        </div>
        <span className="relative h-px w-full overflow-hidden bg-line-strong">
          <span
            className="absolute inset-y-0 left-0 origin-left bg-gradient-to-r from-accent-deep via-accent to-accent-bright"
            style={{ transform: `scaleX(${count / 100})`, width: "100%" }}
          />
        </span>
      </div>
    </div>
  );
}
