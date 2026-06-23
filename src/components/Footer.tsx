import { ArrowUp } from "@phosphor-icons/react";
import { profile } from "../content";

const socials = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];

export default function Footer() {
  const year = 2026;
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

        <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
          <p className="font-mono text-xs text-fg-faint">
            &copy; {year} {profile.name}
            <span className="ml-3 text-line-strong">·</span>
            <span className="ml-3">Updated June 2026</span>
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
      </div>
    </footer>
  );
}
