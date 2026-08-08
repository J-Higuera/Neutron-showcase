import fs from 'node:fs';
import path from 'node:path';

export const deployRoot = '/home/neutron/state/deploy/J-Higuera__Neutron-showcase';
export const publicBaseUrl = 'https://j-higuera.github.io/Neutron-showcase';

export const requiredFields = [
  'name',
  'title',
  'slug',
  'folder',
  'href',
  'category',
  'premise',
  'mood',
  'motif',
  'shape',
  'state',
  'proofNote',
];

// Field metadata is local curatorial material; names, folders, and hrefs are derived from the deploy clone.
export const publicWorlds = [
  {
    folder: 'm00n-atelier',
    category: 'Art & culture',
    premise: 'A twin-moon artist world shaped by orbital editions and quiet inquiry.',
    mood: 'Lunar calm, collectible pacing, and a soft atelier ritual around each work.',
    motif: 'moons',
    shape: 'orbital',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'gorillax-command-deck',
    category: 'Game worlds',
    premise: 'Live game infrastructure staged as a playful command deck.',
    mood: 'Connected play nodes, beast-core pulse, and launch-room urgency without hard dashboard edges.',
    motif: 'nodes',
    shape: 'glass-blob',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'fury-game-studio',
    category: 'Game worlds',
    premise: 'A game-studio identity with motion, pressure, and theatrical launch energy.',
    mood: 'Poster-slab drama and live-build momentum, softened into a field mark.',
    motif: 'slab',
    shape: 'fold',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'cyber-monkeys-arcade',
    category: 'Game worlds',
    premise: 'A playful arcade identity with bright character and browser-native energy.',
    mood: 'Cabinet glow, token logic, and retro voltage with a cheerful edge.',
    motif: 'token',
    shape: 'shelf',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'monkey-blueprint-security',
    category: 'Systems & tools',
    premise: 'Adaptive security architecture drawn as an operating blueprint.',
    mood: 'Schematic routes and inspection marks turn risk into a visible field.',
    motif: 'blueprint',
    shape: 'aperture',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'armo-logistics',
    category: 'Systems & tools',
    premise: 'Cross-border freight coordination made legible through route confidence.',
    mood: 'Harbor, border, and final-mile signals move along a composed delivery lane.',
    motif: 'route',
    shape: 'ribbon',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'vortice-coffee-roastery',
    category: 'Food & craft',
    premise: 'A roastery site built around roast rhythm, origin, and cup ritual.',
    mood: 'Roast curve, farm origin, and ceremony pulled into a warm vortex.',
    motif: 'swirl',
    shape: 'arch',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'miga-sourdough-bakery',
    category: 'Food & craft',
    premise: 'A tiny neighborhood sourdough bakery with daily rhythm and tactile warmth.',
    mood: 'Slow clocks, crust, flour, and morning-light ordering cues.',
    motif: 'crumb',
    shape: 'arch',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'ember-and-sand-glassblowing',
    category: 'Art & culture',
    premise: 'A glassblowing studio shaped by heat, process, and glowing material.',
    mood: 'Furnace temperature, turning pipe, and hand-finished glow.',
    motif: 'orb',
    shape: 'orbital',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'frondosa-nursery-shop',
    category: 'Commerce',
    premise: 'A full nursery shop app with product routes, cart, checkout, and garden warmth.',
    mood: 'Greenhouse browsing, care labels, and a complete e-commerce path.',
    motif: 'leaf',
    shape: 'aperture',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: '48-studio-gallery',
    category: 'Art & culture',
    premise: 'A refined gallery surface for viewing rooms, works, and collector context.',
    mood: 'White-wall calm, studio labels, and careful process notes.',
    motif: 'plinth',
    shape: 'plinth',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'confluence-digital-arts',
    category: 'Art & culture',
    premise: 'A Sacramento digital art studio with public-light, civic texture, and gallery polish.',
    mood: 'River light, civic surfaces, and technical art formats.',
    motif: 'river',
    shape: 'ribbon',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'pixie-theatre-studio',
    category: 'Art & culture',
    premise: 'A theatre-flavored studio world with performance, invitation, and wonder.',
    mood: 'Green-room portal, rehearsal magic, and call-board notices.',
    motif: 'curtain',
    shape: 'curtain',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'nexus-control-fabric',
    category: 'Systems & tools',
    premise: 'Connected-system infrastructure expressed as a governed control fabric.',
    mood: 'Routed topology, operating modes, and fabric-like execution signals.',
    motif: 'fabric',
    shape: 'glass-blob',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'relix-ai-animation',
    category: 'Systems & tools',
    premise: 'An AI animation tool world built around frames, prompts, and motion.',
    mood: 'Timeline controls, frame strips, and directable motion cues.',
    motif: 'film',
    shape: 'fold',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'textron-future-innovations',
    category: 'Systems & tools',
    premise: 'Future-innovation work grounded in aerospace restraint and proof.',
    mood: 'Certification culture, service history, and operational lift.',
    motif: 'horizon',
    shape: 'plinth',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'chewa-electronics',
    category: 'Commerce',
    premise: 'An electronics storefront shaped around comparison, confidence, and purchase flow.',
    mood: 'Specs beside price, product shelf clarity, and buying-proof glints.',
    motif: 'shelf',
    shape: 'shelf',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'triple-play-studio',
    category: 'Workbench',
    premise: 'A strategy/build/launch studio arranged like a fluent play system.',
    mood: 'Three lanes, scoreboard logic, and clean studio motion.',
    motif: 'triple',
    shape: 'ribbon',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'aurel-premium-audio',
    category: 'Commerce',
    premise: 'A premium audio hardware surface centered on listening paths and material detail.',
    mood: 'Measured signal, heirloom finish, and quiet listening-room control.',
    motif: 'sound',
    shape: 'soundwave',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'kiln-clay-portland',
    category: 'Food & craft',
    premise: 'A ceramic studio world built from glaze tests, process, and tactile collection.',
    mood: 'Rainlight, kiln glow, clay ledger, and hands-on process.',
    motif: 'ceramic',
    shape: 'shelf',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'neo-operating-layer',
    category: 'Systems & tools',
    premise: 'An operating-layer technology surface for enterprises that cannot pause.',
    mood: 'Adaptive systems, cloud/security/automation routes, and calm modernization.',
    motif: 'prism',
    shape: 'aperture',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
  {
    folder: 'matrix-infrastructure',
    category: 'Workbench',
    premise: 'Adaptive infrastructure intelligence organized into a visual field.',
    mood: 'Enterprise routes and woven operating panels, soft rather than coded.',
    motif: 'woven',
    shape: 'fold',
    state: 'Public deploy',
    proofNote: 'Title and URL verified from the deployed showcase clone.',
  },
];

export function readPageTitle(folder) {
  const indexFile = path.join(deployRoot, folder, 'index.html');
  const html = fs.readFileSync(indexFile, 'utf8');
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) {
    throw new Error(`Could not find <title> for deployed folder ${folder}.`);
  }
  return match[1].replace(/\s+/g, ' ').trim();
}

export function readDeployArtifacts() {
  const discovered = publicWorlds.map((world) => {
    const folderPath = path.join(deployRoot, world.folder);
    const indexFile = path.join(folderPath, 'index.html');
    if (!fs.existsSync(indexFile)) {
      throw new Error(`Missing deployed index.html for ${world.folder}`);
    }
    const title = readPageTitle(world.folder);
    const href = `${publicBaseUrl}/${world.folder}/`;
    return {
      ...world,
      name: title,
      title,
      slug: world.folder,
      href,
    };
  });

  return discovered;
}

export function projectPublicEntry(entry) {
  const output = {};
  for (const field of requiredFields) {
    output[field] = entry[field];
  }
  return output;
}

export function assertRequiredFields(entries, label = 'entries') {
  entries.forEach((entry, index) => {
    for (const field of requiredFields) {
      if (!(field in entry) || entry[field] === undefined || entry[field] === null || entry[field] === '') {
        throw new Error(`${label}[${index}] is missing required field: ${field}`);
      }
    }
  });
}
