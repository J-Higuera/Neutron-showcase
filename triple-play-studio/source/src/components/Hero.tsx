import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { board as localBoard, studio, type BoardRow } from "../data/fiction";
import { Magnetic, SplitFlap } from "../lib/fx";

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  const reduced = useReducedMotion();
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* grid texture + glow live on their own masked layers — the mask must never touch content */}
      <div aria-hidden="true" className="hero-grid-bg pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-cobalt-deep/25 blur-[120px]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[7fr_5fr]">
        <div>
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.22em] text-cobalt-hot"
          >
            A software studio for funded founders
          </motion.p>

          <h1 id="hero-title" className="font-serif text-[clamp(3.4rem,9vw,7rem)] leading-[0.98] tracking-tight">
            {["Funded is", "not shipped."].map((t, i) => (
              <span key={t} className="block overflow-hidden pb-1">
                <motion.span
                  className="block will-change-transform"
                  variants={line}
                  custom={i}
                  initial={reduced ? false : "hidden"}
                  animate="show"
                >
                  {i === 1 ? (
                    <>
                      <em className="italic text-cobalt-hot">not</em> shipped.
                    </>
                  ) : (
                    t
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-bone/90"
          >
            Triple Play is a seven-person studio in Chicago. We take you from term sheet to
            launched, instrumented product — strategy, build, and launch as one motion, with
            the score kept out loud every Friday.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href="#work"
                className="inline-block rounded-lg bg-bone px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-cobalt-hot hover:text-ink"
              >
                See the work
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href="#configurator"
                className="inline-block rounded-lg border border-edge px-7 py-3.5 text-sm font-medium text-bone transition-colors hover:border-bone"
              >
                Shape your engagement
              </a>
            </Magnetic>
          </motion.div>

          <motion.ul
            aria-label="Studio facts"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-3 border-t border-edge-soft pt-6 text-sm text-dim"
          >
            {studio.facts.map((f) => (
              <li key={f.label}>
                <strong className="mr-1.5 font-mono font-semibold text-bone">{f.n}</strong>
                {f.label}
              </li>
            ))}
          </motion.ul>
        </div>

        <StudioBoard />
      </div>
    </section>
  );
}

/* ---------- the studio board: split-flap slate; on Netlify it is served
   by a real Node function (/.netlify/functions/board), elsewhere it renders
   the same data locally — identical page either way. ---------- */

function StudioBoard() {
  const reduced = useReducedMotion();
  const [rows, setRows] = useState<BoardRow[]>(localBoard);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!window.location.hostname.includes("netlify")) return;
    fetch("/.netlify/functions/board")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { rows: BoardRow[] }) => {
        setRows(data.rows);
        setLive(true);
      })
      .catch(() => {});
  }, []);

  return (
    <motion.aside
      aria-labelledby="board-title"
      initial={reduced ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-edge-soft bg-pit/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm"
    >
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="board-title" className="font-serif text-2xl">The studio board</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
          {live ? "live · node" : "updated friday"}
        </span>
      </div>

      <ol>
        {rows.map((r, i) => (
          <li
            key={r.client}
            className={
              "grid grid-cols-[1fr_auto] items-baseline gap-x-3 border-t border-edge-soft py-3 " +
              (r.state === "open" ? "text-cobalt-hot" : "")
            }
          >
            <span className={"text-[15px] font-semibold " + (r.state === "done" ? "text-dim" : "")}>
              <SplitFlap text={r.client.toUpperCase()} tick={46 + i * 6} className="tracking-wide text-[13px]" />
            </span>
            <span className={"text-right text-xs " + (r.state === "open" ? "text-cobalt-hot" : "text-dim")}>
              {r.phase}
            </span>
            {r.progress !== null && (
              <span aria-hidden="true" className="col-span-2 mt-2 block h-[3px] overflow-hidden rounded bg-bone/10">
                <motion.span
                  className={"block h-full rounded " + (r.state === "steady" ? "bg-leaf" : "bg-cobalt")}
                  initial={reduced ? { width: `${r.progress * 100}%` } : { width: 0 }}
                  animate={{ width: `${r.progress * 100}%` }}
                  transition={{ duration: 1.1, delay: 0.8 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            )}
            {r.state === "done" && (
              <span aria-hidden="true" className="col-span-2 mt-1 font-mono text-xs text-leaf">✓</span>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-4 border-t border-edge-soft pt-4 text-xs leading-relaxed text-dim">
        We publish our slate because our clients read it too. Two builds at a time is a
        promise, not a capacity problem.
      </p>
    </motion.aside>
  );
}
