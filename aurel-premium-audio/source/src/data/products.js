// The store's ledger: one flagship in three finishes, plus the hardware
// that lives around it. Prices are the studio's direct-order prices.
export const FINISHES = [
  {
    id: 'stone',
    name: 'Stone',
    blurb: 'Warm bone-white shells, natural leather, raw aluminum rails.',
    colors: {
      shell: 0xb7ab93, accent: 0x9d6c45, leather: 0x2b241d,
      pad: 0x1c1713, rail: 0xc9c0ad, stage: 0xefe9dc,
    },
  },
  {
    id: 'graphite',
    name: 'Graphite',
    blurb: 'Bead-blasted charcoal, black lambskin, smoked hardware.',
    colors: {
      shell: 0x2e2d2b, accent: 0x7a6a55, leather: 0x141312,
      pad: 0x0f0e0d, rail: 0x4a4844, stage: 0xe6e1d6,
    },
  },
  {
    id: 'copper',
    name: 'Copper',
    blurb: 'Burnished copper shells over espresso leather, brass details.',
    colors: {
      shell: 0x9d6742, accent: 0xc59a62, leather: 0x241a12,
      pad: 0x171006, rail: 0x6f4a30, stage: 0xefe6d8,
    },
  },
];

export const REFERENCE = {
  id: 'aurel-reference',
  name: 'Aurel Reference',
  price: 1290,
  tagline: 'Open-back planar monitor for long sessions, spatial editing, and late-night records.',
  specs: [
    ['Driver', 'Planar magnetic array'],
    ['Build', 'Open-back · milled 6063 aluminum'],
    ['Weight', '385 g'],
    ['Impedance', '32 Ω · 98 dB/mW'],
    ['Cable', 'Detachable, shielded 4.4 mm balanced'],
    ['Pads', 'Lambskin, pressure-balanced seal'],
  ],
};

export const ACCESSORIES = [
  {
    id: 'desk-amp', name: 'Desktop Amplifier', price: 980,
    image: './assets/tube-amplifier-front.jpg',
    alt: 'Front panel of the Aurel desktop tube amplifier',
    blurb: 'Current-capable class A/B drive with a black glass meter and stepped gain.',
  },
  {
    id: 'field-dac', name: 'Portable DAC', price: 420,
    image: './assets/audio-control-panel.jpg',
    alt: 'Compact Aurel portable DAC control panel',
    blurb: 'Small reference converter for travel chains, mastering notes, and USB-C playback.',
  },
  {
    id: 'lambskin-pads', name: 'Lambskin Pad Set', price: 120,
    image: './assets/headphones-leather-closeup.jpg',
    alt: 'Close-up of lambskin leather headphone pads',
    blurb: 'Replacement contact pads, pressure-balanced and hand-stitched.',
  },
  {
    id: 'balanced-cable', name: 'Balanced Cable', price: 140,
    image: './assets/amplifier-input-knobs.jpg',
    alt: 'Braided balanced cable beside amplifier input knobs',
    blurb: 'Shielded 4.4 mm balanced cable, low-noise signal path, 2.2 m.',
  },
];

export const ACOUSTICS = [
  ['Frequency response', 'Even tonal balance with gentle upper-air extension and no spotlighted band.'],
  ['Transient control', 'Start-stop behavior tuned for percussion, plucked strings, and room edges.'],
  ['Soundstage', 'Precise lateral placement without widening tricks or synthetic bloom.'],
  ['Noise floor', 'Quiet electronics preserve reverb tails and low-level texture.'],
];

// The numbers behind the philosophy band — measured on the studio's own rig,
// stated once, plainly.
export const PHILOSOPHY_STATS = [
  ['580 mm²', 'diaphragm area per side'],
  ['< 0.08 %', 'THD at 1 kHz, 94 dB'],
  ['± 0.4 dB', 'left–right pair matching'],
];

export const CRAFT = [
  {
    id: 'aluminum',
    title: 'Milled, not molded.',
    body: 'Every shell starts as a solid billet of 6063 aluminum and leaves the mill as one piece — no seams to buzz, no plastic to color the midrange. The bead-blasted surface is the metal itself, not a coating.',
    image: './assets/amplifier-input-knobs.jpg',
    alt: 'Machined aluminum knobs and panel work, close up',
  },
  {
    id: 'leather',
    title: 'Leather that breaks in, not down.',
    body: 'Pads and headband wear vegetable-tanned lambskin, cut and stitched in-house. It seals gently around glasses, breathes through long sessions, and takes on the shape of its one owner.',
    image: './assets/headphones-leather-closeup.jpg',
    alt: 'Stitched lambskin leather headphone pads, close up',
  },
  {
    id: 'runs',
    title: 'Assembled in runs of 120.',
    body: 'Small runs mean every driver pair is measured, matched, and listened to before it ships — and the person who voiced your set signed the card in the box. This run is № 7.',
    image: './assets/vintage-audio-stack.jpg',
    alt: 'A stack of vintage studio audio equipment',
  },
];

export const PRESS = [
  {
    quote: 'The rare planar that disappears — you stop auditioning the headphone and start hearing the take.',
    source: 'Headroom Quarterly',
  },
  {
    quote: 'Tuning this honest usually costs twice as much and forgives half as little.',
    source: 'The Signal Path',
  },
  {
    quote: 'Our reference for edit-room checks three years running. Nothing else earns the second listen like it.',
    source: 'Mastering Notes',
  },
];

export const FAQ = [
  ['How does the home audition work?', 'We ship a loaner Reference with a matched cable for 14 days. Keep your ears, keep your chain, send it back with the prepaid label — or apply the audition toward your order.'],
  ['What does the warranty cover?', 'Five years on drivers and structure, two on cables and pads. Repairs are done at the bench that built your set, not a service partner.'],
  ['Can I return a purchased pair?', '30 days, any reason, full refund. We only ask that the lambskin comes back clean enough for the next set of ears at the studio.'],
  ['How are drivers matched?', 'Each diaphragm is swept individually; pairs ship only when they track within ±0.4 dB from 40 Hz to 10 kHz. Your measurement sheet is in the box.'],
  ['Which cable comes in the box?', 'A shielded 4.4 mm balanced cable, 2.2 m. Single-ended 6.35 mm and 3 m studio lengths are available at checkout or any time after.'],
  ['Do you repair out-of-warranty sets?', 'Always. Re-pads, re-cables, driver service — priced at cost, turned around within two weeks, whatever the age of the set.'],
];
