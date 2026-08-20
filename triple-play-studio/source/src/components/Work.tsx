import type { ReactNode } from "react";
import { Reveal } from "../lib/fx";
import { cases } from "../data/fiction";
import { QuaysideDemo } from "./demos/Quayside";
import { BrambleDemo } from "./demos/Bramble";
import { LedgerlineDemo } from "./demos/Ledgerline";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="pt-24 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-cobalt-hot">The work</p>
          <h2 id="work-title" className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,3.9rem)] leading-[1.05]">
            Three products. Three different bets.<br />
            <em className="italic text-cobalt-hot">Don’t read them — use them.</em>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute">
            Every interface below is the product we shipped, rebuilt here as a working demo.
            Price a shipment. Tend a garden. Approve a payment run. This is the portfolio.
          </p>
        </Reveal>
      </div>

      <Case
        id="case-harbor"
        tint="oklch(45% 0.09 238 / 0.12)"
        data={cases.harbor}
        demo={<QuaysideDemo />}
        wide
      />
      <Case
        id="case-bramble"
        tint="oklch(45% 0.1 152 / 0.1)"
        data={cases.bramble}
        demo={<BrambleDemo />}
        flip
      />
      <Case
        id="case-ledger"
        tint="oklch(50% 0.1 55 / 0.1)"
        data={cases.ledger}
        demo={<LedgerlineDemo />}
        wide
      />
    </section>
  );
}

type CaseData = (typeof cases)[keyof typeof cases];

function Case({
  id,
  data,
  demo,
  tint,
  flip = false,
  wide = false,
}: {
  id: string;
  data: CaseData;
  demo: ReactNode;
  tint: string;
  flip?: boolean;
  wide?: boolean;
}) {
  return (
    <article
      id={id}
      aria-label={data.name}
      className="mt-16 border-t border-edge-soft py-16 sm:mt-20 sm:py-20"
      style={{ background: `linear-gradient(180deg, ${tint}, transparent 60%)` }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <div>
              <h3 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-none">{data.name}</h3>
              <p className="mt-2 text-sm font-medium text-mute">{data.sector}</p>
            </div>
            <dl className="flex gap-10 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">Engagement</dt>
                <dd className="mt-1 max-w-[16rem] text-mute">{data.engagement}</dd>
              </div>
              <div className="hidden sm:block">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">Shipped</dt>
                <dd className="mt-1 max-w-[16rem] text-mute">{data.shipped}</dd>
              </div>
            </dl>
          </header>
        </Reveal>

        <div
          className={
            "mt-10 grid items-center gap-10 lg:gap-14 " +
            (wide ? "lg:grid-cols-[2fr_3fr]" : "lg:grid-cols-[1fr_1.1fr]") +
            ""
          }
        >
          <Reveal className={flip ? "lg:order-2" : ""}>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-cobalt-hot">Arrived with</h4>
            <p className="mt-2 text-[15px] leading-relaxed text-mute">{data.arrived}</p>
            <h4 className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-cobalt-hot">What we did</h4>
            <p className="mt-2 text-[15px] leading-relaxed text-mute">{data.did}</p>
            <ul className="mt-7 grid grid-cols-3 gap-4 border-t border-edge-soft pt-5" aria-label={data.name + " outcomes"}>
              {data.stats.map((s) => (
                <li key={s.label}>
                  <p className="font-serif text-[clamp(1.4rem,2.2vw,1.9rem)] leading-tight">{s.n}</p>
                  <p className="mt-1 text-xs leading-snug text-dim">{s.label}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12} className={(flip ? "lg:order-1 " : "") + "min-w-0"}>
            {demo}
            <p className="mt-3 text-xs leading-relaxed text-dim">
              <span aria-hidden="true" className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-leaf align-middle" />
              Live demo — {data.caption}
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-12 max-w-3xl">
          <figure>
            <blockquote>
              <p className="font-serif text-[clamp(1.3rem,2.4vw,1.7rem)] italic leading-snug text-bone/90">
                “{data.quote}”
              </p>
            </blockquote>
            <figcaption className="mt-3 text-sm text-dim">
              <strong className="font-semibold text-bone">{data.attribution.split(" — ")[0]}</strong>
              {" — " + data.attribution.split(" — ")[1]}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </article>
  );
}
