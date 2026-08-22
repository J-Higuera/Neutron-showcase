import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent,
} from "react";

/* ---------- scroll reveal (one-shot, native scroll; reduced motion renders settled) ---------- */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- magnetic hover (springs live on their own transform, CSS never fights it) ---------- */

export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const yv = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(yv, { stiffness: 260, damping: 18, mass: 0.5 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    yv.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    yv.set(0);
  };

  return (
    <motion.div
      className={"inline-block " + (className ?? "")}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

/* ---------- split-flap text: the studio's signature ----------
   Each cell flips through glyphs like a station board, staggered left to right,
   and re-runs whenever `text` changes. Reduced motion renders the final text. */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—$%/&";

export function SplitFlap({
  text,
  className,
  tick = 62,
  charClass,
}: {
  text: string;
  className?: string;
  tick?: number;
  charClass?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const [cells, setCells] = useState<{ ch: string; settled: boolean; k: number }[]>(
    () => text.split("").map((ch) => ({ ch, settled: true, k: 0 }))
  );

  useEffect(() => {
    const target = text.split("");
    if (reduced || !inView) {
      setCells(target.map((ch) => ({ ch, settled: true, k: 0 })));
      return;
    }
    let frame = 0;
    setCells(target.map((ch) => ({ ch: ch === " " ? " " : "·", settled: ch === " ", k: 0 })));
    const id = window.setInterval(() => {
      frame += 1;
      let allSettled = true;
      setCells(
        target.map((ch, i) => {
          if (ch === " ") return { ch: " ", settled: true, k: 0 };
          const settleAt = 3 + Math.min(i, 14);
          if (frame >= settleAt) return { ch, settled: true, k: frame };
          allSettled = false;
          return {
            ch: GLYPHS[(i * 7 + frame * 3) % GLYPHS.length],
            settled: false,
            k: frame,
          };
        })
      );
      if (allSettled) window.clearInterval(id);
    }, tick);
    return () => window.clearInterval(id);
  }, [text, inView, reduced, tick]);

  return (
    <span ref={ref} className={"font-mono " + (className ?? "")} aria-label={text} role="text">
      {cells.map((c, i) => (
        <span
          // unsettled cells remount every frame so the flip animation retriggers
          key={i + "-" + (c.settled ? "s" : c.k)}
          aria-hidden="true"
          className={
            "flap" +
            (c.settled ? "" : " is-ticking") +
            " " +
            (charClass ?? "")
          }
        >
          {c.ch === " " ? " " : c.ch}
        </span>
      ))}
    </span>
  );
}

/* ---------- odometer-free number presenter: flap a value change ---------- */

export function FlapValue({ value, className }: { value: string; className?: string }) {
  return <SplitFlap text={value} className={className} tick={48} />;
}

/* ---------- click affordance: the ghost cursor OPERATES the pane ----------
   Drop inside any position:relative interactive pane and pass the ordered
   CSS selectors of the controls to click. When the pane scrolls into view
   the ghost glides to each target and fires a REAL click, so the demo
   produces its real result — then it retires and the visitor drives with
   their own choices (owner design, 2026-08-22). Plays once; any real
   pointer input cancels it (programmatic clicks fire no pointer events,
   so it never cancels itself); reduced motion renders nothing and leaves
   the demos fully manual. */

export function ClickHint({ targets }: { targets: string[] }) {
  const reduced = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(layerRef, { amount: 0.35 });
  const [ghost, setGhost] = useState({ x: 0, y: 0, shown: false, click: false });
  const [armed, setArmed] = useState(false);
  const cancelled = useRef(false);
  // the sequence reads targets through a ref: the prop is a fresh array
  // every parent render, and the clicks THEMSELVES re-render the parent —
  // a dep on it would tear down the run mid-flight (frozen ghost, dead
  // second step; caught by the autopilot probe, 2026-08-22)
  const targetsRef = useRef(targets);
  targetsRef.current = targets;

  useEffect(() => {
    if (inView && !reduced && !armed) setArmed(true);
  }, [inView, reduced, armed]);

  useEffect(() => {
    if (!armed) return;
    const layer = layerRef.current;
    const pane = layer?.parentElement;
    if (!layer || !pane) return;
    const cancel = () => {
      cancelled.current = true;
      setGhost((g) => ({ ...g, shown: false, click: false }));
    };
    pane.addEventListener("pointerdown", cancel);
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(() => { if (!cancelled.current) fn(); }, ms));
    const centerOf = (el: Element) => {
      const pr = pane.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      return { x: er.left - pr.left + er.width / 2, y: er.top - pr.top + er.height / 2 };
    };
    const step = (i: number) => {
      // targets resolve fresh per step: an earlier click may have changed
      // the layout (the configurator's results, a swapped button)
      const el = pane.querySelector<HTMLElement>(targetsRef.current[i]);
      if (!el) { at(200, () => setGhost((g) => ({ ...g, shown: false }))); return; }
      const c = centerOf(el);
      setGhost({ x: c.x, y: c.y, shown: true, click: false });
      at(700, () => {
        const el2 = pane.querySelector<HTMLElement>(targetsRef.current[i]);
        if (!el2) return;
        const c2 = centerOf(el2);
        setGhost({ x: c2.x, y: c2.y, shown: true, click: true });
        el2.click();
      });
      at(1050, () => setGhost((g) => ({ ...g, click: false })));
      if (i + 1 < targetsRef.current.length) at(1500, () => step(i + 1));
      else at(1800, () => setGhost((g) => ({ ...g, shown: false })));
    };
    at(800, () => step(0));
    return () => {
      timers.forEach(clearTimeout);
      pane.removeEventListener("pointerdown", cancel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed]);

  if (reduced) return null;

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <motion.div
        data-ghost-cursor
        className="absolute left-0 top-0"
        initial={false}
        animate={{ x: ghost.x, y: ghost.y, opacity: ghost.shown ? 1 : 0, scale: ghost.click ? 0.85 : 1 }}
        transition={{ opacity: { duration: 0.4 }, scale: { duration: 0.16 } }}
      >
        {ghost.click && (
          <motion.span
            className="absolute -left-6 -top-6 h-12 w-12 rounded-full border-2 border-white/70"
            initial={{ scale: 0.25, opacity: 0.8 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        )}
        <svg viewBox="0 0 28 28" className="h-10 w-10 drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)]" style={{ translate: "-5px -3px" }}>
          <path
            d="M7 3.4 L7 21.2 L11.6 17.2 L14.6 24 L17.9 22.5 L14.9 15.8 L21 15.2 Z"
            fill="#fff"
            stroke="oklch(22% 0.02 250)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
