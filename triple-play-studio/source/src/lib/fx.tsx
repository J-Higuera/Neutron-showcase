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

/* ---------- click affordance: one clean pointer, one click, gone ----------
   Drop inside any position:relative interactive pane. Plays once, only after
   the pane has actually stayed in view; any real interaction cancels it;
   reduced motion renders nothing. fx/fy place it as fractions of the pane. */

export function ClickHint({ fx = 0.5, fy = 0.45 }: { fx?: number; fy?: number }) {
  const reduced = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(layerRef, { amount: 0.35 });
  const [ghost, setGhost] = useState({ x: 0, y: 0, shown: false, click: false });
  const played = useRef(false);
  const cancelled = useRef(false);

  useEffect(() => {
    if (!inView || reduced || played.current || cancelled.current) return;
    const layer = layerRef.current;
    const pane = layer?.parentElement;
    if (!layer || !pane) return;
    const cancel = () => {
      cancelled.current = true;
      setGhost((g) => ({ ...g, shown: false, click: false }));
    };
    pane.addEventListener("pointerdown", cancel);
    pane.addEventListener("change", cancel);
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(() => { if (!cancelled.current) fn(); }, ms));
    at(800, () => {
      played.current = true;
      setGhost({ x: layer.clientWidth * fx, y: layer.clientHeight * fy, shown: true, click: false });
    });
    at(1600, () => setGhost((g) => ({ ...g, click: true })));
    at(2050, () => setGhost((g) => ({ ...g, click: false })));
    at(2450, () => setGhost((g) => ({ ...g, shown: false })));
    return () => {
      timers.forEach(clearTimeout);
      pane.removeEventListener("pointerdown", cancel);
      pane.removeEventListener("change", cancel);
    };
  }, [inView, reduced, fx, fy]);

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
