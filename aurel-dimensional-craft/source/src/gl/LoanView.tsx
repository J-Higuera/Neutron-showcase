import { Suspense, useCallback, useState } from "react";
import type * as THREE from "three";
import type { Exhibit } from "../data/collection";
import { ExhibitStage, type BuildHandle } from "../three/Stage";
import StageCanvas from "./StageCanvas";

// A visitor's loan on the house rig — its own in-pane canvas. The parsed
// object is already local, but the warm window still re-opens on hang so
// upload cost never waits for the visitor's scroll.

export default function LoanView({
  exhibit,
  reduced,
  object,
}: {
  exhibit: Exhibit;
  reduced: boolean;
  object: THREE.Object3D;
}) {
  const [wake, setWake] = useState(0);
  const handleBuild = useCallback((_handle: BuildHandle) => {
    setWake((w) => w + 1);
  }, []);

  return (
    <StageCanvas zIndex={11} wake={wake}>
      <Suspense fallback={null}>
        <ExhibitStage
          exhibit={exhibit}
          reduced={reduced}
          object={object}
          onBuild={handleBuild}
        />
      </Suspense>
    </StageCanvas>
  );
}
