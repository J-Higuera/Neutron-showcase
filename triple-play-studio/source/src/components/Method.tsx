import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../lib/fx";
import { sampleScoreboard as sb, scoreboardAlways, shapes, weekOne } from "../data/fiction";

export function Method() {
  return (
    <section id="method" aria-labelledby="method-title" className="mt-24 border-t border-edge-soft py-24 sm:mt-28 sm:py-28">
      <div className="mx-auto max-w-[110rem] px-5 sm:px-8">
        <Reveal>
          <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-cobalt-hot">How it works</p>
          <h2 id="method-title" className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,3.9rem)] leading-[1.05]">
            Three shapes of engagement.<br />
            <em className="italic text-cobalt-hot">Priced out loud.</em>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute">
            You should not need a sales call to learn what working with us costs or feels like.
            Here is the whole shape of it.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {shapes.map((s, i) => (
            <Reveal key={s.index} delay={i * 0.08}>
              <article className="group flex h-full flex-col rounded-2xl border border-edge-soft bg-pit/70 p-7 transition-colors hover:border-edge">
                <p className="font-mono text-xs text-cobalt-hot">{s.index}</p>
                <h3 className="mt-4 font-serif text-3xl">{s.title}</h3>
                <p className="mt-1.5 text-sm text-dim">
                  {s.terms[0]}
                  <strong className="font-semibold text-bone">{s.terms[1]}</strong>
                  {s.terms[2]}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-mute">{s.body}</p>
                <p className="mb-4 mt-4 text-sm leading-relaxed text-mute">
                  <strong className="font-semibold text-cobalt-hot">You talk to: </strong>
                  {s.who}
                </p>
                <p className="mt-auto border-t border-edge-soft pt-4 text-[13px] leading-relaxed text-dim">{s.fine}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <div className="rounded-2xl border border-edge-soft bg-pit/70 p-7 sm:p-10">
            <h3 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)]">Week one, day by day</h3>
            <ol className="mt-6">
              {weekOne.map(([day, what]) => (
                <li key={day} className="grid grid-cols-[5.5rem_1fr] gap-4 border-t border-edge-soft py-3.5 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cobalt-hot">{day}</span>
                  <span className="text-sm leading-relaxed text-mute">{what}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* the Friday scoreboard — the artifact clients receive, on paper.
            items-CENTER, not start: the paper runs taller than the intro
            column, and centering the pair reads composed instead of the
            doc overshooting (owner call, 2026-08-22) */}
        <div className="mt-20 grid items-start gap-12 lg:grid-cols-[5fr_7fr] lg:items-center">
          <Reveal>
            <h3 className="font-serif text-[clamp(1.8rem,3vw,2.4rem)]">The Friday scoreboard</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-mute">
              {sb.intro} The rule behind it: <em className="italic text-bone">{sb.rule}</em>
            </p>
            <ul className="mt-6 border-t border-edge-soft">
              {scoreboardAlways.map((a) => (
                <li key={a} className="relative border-b border-edge-soft py-3 pl-6 text-sm leading-relaxed text-mute">
                  <span aria-hidden="true" className="absolute left-0.5 top-[1.15rem] h-1.5 w-1.5 rounded-full bg-cobalt" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <ScoreboardDoc />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ScoreboardDoc() {
  const reduced = useReducedMotion();
  return (
    <article aria-label="A sample weekly scoreboard document" className="paper-doc rounded-md p-5 shadow-2xl shadow-black/50 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-paper-ink pb-3.5">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-cobalt-deep">Scoreboard</p>
          <h4 className="mt-1.5 font-serif text-2xl leading-tight">{sb.client}</h4>
        </div>
        <p className="text-right font-mono text-xs leading-relaxed text-paper-ink/60">
          {sb.week}<br />{sb.stamp}
        </p>
      </header>

      <SbSection title="Shipped this week" items={sb.shipped} />
      <SbSection title="Slipped" items={sb.slipped} accent="warn" />
      <SbSection title="Decision we need from you" items={sb.decide} accent="cobalt" />

      <div className="border-t border-paper-ink/10 py-3">
        <h5 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-paper-ink/55">Budget</h5>
        <div
          role="img"
          aria-label={`Budget used: ${sb.budget.spent} of ${sb.budget.of}, ${sb.budget.pct} percent, ${sb.budget.note}`}
          className="mt-3"
        >
          <div className="h-2 overflow-hidden rounded-full bg-paper-ink/10">
            <motion.div
              className="h-full rounded-full bg-cobalt-deep"
              initial={reduced ? { width: `${sb.budget.pct}%` } : { width: 0 }}
              whileInView={{ width: `${sb.budget.pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-paper-ink/60">
            <span><strong className="font-semibold text-paper-ink">{sb.budget.spent}</strong> of {sb.budget.of} · {sb.budget.pct}%</span>
            <span>{sb.budget.note}</span>
          </div>
        </div>
      </div>

      <footer className="mt-2 border-t border-paper-ink/10 pt-3 font-serif text-base italic">
        {sb.signed}
      </footer>
    </article>
  );
}

function SbSection({ title, items, accent }: { title: string; items: readonly string[]; accent?: "warn" | "cobalt" }) {
  const border =
    accent === "warn"
      ? "border-l-[3px] border-l-[oklch(62%_0.13_75)] pl-4"
      : accent === "cobalt"
        ? "border-l-[3px] border-l-cobalt-deep pl-4"
        : "";
  const titleColor =
    accent === "warn" ? "text-[oklch(50%_0.12_70)]" : accent === "cobalt" ? "text-cobalt-deep" : "text-paper-ink/55";
  return (
    <div className={"border-t border-paper-ink/10 py-2.5 first-of-type:border-t-0 " + border}>
      <h5 className={"font-mono text-[10px] font-semibold uppercase tracking-[0.14em] " + titleColor}>{title}</h5>
      <ul className="mt-2 list-disc space-y-1.5 pl-5">
        {items.map((it) => (
          <li key={it} className="text-[13px] leading-relaxed text-paper-ink/80">{it}</li>
        ))}
      </ul>
    </div>
  );
}
