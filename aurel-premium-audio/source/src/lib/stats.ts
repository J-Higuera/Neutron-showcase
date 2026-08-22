import * as THREE from "three";

// Plaque data is measured, never typed: traverse the real scene graph and
// count what is actually there. The same extractor serves the permanent
// collection, the procedural founding piece, and visitor loans.
// (Display formatters live in ./format — this module touches three and
// must stay out of the shell chunk.)

export interface WorkStats {
  triangles: number;
  vertices: number;
  meshes: number;
  materials: number;
  textures: number;
  /** Sum of unique texture pixels, for the "how much surface" line. */
  texturePixels: number;
}

export function extractStats(root: THREE.Object3D): WorkStats {
  let triangles = 0;
  let vertices = 0;
  let meshes = 0;
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  const textureSlots = [
    "map",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "aoMap",
    "emissiveMap",
    "bumpMap",
    "alphaMap",
    "envMap",
    "clearcoatMap",
    "clearcoatNormalMap",
    "clearcoatRoughnessMap",
    "transmissionMap",
    "thicknessMap",
    "sheenColorMap",
    "sheenRoughnessMap",
    "specularIntensityMap",
    "specularColorMap",
    "iridescenceMap",
    "iridescenceThicknessMap",
    "anisotropyMap",
  ] as const;

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    meshes += 1;
    const geo = mesh.geometry as THREE.BufferGeometry;
    const pos = geo.getAttribute("position");
    if (pos) {
      vertices += pos.count;
      const instances =
        (mesh as unknown as THREE.InstancedMesh).isInstancedMesh
          ? (mesh as unknown as THREE.InstancedMesh).count
          : 1;
      const tris = geo.index ? geo.index.count / 3 : pos.count / 3;
      triangles += Math.round(tris) * instances;
    }
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) {
      if (!m) continue;
      materials.add(m);
      for (const slot of textureSlots) {
        const t = (m as unknown as Record<string, unknown>)[slot];
        if (t && (t as THREE.Texture).isTexture) textures.add(t as THREE.Texture);
      }
    }
  });

  let texturePixels = 0;
  for (const t of textures) {
    const img = t.image as { width?: number; height?: number } | undefined;
    if (img?.width && img?.height) texturePixels += img.width * img.height;
  }

  return {
    triangles,
    vertices,
    meshes,
    materials: materials.size,
    textures: textures.size,
    texturePixels,
  };
}
