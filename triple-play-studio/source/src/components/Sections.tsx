import { Reveal } from "../lib/fx";
import { beliefs, faq, team } from "../data/fiction";

/* ---------- team ---------- */

export function Team() {
  return (
    <section id="team" aria-labelledby="team-title" className="mt-24 border-t border-edge-soft py-24 sm:mt-28 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-cobalt-hot">The team</p>
          <h2 id="team-title" className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,3.9rem)] leading-[1.05]">
            Seven people. <em className="italic text-cobalt-hot">No bench, no subcontractors.</em>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute">
            When you hire Triple Play, these are the humans who show up. Each card says what
            they’re doing this week — because if we’ll publish our slate, we’ll publish our
            calendars.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((p, i) => (
            <Reveal key={p.name} delay={(i % 4) * 0.06}>
              <li className="group h-full list-none rounded-2xl border border-edge-soft bg-pit/70 p-6 transition-all hover:-translate-y-1 hover:border-edge">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    background: `oklch(32% 0.07 ${p.hue})`,
                    color: `oklch(85% 0.08 ${p.hue})`,
                  }}
                >
                  {p.initials}
                </span>
                <h3 className="mt-4 font-serif text-xl">{p.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-cobalt-hot">{p.role}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-mute">{p.bio}</p>
                <p className="mt-4 border-t border-edge-soft pt-3 font-mono text-[10.5px] leading-relaxed text-dim">{p.now}</p>
              </li>
            </Reveal>
          ))}
          <Reveal delay={0.18}>
            <li className="h-full list-none rounded-2xl border border-dashed border-edge-soft p-6">
              <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-edge font-serif text-lg text-dim">
                8
              </span>
              <h3 className="mt-4 font-serif text-xl">An eighth chair</h3>
              <p className="mt-0.5 text-xs font-medium text-cobalt-hot">Senior only · someday</p>
              <p className="mt-3 text-[13px] leading-relaxed text-mute">
                We add at most one person a year, and some years we don’t. If you’ve shipped
                things you’re proud of and you like keeping score, introduce yourself anyway.
              </p>
              <p className="mt-4 border-t border-edge-soft pt-3 font-mono text-[10.5px]">
                <a href="mailto:hello@tripleplay.studio" className="text-cobalt-hot hover:underline">hello@tripleplay.studio</a>
              </p>
            </li>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}

/* ---------- beliefs ---------- */

export function Beliefs() {
  return (
    <section id="beliefs" aria-labelledby="beliefs-title" className="mt-24 border-y border-edge-soft bg-pit/60 py-24 sm:mt-28 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-cobalt-hot">What we believe</p>
          <h2 id="beliefs-title" className="font-serif text-[clamp(2.4rem,5vw,3.9rem)] leading-[1.05]">
            Three convictions, <em className="italic text-cobalt-hot">held expensively.</em>
          </h2>
        </Reveal>
        <div className="mt-10">
          {beliefs.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06}>
              <article className="grid gap-3 border-t border-edge-soft py-9 first-of-type:border-t-0 lg:grid-cols-[5fr_7fr] lg:gap-12">
                <h3 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">{b.title}</h3>
                <p className="max-w-2xl text-base leading-relaxed text-mute">{b.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- faq (open grid — nothing collapsed, nothing to operate) ---------- */

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-cobalt-hot">Founder questions</p>
          <h2 id="faq-title" className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,3.9rem)] leading-[1.05]">
            Asked by people <em className="italic text-cobalt-hot">betting a company on the answer.</em>
          </h2>
        </Reveal>
        <dl className="mt-14 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {faq.map(([q, a], i) => (
            <Reveal key={q} delay={(i % 2) * 0.06}>
              <div className="border-t border-edge-soft pt-5">
                <dt className="font-serif text-[1.35rem] leading-snug">{q}</dt>
                <dd className="mt-2.5 text-sm leading-relaxed text-mute">{a}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
