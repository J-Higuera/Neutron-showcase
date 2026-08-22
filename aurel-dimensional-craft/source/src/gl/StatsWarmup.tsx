import { Suspense, useCallback, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { COLLECTION, FOUNDING, type Exhibit } from "../data/collection";
import { extractStats, type WorkStats } from "../lib/stats";
import { buildHeadphone } from "../three/headphone";

// Measure the whole collection off-GPU: load each file into the SAME
// loader cache the halls use (no double download, no double parse) and
// extract its plaque numbers — nothing renders. ONE FILE AT A TIME, with
// a breath between parses: fanning all five out at once put a decode
// burst exactly where the visitor's first scroll lands (owner round 4).

type OnStats = (id: string, stats: WorkStats) => void;

// The pass advances only while the visitor is NOT scrolling: each model's
// main-thread assembly is a small spike, and a spike under a live scroll
// reads as jank. Quiet = no scroll event for 800ms.
let lastScroll = 0;
if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => { lastScroll = performance.now(); }, { passive: true });
}
function whenQuiet(cb: () => void, breath: number): () => void {
  let id = 0;
  const tick = () => {
    id = window.setTimeout(() => {
      if (performance.now() - lastScroll >= 800) cb();
      else tick();
    }, breath);
  };
  tick();
  return () => window.clearTimeout(id);
}

function Warm({
  exhibit,
  onStats,
  onDone,
}: {
  exhibit: Exhibit;
  onStats: OnStats;
  onDone: () => void;
}) {
  const { scene } = useGLTF(exhibit.src!, "./draco/", true);
  useEffect(() => {
    onStats(exhibit.id, extractStats(scene));
    return whenQuiet(onDone, 500);
  }, [scene, exhibit, onStats, onDone]);
  return null;
}

export default function StatsWarmup({ onStats }: { onStats: OnStats }) {
  const [idx, setIdx] = useState(0);
  const next = useCallback(() => setIdx((i) => i + 1), []);

  // the founding piece is procedural — measured synchronously, no fetch
  useEffect(() => {
    onStats(FOUNDING.id, extractStats(buildHeadphone().group));
  }, [onStats]);

  if (idx >= COLLECTION.length) return null;
  return (
    <Suspense fallback={null}>
      <Warm exhibit={COLLECTION[idx]} onStats={onStats} onDone={next} />
    </Suspense>
  );
}
