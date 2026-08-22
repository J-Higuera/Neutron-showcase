import * as THREE from "three";

// Inspect-mode display modes. Presentation restores the work's own
// materials from a per-mesh map; the study modes are shared override
// materials so switching is a pointer swap, not a rebuild.

export type ViewMode = "presentation" | "clay" | "wireframe" | "normals";

export const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  presentation: "Presentation",
  clay: "Clay",
  wireframe: "Wireframe",
  normals: "Normals",
};

const clay = new THREE.MeshStandardMaterial({
  color: 0xb6ad9d,
  roughness: 0.82,
  metalness: 0.02,
});

const wire = new THREE.MeshBasicMaterial({
  color: 0xc49a62,
  wireframe: true,
  transparent: true,
  opacity: 0.5,
});

const normals = new THREE.MeshNormalMaterial();

const OVERRIDES: Record<Exclude<ViewMode, "presentation">, THREE.Material> = {
  clay,
  wireframe: wire,
  normals,
};

export type MaterialBackup = Map<THREE.Mesh, THREE.Material | THREE.Material[]>;

export function applyViewMode(
  root: THREE.Object3D,
  mode: ViewMode,
  backup: MaterialBackup
): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    if (!backup.has(mesh)) backup.set(mesh, mesh.material);
    mesh.material = mode === "presentation" ? backup.get(mesh)! : OVERRIDES[mode];
  });
}

export function restoreMaterials(backup: MaterialBackup): void {
  for (const [mesh, original] of backup) mesh.material = original;
  backup.clear();
}
