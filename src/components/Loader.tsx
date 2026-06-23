import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "motion/react";

/* Minimal full-screen preloader.
   - A single chromatic monogram + a hairline progress track and a quiet
     percentage. Counts 0 -> 100 on a fixed timeline (never waits on the 3D
     canvas, so it can't hang), then wipes upward to uncover the page.
   - Reduced motion: jumps to 100 and unmounts almost immediately.
   - Locks body scroll while active and always restores it on cleanup. */

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

      tl.from(".loader-mark", {
        scale: 0.6,
        opacity: 0,
        rotate: -90,
        duration: 0.9,
        ease: "expo.out",
      });
      tl.to(
        num,
        {
          v: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => setCount(Math.round(num.v)),
        },
        0.1
      );
      tl.to(".loader-fade", { opacity: 0, duration: 0.4 }, "-=0.15");
      tl.to(".loader-mark", { scale: 0.9, opacity: 0, duration: 0.4 }, "<");
      tl.to(root.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.1");
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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-ink"
    >
      <span className="loader-mark chroma-text text-5xl leading-none will-change-transform">
        &#9672;
      </span>

      <div className="loader-fade flex w-44 flex-col items-center gap-3">
        <span className="relative h-px w-full overflow-hidden bg-line-strong">
          <span
            className="absolute inset-y-0 left-0 origin-left bg-gradient-to-r from-accent-deep via-accent to-accent-bright"
            style={{ transform: `scaleX(${count / 100})`, width: "100%" }}
          />
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.3em] tabular-nums text-fg-faint">
          {count}%
        </span>
      </div>
    </div>
  );
}
