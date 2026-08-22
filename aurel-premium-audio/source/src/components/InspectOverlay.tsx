import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, OrbitControls, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { MOOD_FILES, MOOD_LABELS, type Mood } from "../data/collection";
import { useMuseum } from "../lib/store";
import {
  applyViewMode,
  VIEW_MODE_LABELS,
  type MaterialBackup,
  type ViewMode,
} from "../lib/materialModes";
import { formatInt } from "../lib/format";
import { ExhibitModel, StageLights, type BuildHandle } from "../three/Stage";

// Inspect mode — the museum's argument made operable. The work re-hangs in
// a private room with free orbit, three lighting moods, four study modes,
// and a live readout straight from the renderer. The founding piece adds a
// disassembly slider with annotated parts. Everything on screen is being
// computed right now, and the readout is how the museum proves it.

const MOODS: Mood[] = ["studio", "interior", "night"];
const MODES: ViewMode[] = ["presentation", "clay", "wireframe", "normals"];

interface LiveSample {
  calls: number;
  triangles: number;
  fps: number;
}

function LiveProbe({ onSample }: { onSample: (s: LiveSample) => void }) {
  const gl = useThree((s) => s.gl);
  const acc = useRef({ frames: 0, time: 0 });

  // The composer renders in several passes; with autoReset the info block
  // would only ever describe the final fullscreen quad (2 triangles). Manual
  // reset at the top of each frame makes the readout describe the whole
  // frame — the truth, which is the point of showing it.
  useEffect(() => {
    gl.info.autoReset = false;
    return () => {
      gl.info.autoReset = true;
    };
  }, [gl]);

  useFrame((_, dt) => {
    const a = acc.current;
    a.frames += 1;
    a.time += dt;
    if (a.time >= 0.5) {
      onSample({
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        fps: Math.round(a.frames / a.time),
      });
      a.frames = 0;
      a.time = 0;
    }
    gl.info.reset();
  });
  return null;
}

function Turntable({
  enabled,
  speed,
  children,
}: {
  enabled: boolean;
  speed: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current && enabled) ref.current.rotation.y += Math.min(dt, 0.1) * speed;
  });
  return <group ref={ref}>{children}</group>;
}

// Each label floats offset from its part so chips never stack when the
// exploded diagram compresses under a shallow camera angle.
const HEADPHONE_LABELS: Array<{
  anchor: "driver" | "grille" | "pad" | "cushion" | "port";
  label: string;
  offset: [number, number, number];
}> = [
  { anchor: "driver", label: "Planar-magnet driver", offset: [0, -0.6, 0] },
  { anchor: "grille", label: "Open-back grille", offset: [0, 0.55, 0] },
  { anchor: "pad", label: "Lambskin pad", offset: [0, -0.55, 0] },
  { anchor: "cushion", label: "Leather crown cushion", offset: [0, 0.5, 0] },
  { anchor: "port", label: "Detachable cable port", offset: [0, -0.4, 0] },
];

function Annotations({ handle }: { handle: BuildHandle }) {
  if (!handle.headphone) return null;
  const anchors = handle.headphone.anchors;
  return (
    <>
      {HEADPHONE_LABELS.map(({ anchor, label, offset }) =>
        createPortal(
          <Html center className="anno" position={offset} zIndexRange={[30, 10]}>
            <span>{label}</span>
          </Html>,
          anchors[anchor]
        )
      )}
    </>
  );
}

export default function InspectOverlay() {
  const { inspect, closeInspect, reduced, stats } = useMuseum();
  const [mood, setMood] = useState<Mood>("studio");
  const [mode, setMode] = useState<ViewMode>("presentation");
  const [turntable, setTurntable] = useState(false);
  const [explode, setExplode] = useState(0);
  const [live, setLive] = useState<LiveSample | null>(null);
  const [handle, setHandle] = useState<BuildHandle | null>(null);
  const backupRef = useRef<MaterialBackup>(new Map());
  const closeRef = useRef<HTMLButtonElement>(null);

  const exhibit = inspect?.exhibit ?? null;

  // Re-arm per exhibit: house mood, presentation, assembled, gentle motion.
  useEffect(() => {
    if (!exhibit) return;
    setMood(exhibit.mood);
    setMode("presentation");
    setExplode(0);
    setTurntable(!reduced);
    setHandle(null);
    setLive(null);
    backupRef.current = new Map();
  }, [exhibit, reduced]);

  useEffect(() => {
    if (!inspect) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeInspect();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [inspect, closeInspect]);

  useEffect(() => {
    if (handle) applyViewMode(handle.root, mode, backupRef.current);
  }, [handle, mode]);

  useEffect(() => {
    handle?.setExplode?.(explode / 100);
  }, [handle, explode]);

  if (!inspect || !exhibit) return null;

  const s = stats[exhibit.id];
  const camera: [number, number, number] = [
    exhibit.camera.position[0] * 1.18,
    exhibit.camera.position[1] * 1.18 + 0.15,
    exhibit.camera.position[2] * 1.18,
  ];

  return (
    <div className="inspect" role="dialog" aria-modal="true" aria-label={`Inspect ${exhibit.title}`}>
      <Canvas
        className="inspect-canvas"
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.12;
        }}
      >
        <color attach="background" args={["#08090c"]} />
        <PerspectiveCamera makeDefault position={camera} fov={exhibit.camera.fov} />
        <Suspense fallback={null}>
          <Environment files={MOOD_FILES[mood]} environmentIntensity={0.95} />
          <StageLights mood={mood} />
          <Turntable enabled={turntable && !reduced} speed={exhibit.spin * 1.6}>
            <ExhibitModel exhibit={exhibit} object={inspect.object} onBuild={setHandle} />
            {handle && explode > 32 && <Annotations handle={handle} />}
          </Turntable>
          <ContactShadows
            position={[0, -1.95, 0]}
            opacity={0.55}
            scale={9}
            blur={2.4}
            far={3.6}
            resolution={256}
            color={0x000000}
          />
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={2.1}
          maxDistance={10}
          enableDamping={!reduced}
          target={[0, 0.1, 0]}
        />
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.5} luminanceThreshold={1} levels={7} />
          <Vignette offset={0.22} darkness={0.62} />
        </EffectComposer>
        <LiveProbe onSample={setLive} />
      </Canvas>

      {!handle && (
        <div className="stage-loading inspect-loading" aria-hidden="true">
          <span className="loading-ring" />
          <span className="loading-note">Hanging {exhibit.title}…</span>
        </div>
      )}

      <header className="inspect-top">
        <div className="inspect-id">
          <span className="plaque-num">AU·{exhibit.num}</span>
          <strong>{exhibit.title}</strong>
          <span className="inspect-maker">{exhibit.maker}</span>
        </div>
        <button
          type="button"
          className="inspect-close"
          ref={closeRef}
          onClick={closeInspect}
        >
          <span className="visually-hidden">Close</span>
          <span aria-hidden="true">✕</span>
        </button>
      </header>

      <div className="inspect-rail" aria-label="Inspection controls">
        <div className="rail-group" role="group" aria-label="Lighting mood">
          <p className="rail-label">Light</p>
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mood === m}
              onClick={() => setMood(m)}
            >
              {MOOD_LABELS[m]}
            </button>
          ))}
        </div>
        <div className="rail-group" role="group" aria-label="Study mode">
          <p className="rail-label">View</p>
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
            >
              {VIEW_MODE_LABELS[m]}
            </button>
          ))}
        </div>
        <div className="rail-group" role="group" aria-label="Motion">
          <p className="rail-label">Motion</p>
          <button
            type="button"
            aria-pressed={turntable}
            disabled={reduced}
            onClick={() => setTurntable((t) => !t)}
          >
            {reduced ? "Still (reduced motion)" : turntable ? "Turntable on" : "Turntable off"}
          </button>
        </div>
        {handle?.setExplode && (
          <div className="rail-group rail-explode" role="group" aria-label="Disassembly">
            <p className="rail-label">Disassemble</p>
            <input
              type="range"
              min={0}
              max={100}
              value={explode}
              aria-label="Disassembly amount"
              onChange={(e) => setExplode(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      <p className="inspect-live" aria-hidden="true">
        {live ? (
          <>
            <span>{live.calls} draw calls</span>
            <span>{formatInt(live.triangles)} triangles / frame</span>
            <span>{live.fps} fps</span>
          </>
        ) : (
          <span>waking the renderer…</span>
        )}
        {s && <span className="inspect-live-note">measured, not typed</span>}
      </p>
      <p className="inspect-hint" aria-hidden="true">
        Drag to orbit · scroll to approach
      </p>
    </div>
  );
}
