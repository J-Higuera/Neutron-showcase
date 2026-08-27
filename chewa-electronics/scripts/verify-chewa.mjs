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

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function nextBusinessDate(now, minimumDaysOut) {
  const candidate = addDays(now, minimumDaysOut);
  while (candidate.getDay() === 0 || candidate.getDay() === 6) candidate.setDate(candidate.getDate() + 1);
  return candidate;
}

function isBusinessDay(date) {
  return date.getDay() !== 0 && date.getDay() !== 6;
}

function expectedDelivery(now) {
  const formatter = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" });
  const fmt = (minimumDaysOut) => formatter.format(nextBusinessDate(now, minimumDaysOut));
  const fulfillment = (action, variant = "full") => {
    if (isBusinessDay(now)) {
      if (action === "pickup") return variant === "short" ? "pickup today" : "Available for pickup today";
      if (action === "ship") return variant === "short" ? "ships today" : "Ships today";
    }
    const next = fmt(0);
    if (action === "pickup") return variant === "short" ? `pickup ${next}` : `Available for pickup ${next}`;
    if (action === "ship") return variant === "short" ? `ships ${next}` : `Ships ${next}`;
    return "Next eligible fulfillment";
  };
  const aeroDate = fmt(2);
  const studioDate = fmt(3);
  const meshDate = fmt(1);
  const aeroPickup = fulfillment("pickup");
  const meshShip = fulfillment("ship");
  return {
    "aero-day": `${aeroDate} delivery`,
    "aero-window": `${aeroPickup} / ${aeroDate} delivery`,
    "aero-date-zip": `${aeroDate} to 94107`,
    "aero-pickup-day": aeroPickup,
    "aero-pickup-day-short": fulfillment("pickup", "short"),
    "studio-day": `${studioDate} delivery`,
    "studio-window": `${studioDate} delivery / store pickup varies`,
    "mesh-ship-day": meshShip,
    "mesh-ship-day-short": fulfillment("ship", "short"),
    "mesh-window": `${meshShip} / ${meshDate} delivery available`
  };
}

function validateSource(indexText, scriptText) {
  const staleDateClaims = ["Tue, Aug 18", "Aug 18", "Tue delivery / pickup today", "Pickup today / Tue delivery", "Thu delivery / store pickup varies"];
  const foundStaleDates = staleDateClaims.filter((claim) => (indexText + scriptText).includes(claim));
  if (foundStaleDates.length) throw new Error(`stale delivery date claims remain in source: ${foundStaleDates.join(", ")}`);

  const staticSameDay = indexText.match(/\b(Ships today|ships today|pickup today|Available for pickup today)\b/g) || [];
  if (staticSameDay.length) throw new Error(`static same-day fulfillment claims remain in HTML: ${staticSameDay.join(", ")}`);

  const requiredHooks = [
    "aero-window",
    "aero-date-zip",
    "aero-pickup-day",
    "aero-pickup-day-short",
    "studio-day",
    "studio-window",
    "mesh-ship-day",
    "mesh-ship-day-short",
    "mesh-window"
  ];
  const missingHooks = requiredHooks.filter((hook) => !indexText.includes(`data-delivery="${hook}"`));
  if (missingHooks.length) throw new Error(`delivery hooks missing from HTML: ${missingHooks.join(", ")}`);

  for (const snippet of ["function isBusinessDay", "function fulfillmentCopy", "mesh-ship-day", "aero-pickup-day"]) {
    if (!scriptText.includes(snippet)) throw new Error(`script missing dynamic fulfillment support: ${snippet}`);
  }
}

async function installMockDate(page, isoNoon) {
  await page.evaluateOnNewDocument((iso) => {
    const fixed = new Date(iso).getTime();
    const RealDate = Date;
    class MockDate extends RealDate {
      constructor(...args) {
        super(...(args.length ? args : [fixed]));
      }
      static now() { return fixed; }
      static parse(value) { return RealDate.parse(value); }
      static UTC(...args) { return RealDate.UTC(...args); }
    }
    Object.setPrototypeOf(MockDate, RealDate);
    Date = MockDate;
  }, isoNoon);
}

async function verifyScenario(browser, label, isoNoon) {
  const page = await browser.newPage();
  await installMockDate(page, isoNoon);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto(baseUrl, { waitUntil: "networkidle0" });

  const now = new Date(isoNoon);
  const expected = expectedDelivery(now);
  const delivery = await page.evaluate(() => ({
    texts: Array.from(document.querySelectorAll("[data-delivery]")).map((node) => ({
      kind: node.getAttribute("data-delivery"),
      text: node.textContent?.trim()
    })),
    body: document.body.innerText
  }));
  const wrongDelivery = delivery.texts.filter(({ kind, text }) => expected[kind] && text !== expected[kind]);
  if (wrongDelivery.length) throw new Error(`${label}: dynamic delivery copy mismatch: ${JSON.stringify(wrongDelivery)}`);
  if (!isBusinessDay(now) && /\b(Available for pickup today|pickup today|Ships today|ships today)\b/.test(delivery.body)) {
    throw new Error(`${label}: weekend rendered same-day fulfillment copy`);
  }

  await page.click('[data-spec="delivery"]');
  await page.waitForFunction(() => document.querySelector("[data-spec-panel]")?.innerText.includes("ZIP 94107"));
  const deliveryTabText = await page.$eval("[data-spec-panel]", (el) => el.innerText);
  if (!deliveryTabText.includes(expected["aero-day"]) || /Aug 18/.test(deliveryTabText)) {
    throw new Error(`${label}: delivery tab did not render live future copy: ${deliveryTabText}`);
  }
  if (!isBusinessDay(now) && /\b(Available for pickup today|pickup today)\b/.test(deliveryTabText)) {
    throw new Error(`${label}: delivery tab rendered weekend pickup-today copy: ${deliveryTabText}`);
  }

  if (label === "business-day") {
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
  }

  await page.close();
  console.log(`PASS ${label} delivery hydration (${expected["aero-window"]}; ${expected["mesh-window"]})`);
}

let ready = false;
if (liveBase) ready = true;
server?.stdout.on("data", (buf) => {
  if (buf.toString().includes("ready")) ready = true;
});
for (let i = 0; i < 40 && !ready; i += 1) await new Promise((r) => setTimeout(r, 50));
if (!ready) throw new Error("local static server did not start");

const indexText = readFileSync("index.html", "utf8");
const scriptText = readFileSync("script.js", "utf8");
validateSource(indexText, scriptText);
try {
  validateSource(indexText.replace("Next eligible shipping", "Ships today"), scriptText);
  throw new Error("red proof failed: static same-day claim was not caught");
} catch (error) {
  if (!String(error.message).includes("static same-day fulfillment claims")) throw error;
  console.log("PASS verifier red-proof catches reintroduced static same-day fulfillment claim");
}

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_BIN || "/usr/bin/chromium",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});
try {
  await verifyScenario(browser, "business-day", "2026-08-27T12:00:00");
  await verifyScenario(browser, "weekend", "2026-08-29T12:00:00");
  console.log("PASS Chewa source and rendered page contain no stale fixed delivery dates");
  console.log("PASS Chewa featured and recommendation Add controls update Shortlist count");
} finally {
  await browser.close();
  await cleanup();
  if (server) await once(server, "exit").catch(() => {});
}
