import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClickHint, FlapValue } from "../../lib/fx";

/* Quayside — the shipped product, operable. A deterministic rate engine:
   pick a lane and a load, price it, send it to the pipeline. */

const LANES = [
  { id: "sha-chi", label: "Shanghai → Chicago", base: 3200, rail: 640 },
  { id: "rtm-det", label: "Rotterdam → Detroit", base: 3900, rail: 480 },
  { id: "pus-mem", label: "Busan → Memphis", base: 3450, rail: 720 },
  { id: "ham-chi", label: "Hamburg → Chicago", base: 3650, rail: 510 },
] as const;

const LOADS = [
  { id: "20", label: "20′ standard", factor: 0.62 },
  { id: "40hc", label: "40′ high-cube", factor: 1.0 },
  { id: "40rf", label: "40′ reefer", factor: 1.55 },
] as const;

type PipelineRow = { id: number; route: string; load: string; customer: string; price: number; status: "Priced" | "Sent" | "Won" };

// ids are the React keys: sending the same lane twice used to mint rows
// with IDENTICAL keys, and AnimatePresence accumulated ghost entries for
// them — the list grew without bound (owner repro, 2026-08-22)
const SEED_ROWS: PipelineRow[] = [
  { id: 1, route: "Ningbo → Columbus", load: "40′ HC", customer: "Fielder Home", price: 3975, status: "Won" },
  { id: 2, route: "Antwerp → Milwaukee", load: "20′", customer: "Kestrel Brewing", price: 2410, status: "Sent" },
  { id: 3, route: "Busan → Memphis", load: "40′ reefer", customer: "Pelican Produce", price: 7340, status: "Priced" },
  { id: 4, route: "Hamburg → Chicago", load: "40′ HC", customer: "Marquette Paper", price: 4180, status: "Priced" },
];

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

export function QuaysideDemo() {
  const reduced = useReducedMotion();
  const [laneId, setLaneId] = useState<(typeof LANES)[number]["id"]>("sha-chi");
  const [loadId, setLoadId] = useState<(typeof LOADS)[number]["id"]>("40hc");
  const [priced, setPriced] = useState(false);
  const [rows, setRows] = useState<PipelineRow[]>(SEED_ROWS);
  const [sentFlash, setSentFlash] = useState(false);

  const lane = LANES.find((l) => l.id === laneId)!;
  const load = LOADS.find((l) => l.id === loadId)!;

  const quote = useMemo(() => {
    const ocean = Math.round(lane.base * load.factor);
    const rail = lane.rail;
    const fuel = Math.round((ocean + rail) * 0.08);
    const margin = Math.round((ocean + rail + fuel) * 0.12);
    const total = ocean + rail + fuel + margin;
    const win = 48 + ((lane.base + load.factor * 1000) % 26); // deterministic 48–74
    return { ocean, rail, fuel, margin, total, win: Math.round(win) };
  }, [lane, load]);

  const nextId = useRef(100);
  const sendQuote = () => {
    setRows((r) =>
      [{ id: nextId.current++, route: lane.label, load: load.label.replace(" standard", "").replace(" high-cube", " HC"), customer: "Your customer", price: quote.total, status: "Sent" as const }, ...r].slice(0, 4)
    );
    setPriced(false);
    setSentFlash(true);
    window.setTimeout(() => setSentFlash(false), 1800);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-edge-soft bg-[oklch(21%_0.035_244)] shadow-2xl shadow-black/40">
      <ClickHint targets={['[data-hint="price"]']} />
      {/* chrome */}
      <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-white/5 bg-[oklch(26%_0.03_244)] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 rounded-full border border-white/10 bg-black/20 px-3 py-1 font-mono text-[10px] text-white/50">
          app.quayside.io/quotes/new
        </span>
      </div>

      <div className="grid gap-0 text-[oklch(92%_0.008_240)] sm:grid-cols-[1fr_1fr]">
        {/* quote builder */}
        <div className="border-b border-white/5 p-5 sm:border-b-0 sm:border-r">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[oklch(68%_0.02_240)]">New quote</p>

          <label className="mt-4 block text-xs text-[oklch(68%_0.02_240)]">
            Lane
            <select
              value={laneId}
              onChange={(e) => { setLaneId(e.target.value as typeof laneId); setPriced(false); }}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-black/25 px-3 py-2 text-sm text-[oklch(92%_0.008_240)] outline-none focus:border-[oklch(80%_0.09_205)]"
            >
              {LANES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </label>

          <label className="mt-3 block text-xs text-[oklch(68%_0.02_240)]">
            Load
            <select
              value={loadId}
              onChange={(e) => { setLoadId(e.target.value as typeof loadId); setPriced(false); }}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-black/25 px-3 py-2 text-sm text-[oklch(92%_0.008_240)] outline-none focus:border-[oklch(80%_0.09_205)]"
            >
              {LOADS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </label>

          {!priced ? (
            <button
              type="button"
              data-hint="price"
              onClick={() => setPriced(true)}
              className="mt-4 w-full rounded-md border border-transparent bg-[oklch(80%_0.09_205)] px-4 py-2.5 text-sm font-semibold text-[oklch(18%_0.03_244)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              Price it
            </button>
          ) : (
            <button
              type="button"
              onClick={sendQuote}
              className="mt-4 w-full rounded-md border border-[oklch(80%_0.09_205)] px-4 py-2.5 text-sm font-semibold text-[oklch(80%_0.09_205)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              Send to customer →
            </button>
          )}

          {/* mounted permanently on sm+ so the pane's height is reserved —
              clicking Price it must not move the container (owner,
              2026-08-22); phones keep natural flow */}
          <motion.dl
            initial={false}
            animate={{ opacity: priced ? 1 : 0, y: priced ? 0 : 8 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            aria-hidden={!priced}
            className={
              "mt-4 space-y-1.5 border-t border-white/10 pt-3 font-mono text-xs " +
              (priced ? "" : "hidden sm:invisible sm:block")
            }
          >
                {([["Ocean leg", quote.ocean], ["Rail inland", quote.rail], ["Fuel surcharge", quote.fuel], ["Margin", quote.margin]] as const).map(([k, v], i) => (
                  <motion.div
                    key={k}
                    initial={reduced ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduced ? 0 : 0.08 * i, duration: 0.25 }}
                    className="flex justify-between text-[oklch(75%_0.02_240)]"
                  >
                    <dt>{k}</dt><dd>{fmt(v)}</dd>
                  </motion.div>
                ))}
                <div className="flex items-baseline justify-between border-t border-white/10 pt-2 text-sm font-semibold text-[oklch(92%_0.008_240)]">
                  <dt>Quote</dt>
                  <dd><FlapValue value={fmt(quote.total)} /></dd>
                </div>
                <div className="flex justify-between pt-1 text-[10px] uppercase tracking-wider text-[oklch(68%_0.02_240)]">
                  <dt>Win likelihood, this lane</dt><dd className="text-[oklch(80%_0.09_205)]">{quote.win}%</dd>
                </div>
          </motion.dl>
        </div>

        {/* pipeline */}
        <div className="p-5">
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[oklch(68%_0.02_240)]">Quote pipeline — week 32</p>
            <AnimatePresence>
              {sentFlash && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[10px] text-[oklch(85%_0.09_160)]"
                >
                  quote sent · 38 min
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {([["Open", "24"], ["Avg. turnaround", "38 min"], ["Win rate, 30d", "61%"]] as const).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2.5">
                <p className="text-[9px] uppercase tracking-wider text-[oklch(68%_0.02_240)]">{k}</p>
                <p className="mt-0.5 font-mono text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>

          <ul className="mt-4 max-h-[208px] overflow-hidden rounded-lg border border-white/10 bg-black/20">
            <AnimatePresence initial={false}>
              {rows.map((r) => (
                <motion.li
                  key={r.id}
                  layout
                  initial={reduced ? false : { opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-[51px] items-center justify-between gap-2 border-t border-white/5 px-3.5 text-xs first:border-t-0"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{r.route}</span>
                    <span className="text-[10px] text-[oklch(68%_0.02_240)]">{r.load} · {r.customer}</span>
                  </span>
                  <span className="flex flex-none items-center gap-2">
                    <span className="font-mono">{fmt(r.price)}</span>
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-[10px] font-medium " +
                        (r.status === "Won"
                          ? "bg-[oklch(45%_0.09_160/0.35)] text-[oklch(85%_0.09_160)]"
                          : r.status === "Sent"
                            ? "bg-[oklch(50%_0.09_240/0.35)] text-[oklch(85%_0.06_235)]"
                            : "bg-white/10 text-white/70")
                      }
                    >
                      {r.status}
                    </span>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <p className="mt-3 text-[10px] leading-relaxed text-[oklch(60%_0.02_240)]">
            The rate engine reads live tariff feeds; dispatchers stopped retyping them in week seven.
          </p>
        </div>
      </div>
    </div>
  );
}
