// QA captures of the built page over the dashboard's /preview/ route (the real
// serving path, dist-aware). Scrolls through first so scroll reveals fire, then
// takes a hero shot and a full-page shot per width.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const BASE = process.env.CAPTURE_URL ?? 'http://127.0.0.1:8081/preview/neutron-showcase-root-pulsar/';
const OUT = path.resolve(process.env.CAPTURE_OUT ?? 'qa-shots');
const WIDTHS = [1440, 1200, 768, 390];

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
  return '/usr/bin/chromium';
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: findChromium(),
  args: ['--enable-unsafe-swiftshader'],
});

for (const width of WIDTHS) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
  });
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(OUT, `hero-${width}.png`) });

  // walk the page so IntersectionObserver reveals fire and stick
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, `full-${width}.png`), fullPage: true });
  console.log(`captured ${width}px`);
  await page.close();
}

await browser.close();
console.log(`shots in ${OUT}`);
