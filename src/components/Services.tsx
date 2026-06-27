import Reveal from "./Reveal";
import { ArrowUpRight, Check } from "@phosphor-icons/react";
import { freelance, gmailCompose } from "../content";
import { useMagnetic } from "../hooks/useMagnetic";

export default function Services() {
  const enquire = useMagnetic<HTMLAnchorElement>(0.4);

  return (
    <section id="services" className="mx-auto w-full max-w-[1200px] px-6 py-28">
      <Reveal>
        {/* Outer shell of the double-bezel card */}
        <div className="rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/5">
          <div className="glass chroma-edge relative overflow-hidden rounded-[calc(2rem-0.375rem)]">
            {/* ambient gradient mesh — a designed cool-steel wash instead of a
                stock photo, tuned to sit under the glass in both themes */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(48rem 34rem at 108% -20%, rgba(170,198,214,0.14), transparent 58%)," +
                  "radial-gradient(42rem 36rem at -12% 120%, rgba(111,138,153,0.12), transparent 60%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(170,198,214,0.4), transparent 70%)",
              }}
            />

            <div className="relative grid grid-cols-1 gap-10 px-7 py-14 md:grid-cols-[1.3fr_1fr] md:items-center md:px-14 md:py-20">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent">
                  {freelance.eyebrow}
                </p>
                <h2 className="font-display mt-5 max-w-[18ch] text-balance text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
                  {freelance.headline}
                </h2>
                <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-fg/75">
                  {freelance.blurb}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    ref={enquire}
                    href={gmailCompose(
                      freelance.enquirySubject,
                      freelance.enquiryBody
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-fg py-3.5 pl-6 pr-3.5 text-sm font-medium text-ink transition-transform active:scale-[0.97]"
                  >
                    {freelance.cta}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight size={15} weight="bold" />
                    </span>
                  </a>
                  <span className="font-mono text-xs text-fg-faint">
                    I reply to every enquiry
                  </span>
                </div>
              </div>

              {/* offer list */}
              <div className="md:border-l md:border-line md:pl-10">
                <ul className="flex flex-col gap-4">
                  {freelance.offers.map((o) => (
                    <li key={o} className="flex items-start gap-3 text-fg">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Check size={12} weight="bold" />
                      </span>
                      <span className="text-[15px] leading-snug">{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
