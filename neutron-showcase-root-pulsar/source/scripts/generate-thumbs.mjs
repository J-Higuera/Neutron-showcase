// Screenshot every deployed world from the local deploy clone into public/thumbs/.
// Serves the clone over a loopback static server so pages load with real relative
// asset paths (file:// breaks them), then captures one JPEG per world folder.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright-core';
import { deployRoot, readDeployArtifacts } from './roster-utils.mjs';

const OUT_DIR = path.resolve('public/thumbs');
const PORT = 8917;
const VIEWPORT = { width: 1200, height: 750 };

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
};

function serveClone() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let filePath = path.join(deployRoot, urlPath);
    if (!filePath.startsWith(deployRoot)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': MIME[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise(resolve => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

function findChromium() {
  const cacheRoot = path.join(process.env.HOME, '.cache/ms-playwright');
  if (fs.existsSync(cacheRoot)) {
    for (const dir of fs.readdirSync(cacheRoot)) {
      if (!dir.startsWith('chromium-')) continue;
      for (const rel of ['chrome-linux/chrome', 'chrome-linux/headless_shell']) {
        const candidate = path.join(cacheRoot, dir, rel);
        if (fs.existsSync(candidate)) return candidate;
      }
    }
  }
  for (const sys of ['/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (fs.existsSync(sys)) return sys;
  }
  throw new Error('No chromium executable found');
}

const worlds = readDeployArtifacts();
fs.mkdirSync(OUT_DIR, { recursive: true });
const server = await serveClone();
const browser = await chromium.launch({ executablePath: findChromium() });
const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1 });

let ok = 0;
for (const world of worlds) {
  const url = `http://127.0.0.1:${PORT}/${world.folder}/`;
  const out = path.join(OUT_DIR, `${world.folder}.jpg`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() =>
      page.goto(url, { waitUntil: 'load', timeout: 30000 }));
    await page.waitForTimeout(2500); // let intro animations settle
    await page.screenshot({ path: out, type: 'jpeg', quality: 78 });
    ok += 1;
    console.log(`thumb ok  ${world.folder}`);
  } catch (err) {
    console.error(`thumb FAIL ${world.folder}: ${err.message}`);
  }
}

await browser.close();
server.close();
console.log(`${ok}/${worlds.length} thumbnails written to ${OUT_DIR}`);
if (ok !== worlds.length) process.exitCode = 1;
