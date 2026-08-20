import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClickHint, FlapValue } from "../../lib/fx";

/* Ledgerline Contractor — the shipped product, operable.
   Approve the March run and watch it settle: queued → paid, receipts issued. */

type Row = { name: string; invoice: string; amount: number; status: "Queued" | "Processing" | "Paid" };

const INITIAL: Row[] = [
  { name: "Alvarez Design Co.", invoice: "#1178", amount: 12400, status: "Queued" },
  { name: "K. Osei — consulting", invoice: "#1179", amount: 8750, status: "Queued" },
  { name: "Northfield Media LLC", invoice: "#1181", amount: 21300, status: "Queued" },
  { name: "Petra Lindqvist", invoice: "#1183", amount: 5200, status: "Queued" },
  { name: "Marisol Ferreira", invoice: "#1184", amount: 9860, status: "Queued" },
  { name: "Beacon Copy Co.", invoice: "#1186", amount: 3150, status: "Queued" },
];

const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });

export function LedgerlineDemo() {
  const reduced = useReducedMotion();
  const [rows, setRows] = useState<Row[]>(INITIAL);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);

  const paid = rows.filter((r) => r.status === "Paid");
  const done = paid.length === rows.length;
  const paidTotal = paid.reduce((s, r) => s + r.amount, 0);

  const approve = () => {
    if (running || done) return;
    setRunning(true);
    const stepMs = reduced ? 0 : 260;
    rows.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setRows((rs) => rs.map((r, j) => (j === i ? { ...r, status: "Processing" } : r)));
        }, i * stepMs),
        window.setTimeout(() => {
          setRows((rs) => rs.map((r, j) => (j === i ? { ...r, status: "Paid" } : r)));
          if (i === rows.length - 1) setRunning(false);
        }, i * stepMs + (reduced ? 0 : 220))
      );
    });
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRows(INITIAL);
    setRunning(false);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-edge-soft bg-[oklch(98.5%_0.004_80)] text-[oklch(26%_0.02_60)] shadow-2xl shadow-black/40">
      <ClickHint fx={0.62} fy={0.22} />
      {/* app header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[oklch(88%_0.012_75)] px-5 py-3">
        <p className="text-sm font-semibold">
          Ledgerline <span className="font-normal text-[oklch(55%_0.11_50)]">Contractor</span>
        </p>
        <div className="flex gap-5 text-xs text-[oklch(52%_0.02_65)]">
          <span>Contractors</span>
          <span className="font-semibold text-[oklch(26%_0.02_60)] shadow-[0_14px_0_-12px_oklch(55%_0.11_50)]">Payment runs</span>
          <span>Documents</span>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_15rem]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-[oklch(52%_0.02_65)]">Payment run</p>
              <p className="text-base font-semibold">March — final</p>
            </div>
            {!done ? (
              <button
                type="button"
                onClick={approve}
                disabled={running}
                className="rounded-md bg-[oklch(30%_0.02_60)] px-4 py-2 text-xs font-semibold text-[oklch(97%_0.005_80)] transition-transform hover:scale-[1.03] active:scale-[0.99] disabled:opacity-60"
              >
                {running ? "Running…" : "Approve run"}
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-[oklch(85%_0.05_160)] bg-[oklch(93%_0.035_160)] px-3.5 py-1.5 text-[11px] font-medium text-[oklch(40%_0.09_160)]"
              >
                Run complete · reset demo
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <div className="rounded-lg border border-[oklch(88%_0.012_75)] bg-white px-3 py-2.5">
              <p className="font-mono text-sm font-semibold"><FlapValue value={"$" + Math.round(paidTotal / 1000).toLocaleString() + "k"} /></p>
              <p className="text-[10px] text-[oklch(52%_0.02_65)]">paid out</p>
            </div>
            <div className="rounded-lg border border-[oklch(88%_0.012_75)] bg-white px-3 py-2.5">
              <p className="font-mono text-sm font-semibold">{paid.length}/{rows.length}</p>
              <p className="text-[10px] text-[oklch(52%_0.02_65)]">paid</p>
            </div>
            <div className="rounded-lg border border-[oklch(88%_0.012_75)] bg-white px-3 py-2.5">
              <p className="font-mono text-sm font-semibold">0</p>
              <p className="text-[10px] text-[oklch(52%_0.02_65)]">failed transfers</p>
            </div>
          </div>

          <ul className="mt-4 overflow-hidden rounded-lg border border-[oklch(88%_0.012_75)] bg-white">
            {rows.map((r) => (
              <li key={r.invoice} className="flex items-center justify-between gap-2 border-t border-[oklch(92%_0.008_75)] px-3.5 py-2.5 text-xs first:border-t-0">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{r.name}</span>
                  <span className="font-mono text-[10px] text-[oklch(55%_0.02_65)]">{r.invoice}</span>
                </span>
                <span className="flex flex-none items-center gap-2.5">
                  <span className="font-mono">{fmt(r.amount)}</span>
                  <motion.span
                    key={r.status}
                    initial={reduced ? false : { rotateX: 90 }}
                    animate={{ rotateX: 0 }}
                    transition={{ duration: 0.25 }}
                    className={
                      "w-[4.6rem] rounded-full px-2 py-0.5 text-center text-[10px] font-medium " +
                      (r.status === "Paid"
                        ? "bg-[oklch(93%_0.035_160)] text-[oklch(38%_0.09_160)]"
                        : r.status === "Processing"
                          ? "bg-[oklch(93%_0.04_82)] text-[oklch(45%_0.1_70)]"
                          : "border border-[oklch(88%_0.012_75)] bg-[oklch(96%_0.006_80)] text-[oklch(45%_0.02_70)]")
                    }
                  >
                    {r.status}
                  </motion.span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* document center */}
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[oklch(52%_0.02_65)]">Document center</p>
          <div className="rounded-md border border-[oklch(88%_0.012_75)] bg-white p-3.5 shadow-[4px_5px_0_-1px_oklch(92%_0.015_75)]">
            <p className="font-mono text-xs font-semibold">Form 1099-NEC</p>
            <p className="text-[10px] text-[oklch(52%_0.02_65)]">2025 · Alvarez Design Co.</p>
            <div aria-hidden="true" className="my-3 space-y-1.5">
              <span className="block h-1.5 rounded bg-[oklch(93%_0.01_75)]" />
              <span className="block h-1.5 w-3/4 rounded bg-[oklch(93%_0.01_75)]" />
              <span className="block h-1.5 w-5/6 rounded bg-[oklch(93%_0.01_75)]" />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={done ? "filed" : "ready"}
                initial={reduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={"text-[10px] font-semibold " + (done ? "text-[oklch(40%_0.09_160)]" : "text-[oklch(52%_0.02_65)]")}
              >
                {done ? "Generated · filed electronically ✓" : "Awaiting run approval"}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="text-[10px] leading-relaxed text-[oklch(52%_0.02_65)]">
            312 of 312 forms generated last season.<br />0 support tickets. Her team runs this screen now.
          </p>
        </div>
      </div>
    </div>
  );
}
