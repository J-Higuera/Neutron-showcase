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
