import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/* A small steel-tinted pixel astronaut that lives in the corner and reacts to
   scroll — idle float when still, a jetpack thrust + a lean in the scroll
   direction while moving. Tied to the hero's galaxy motif so it reads as art
   direction rather than a random mascot. Hidden on mobile; static under reduced
   motion (the global CSS reset neutralizes its keyframes, and we skip the
   scroll listener entirely). Colors come from CSS vars that flip per theme. */

// 14x16 pixel grid. H=helmet/ice, V=visor, G=glint, S=suit, D=boots/belt.
const SPRITE = [
  "....HHHHHH....",
  "...HHHHHHHH...",
  "..HHHHHHHHHH..",
  "..HHVVVVVVHH..",
  "..HHVGVVVVHH..",
  "..HHVVVVVVHH..",
  "...HHHHHHHH...",
  "....SSSSSS....",
  "..SSSSSSSSSS..",
  "..SSSSSSSSSS..",
  "...SSSSSSSS...",
  "...SSDDDDSS...",
  "...SSSSSSSS...",
  "....SS..SS....",
  "...DDD..DDD...",
  "..............",
];

const FILL: Record<string, string> = {
  H: "var(--buddy-light)",
  V: "var(--buddy-visor)",
  G: "var(--buddy-glint)",
  S: "var(--buddy-mid)",
  D: "var(--buddy-dark)",
};

const PIXELS = SPRITE.flatMap((row, y) =>
  [...row].flatMap((c, x) =>
    FILL[c] ? [<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={FILL[c]} />] : []
  )
);

export default function PixelBuddy() {
  const reduce = useReducedMotion();
  const [moving, setMoving] = useState(false);
  const [dir, setDir] = useState(1); // 1 = scrolling down, -1 = up
  const lastY = useRef(0);
  const raf = useRef(0);
  const stopTimer = useRef(0);

  useEffect(() => {
    if (reduce) return;
    lastY.current = window.scrollY;
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        const y = window.scrollY;
        const delta = y - lastY.current;
        lastY.current = y;
        if (Math.abs(delta) > 1) {
          setDir(delta > 0 ? 1 : -1);
          setMoving(true);
          window.clearTimeout(stopTimer.current);
          stopTimer.current = window.setTimeout(() => setMoving(false), 170);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
      window.clearTimeout(stopTimer.current);
    };
  }, [reduce]);

  return (
    <div
      aria-hidden
      data-dir={dir}
      className={`pixel-buddy pointer-events-none fixed bottom-5 right-5 z-40 hidden md:block ${
        moving ? "is-moving" : ""
      }`}
    >
      <div className="pixel-buddy-bob">
        <svg
          width="52"
          height="60"
          viewBox="0 0 14 16"
          shapeRendering="crispEdges"
          style={{ imageRendering: "pixelated" }}
        >
          <g className="pixel-buddy-flame">
            <rect x="6" y="14" width="1" height="1.7" fill="var(--buddy-flame)" />
            <rect x="7" y="14" width="1" height="2.1" fill="var(--buddy-flame)" />
          </g>
          {PIXELS}
        </svg>
      </div>
    </div>
  );
}
