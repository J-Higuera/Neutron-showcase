import type * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { extractStats, type WorkStats } from "../lib/stats";

// The registrar reads a visitor's file — entirely on their device — and
// measures it for the plaque. Imported dynamically the moment a file is
// offered; until then the loan desk is plain DOM.

export async function parseModel(
  file: File
): Promise<{ object: THREE.Object3D; stats: WorkStats }> {
  const buffer = await file.arrayBuffer();
  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath("./draco/");
  loader.setDRACOLoader(draco);
  loader.setMeshoptDecoder(MeshoptDecoder);
  try {
    const gltf = await loader.parseAsync(buffer, "");
    const object = gltf.scene ?? gltf.scenes[0];
    return { object, stats: extractStats(object) };
  } finally {
    draco.dispose();
  }
}
