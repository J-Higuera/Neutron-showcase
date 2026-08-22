import { Suspense } from "react";
import type { CSSProperties } from "react";
import { WALK } from "./data/collection";
import { ExhibitStage } from "./three/Stage";
import StageCanvas from "./gl/StageCanvas";

// The poster darkroom: /?bake=004 renders ONE hall pane live, at the
// desktop pane size, for the stills baker
// (scratchpad/aurel-v3-check/bake-stills.mjs). It is linked from nowhere
// and ships dormant behind the lazy gl chunk; under reduced motion the
// rig holds the authored front pose, which is the pose the posters use.
// `document.body.dataset.ready = "1"` is the baker's cue that the work
// has hung.

export default function BakePane({ num }: { num: string }) {
  const exhibit = WALK.find((e) => e.num === num) ?? WALK[0];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <div
      className="hall-stage bake-pane"
      style={
        {
          "--hue": exhibit.hue,
          position: "relative",
          width: 835,
          height: 570,
          containerType: "inline-size",
        } as CSSProperties
      }
    >
      <div className="hall-num" aria-hidden="true">
        {exhibit.num}
      </div>
      <StageCanvas zIndex={11}>
        <Suspense fallback={null}>
          <ExhibitStage
            exhibit={exhibit}
            reduced={reduced}
            onStats={() => {
              document.body.dataset.ready = "1";
            }}
          />
        </Suspense>
      </StageCanvas>
    </div>
  );
}
