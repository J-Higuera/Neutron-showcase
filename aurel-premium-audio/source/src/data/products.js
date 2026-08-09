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
