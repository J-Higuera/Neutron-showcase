// The permanent collection. Every number on a plaque that can be measured
// is measured — triangle counts, materials, textures are extracted from the
// loaded file at runtime, never typed here. This file holds only identity,
// provenance, and staging.

export type Mood = "studio" | "interior" | "night";

export interface Exhibit {
  id: string;
  num: string;
  title: string;
  maker: string;
  year: string;
  medium: string;
  license: string;
  licenseUrl?: string;
  acquisition: string;
  story: string;
  /** GLB path relative to the deployed page; absent = procedural build. */
  src?: string;
  mood: Mood;
  /** Accent hue for the hall's wash + reticle. */
  hue: number;
  /** Normalized bounding-sphere radius the stage fits the work to. */
  fitRadius: number;
  /** Vertical nudge after fitting (stage units). */
  yLift?: number;
  /** Idle turntable speed, radians/s. */
  spin: number;
  camera: { position: [number, number, number]; fov: number };
}

export const MOOD_FILES: Record<Mood, string> = {
  studio: "hdri/studio_small_03_1k.hdr",
  interior: "hdri/st_fagans_interior_1k.hdr",
  night: "hdri/dikhololo_night_1k.hdr",
};

export const MOOD_LABELS: Record<Mood, string> = {
  studio: "Studio",
  interior: "Gallery",
  night: "Night",
};

/** Exhibit 001 greets visitors in the entrance hall; 002–006 hang in the wings. */
export const FOUNDING: Exhibit = {
  id: "reference-one",
  num: "001",
  title: "Reference One",
  maker: "Aurel Atelier",
  year: "2026",
  medium: "Procedural geometry — lathe shells, planar-magnet driver, drawn brand mark",
  license: "Museum original",
  acquisition: "The founding piece · built in-house",
  story:
    "Aurel began as an audio atelier. When the reference headphone was rebuilt digitally — driver bars, copper trace, the liner inside the cup — the file outgrew the catalogue, and the atelier became a museum. Every part you can point at can come apart.",
  mood: "night",
  hue: 226,
  fitRadius: 1.22,
  yLift: 0.05,
  spin: 0.14,
  camera: { position: [0.6, 0.35, 4.8], fov: 32 },
};

export const COLLECTION: Exhibit[] = [
  {
    id: "damaged-helmet",
    num: "002",
    title: "Battle-Damaged Helmet",
    maker: "theblueturtle_ · glTF by ctxwing",
    year: "2016",
    medium: "Photoscanned PBR — albedo, normal, occlusion-roughness-metal",
    license: "CC BY-NC 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
    acquisition: "On loan since 2026 · non-commercial exhibition",
    story:
      "The most-rendered object in real-time graphics, hung here the way it deserves: full normal detail, every scratch load-bearing. The wear is painted into the roughness map — turn it and watch the scorching move against the light.",
    src: "models/damaged-helmet.glb",
    mood: "studio",
    hue: 4,
    fitRadius: 1.14,
    spin: 0.16,
    camera: { position: [0.2, 0.25, 4.4], fov: 30 },
  },
  {
    id: "mosquito-in-amber",
    num: "003",
    title: "Mosquito in Amber",
    maker: "Loïc Norgeot · scan by Geoffrey Marchal",
    year: "2018",
    medium: "Surface scan in volumetric transmission — light refracts in real time",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    acquisition: "Acquired 2026 · Sketchfab collection",
    story:
      "A real insect, scanned, cast in computed resin. The amber is not a picture of amber: light enters the volume, bends, and finds the mosquito — your machine is doing the optics. The museum considers this its clearest argument.",
    src: "models/mosquito-in-amber.glb",
    mood: "interior",
    hue: 48,
    fitRadius: 1.1,
    spin: 0.12,
    camera: { position: [0.1, 0.15, 4.1], fov: 28 },
  },
  {
    id: "antique-camera",
    num: "004",
    title: "Antique Plate Camera",
    maker: "Maximillan Kamps · UX3D",
    year: "2018",
    medium: "PBR hard-surface — lacquered wood, brass, bellows leather",
    license: "CC0 · public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    acquisition: "Acquired 2026 · unrestricted gift",
    story:
      "An instrument for fixing images, now fixed as one itself. The brass keeps its machining marks and the bellows their creases; stand close and the lens barrel still promises a picture it can no longer take.",
    src: "models/antique-camera.glb",
    mood: "interior",
    hue: 192,
    fitRadius: 1.14,
    yLift: -0.05,
    spin: 0.14,
    camera: { position: [0.4, 0.5, 4.9], fov: 33 },
  },
  {
    id: "iridescence-lamp",
    num: "005",
    title: "Iridescence Lamp",
    maker: "Wayfair 3D",
    year: "2022",
    medium: "Thin-film iridescence over transmission glass",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    acquisition: "Acquired 2026 · materials study",
    story:
      "A study in the museum's favorite impossible material: a film some hundreds of nanometers thick, simulated per pixel. The color you see is interference, not paint — move, and it disagrees with you politely.",
    src: "models/iridescence-lamp.glb",
    mood: "studio",
    hue: 268,
    fitRadius: 1.18,
    spin: 0.16,
    camera: { position: [0.3, 0.35, 4.7], fov: 32 },
  },
  {
    id: "boombox",
    num: "006",
    title: "Boombox",
    maker: "Microsoft",
    year: "2017",
    medium: "PBR hard-surface — injection plastics, speaker mesh, chrome",
    license: "CC0 · public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    acquisition: "Acquired 2026 · the wing where Aurel came from",
    story:
      "The museum's nod to its own past life in audio. Loud by design and silent by medium: every grille hole is geometry, every dial readable, and not one decibel — the first object in the collection you are encouraged to imagine hearing.",
    src: "models/boombox.glb",
    mood: "studio",
    hue: 318,
    fitRadius: 1.14,
    spin: 0.18,
    camera: { position: [0.2, 0.2, 4.5], fov: 31 },
  },
];

export const ALL_EXHIBITS: Exhibit[] = [FOUNDING, ...COLLECTION];

/** The single work greeting visitors beside the title. Never the founding
 *  headphone (identity ruling), and deliberately a plain-PBR piece: the
 *  amber's volumetric transmission is the priciest material in the house,
 *  and the entrance must stay light on every GPU. */
export const FEATURED: Exhibit = COLLECTION.find((e) => e.id === "antique-camera")!;

/** The visitor's walk — the deck order. The founding piece
 *  hangs LAST: the museum leads with the collection and the walk ends
 *  where Aurel began. (The registry stays in catalogue order.) */
export const WALK: Exhibit[] = [...COLLECTION, FOUNDING];

/** Synthesized exhibit identity for a visitor's dropped file. */
export function loanExhibit(fileName: string): Exhibit {
  return {
    id: "visitor-loan",
    num: "L·01",
    title: fileName.replace(/\.(glb|gltf)$/i, ""),
    maker: "Private lender",
    year: new Date().getFullYear().toString(),
    medium: "Visitor loan — read, hung, and lit on your device",
    license: "Remains yours",
    acquisition: "Never uploaded · leaves when you do",
    story:
      "Hung sight unseen, as promised. The registrar read the file locally, measured what is inside, and gave it the house treatment — lighting, plaque, and a room of its own.",
    mood: "studio",
    hue: 226,
    fitRadius: 1.0,
    spin: 0.14,
    camera: { position: [0.3, 0.3, 4.8], fov: 32 },
  };
}
