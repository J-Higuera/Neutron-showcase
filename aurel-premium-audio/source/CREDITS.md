# AUREL — Museum of Dimensional Craft · Credits

AUREL is a fictional institution built as a demonstration site. Every 3D work
is rendered live in the browser; nothing is a photograph or a pre-rendered
video. The works below are exhibited under their true names and licenses, and
the same credits appear on the plaques and in the site's registry.

## Works in the collection

| No. | Work | Maker | Source | License |
| --- | ---- | ----- | ------ | ------- |
| AU·001 | Reference One (headphone) | Aurel Atelier (procedural three.js build, authored in-house for this project) | this repository | — |
| AU·002 | Battle-Damaged Helmet | theblueturtle_ (model, 2016) · ctxwing (glTF conversion, 2018) | [KhronosGroup/glTF-Sample-Assets — DamagedHelmet](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/DamagedHelmet) | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) (exhibited non-commercially) |
| AU·003 | Mosquito in Amber | Loïc Norgeot · mosquito scan by Geoffrey Marchal · via Sketchfab | [KhronosGroup/glTF-Sample-Assets — MosquitoInAmber](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/MosquitoInAmber) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| AU·004 | Antique Plate Camera | Maximillan Kamps · UX3D (2018) | [KhronosGroup/glTF-Sample-Assets — AntiqueCamera](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/AntiqueCamera) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| AU·005 | Iridescence Lamp | Wayfair, LLC (2022) | [KhronosGroup/glTF-Sample-Assets — IridescenceLamp](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/IridescenceLamp) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| AU·006 | Boombox | Microsoft (2017) | [KhronosGroup/glTF-Sample-Assets — BoomBox](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/BoomBox) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |

Models were optimized for the web with [glTF Transform](https://gltf-transform.dev/)
(Draco geometry compression, WebP texture compression, textures capped at 2048px;
no mesh simplification — geometry is exhibited exactly as authored).

## Lighting environments

Image-based lighting uses three 1k HDR environments by **Poly Haven** (CC0),
obtained via the [pmndrs/drei-assets](https://github.com/pmndrs/drei-assets)
mirror: `studio_small_03`, `st_fagans_interior`, `dikhololo_night`.

## Type

Self-hosted webfonts, carried over from the Aurel v2 build: **Work Sans**
and **IBM Plex Mono** in use (Fraunces files remain shipped but unused since
the gallery-mode redesign; all SIL Open Font License, via Google Fonts /
google-webfonts-helper).

## Software

React 19 · React Three Fiber 9 · drei 10 · @react-three/postprocessing ·
three.js r185 (Draco decoder bundled from the three package) · Vite 8 ·
TypeScript. Visitor-loaned models are parsed entirely client-side with
three's GLTFLoader (Draco + Meshopt decoders wired); nothing is uploaded.
