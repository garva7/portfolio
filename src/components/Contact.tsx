import Reveal from "./Reveal";
import { ArrowUpRight, EnvelopeSimple } from "@phosphor-icons/react";
import { profile, gmailCompose } from "../content";
import { useMagnetic } from "../hooks/useMagnetic";

export default function Contact() {
  const mail = useMagnetic<HTMLAnchorElement>(0.4);
  return (
    <section id="contact" className="mx-auto w-full max-w-[1200px] px-6 py-28">
      <Reveal>
        <div className="glass chroma-edge relative overflow-hidden rounded-[var(--radius-glass)] px-7 py-16 md:px-16 md:py-24">
          {/* internal chromatic glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(170,198,214,0.4), transparent 70%)",
            }}
          />
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-fg-faint">
            Open to freelance and internships
          </p>
          <h2 className="font-display mt-5 max-w-[16ch] text-balance text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl md:text-7xl">
            Let's build <span className="chroma-text">something good.</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-fg-dim">
            Have a product to ship or a site that needs to look the part? I
            reply to every message.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              ref={mail}
              href={gmailCompose("Hello Garv")}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-ink transition-transform active:scale-[0.97]"
            >
              <EnvelopeSimple size={17} weight="bold" />
              {profile.email}
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-3.5 text-sm font-medium text-fg transition-colors hover:border-line-strong hover:bg-white/5"
            >
              GitHub
              <ArrowUpRight size={15} weight="bold" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-3.5 text-sm font-medium text-fg transition-colors hover:border-line-strong hover:bg-white/5"
            >
              LinkedIn
              <ArrowUpRight size={15} weight="bold" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
