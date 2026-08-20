import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClickHint, Reveal, SplitFlap } from "../lib/fx";

/* Shape your engagement — the site produces the artifact you'd actually receive:
   a recommended path and your own week-01 scoreboard, assembled live. */

const STAGES = [
  { id: "idea", label: "An idea and a market I know" },
  { id: "deck", label: "Funding and a deck" },
  { id: "proto", label: "A prototype that needs to become real" },
  { id: "live", label: "A live product that needs a team" },
] as const;

const BUDGETS = [
  { id: "b1", label: "$48k — discovery only" },
  { id: "b2", label: "$150k–$450k" },
  { id: "b3", label: "$450k+" },
  { id: "b4", label: "Honestly not sure yet" },
] as const;

type StageId = (typeof STAGES)[number]["id"];
type BudgetId = (typeof BUDGETS)[number]["id"];

function plan(stage: StageId, budget: BudgetId) {
  const discovery = { name: "Discovery sprint", weeks: 6, note: "fixed $48,000" };
  const build = (w: number) => ({ name: "The build", weeks: w, note: `senior team of 3–4 · scoreboard every Friday` });
  const retainer = { name: "After launch", weeks: 0, note: "retainer from $9k/mo — or a paired handoff" };

  switch (stage) {
    case "idea":
      return { steps: [discovery], say: "Start with discovery alone. If the wedge is real, the build plan comes out of it with a price on it — if it isn’t, we’ll be the first to say stop." };
    case "deck":
      return { steps: [discovery, build(budget === "b3" ? 14 : 12), retainer], say: "Discovery kills the weak half of the deck, then a focused build ships the sharp half. Bramble ran exactly this path: deck to both app stores in 19 weeks." };
    case "proto":
      return { steps: [discovery, build(budget === "b3" ? 16 : 10), retainer], say: "Discovery here is short and surgical — we test what the prototype already proves, then rebuild for production the way Harbor & Line’s Quayside was." };
    case "live":
      return { steps: [build(budget === "b1" ? 8 : 12), retainer], say: "No discovery theater — we embed with what exists. If your endgame is your own team owning it, we’ll run the Ledgerline play: build alongside them, then hand over the keys." };
  }
}

function firstScoreboard(project: string, stage: StageId) {
  const name = project.trim() || "Your project";
  const shipped: Record<StageId, string[]> = {
    idea: ["The one metric that defines success, agreed in writing.", "Market map drafted — three wedge candidates, one favorite.", "Interview slate booked: eight buyers, week two."],
    deck: ["Repo, CI, staging and production accounts — in your name.", "The deck’s riskiest claim named; prototype scoped to test it.", "Walking skeleton deployed to production."],
    proto: ["Prototype audit complete: what it proves, what it only suggests.", "Production architecture drafted around the proven core.", "Walking skeleton deployed to production."],
    live: ["Access, instrumentation and on-call inherited — nothing broke.", "The one metric that decides this engagement, agreed in writing.", "First fix shipped to production. Small on purpose."],
  };
  return { name, shipped: shipped[stage] };
}

export function Configurator() {
  const reduced = useReducedMotion();
  const [project, setProject] = useState("");
  const [stage, setStage] = useState<StageId | null>(null);
  const [budget, setBudget] = useState<BudgetId | null>(null);

  const ready = stage !== null && budget !== null;
  const p = useMemo(() => (ready ? plan(stage!, budget!) : null), [ready, stage, budget]);
  const sb = useMemo(() => (ready ? firstScoreboard(project, stage!) : null), [ready, project, stage]);
  const totalWeeks = p ? p.steps.reduce((s, x) => s + x.weeks, 0) : 0;

  return (
    <section id="configurator" aria-labelledby="conf-title" className="mt-24 border-t border-edge-soft bg-pit/40 py-24 sm:mt-28 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-cobalt-hot">Interactive</p>
          <h2 id="conf-title" className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,3.9rem)] leading-[1.05]">
            Shape your engagement.<br />
            <em className="italic text-cobalt-hot">Get your first scoreboard.</em>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute">
            Answer two questions and the studio board does what it always does — turns
            ambition into a plan with dates and a price. No email required to see it.
          </p>
        </Reveal>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[5fr_7fr]">
          {/* inputs */}
          <Reveal>
            <div className="relative rounded-2xl border border-edge-soft bg-pit/80 p-6 sm:p-7">
              <ClickHint fx={0.5} fy={0.42} />
              <label className="block text-sm font-medium text-mute">
                What are you building? <span className="text-dim">(optional)</span>
                <input
                  value={project}
                  onChange={(e) => setProject(e.target.value.slice(0, 32))}
                  placeholder="e.g. Brightpath"
                  className="mt-2 w-full rounded-lg border border-edge-soft bg-ink px-3.5 py-2.5 text-sm text-bone placeholder-dim outline-none transition-colors focus:border-cobalt"
                />
              </label>

              <fieldset className="mt-6">
                <legend className="text-sm font-medium text-mute">Where are you today?</legend>
                <div className="mt-2.5 grid gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStage(s.id)}
                      aria-pressed={stage === s.id}
                      className={
                        "rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors " +
                        (stage === s.id
                          ? "border-cobalt bg-cobalt-deep/25 text-bone"
                          : "border-edge-soft text-mute hover:border-edge hover:text-bone")
                      }
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-6">
                <legend className="text-sm font-medium text-mute">Budget you’re working with</legend>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBudget(b.id)}
                      aria-pressed={budget === b.id}
                      className={
                        "rounded-full border px-3.5 py-2 text-xs font-medium transition-colors " +
                        (budget === b.id
                          ? "border-cobalt bg-cobalt-deep/25 text-bone"
                          : "border-edge-soft text-mute hover:border-edge hover:text-bone")
                      }
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </Reveal>

          {/* output */}
          <div aria-live="polite" className="min-w-0">
            <AnimatePresence mode="wait">
              {!ready ? (
                <motion.div
                  key="empty"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[22rem] items-center justify-center rounded-2xl border border-dashed border-edge-soft p-10 text-center"
                >
                  <p className="max-w-xs text-sm leading-relaxed text-dim">
                    The plan and your week-01 scoreboard assemble here — pick a stage and a
                    budget on the left.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={stage! + budget! + (project || "_")}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* recommended path */}
                  <div className="relative rounded-2xl border border-edge-soft bg-pit/80 p-6 sm:p-7">
              <ClickHint fx={0.5} fy={0.42} />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-serif text-2xl">The recommended path</h3>
                      {totalWeeks > 0 && (
                        <p className="font-mono text-xs text-cobalt-hot">
                          <SplitFlap text={`~${totalWeeks} WEEKS TO LAUNCH`} tick={40} />
                        </p>
                      )}
                    </div>
                    <ol className="mt-5 flex flex-wrap gap-2.5">
                      {p!.steps.map((s, i) => (
                        <motion.li
                          key={s.name}
                          initial={reduced ? false : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduced ? 0 : 0.12 * i, duration: 0.3 }}
                          className="flex items-center gap-2.5"
                        >
                          <span className="rounded-lg border border-edge-soft bg-ink px-3.5 py-2.5">
                            <span className="block text-sm font-semibold">{s.name}</span>
                            <span className="block text-[11px] text-dim">
                              {s.weeks > 0 ? `${s.weeks} weeks · ` : ""}{s.note}
                            </span>
                          </span>
                          {i < p!.steps.length - 1 && <span aria-hidden="true" className="text-dim">→</span>}
                        </motion.li>
                      ))}
                    </ol>
                    <p className="mt-4 text-sm leading-relaxed text-mute">{p!.say}</p>
                  </div>

                  {/* the personalized week-01 scoreboard */}
                  <div className="paper-doc mt-6 rounded-md p-6 shadow-2xl shadow-black/50 sm:p-8">
                    <header className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-paper-ink pb-4">
                      <div>
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-cobalt-deep">Scoreboard · preview</p>
                        <h4 className="mt-1 font-serif text-xl leading-tight">
                          <SplitFlap text={(sb!.name + " — week one").toUpperCase()} tick={38} className="text-[15px] tracking-wide" />
                        </h4>
                      </div>
                      <p className="text-right font-mono text-[11px] leading-relaxed text-paper-ink/60">
                        Week 01 / {totalWeeks || "—"}<br />your first Friday
                      </p>
                    </header>
                    <div className="py-4">
                      <h5 className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-paper-ink/55">
                        Shipped this week — the plan
                      </h5>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5">
                        {sb!.shipped.map((it, i) => (
                          <motion.li
                            key={it}
                            initial={reduced ? false : { opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: reduced ? 0 : 0.15 + i * 0.1 }}
                            className="text-[13px] leading-relaxed text-paper-ink/80"
                          >
                            {it}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-paper-ink/10 pt-4">
                      <p className="font-serif text-sm italic text-paper-ink/80">— the real one arrives every Friday by 4 p.m.</p>
                      <a
                        href="#start"
                        className="rounded-lg bg-paper-ink px-4 py-2 text-xs font-semibold text-paper transition-transform hover:scale-[1.03]"
                      >
                        Make it real →
                      </a>
                    </footer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
