import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_EXHIBITS, WALK } from "../data/collection";
import { START_ANCHOR } from "../lib/anchor";
import { useMuseum } from "../lib/store";
import { formatInt, formatMegapixels } from "../lib/format";
import { useReveal } from "../lib/useReveal";
import { Hall } from "./Hall";

// The collection as ONE hall, paged horizontally: a native scroll-snap
// deck (real momentum, real swipe, real scrollbar) driven equally by
// arrows, keyboard, drag, and deep links. Rooms are printed stills —
// weightless to page through; Inspect hangs the real model. The page
// stays four sections tall no matter how the collection grows. The walk
// runs 002→006 and closes on 001 — the founding piece ends the tour
// rather than opening the page.

export function Wing({ hasWebGL }: { hasWebGL: boolean }) {
  const { stats, reduced, openInspect } = useMuseum();
  const deckRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [announced, setAnnounced] = useState(0);
  const reveal = useReveal<HTMLDivElement>();

  // The visual counter tracks every midpoint crossing; the SPOKEN counter
  // waits for the scroll to settle so one keypress or momentum swipe is
  // announced once, not as a burst of stale positions.
  useEffect(() => {
    const t = window.setTimeout(() => setAnnounced(active), 350);
    return () => window.clearTimeout(t);
  }, [active]);

  // Remember the settled room (per tab): a reload while reading the
  // collection reopens on this very slide.
  useEffect(() => {
    const num = WALK[announced]?.num;
    if (!num) return;
    try {
      sessionStorage.setItem("aurel-room", `au-${num}`);
    } catch {
      /* fine without */
    }
  }, [announced]);

  // Measured strip — filled by the idle warmup pass (and by any stage
  // that loads first), straight from the files. No view mounts for this.
  let triangles = 0;
  let texturePixels = 0;
  let measured = 0;
  for (const e of ALL_EXHIBITS) {
    const s = stats[e.id];
    if (!s) continue;
    measured += 1;
    triangles += s.triangles;
    texturePixels += s.texturePixels;
  }

  // Scroll-spy: the active slide is the one whose left edge sits nearest
  // the deck's scroll-padding line. rAF-throttled. When the deck is parked
  // at its maximum scroll the LAST slide is active by definition — on very
  // wide viewports its edge can never reach the snap line, and the argmin
  // alone would hand the crown to its neighbour.
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    let raf = 0;
    // geometry cached per resize, not re-queried per scroll frame — the
    // spy runs inside every glide frame and must stay near-free
    let slides: HTMLElement[] = [];
    let pad = 0;
    const remeasure = () => {
      slides = Array.from(deck.querySelectorAll<HTMLElement>(".slide"));
      pad = parseFloat(getComputedStyle(deck).scrollPaddingInlineStart) || 0;
    };
    remeasure();
    const measureActive = () => {
      raf = 0;
      if (!slides.length) return;
      if (deck.scrollLeft >= deck.scrollWidth - deck.clientWidth - 2) {
        setActive(slides.length - 1);
        return;
      }
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft - pad - deck.scrollLeft);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measureActive);
    };
    deck.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    measureActive();
    return () => {
      deck.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Rapid paging: arrows/keys act on where the deck is HEADED, not where
  // the lagging scroll-spy still says it is. The pending target clears
  // shortly after the scroll settles.
  const pendingRef = useRef<number | null>(null);
  const pendingTimer = useRef(0);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  // The glide is hand-rolled: the browser's smooth scrollTo re-targets
  // against mandatory snap mid-flight and stutters. A plain rAF tween
  // with snap parked lands exactly on the boundary, then snap resumes.
  const glideRef = useRef(0);
  const stopGlide = useCallback((restoreSnap: boolean) => {
    if (glideRef.current) {
      cancelAnimationFrame(glideRef.current);
      glideRef.current = 0;
    }
    if (restoreSnap && deckRef.current) deckRef.current.style.scrollSnapType = "";
  }, []);

  // the visitor taking over (drag / wheel / touch) always beats the glide
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    const cancel = () => {
      if (glideRef.current) stopGlide(true);
    };
    deck.addEventListener("pointerdown", cancel, { passive: true });
    deck.addEventListener("wheel", cancel, { passive: true });
    deck.addEventListener("touchstart", cancel, { passive: true });
    return () => {
      deck.removeEventListener("pointerdown", cancel);
      deck.removeEventListener("wheel", cancel);
      deck.removeEventListener("touchstart", cancel);
      stopGlide(true);
    };
  }, [stopGlide]);

  const goTo = useCallback(
    (index: number) => {
      const deck = deckRef.current;
      if (!deck) return;
      const slides = deck.querySelectorAll<HTMLElement>(".slide");
      const clamped = Math.max(0, Math.min(index, slides.length - 1));
      const target = slides[clamped];
      if (!target) return;
      pendingRef.current = clamped;
      window.clearTimeout(pendingTimer.current);
      pendingTimer.current = window.setTimeout(() => {
        pendingRef.current = null;
      }, 900);
      const pad = parseFloat(getComputedStyle(deck).scrollPaddingInlineStart) || 0;
      const max = deck.scrollWidth - deck.clientWidth;
      // Rect-based, NOT offsetLeft: the slides' offsetParent is the wing, so
      // once the deck is narrower than the wing and centered (≥1560px
      // viewports) offsetLeft carries the centering margin — the glide then
      // lands past the real snap point and mandatory snap jerks it back on
      // arrival (the wide-screen "pane flashes then vanishes" bug).
      const rawEnd =
        deck.scrollLeft +
        (target.getBoundingClientRect().left - deck.getBoundingClientRect().left) -
        pad;
      const end = Math.max(0, Math.min(rawEnd, max));
      stopGlide(false);
      if (reducedRef.current) {
        deck.style.scrollSnapType = "";
        deck.scrollLeft = end;
        return;
      }
      const start = deck.scrollLeft;
      if (Math.abs(end - start) < 1) {
        deck.style.scrollSnapType = "";
        return;
      }
      deck.style.scrollSnapType = "none";
      const dur = Math.min(700, 340 + Math.abs(end - start) * 0.1);
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        deck.scrollLeft = start + (end - start) * eased;
        if (t < 1) {
          glideRef.current = requestAnimationFrame(step);
        } else {
          glideRef.current = 0;
          deck.style.scrollSnapType = "";
        }
      };
      glideRef.current = requestAnimationFrame(step);
    },
    [stopGlide]
  );

  const page = useCallback(
    (delta: number) => {
      goTo((pendingRef.current ?? active) + delta);
    },
    [goTo, active]
  );

  // Room anchors (#au-004 deep links, and the per-tab restore via
  // START_ANCHOR) land on their slide even though the walk is horizontal.
  // The vertical walk to the wing is OURS on every anchor: goTo's
  // programmatic deck scroll aborts Chromium's native fragment-scroll
  // sequence (innermost scroller first), so the browser's own vertical
  // leg never runs. Each anchor is handled once.
  const handledHash = useRef<string | null>(null);
  useEffect(() => {
    const align = (num: string | null) => {
      if (!num || handledHash.current === num) return;
      const idx = WALK.findIndex((e) => e.num === num);
      if (idx < 0) return;
      handledHash.current = num;
      // Truly instant (and abort-proof): the wing appears at once, then
      // the deck glides to the room. NOT "auto" — with the page's CSS
      // scroll-behavior:smooth, "auto" animates, and a second smooth
      // scroll re-enters the sequencer fight goTo just won.
      document.getElementById("collection")?.scrollIntoView({ behavior: "instant" });
      goTo(idx);
    };
    // initial: START_ANCHOR (a real fragment wins inside it by design)
    align(((START_ANCHOR ?? "").match(/^au-(\d+)$/) || [])[1] ?? null);
    const onHash = () => {
      handledHash.current = null;
      align((location.hash.match(/^#au-(\d+)$/) || [])[1] ?? null);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [goTo]);

  const onDeckKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      page(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      page(-1);
    } else if ((e.key === "Home" || e.key === "End") && e.target === deckRef.current) {
      e.preventDefault();
      goTo(e.key === "Home" ? 0 : WALK.length - 1);
    }
  };

  return (
    <section
      className="wing"
      id="collection"
      aria-roledescription="carousel"
      aria-label="The permanent collection"
    >
      <div className="wing-head reveal" ref={reveal}>
        <div className="wing-head-left">
          <p className="kicker">The permanent collection</p>
          <h2 className="intro-title">
            Objects this considered deserve a room, not a thumbnail.
          </h2>
        </div>
        <dl className="wing-strip" aria-label="Collection, measured live">
          <div>
            <dt>Works on view</dt>
            <dd>{ALL_EXHIBITS.length}</dd>
          </div>
          <div>
            <dt>Triangles on view</dt>
            <dd data-live="triangles">{measured ? formatInt(triangles) : "—"}</dd>
          </div>
          <div>
            <dt>Painted surface</dt>
            <dd>{measured ? formatMegapixels(texturePixels) : "—"}</dd>
          </div>
          <div>
            <dt>Photographs</dt>
            <dd>0</dd>
          </div>
        </dl>
        <div className="wing-controls">
          <WingArrow dir={-1} active={active} page={page} />
          <p className="wing-index">
            <strong>{String(active + 1).padStart(2, "0")}</strong>
            {" / "}
            {String(WALK.length).padStart(2, "0")}
          </p>
          <p className="visually-hidden" aria-live="polite">
            {`Work ${announced + 1} of ${WALK.length}: ${WALK[announced]?.title ?? ""}`}
          </p>
          <WingArrow dir={1} active={active} page={page} />
        </div>
      </div>

      <div
        className="deck"
        ref={deckRef}
        tabIndex={0}
        role="group"
        aria-label={`${WALK.length} works — arrow keys, swipe, or the controls page between them`}
        onKeyDown={onDeckKeyDown}
      >
        {WALK.map((exhibit, i) => (
          <Hall
            key={exhibit.id}
            exhibit={exhibit}
            index={i}
            count={WALK.length}
            hasWebGL={hasWebGL}
            isActive={i === active}
            workStats={stats[exhibit.id]}
            onInspect={openInspect}
          />
        ))}
      </div>

      <div className="deck-nav">
        <WingArrow dir={-1} active={active} page={page} />
        <WingArrow dir={1} active={active} page={page} />
      </div>
    </section>
  );
}

/** One paging arrow — the same button in the wing head and at the foot
 *  of the deck, so both hands land on identical controls. */
function WingArrow({
  dir,
  active,
  page,
}: {
  dir: -1 | 1;
  active: number;
  page: (delta: number) => void;
}) {
  const atEdge = dir === -1 ? active <= 0 : active >= WALK.length - 1;
  return (
    <button
      type="button"
      className="wing-arrow"
      onClick={() => {
        if (!atEdge) page(dir);
      }}
      aria-disabled={atEdge}
      aria-label={dir === -1 ? "Previous work" : "Next work"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {dir === -1 ? (
          <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
