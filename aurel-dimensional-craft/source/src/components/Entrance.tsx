import { Suspense, lazy, useState } from "react";
import type { CSSProperties } from "react";
import { ALL_EXHIBITS, FEATURED } from "../data/collection";
import { useMuseum } from "../lib/store";

// The entrance presents ONE work beside the title — never the founding
// headphone, and never a transmission-heavy piece (owner rulings, 08-21).
// It paints instantly as a baked still; once the GL runtime arms, the
// live stage mounts behind it and the still fades the moment the work
// reports in. Calm by construction: no cursor rig, just the slow house
// turntable.

const FeatureView = lazy(() => import("../gl/FeatureView"));

// The lede SPELLS the count ("Seven works on view") — the museum's voice, and how
// it has always read. It is still DERIVED, because the bug this replaced was a
// hardcoded count drifting from the collection (the plaque said 006 after a seventh
// work was hung). Past the list it falls back to the numeral rather than inventing
// a word, which is the only way this can be wrong and is visibly wrong when it is.
const COUNT_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
                     "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const countInWords = (n: number) => COUNT_WORDS[n] ?? String(n);

export function Entrance({ glReady }: { glReady: boolean }) {
  const { reduced } = useMuseum();
  const [live, setLive] = useState(false);
  const [posterReady, setPosterReady] = useState(false);

  return (
    <section className="entrance" id="top">
      <div className="entrance-copy">
        <p className="kicker">Est. MMXXVI · The digital wing is the only wing</p>
        <h1 className="entrance-title" aria-label="Aurel">
          AUREL
        </h1>
        <p className="entrance-sub">Museum of Dimensional Craft</p>
        <p className="entrance-lede">
          {countInWords(ALL_EXHIBITS.length)} works on view. Every still is printed from the museum's own files —
          and Inspect hangs the work itself, live in your browser at full
          fidelity. Admission is free, and the museum accepts loans: bring a work
          of your own.
        </p>
        <div className="entrance-ctas">
          <a className="btn btn-solid" href="#collection">
            Enter the collection
          </a>
          <a className="btn btn-ghost" href="#lend">
            Lend a work
          </a>
        </div>
        <dl className="entrance-facts" aria-label="The museum at a glance">
          <div>
            <dt>Works on view</dt>
            <dd>{String(ALL_EXHIBITS.length).padStart(3, "0")}</dd>
          </div>
          <div>
            <dt>Rendered</dt>
            <dd>Live · on device</dd>
          </div>
          <div>
            <dt>Admission</dt>
            <dd>Free</dd>
          </div>
        </dl>
      </div>

      <a
        className="feature"
        href={`#au-${FEATURED.num}`}
        style={{ "--hue": FEATURED.hue } as CSSProperties}
        aria-label={`On view now: AU ${FEATURED.num} — ${FEATURED.title}. Enter its room.`}
      >
        <span className="feature-stage" aria-hidden="true">
          {!posterReady && !live && (
            <span className="stage-loading">
              <span className="loading-ring" />
              <span className="loading-note">Opening the museum</span>
            </span>
          )}
          {/* under reduced motion the live view would stand as still as the
              still — keep the baked frame and spare the GPU */}
          {glReady && !reduced && (
            <Suspense fallback={null}>
              <FeatureView reduced={reduced} onLive={() => setLive(true)} />
            </Suspense>
          )}
          <img
            className={live ? "is-live" : undefined}
            src="thumbs/feature.webp"
            alt={`Baked still of AU ${FEATURED.num}: ${FEATURED.title}`}
            width="1645"
            height="1353"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setPosterReady(true)}
            ref={(el) => {
              if (el?.complete && el.naturalWidth > 0) setPosterReady(true);
            }}
          />
        </span>
        <span className="feature-label">
          <span className="feature-kicker">On view now</span>
          <span className="feature-title">
            AU·{FEATURED.num} — {FEATURED.title}
          </span>
          <span className="feature-cta">Enter its room →</span>
        </span>
      </a>

      <a className="scroll-cue" href="#collection" aria-hidden="true" tabIndex={-1}>
        <span />
      </a>
    </section>
  );
}
