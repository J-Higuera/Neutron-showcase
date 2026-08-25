import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('assets');
const manifestPath = path.join(outDir, 'image-sources.json');
const USER_AGENT = 'NeutronFrondosaImageRepair/1.0 (local portfolio demo; source attribution manifest)';
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const targets = [
  { key: 'zz', queries: ['Zamioculcas zamiifolia potted plant', 'Zamioculcas zamiifolia houseplant'] },
  { key: 'parlorPalm', queries: ['Chamaedorea elegans potted plant', 'Chamaedorea elegans'] },
  { key: 'rubber', queries: ['Ficus elastica potted', 'Ficus elastica plant'] },
  { key: 'stringHearts', queries: ['Ceropegia woodii String of Hearts hanging plant', 'Ceropegia woodii'] },
  { key: 'birdNestFern', queries: ['Asplenium nidus bird nest fern potted', 'Asplenium nidus'] },
  { key: 'jade', queries: ['Crassula ovata jade plant potted', 'Crassula ovata'] },
  { key: 'hoya', queries: ['Hoya carnosa hanging plant', 'Hoya carnosa'] },
  { key: 'pilea', queries: ['Pilea peperomioides potted plant', 'Pilea peperomioides'] },
  { key: 'orchid', queries: ['Phalaenopsis orchid potted flower', 'Phalaenopsis orchid'] },
  { key: 'aloe', queries: ['Aloe vera potted plant', 'Aloe vera'] },
  { key: 'cachepot', queries: ['ceramic cachepot flower pot', 'ceramic flower pot planter', 'flower pot ceramic'] },
  { key: 'terracottaSaucer', queries: ['terracotta pot saucer', 'terracotta flower pot saucer', 'terracotta pot'] },
  { key: 'heatPack', queries: ['disposable hand warmer heat pack', 'hand warmer packet', 'shipping heat pack'] },
];

function safeName(key, title, ext) {
  const cleaned = title.replace(/^File:/, '').replace(/\.[^.]+$/, '').normalize('NFKD').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 86).toLowerCase();
  return `${key}-${cleaned}.${ext}`;
}

async function fetchJson(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) return res.json();
    if (![429, 500, 502, 503, 504].includes(res.status) || i === tries - 1) throw new Error(`HTTP ${res.status}: ${url}`);
    await wait(1200 * (i + 1));
  }
}

async function commonsSearch(query) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', generator: 'search', gsrsearch: query,
    gsrnamespace: '6', gsrlimit: '10', prop: 'imageinfo', iiprop: 'url|mime|size|extmetadata'
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  const pages = Object.values(data.query?.pages ?? {}).sort((a,b) => (a.index ?? 99) - (b.index ?? 99));
  return pages
    .map(p => ({ title: p.title, ...(p.imageinfo?.[0] ?? {}) }))
    .filter(p => p.url && /^image\/(jpeg|png|webp)$/.test(p.mime || '') && p.width >= 350 && p.height >= 350);
}

async function download(url, filename, tries = 5) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(path.join(outDir, filename), buf);
      return buf.length;
    }
    if (![429, 500, 502, 503, 504].includes(res.status) || i === tries - 1) throw new Error(`download ${res.status}: ${url}`);
    await wait(2000 * (i + 1));
  }
}

await fs.mkdir(outDir, { recursive: true });
const manifest = { generatedAt: new Date().toISOString(), source: 'Wikimedia Commons API imageinfo; chosen to replace repeated/misidentified Frondosa catalog primary images.', images: {} };

for (const target of targets) {
  let chosen, queryUsed;
  for (const query of target.queries) {
    await wait(350);
    const candidates = await commonsSearch(query);
    if (candidates.length) { chosen = candidates[0]; queryUsed = query; break; }
  }
  if (!chosen) throw new Error(`No Commons image candidates for ${target.key}: ${target.queries.join(' | ')}`);
  const ext = chosen.mime === 'image/png' ? 'png' : chosen.mime === 'image/webp' ? 'webp' : 'jpg';
  const filename = safeName(target.key, chosen.title, ext);
  const bytes = await download(chosen.url, filename);
  manifest.images[target.key] = {
    query: queryUsed,
    filename,
    commonsTitle: chosen.title,
    descriptionUrl: chosen.descriptionurl,
    width: chosen.width,
    height: chosen.height,
    bytes,
    artist: chosen.extmetadata?.Artist?.value?.replace(/<[^>]+>/g, '') ?? '',
    licenseShortName: chosen.extmetadata?.LicenseShortName?.value ?? '',
    usageTerms: chosen.extmetadata?.UsageTerms?.value ?? '',
  };
  console.log(`${target.key}: ${filename} (${chosen.width}x${chosen.height}, ${bytes} bytes)`);
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest: ${manifestPath}`);
