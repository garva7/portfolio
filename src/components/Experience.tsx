import Reveal from "./Reveal";
import { experience } from "../content";

export default function Experience() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-32 md:py-40">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Experience
        </span>
        <h2 className="font-display mt-5 text-balance text-4xl font-medium tracking-tight md:text-6xl">
          Where I've worked
        </h2>
      </Reveal>

      <div className="mt-20 flex flex-col gap-px overflow-hidden rounded-[var(--radius-glass)] border border-line">
        {experience.map((e, i) => (
          <Reveal key={e.org} delay={i * 0.08}>
            <div className="grid grid-cols-1 gap-6 bg-white/[0.015] px-6 py-12 transition-colors hover:bg-white/[0.03] md:grid-cols-[1fr_1.1fr] md:gap-12 md:px-10 md:py-14">
              <div className="flex items-start gap-4">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br from-accent-bright to-accent-deep" />
                <div>
                  <div className="text-xl font-medium md:text-2xl">{e.role}</div>
                  <div className="mt-1 text-accent">{e.org}</div>
                </div>
              </div>
              <p className="max-w-[52ch] text-lg leading-relaxed text-fg-dim md:pt-1">
                {e.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
