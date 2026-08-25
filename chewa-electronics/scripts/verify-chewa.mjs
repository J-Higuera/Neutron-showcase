import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const liveBase = process.env.CHEWA_BASE_URL;
const port = 4321 + Math.floor(Math.random() * 1000);
const baseUrl = liveBase || `http://127.0.0.1:${port}/`;
const server = liveBase ? null : spawn(process.execPath, ["-e", `
  const http = require('http');
  const fs = require('fs');
  const path = require('path');
  const root = process.cwd();
  const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
  http.createServer((req,res)=>{
    const url = new URL(req.url, 'http://local');
    let file = path.join(root, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!file.startsWith(root)) { res.writeHead(403); res.end('forbidden'); return; }
    fs.readFile(file, (err, data)=>{
      if (err) { res.writeHead(404); res.end('missing'); return; }
      res.writeHead(200, {'content-type': types[path.extname(file)] || 'application/octet-stream'});
      res.end(data);
    });
  }).listen(${port}, '127.0.0.1', () => console.log('ready'));
`], { cwd: process.cwd(), stdio: ["ignore", "pipe", "pipe"] });

const cleanup = async () => {
  if (server && !server.killed) server.kill("SIGTERM");
};
process.on("exit", cleanup);
process.on("SIGINT", () => { cleanup(); process.exit(130); });

let ready = false;
if (liveBase) ready = true;
server?.stdout.on("data", (buf) => {
  if (buf.toString().includes("ready")) ready = true;
});
for (let i = 0; i < 40 && !ready; i += 1) await new Promise((r) => setTimeout(r, 50));
if (!ready) throw new Error("local static server did not start");

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_BIN || "/usr/bin/chromium",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto(baseUrl, { waitUntil: "networkidle0" });

  const sourceText = readFileSync("index.html", "utf8") + readFileSync("script.js", "utf8");
  const staleClaims = ["Tue, Aug 18", "Aug 18", "Tue delivery / pickup today", "Pickup today / Tue delivery", "Thu delivery / store pickup varies"];
  const foundStale = staleClaims.filter((claim) => sourceText.includes(claim));
  if (foundStale.length) throw new Error(`stale delivery claims remain in source: ${foundStale.join(", ")}`);

  const delivery = await page.evaluate(() => {
    const formatter = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" });
    const addDays = (date, days) => {
      const next = new Date(date);
      next.setDate(next.getDate() + days);
      return next;
    };
    const nextBusinessDate = (minimumDaysOut) => {
      const candidate = addDays(new Date(), minimumDaysOut);
      while (candidate.getDay() === 0 || candidate.getDay() === 6) candidate.setDate(candidate.getDate() + 1);
      return candidate;
    };
    const expected = {
      aeroDay: `${formatter.format(nextBusinessDate(2))} delivery`,
      aeroWindow: `Pickup today / ${formatter.format(nextBusinessDate(2))} delivery`,
      aeroDateZip: `${formatter.format(nextBusinessDate(2))} to 94107`,
      studioDay: `${formatter.format(nextBusinessDate(3))} delivery`,
      studioWindow: `${formatter.format(nextBusinessDate(3))} delivery / store pickup varies`,
      meshWindow: `Ships today / ${formatter.format(nextBusinessDate(1))} delivery available`
    };
    const texts = Array.from(document.querySelectorAll("[data-delivery]")).map((node) => ({
      kind: node.getAttribute("data-delivery"),
      text: node.textContent?.trim()
    }));
    return { expected, texts, body: document.body.innerText };
  });
  const expectedByKind = {
    "aero-day": delivery.expected.aeroDay,
    "aero-window": delivery.expected.aeroWindow,
    "aero-date-zip": delivery.expected.aeroDateZip,
    "studio-day": delivery.expected.studioDay,
    "studio-window": delivery.expected.studioWindow,
    "mesh-window": delivery.expected.meshWindow
  };
  const wrongDelivery = delivery.texts.filter(({ kind, text }) => expectedByKind[kind] && text !== expectedByKind[kind]);
  if (wrongDelivery.length) throw new Error(`dynamic delivery copy mismatch: ${JSON.stringify(wrongDelivery)}`);
  if (/Tue, Aug 18|Aug 18/.test(delivery.body)) throw new Error("stale Aug 18 delivery copy rendered");

  await page.click('[data-spec="delivery"]');
  await page.waitForFunction(() => document.querySelector("[data-spec-panel]")?.innerText.includes("ZIP 94107"));
  const deliveryTabText = await page.$eval("[data-spec-panel]", (el) => el.innerText);
  if (!deliveryTabText.includes(delivery.expected.aeroDay) || /Aug 18/.test(deliveryTabText)) {
    throw new Error(`delivery tab did not render live future copy: ${deliveryTabText}`);
  }
  console.log(`PASS Chewa delivery dates hydrate from load date (${delivery.expected.aeroWindow})`);
  console.log("PASS Chewa source and rendered page contain no stale Aug 18 delivery claim");

  const before = await page.$eval("[data-cart-count]", (el) => el.textContent?.trim());
  await page.$eval("#featured [data-add-item], #featured [data-add-shortlist]", (button) => button.scrollIntoView({ block: "center" }));
  await page.click("#featured [data-add-item], #featured [data-add-shortlist]");
  await page.waitForFunction(() => document.querySelector("[data-cart-count]")?.textContent?.trim() === "1");
  const afterFeatured = await page.$eval("[data-cart-count]", (el) => el.textContent?.trim());
  const aria = await page.$eval(".cart-chip", (el) => el.getAttribute("aria-label"));

  await page.$eval("[data-rec-list] [data-add-item]", (button) => button.scrollIntoView({ block: "center" }));
  await page.click("[data-rec-list] [data-add-item]");
  await page.waitForFunction(() => document.querySelector("[data-cart-count]")?.textContent?.trim() === "2");
  const afterRecommendation = await page.$eval("[data-cart-count]", (el) => el.textContent?.trim());

  if (before !== "0" || afterFeatured !== "1" || afterRecommendation !== "2" || !aria?.includes("1 items")) {
    throw new Error(`unexpected shortlist state: before=${before} featured=${afterFeatured} rec=${afterRecommendation} aria=${aria}`);
  }
  console.log("PASS Chewa featured Add to shortlist updates Shortlist count");
  console.log("PASS Chewa recommendation Add still updates Shortlist count");
} finally {
  await browser.close();
  await cleanup();
  if (server) await once(server, "exit").catch(() => {});
}
