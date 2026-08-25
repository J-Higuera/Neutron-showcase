import { memo, useRef, useState, type CSSProperties } from "react";
import type { Exhibit } from "../data/collection";
import type { WorkStats } from "../lib/stats";
import { formatInt, formatMegapixels } from "../lib/format";

// A room shows a PRINTED STILL of its work — the model-viewer poster
// pattern (image first, the full model only on demand): the deck stays
// weightless and Inspect hangs the real thing, live. The still is baked
// from the same file, numeral and wash included, so the pane looks
// exactly like the live render it was printed from. A loading ring
// stands in the pane until the still has painted — nothing ever looks
// bare or broken while bytes arrive.

// Memoized on purpose: the deck re-renders on every room change and every
// plaque measurement, and six rooms re-painting mid-glide read as jitter.
// Everything arrives as props (no context subscription), so only the two
// rooms whose state actually changed render.
export const Hall = memo(function Hall({
  exhibit,
  index,
  count,
  hasWebGL,
  isActive,
  workStats,
  onInspect,
}: {
  exhibit: Exhibit;
  index: number;
  count: number;
  hasWebGL: boolean;
  isActive: boolean;
  workStats?: WorkStats;
  onInspect: (exhibit: Exhibit, opener: HTMLElement | null) => void;
}) {
  const inspectRef = useRef<HTMLButtonElement>(null);
  const [imgReady, setImgReady] = useState(false);
  const s = workStats;

  return (
    <article
      className={`slide${isActive ? " is-active" : ""}`}
      id={`au-${exhibit.num}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${count} — ${exhibit.title}`}
      style={{ "--hue": exhibit.hue } as CSSProperties}
    >
      <div
        className={`hall-stage${hasWebGL ? " is-door" : ""}`}
        onClick={hasWebGL ? () => onInspect(exhibit, inspectRef.current) : undefined}
      >
        {!imgReady && (
          <div className="stage-loading" aria-hidden="true">
            <span className="loading-ring" />
            <span className="loading-note">Acquisition {exhibit.num} in transit</span>
          </div>
        )}
        <img
          className={`hall-still${imgReady ? " is-ready" : ""}`}
          src={`stills/au-${exhibit.num}.webp`}
          alt={`Baked still of AU ${exhibit.num}: ${exhibit.title}`}
          width="1668"
          height="1140"
          // NOT lazy: the wing is a horizontally-scrolled deck, so off-screen
          // rooms never enter the viewport on their own — a lazy still never
          // loads, its `is-ready` never fires, and the .stage-loading ring is
          // left standing (probe-proven, 2026-08-25). fetchPriority still
          // front-loads the first room.
          loading="eager"
          fetchPriority={index === 0 ? "high" : "auto"}
          decoding="async"
          onLoad={() => setImgReady(true)}
          ref={(el) => {
            if (el?.complete && el.naturalWidth > 0) setImgReady(true);
          }}
        />
        {hasWebGL && (
          <button
            type="button"
            ref={inspectRef}
            className="inspect-chip"
            onClick={(e) => {
              e.stopPropagation();
              onInspect(exhibit, inspectRef.current);
            }}
          >
            Inspect
          </button>
        )}
      </div>

      <aside className="plaque">
        <p className="plaque-num">AU·{exhibit.num}</p>
        <h3 className="plaque-title">{exhibit.title}</h3>
        <p className="plaque-maker">
          {exhibit.maker} · {exhibit.year}
        </p>
        <p className="plaque-medium">{exhibit.medium}</p>
        <p className="plaque-story">{exhibit.story}</p>
        <dl className="plaque-data" aria-label="Measured from the file">
          <div>
            <dt>Triangles</dt>
            <dd>{s ? formatInt(s.triangles) : "—"}</dd>
          </div>
          <div>
            <dt>Vertices</dt>
            <dd>{s ? formatInt(s.vertices) : "—"}</dd>
          </div>
          <div>
            <dt>Materials</dt>
            <dd>{s ? s.materials : "—"}</dd>
          </div>
          <div>
            <dt>Textures</dt>
            <dd>{s ? `${s.textures} · ${formatMegapixels(s.texturePixels)}` : "—"}</dd>
          </div>
        </dl>
        <p className="plaque-license">
          {exhibit.licenseUrl ? (
            <a href={exhibit.licenseUrl} target="_blank" rel="noreferrer">
              {exhibit.license}
            </a>
          ) : (
            exhibit.license
          )}
          <span> · {exhibit.acquisition}</span>
        </p>
      </aside>
    </article>
  );
});
