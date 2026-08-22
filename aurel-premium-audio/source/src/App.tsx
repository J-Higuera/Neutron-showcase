import { Suspense, lazy, useEffect, useState } from "react";
import { MuseumProvider, useMuseum } from "./lib/store";
import { START_ANCHOR } from "./lib/anchor";
import { Header } from "./components/Header";
import { Rail } from "./components/Rail";
import { Entrance } from "./components/Entrance";
import { Wing } from "./components/Wing";
import { Contribute } from "./components/Contribute";
import { Colophon } from "./components/Colophon";

// The shell ships without three.js: header, featured case, plaques, and
// registry paint from a small bundle. Every stage owns its own in-pane
// canvas (see gl/StageCanvas) and the GL runtime streams in behind the
// paint: the featured case arms on idle, and the collection-wide stats
// warmup waits longer still, parsing one file at a time.

const StatsWarmup = lazy(() => import("./gl/StatsWarmup"));
const InspectOverlay = lazy(() => import("./components/InspectOverlay"));

function useIdleFlag(enabled: boolean, timeout: number): boolean {
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const arm = () => setFlag(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(arm, { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(arm, timeout);
    return () => window.clearTimeout(id);
  }, [enabled, timeout]);
  return flag;
}

/** Remember the section the visitor is standing in (scroll-spied, like the
 *  rail), walk a restored/linked SECTION anchor into view on mount (#au-…
 *  room anchors are the Wing's to handle), and RETIRE a deep-link fragment
 *  the moment the visitor scrolls to a different section — a stale
 *  fragment would out-vote the scroll memory on the next refresh. */
function useAnchorMemory(): void {
  useEffect(() => {
    const m = START_ANCHOR ?? "";
    if (m === "collection" || m === "lend" || m === "colophon") {
      document.getElementById(m)?.scrollIntoView({ behavior: "instant" });
    }
    const els = ["top", "collection", "lend", "colophon"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          try {
            sessionStorage.setItem("aurel-anchor", e.target.id);
          } catch {
            /* per-tab memory only; fine without */
          }
          if (location.hash) {
            const hashSection = location.hash.startsWith("#au-")
              ? "collection"
              : location.hash.slice(1);
            if (hashSection !== e.target.id) {
              history.replaceState(null, "", location.pathname + location.search);
            }
          }
        }
      },
      { rootMargin: "-42% 0px -42% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App({ hasWebGL }: { hasWebGL: boolean }) {
  return (
    <MuseumProvider>
      <AppBody hasWebGL={hasWebGL} />
    </MuseumProvider>
  );
}

function AppBody({ hasWebGL }: { hasWebGL: boolean }) {
  const { registerStats } = useMuseum();
  // The feature case wakes almost immediately (≤0.8s — its model bytes are
  // already arriving via the HTML preload, and a frozen hero "looks off",
  // owner round 5). Rooms are printed stills, so the collection-wide
  // measuring pass is unhurried (≤6s idle, strictly sequential): it fills
  // the plaques and doubles as an Inspect prefetch, never a load burst.
  const glReady = useIdleFlag(hasWebGL, 800);
  const warmReady = useIdleFlag(hasWebGL, 6000);
  useAnchorMemory();

  return (
    <div className="app">
      <Header />
      <Rail />
      <main>
        <Entrance glReady={glReady} />
        <Wing hasWebGL={hasWebGL} />
        <Contribute hasWebGL={hasWebGL} />
        <Colophon />
      </main>
      {warmReady && (
        <Suspense fallback={null}>
          <StatsWarmup onStats={registerStats} />
        </Suspense>
      )}
      <InspectGate />
    </div>
  );
}

/** Mounts the (lazy, GL-heavy) inspect overlay only once a work is opened. */
function InspectGate() {
  const { inspect } = useMuseum();
  if (!inspect) return null;
  return (
    <Suspense fallback={null}>
      <InspectOverlay />
    </Suspense>
  );
}
