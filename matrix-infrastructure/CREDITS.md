# Matrix v2 — Credits

## Photography
All photographs are stored locally in `assets/` and are not hotlinked. The three
images are carried over from the v1 build (`technology-company-called-matrix-creative-direct`,
acquired 2026-07-23 by the asset-acquisition pipeline). Source URLs were not recorded
in the v1 build folder; they originate from the pipeline's free-stock sources
(Unsplash/Pexels-class licensing).

| Local file | Subject | Provenance |
|---|---|---|
| `assets/server-racks-dark.jpg` | Dark data-hall server racks | carried from v1, free-stock acquisition |
| `assets/network-switch-cables.jpg` | Network switch with patch cables | carried from v1, free-stock acquisition |
| `assets/cabling-fiber.jpg` | Fiber cabling detail | carried from v1, free-stock acquisition |

## Libraries (vendored locally, no CDN, no installs)
- [three.js](https://threejs.org) r179 — MIT license. `assets/vendor/three.module.min.js`
  + `three.core.min.js`, file-copied from the owner-approved aurel-v2 npm install.
- [GSAP](https://gsap.com) core + ScrollTrigger — standard GSAP license.
  `assets/vendor/gsap.min.js` + `ScrollTrigger.min.js`, file-copied from miga-v2's vendored copy.

## Fonts
Google Fonts: Space Grotesk, Inter, Newsreader (italic), JetBrains Mono.
