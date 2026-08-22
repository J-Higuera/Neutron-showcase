import { Suspense, useCallback, useState } from "react";
import { FEATURED } from "../data/collection";
import type { WorkStats } from "../lib/stats";
import { ExhibitStage } from "../three/Stage";
import StageCanvas from "./StageCanvas";

// The entrance's single live case, in its own in-pane canvas. It mounts
// behind the baked still once the GL runtime is armed; the still fades
// the moment the work reports in — which also re-opens the canvas's warm
// window so the first real frames render immediately.

export default function FeatureView({
  reduced,
  onLive,
}: {
  reduced: boolean;
  onLive: (id: string, stats: WorkStats) => void;
}) {
  const [wake, setWake] = useState(0);
  const handleLive = useCallback(
    (id: string, stats: WorkStats) => {
      onLive(id, stats);
      setWake((w) => w + 1);
    },
    [onLive]
  );

  return (
    <StageCanvas zIndex={1} wake={wake}>
      <Suspense fallback={null}>
        <ExhibitStage exhibit={FEATURED} reduced={reduced} onStats={handleLive} />
      </Suspense>
    </StageCanvas>
  );
}
