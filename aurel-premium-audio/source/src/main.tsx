import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { START_ANCHOR } from "./lib/anchor";
import "./styles.css";

// Reveal styling is JS-owned: nothing is hidden unless this class lands.
document.documentElement.classList.add("js");

const root = createRoot(document.getElementById("root")!);

// The poster darkroom: /?bake=004 renders one live hall pane for the
// stills baker instead of the museum. Lazy — the shell chunk must never
// pull three.js.
const bakeNum = new URLSearchParams(location.search).get("bake");
if (bakeNum) {
  document.getElementById("veil")?.remove();
  const BakePane = lazy(() => import("./BakePane"));
  root.render(
    <Suspense fallback={null}>
      <BakePane num={bakeNum} />
    </Suspense>
  );
} else {
  // WebGL capability decides whether the live stages mount at all.
  const hasWebGL = (() => {
    try {
      const c = document.createElement("canvas");
      return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  })();
  if (!hasWebGL) document.documentElement.classList.add("no-webgl");

  // Return visits land where the last one ended (owner round 8): the page
  // remembers the section — and the exact room of the collection — you
  // were in, per tab, tracked by scroll alone. The resolved anchor lives
  // in START_ANCHOR (lib/anchor) and is NEVER written into the URL; the
  // app's own anchor logic (App + Wing) walks the page there instantly.
  // An explicit deep link always wins; a fresh tab opens at the entrance.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!location.hash && !START_ANCHOR) {
    window.scrollTo(0, 0);
  }

  root.render(
    <StrictMode>
      <App hasWebGL={hasWebGL} />
    </StrictMode>
  );

  // Lift the veil once the type has arrived (capped so a slow font never
  // holds the doors). Reduced motion gets an instant open.
  const veil = document.getElementById("veil");
  if (veil) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lift = () => {
      if (reduced) {
        veil.remove();
        return;
      }
      veil.style.opacity = "0";
      window.setTimeout(() => veil.remove(), 650);
    };
    const cap = window.setTimeout(lift, 1400);
    document.fonts?.ready.then(() => {
      window.clearTimeout(cap);
      window.setTimeout(lift, 250);
    });
  }
}
