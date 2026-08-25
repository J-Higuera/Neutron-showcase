#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

const forbiddenCalendarLiterals = [
  /Tuesday,\s*April\s*14/i,
  /\bApril\s*14\b/i,
];

const defaultRoot = process.cwd();

function read(siteRoot, file) {
  return fs.readFileSync(path.join(siteRoot, file), 'utf8');
}

function fail(message) {
  throw new Error(message);
}

function scanNoForbidden(label, file, text) {
  for (const pattern of forbiddenCalendarLiterals) {
    if (pattern.test(text)) fail(`${label}: forbidden stale calendar literal ${pattern} in ${file}`);
  }
}

function validateSite({ siteRoot = defaultRoot, requireDist = true } = {}) {
  const checks = [];

  const brambleFile = 'src/components/demos/Bramble.tsx';
  const dateFile = 'src/lib/date.ts';
  const pkgFile = 'package.json';

  const bramble = read(siteRoot, brambleFile);
  const dateUtil = read(siteRoot, dateFile);
  const pkg = JSON.parse(read(siteRoot, pkgFile));

  scanNoForbidden('source', brambleFile, bramble);
  scanNoForbidden('source', dateFile, dateUtil);
  checks.push('stale Bramble date literals absent from source');

  if (!bramble.includes('import { formatTodayLabel } from "../../lib/date"')) {
    fail('Bramble demo must import formatTodayLabel from the shared date utility');
  }
  if (!bramble.includes('{formatTodayLabel()}')) {
    fail('Bramble visible date label must render formatTodayLabel(), not a fixed calendar string');
  }
  checks.push('Bramble date label is runtime-derived');

  for (const required of ['new Date()', 'weekday: "long"', 'month: "long"', 'day: "numeric"']) {
    if (!dateUtil.includes(required)) fail(`date utility is missing required derivation token: ${required}`);
  }
  checks.push('date utility derives weekday/month/day from load-time Date');

  const buildScript = pkg.scripts?.build || '';
  const verifyScript = pkg.scripts?.['verify:triple-play'] || '';
  if (!verifyScript.includes('scripts/verify-triple-play.mjs')) {
    fail('package.json must expose verify:triple-play');
  }
  if (!buildScript.includes('verify:triple-play')) {
    fail('package.json build must run verify:triple-play so deploy builds cannot skip it');
  }
  checks.push('Triple Play verifier is wired into npm run build');

  if (requireDist) {
    const dist = path.join(siteRoot, 'dist');
    if (!fs.existsSync(dist)) fail('dist/ missing; run the production build before verification');
    const files = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(html|js|css)$/i.test(entry.name)) files.push(full);
      }
    };
    walk(dist);
    for (const full of files) {
      const rel = path.relative(siteRoot, full);
      scanNoForbidden('dist', rel, fs.readFileSync(full, 'utf8'));
    }
    checks.push(`built output scanned clean (${files.length} html/js/css files)`);
  }

  return checks;
}

function proveRed() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'triple-play-red-'));
  try {
    fs.mkdirSync(path.join(tmp, 'src/components/demos'), { recursive: true });
    fs.mkdirSync(path.join(tmp, 'src/lib'), { recursive: true });
    fs.copyFileSync(path.join(defaultRoot, 'src/components/demos/Bramble.tsx'), path.join(tmp, 'src/components/demos/Bramble.tsx'));
    fs.copyFileSync(path.join(defaultRoot, 'src/lib/date.ts'), path.join(tmp, 'src/lib/date.ts'));
    fs.copyFileSync(path.join(defaultRoot, 'package.json'), path.join(tmp, 'package.json'));
    const target = path.join(tmp, 'src/components/demos/Bramble.tsx');
    let mutated = fs.readFileSync(target, 'utf8');
    mutated = mutated.replace('import { formatTodayLabel } from "../../lib/date";\n', '');
    const staleFixture = ['Tuesday', ['April', '14'].join(' ')].join(', ');
    mutated = mutated.replace('{formatTodayLabel()}', staleFixture);
    fs.writeFileSync(target, mutated);

    validateSite({ siteRoot: tmp, requireDist: false });
    fail('red-proof mutation unexpectedly passed');
  } catch (error) {
    if (String(error.message).includes('forbidden stale calendar literal') || String(error.message).includes('must import formatTodayLabel')) {
      return error.message;
    }
    throw error;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const args = new Set(process.argv.slice(2));

try {
  const checks = validateSite({ requireDist: !args.has('--source-only') });
  console.log('PASS Triple Play canonical verifier');
  for (const check of checks) console.log(`PASS ${check}`);
  if (args.has('--prove-red')) {
    const red = proveRed();
    console.log(`PASS red-proof: stale-date mutation failed as expected — ${red}`);
  }
} catch (error) {
  console.error(`FAIL Triple Play canonical verifier: ${error.message}`);
  process.exit(1);
}
