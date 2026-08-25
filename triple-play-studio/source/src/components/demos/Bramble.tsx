import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClickHint } from "../../lib/fx";
import { formatTodayLabel } from "../../lib/date";

/* Bramble — the shipped app, operable. Check tasks off, switch tabs,
   dismiss the frost alert; the streak keeps honest count. */

type Task = { id: string; text: string; sub: string; done: boolean };

const INITIAL: Task[] = [
  { id: "ficus", text: "Water the ficus", sub: "every 6 days", done: true },
  { id: "tomato", text: "Feed the tomatoes", sub: "fish emulsion, diluted", done: false },
  { id: "basil", text: "Pinch the basil", sub: "it’s about to bolt", done: false },
];

export function BrambleDemo() {
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<"today" | "garden">("today");
  const [tasks, setTasks] = useState(INITIAL);
  const [alertOn, setAlertOn] = useState(true);
  const doneCount = tasks.filter((t) => t.done).length;
  const allDone = doneCount === tasks.length;
  const streak = 12 + (allDone ? 1 : 0);

  const toggle = (id: string) =>
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="relative mx-auto w-full max-w-[19rem]">
      <ClickHint targets={['button[data-hint="task"][aria-pressed="false"]']} />
      <div aria-hidden="true" className="absolute -inset-6 rounded-[3rem] bg-leaf/10 blur-2xl" />
      <div data-phone className="relative rounded-[2.4rem] border border-[oklch(60%_0.05_150/0.4)] bg-[oklch(97%_0.008_135)] p-2 shadow-2xl shadow-black/50">
        <div aria-hidden="true" className="absolute left-1/2 top-4 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-[oklch(22%_0.01_140)]" />
        <div className="flex h-[34rem] flex-col gap-3 overflow-hidden rounded-[2rem] bg-[oklch(98%_0.008_135)] px-4 pb-3 pt-10 text-[oklch(28%_0.04_150)]">

          {tab === "today" ? (
            <>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[oklch(52%_0.05_145)]">{formatTodayLabel()}</p>
                <p className="text-lg font-semibold">Good morning, Sam.</p>
              </div>

              <AnimatePresence initial={false}>
                {alertOn && (
                  <motion.button
                    type="button"
                    onClick={() => setAlertOn(false)}
                    exit={reduced ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-2 rounded-xl border border-[oklch(85%_0.04_240)] bg-[oklch(94%_0.025_240)] px-3 py-2.5 text-left text-xs leading-snug text-[oklch(35%_0.06_250)]"
                  >
                    <span aria-hidden="true">❄</span>
                    <span><strong>Frost tonight, 29°F.</strong> Cover the dahlias and bring the citrus in. <span className="opacity-60">(tap to dismiss)</span></span>
                  </motion.button>
                )}
              </AnimatePresence>

              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[oklch(52%_0.05_145)]">Today in your garden</p>
                  <p className="font-mono text-[10px] text-[oklch(46%_0.08_150)]">{doneCount}/{tasks.length}</p>
                </div>
                <ul className="mt-1">
                  {tasks.map((t) => (
                    <li key={t.id} className="border-t border-[oklch(90%_0.015_140)] first:border-t-0">
                      <button
                        type="button"
                        data-hint="task"
                        onClick={() => toggle(t.id)}
                        aria-pressed={t.done}
                        className="flex w-full items-center gap-2.5 py-2.5 text-left text-[13px]"
                      >
                        <motion.span
                          aria-hidden="true"
                          animate={reduced ? undefined : { scale: t.done ? [1, 1.25, 1] : 1 }}
                          transition={{ duration: 0.3 }}
                          className={
                            "flex h-5 w-5 flex-none items-center justify-center rounded-full border-[1.5px] text-[10px] text-white " +
                            (t.done
                              ? "border-[oklch(52%_0.11_150)] bg-[oklch(52%_0.11_150)]"
                              : "border-[oklch(60%_0.09_150)]")
                          }
                        >
                          {t.done ? "✓" : ""}
                        </motion.span>
                        <span className={t.done ? "text-[oklch(55%_0.03_150)] line-through" : ""}>
                          {t.text} <span className="text-[11px] text-[oklch(55%_0.04_145)]">— {t.sub}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {allDone ? (
                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-[oklch(93%_0.03_145)] px-3 py-2.5 text-xs font-medium text-[oklch(38%_0.09_150)]"
                >
                  All done — the garden thanks you. 🌱
                </motion.p>
              ) : (
                <div className="rounded-xl border border-[oklch(89%_0.028_142)] bg-[oklch(96%_0.018_140)] px-3 py-2.5 text-xs leading-snug">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[oklch(46%_0.08_150)]">This weekend</p>
                  <p className="mt-0.5 text-[oklch(34%_0.04_150)]">Clear skies Sat–Sun and tonight should be the season’s last frost — a good window to plant out the beds.</p>
                </div>
              )}

              <div className="mt-auto flex items-center justify-between rounded-xl bg-[oklch(96%_0.018_140)] px-3 py-2">
                <span className="text-[11px] text-[oklch(48%_0.05_150)]">Care streak</span>
                <motion.span
                  key={streak}
                  initial={reduced ? false : { rotateX: 90 }}
                  animate={{ rotateX: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-sm font-semibold text-[oklch(38%_0.09_150)]"
                >
                  {streak} days
                </motion.span>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl bg-gradient-to-b from-[oklch(93%_0.03_145)] to-[oklch(88%_0.045_150)] px-4 pb-4 pt-5 text-center">
                <svg viewBox="0 0 120 90" aria-hidden="true" className="mx-auto mb-1 w-24">
                  <path d="M60 82 C30 70 18 42 26 16 C50 26 62 50 60 82Z" fill="oklch(50% 0.11 150)" />
                  <path d="M60 82 C88 68 98 40 90 14 C68 26 56 52 60 82Z" fill="oklch(58% 0.1 145)" />
                  <path d="M60 84 L60 40" stroke="oklch(42% 0.09 150)" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
                <p className="text-sm font-semibold text-[oklch(26%_0.05_150)]">Black Mission Fig</p>
                <p className="text-[10px] text-[oklch(48%_0.05_150)]">added from scan · April 2</p>
              </div>
              <div className="text-[12px]">
                {([["Water", "Weekly, deep soak"], ["Light", "Full sun, 6h+"], ["Hardy to", "Zone 7 — protect below 20°F"], ["Next up", "Thin fruit in June"]] as const).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-3 border-t border-[oklch(90%_0.015_140)] py-2 first:border-t-0">
                    <span className="flex-none text-[oklch(52%_0.04_148)]">{k}</span>
                    <span className="text-right font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* tab bar */}
          <div className="flex justify-around border-t border-[oklch(90%_0.015_140)] pt-2 text-[11px] text-[oklch(55%_0.04_145)]">
            {(["today", "garden"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={"relative px-3 pb-1 capitalize " + (tab === t ? "font-semibold text-[oklch(40%_0.1_150)]" : "")}
              >
                {t}
                {tab === t && (
                  <motion.span
                    layoutId="bramble-tab"
                    aria-hidden="true"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded bg-[oklch(46%_0.11_150)]"
                  />
                )}
              </button>
            ))}
            <span className="px-3 pb-1 opacity-50">Scan</span>
            <span className="px-3 pb-1 opacity-50">You</span>
          </div>
        </div>
      </div>
    </div>
  );
}
