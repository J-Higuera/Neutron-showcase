# Case study — PULSAR (the showcase landing, built 2026-08-07)

One real build, documented end to end by the builder (Claude Code): what was
decided, why, what broke, how each break was diagnosed, and how eight rounds of
owner feedback were turned into fixes. This is **one worked example, not a
template** — the value is in the reasoning, so every choice carries its why.
The live result: https://j-higuera.github.io/Neutron-showcase/neutron-showcase-root-pulsar/
(full source in that repo under `neutron-showcase-root-pulsar/source/`).

## How the build was approached

**Grounding came before concept.** Before any design thinking: read the deploy
clone (the authoritative public roster), the previous build's scripts, and the
serving infrastructure. The previous landing attempt had shipped broken links
because its roster mixed local build names with public deploy names — so this
build *derived* its roster from the deploy clone through a generator script and
kept a verify script in the build loop (`verify:roster` — 22/22 exact titles +
absolute URLs before every deploy). A data bug that once cost a whole round
became structurally impossible. The general shape: when a class of mistake has
happened once, a derivation or a check in the pipeline beats remembering to be
careful.

**One concept carried everything.** Neutron is named for a collapsed star, so
the page took that literally: a hand-written WebGL pulsar as the hero, the 22
sites presented as worlds in its orbit, categories as "orbits," a beam-sweep
pulse that fires when the beam crosses the viewer's line of sight. Every
section decision afterwards (naming, copy, the orbital spine down the gallery)
answered to that one idea, which is what made the page feel designed rather
than assembled. The concept came from the subject's own name — not from a
style preference.

**The centerpiece was hand-written; the supporting cast was vendored.** The
pulsar is ~200 lines of custom GLSL — four particle populations (core, disk,
beams, starfield) computed procedurally in the vertex shader from static random
seeds, one draw call, nothing re-uploaded per frame. Around it, eight React
Bits components were vendored **verbatim** from a sparse clone of the official
repo. The reasoning on both sides: the thing no library provides is what makes
a build unique, and for everything a library does provide, exact vendored
source beats a from-memory imitation — it behaves like the documented thing,
and its actual code can be read when something goes wrong (which mattered —
see below). Every local change to a vendored file was marked with a
`NEUTRON patch` comment explaining what changed and why, so the diff against
upstream stays visible forever.

**Verification used instruments, not impressions.** Playwright screenshots at
four widths (1440/1200/768/390) before every deploy — the previous build had
shipped a width-specific overlap that two screenshot widths missed. When a
mobile screenshot *looked* like a text overflow, an in-browser measurement
(`scrollWidth`, computed font-size, per-element widths) showed the layout was
actually correct and the impression was wrong — so nothing was "fixed" that
wasn't broken. Claims got proven in both directions: a live click test drove
the gallery and confirmed the opened tab's URL matched the clicked world.

## What broke during the build, and how each was found

These are mechanisms, not warnings — each one generalizes.

- **The gradient title rendered invisible.** `background-clip: text` was on
  the `h1`, but each letter was a `span` animating in its own compositing
  layer — and a parent's clipped background does not paint into composited
  children. Found by screenshot (the hero simply had no title), fixed by
  moving the gradient+clip onto each span. Mechanism worth keeping:
  animation creates compositing boundaries, and some parent-paint effects
  stop at them.
- **A vendored heading component produced a 400px blank block.** ScrollFloat
  ships its own `font-size: clamp(1.6rem, 8vw, 10rem)` and `line-height: 1.5`
  inside its own `h2`. Diagnosed by *reading the vendored source* rather than
  fighting it with increasingly specific CSS. Also caught: nesting my `h2`
  around its `h2` was invalid HTML. When a component misbehaves, its source is
  the fastest documentation there is.
- **Scroll felt "distorted and slow" (owner report).** Three independent
  mechanisms stacked: (1) a smooth-scroll library (Lenis) interpolating every
  wheel tick — sluggishness by design; (2) ScrollFloat's scrub animation
  literally stretching letters (`scaleY 2.3→1`) tied to scroll position —
  distortion by design; (3) the gallery component binding `wheel`, `mousedown`
  and `mousemove` to **window** — so every page scroll spun the ring and fired
  its speed-ripple, and its WebGL loop rendered every frame for the life of
  the page. One symptom, three root causes; each found by reading code, none
  guessable from the symptom alone. The fixes were removals and scoping, not
  additions.
- **Residual choppiness came from an invisible full-page canvas.** ClickSpark
  sizes its canvas to its parent — wrapped around the whole page, that meant
  `clearRect` on a ~1440×14,600px canvas (~84 megapixels) every animation
  frame, even with zero sparks. Patched to a viewport-fixed canvas whose draw
  loop exists only while sparks are alive. The general mechanism: components
  are usually designed for demo-sized parents; embedding one in a long page
  changes its cost model, and "invisible" work never shows up visually — only
  in the profiler or the code.
- **The page froze at load, then popped in.** Everything heavy initialized at
  t=0 — WebGL gallery init plus 22 texture uploads — while the hero's CSS
  animation clock was already running, so dropped frames made the intro jump
  to its end state. Fixed by sequencing: the ring lazy-mounts when scrolled
  toward, row images load lazily, and the title animation starts only after
  two painted frames (`animation-play-state: paused` until then). CSS
  animation clocks don't wait for the main thread — if the first frames
  matter, nothing heavy can share them.
- **Long-page scroll cost was cut with `content-visibility: auto`** on the 22
  gallery rows (with `contain-intrinsic-size` so the scrollbar stays stable) —
  off-screen rows skip layout and paint entirely. Cheap, invisible, and it
  also explains why stitched full-page screenshots of such pages show blank
  regions: the QA artifact changes meaning when this optimization is on.

## How owner feedback was turned into changes

Eight feedback rounds shipped same-day. The patterns that made them land:

- **Feedback names a symptom; the mechanism still has to be found.** "Scrolling
  is distorted and slow" did not say "remove Lenis" — it took code-reading to
  find three separate mechanisms. Fixing the symptom without the mechanism
  (e.g. tuning Lenis instead of questioning it) would have left two of the
  three causes alive.
- **Change exactly what was named — and when scope is misjudged, restore
  precisely.** Asked to remove "the animation triggered by scrolling" on the
  ring, I removed both the wheel-spin *and* the fade-up reveal. The owner
  liked the reveal; only the left/right wheel movement was the problem. The
  correction was surgical: restore the reveal, keep the wheel removal. The
  cheap prevention would have been confirming scope when one phrase could
  cover two behaviors.
- **Tuning converged by halving, one number per round.** The ripple speed went
  0.04 → 0.02 → 0.012 → 0.008 across three owner calls of "still a bit too
  fast." Each round changed one knob, named the number, and shipped fast —
  so the owner always evaluated a single change, and "a bit slower" stayed a
  one-line edit. Isolating the knob also kept the drag-response feel intact
  while only the idle oscillation slowed.
- **"It didn't work" sometimes means caching, not code.** When the full-bleed
  change "didn't take effect," the deployed CSS was fetched from the live
  server and contained the new rule — GitHub Pages caches HTML up to ~10
  minutes, and since every build renames its hashed assets, stale HTML serves
  the *entire old build*. Proving what the server serves before re-touching
  code prevented a pointless second "fix" — and gave the owner the actual
  remedy (hard refresh).
- **Every round ended with verification and an honest report**: what changed,
  in the owner's terms, what was checked, and what was *not* done (root
  placement was left untouched through all nine deploys because publishing to
  the root was explicitly the owner's own step).

## What this build left behind

A deploy-clone-derived roster with a verifier; six vendored React Bits
components with all local patches marked; a hand-written pulsar shader; and a
QA loop (multi-width screenshots + in-browser measurement + live click tests)
that caught every visual bug before the owner saw it except the ones only felt
on real hardware — scroll feel and load feel — which is what the owner's own
eyes are for. That division of labor is worth keeping: instruments catch what
they measure; the owner catches what it feels like.

## Comparing with the earlier attempt

The previous landing build — the fieldguide — lives at
`Projects/external-sites/neutron-showcase-root-fieldguide/` and is preserved
deliberately (owner ruling, 2026-08-07): same brief, same roster
infrastructure, same preview and deploy pipeline — a different set of choices
at every level above them. Reading the two side by side shows where the
approaches diverged (concept, component sourcing, verification depth,
iteration mechanics) more precisely than either build alone can.
