import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import { MOOD_FILES, type Exhibit } from "../data/collection";
import { extractStats, type WorkStats } from "../lib/stats";
import { buildHeadphone, type HeadphoneBuild } from "./headphone";

// The house treatment. Every work — permanent collection, founding piece,
// or a visitor's loan — hangs in the same rig: image-based lighting by
// mood, a key and a rim, a soft contact shadow, and a slow full turntable.
// Deliberately NOT cursor-reactive: the hover lean/lift read as a sudden
// jump (owner call, 08-21) — the works simply turn on their own. Scene
// components receive everything as props; nothing in here reaches for
// React context across the canvas bridge.

export interface BuildHandle {
  root: THREE.Object3D;
  setExplode?: (t: number) => void;
  headphone?: HeadphoneBuild;
}

/** Scale + center a wrapper group so its content fits a bounding sphere.
 *  Idempotent by construction: the wrapper is reset to a neutral frame
 *  before measuring, so a re-run (React re-firing an effect) converges on
 *  the same fit instead of unwinding it. Measured DETACHED from its parent:
 *  setFromObject works in world space, and the fit effect can fire after the
 *  rig has already posed (float/lean/turn) — any inherited offset is
 *  multiplied by the fit scale, which flung a tiny 75×-fitted loan model
 *  whole metres off the stage. */
function fitInto(wrapper: THREE.Object3D, radius: number, yLift = 0): void {
  wrapper.scale.setScalar(1);
  wrapper.position.set(0, 0, 0);
  const parent = wrapper.parent;
  parent?.remove(wrapper);
  try {
    wrapper.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(wrapper);
    if (box.isEmpty()) return;
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const scale = radius / (sphere.radius || 1);
    wrapper.scale.setScalar(scale);
    wrapper.position.set(
      -sphere.center.x * scale,
      -sphere.center.y * scale + yLift,
      -sphere.center.z * scale
    );
    wrapper.updateMatrixWorld(true);
  } finally {
    parent?.add(wrapper);
  }
}

/** Turntable rig: a slow, steady 360° turn with a gentle float. */
function SpinRig({
  spin,
  reduced,
  float = true,
  children,
}: {
  spin: number;
  reduced: boolean;
  float?: boolean;
  children: ReactNode;
}) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const angle = useRef(0);

  useFrame((state, dt) => {
    if (!outer.current || !inner.current || reduced) return;
    angle.current += spin * Math.min(dt, 0.1);
    outer.current.rotation.y = angle.current;
    if (float) {
      inner.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.035;
    }
  });

  return (
    <group ref={outer}>
      <group ref={inner}>{children}</group>
    </group>
  );
}

function GlbWork({
  exhibit,
  onStats,
  onBuild,
}: {
  exhibit: Exhibit;
  onStats?: (id: string, stats: WorkStats) => void;
  onBuild?: (handle: BuildHandle) => void;
}) {
  const { scene } = useGLTF(exhibit.src!, "./draco/", true);
  // Clone per mount: the hall and the inspect overlay can then both hang
  // the work at once. Geometries and textures are shared; mesh material
  // pointers are per-clone, which is exactly what the study modes swap.
  const clone = useMemo(() => scene.clone(true), [scene]);
  const wrapper = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!wrapper.current) return;
    fitInto(wrapper.current, exhibit.fitRadius, exhibit.yLift ?? 0);
    onStats?.(exhibit.id, extractStats(clone));
    onBuild?.({ root: clone });
  }, [clone, exhibit, onStats, onBuild]);

  return (
    <group ref={wrapper}>
      <primitive object={clone} />
    </group>
  );
}

function FoundingWork({
  exhibit,
  onStats,
  onBuild,
}: {
  exhibit: Exhibit;
  onStats?: (id: string, stats: WorkStats) => void;
  onBuild?: (handle: BuildHandle) => void;
}) {
  const build = useMemo(() => buildHeadphone(), []);
  const wrapper = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!wrapper.current) return;
    fitInto(wrapper.current, exhibit.fitRadius, exhibit.yLift ?? 0);
    onStats?.(exhibit.id, extractStats(build.group));
    onBuild?.({ root: build.group, setExplode: build.setExplode, headphone: build });
  }, [build, exhibit, onStats, onBuild]);

  return (
    <group ref={wrapper}>
      <primitive object={build.group} />
    </group>
  );
}

function LoanWorkView({
  exhibit,
  object,
  onBuild,
}: {
  exhibit: Exhibit;
  object: THREE.Object3D;
  onBuild?: (handle: BuildHandle) => void;
}) {
  const clone = useMemo(() => object.clone(true), [object]);
  const wrapper = useRef<THREE.Group>(null);
  useEffect(() => {
    if (!wrapper.current) return;
    fitInto(wrapper.current, exhibit.fitRadius, exhibit.yLift ?? 0);
    onBuild?.({ root: clone });
  }, [clone, exhibit, onBuild]);
  return (
    <group ref={wrapper}>
      <primitive object={clone} />
    </group>
  );
}

export function ExhibitModel({
  exhibit,
  object,
  onStats,
  onBuild,
}: {
  exhibit: Exhibit;
  object?: THREE.Object3D;
  onStats?: (id: string, stats: WorkStats) => void;
  onBuild?: (handle: BuildHandle) => void;
}) {
  if (object) return <LoanWorkView exhibit={exhibit} object={object} onBuild={onBuild} />;
  if (exhibit.src)
    return <GlbWork exhibit={exhibit} onStats={onStats} onBuild={onBuild} />;
  return <FoundingWork exhibit={exhibit} onStats={onStats} onBuild={onBuild} />;
}

export function StageLights({ mood }: { mood: Exhibit["mood"] }) {
  const warm = mood !== "night";
  return (
    <>
      <ambientLight intensity={0.14} />
      <directionalLight
        position={[3.4, 4.2, 3.2]}
        intensity={warm ? 1.15 : 0.9}
        color={warm ? 0xfff0dd : 0xdde8ff}
      />
      <directionalLight
        position={[-3.6, 2.4, -3.4]}
        intensity={0.75}
        color={mood === "night" ? 0x8fa8ff : 0xffe6c4}
      />
    </>
  );
}

/**
 * A complete hall interior: camera, mood lighting, shadow, rig, work.
 * Used by the entrance, every gallery view, and the loan plinth.
 */
export function ExhibitStage({
  exhibit,
  reduced,
  object,
  onStats,
  onBuild,
  shadowFrames = 1,
  children,
}: {
  exhibit: Exhibit;
  reduced: boolean;
  object?: THREE.Object3D;
  onStats?: (id: string, stats: WorkStats) => void;
  onBuild?: (handle: BuildHandle) => void;
  shadowFrames?: number;
  children?: ReactNode;
}) {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={exhibit.camera.position}
        fov={exhibit.camera.fov}
        onUpdate={(c) => c.lookAt(0, 0.1, 0)}
      />
      <Environment files={MOOD_FILES[exhibit.mood]} environmentIntensity={0.9} />
      <StageLights mood={exhibit.mood} />
      <SpinRig spin={exhibit.spin} reduced={reduced}>
        <ExhibitModel
          exhibit={exhibit}
          object={object}
          onStats={onStats}
          onBuild={onBuild}
        />
        {children}
      </SpinRig>
      <ContactShadows
        position={[0, -1.85, 0]}
        opacity={0.6}
        scale={8}
        blur={2.6}
        far={3.4}
        resolution={256}
        frames={shadowFrames}
        color={0x000000}
      />
    </>
  );
}
