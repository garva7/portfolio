import Reveal from "./Reveal";
import { stackGroups } from "../content";

export default function Stack() {
  return (
    <section id="stack" className="mx-auto w-full max-w-[1200px] px-6 py-28">
      <Reveal>
        <h2 className="font-display text-balance text-4xl font-medium tracking-tight md:text-6xl">
          Tools I reach for
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {stackGroups.map((g, i) => (
          <Reveal key={g.label} delay={(i % 3) * 0.07}>
            <div className="border-t border-line-strong pt-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                {g.label}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {g.items.map((item) => (
                  <li key={item} className="text-lg text-fg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
