import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

/** True while the PAGE is being scrolled (edge-triggered, settles 160ms
 *  after the last event). A live canvas compositing new frames under a
 *  scroll competes with it — the stage holds its pose instead; nobody can
 *  see a turntable turn while it flies past. */
function usePageScrolling(): boolean {
  const [scrolling, setScrolling] = useState(false);
  const scrollingRef = useRef(false);
  useEffect(() => {
    let timer = 0;
    const onScroll = () => {
      if (!scrollingRef.current) {
        scrollingRef.current = true;
        setScrolling(true);
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        scrollingRef.current = false;
        setScrolling(false);
      }, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);
  return scrolling;
}

// Every stage owns a small in-pane canvas. This replaced the one shared
// fixed canvas with scissored views: the shared canvas re-measured each
// pane per frame and DREW A FRAME BEHIND it, so models visibly detached
// from their panes during page scroll and stuttered inside the gliding
// deck (owner round 4). An in-flow canvas scrolls with its pane natively
// — locked at any frame rate.
//
// Cheap by contract: the canvas renders only while ON SCREEN (plus a
// short warm window so shaders compile and textures upload off-screen,
// never mid-glide). Asleep costs zero frames.
//
// The warm window opens at mount AND re-opens whenever `wake` changes —
// the owning view bumps it when its model actually lands. A mount-only
// window expired before slow model fetches resolved, so first-render
// cost (compile + upload + the turntable starting) was paid in front of
// the visitor instead of off-screen (owner round 6).

export default function StageCanvas({
  zIndex = 1,
  warmMs = 900,
  wake = 0,
  children,
}: {
  zIndex?: number;
  warmMs?: number;
  /** Bump to re-open the warm window (e.g. the moment a model arrives). */
  wake?: number;
  children: ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [warm, setWarm] = useState(true);
  const scrolling = usePageScrolling();

  useEffect(() => {
    setWarm(true);
    const id = window.setTimeout(() => setWarm(false), warmMs);
    return () => window.clearTimeout(id);
  }, [warmMs, wake]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    // viewport root: ancestor clipping (the deck) is part of the math, so
    // a slide scrolled out of the deck counts as off screen
    const io = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Canvas
      ref={canvasRef}
      className="stage-canvas"
      style={{ position: "absolute", inset: 0, zIndex }}
      frameloop={warm || (visible && !scrolling) ? "always" : "never"}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.12;
      }}
    >
      {children}
    </Canvas>
  );
}
