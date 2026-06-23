import { useState, useEffect } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { profile } from "../content";

const socials = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];

const BASE_COUNT = 1024;

export default function Footer() {
  const year = 2026;
  const [visitorNum, setVisitorNum] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("visitor_num");
    if (stored) {
      setVisitorNum(parseInt(stored, 10));
    } else {
      const num = BASE_COUNT + Math.floor(Math.random() * 800) + 1;
      localStorage.setItem("visitor_num", String(num));
      setVisitorNum(num);
    }
  }, []);

  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <a href="#top" className="flex items-center gap-2 text-lg font-medium">
              <span className="chroma-text">◈</span>
              <span className="font-display">{profile.name}</span>
            </a>
            <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-fg-faint">
              {profile.role}. Building and shipping AI and web products.
            </p>
          </div>

          <nav className="flex flex-col gap-3 md:items-end">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group inline-flex items-center gap-2 py-1.5 text-sm text-fg-dim transition-colors hover:text-fg"
              >
                <span className="font-mono text-xs text-fg-faint">{s.label}</span>
                <span className="h-px w-6 bg-line-strong transition-all group-hover:w-10 group-hover:bg-accent" />
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-fg-faint">
              &copy; {year} {profile.name}
            </p>
            <a
              href="#top"
              className="group inline-flex items-center gap-1.5 font-mono text-xs text-fg-faint transition-colors hover:text-fg"
            >
              Back to top
              <ArrowUp
                size={13}
                weight="bold"
                className="transition-transform group-hover:-translate-y-0.5"
              />
            </a>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-fg-faint">Updated June 2026</p>
            {visitorNum !== null && (
              <p className="font-mono text-xs text-fg-faint">
                you are visitor{" "}
                <span className="text-accent">#{visitorNum.toLocaleString()}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
