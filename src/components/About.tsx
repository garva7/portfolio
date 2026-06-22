import Reveal from "./Reveal";
import { GraduationCap } from "@phosphor-icons/react";
import { education } from "../content";

export default function About() {
  return (
    <section id="about" className="mx-auto w-full max-w-[1200px] px-6 py-28">
      <Reveal>
        <h2 className="font-display max-w-[18ch] text-balance text-4xl font-medium leading-tight tracking-tight md:text-6xl">
          A builder who ships, <span className="chroma-text">not a list of tutorials.</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
        <Reveal delay={0.05}>
          <p className="max-w-[60ch] text-xl leading-relaxed text-fg-dim">
            I work end to end: from LLM integration and API design down to the
            frontend and deployment. The work I care about is the kind that
            measurably moves, like cutting Moodify's response time by 83%, not
            demos that never leave a laptop.
          </p>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-faint">
            Alongside product work, I take on freelance builds for small premium
            service businesses and ship them live.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="glass chroma-edge rounded-[var(--radius-glass)] p-7">
            <div className="flex items-center gap-3 text-fg">
              <GraduationCap size={22} weight="duotone" className="text-accent" />
              <span className="text-sm font-medium uppercase tracking-[0.18em] text-fg-dim">
                Education
              </span>
            </div>
            <div className="mt-5">
              <div className="text-lg font-medium">{education.degree}</div>
              <div className="text-fg-dim">{education.school}</div>
              <div className="mt-1 font-mono text-sm text-fg-faint">
                {education.year}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {education.coursework.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line px-3 py-1 text-xs text-fg-dim"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
