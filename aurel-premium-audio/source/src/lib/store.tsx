import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type * as THREE from "three";
import type { Exhibit } from "../data/collection";
import type { WorkStats } from "./stats";

// One quiet context for museum-wide state: measured plaque data, the
// inspect overlay, the visitor's loan, and the reduced-motion flag.

export interface LoanWork {
  fileName: string;
  bytes: number;
  object: THREE.Object3D;
  stats: WorkStats;
}

interface InspectTarget {
  exhibit: Exhibit;
  /** Present only for visitor loans (parsed client-side, not URL-loaded). */
  object?: THREE.Object3D;
}

interface MuseumState {
  reduced: boolean;
  stats: Record<string, WorkStats>;
  registerStats: (id: string, stats: WorkStats) => void;
  inspect: InspectTarget | null;
  openInspect: (
    exhibit: Exhibit,
    opener?: HTMLElement | null,
    object?: THREE.Object3D
  ) => void;
  closeInspect: () => void;
  loan: LoanWork | null;
  setLoan: (loan: LoanWork | null) => void;
}

const MuseumContext = createContext<MuseumState | null>(null);

export function MuseumProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [stats, setStats] = useState<Record<string, WorkStats>>({});
  const [inspect, setInspect] = useState<InspectTarget | null>(null);
  const [loan, setLoan] = useState<LoanWork | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const registerStats = useCallback((id: string, s: WorkStats) => {
    setStats((prev) => {
      const existing = prev[id];
      if (existing && existing.triangles === s.triangles) return prev;
      return { ...prev, [id]: s };
    });
  }, []);

  const openInspect = useCallback(
    (exhibit: Exhibit, opener?: HTMLElement | null, object?: THREE.Object3D) => {
      openerRef.current = opener ?? null;
      setInspect({ exhibit, object });
    },
    []
  );

  const closeInspect = useCallback(() => {
    setInspect(null);
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener) window.setTimeout(() => opener.focus(), 0);
  }, []);

  const value = useMemo(
    () => ({
      reduced,
      stats,
      registerStats,
      inspect,
      openInspect,
      closeInspect,
      loan,
      setLoan,
    }),
    [reduced, stats, registerStats, inspect, openInspect, closeInspect, loan]
  );

  return <MuseumContext.Provider value={value}>{children}</MuseumContext.Provider>;
}

export function useMuseum(): MuseumState {
  const ctx = useContext(MuseumContext);
  if (!ctx) throw new Error("useMuseum outside MuseumProvider");
  return ctx;
}
