import { spawn } from "node:child_process";
import { once } from "node:events";
import puppeteer from "puppeteer-core";

const port = 4321 + Math.floor(Math.random() * 1000);
const baseUrl = `http://127.0.0.1:${port}/`;
const server = spawn(process.execPath, ["-e", `
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
  if (!server.killed) server.kill("SIGTERM");
};
process.on("exit", cleanup);
process.on("SIGINT", () => { cleanup(); process.exit(130); });

let ready = false;
server.stdout.on("data", (buf) => {
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
  await once(server, "exit").catch(() => {});
}
