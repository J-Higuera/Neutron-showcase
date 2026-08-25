import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const countWords = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const fail = (message) => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};
const pass = (message) => console.log(`PASS ${message}`);

function countExhibits(source) {
  // Permanent exhibits use three-digit catalogue numbers; visitor loans are
  // runtime-only L· numbers and do not belong in static share metadata.
  return [...source.matchAll(/\bnum:\s*["']\d{3}["']/g)].length;
}
function collectionCount(source) {
  const collectionBody = source.match(/export const COLLECTION: Exhibit\[\] = \[([\s\S]*?)\n\];/);
  if (!collectionBody) return 0;
  return [...collectionBody[1].matchAll(/\bnum:\s*["']\d{3}["']/g)].length;
}
function readMaybe(file) {
  return readFile(path.join(root, file), "utf8").catch(() => "");
}

const collectionSource = await readFile(path.join(root, "src/data/collection.ts"), "utf8");
const indexHtml = await readFile(path.join(root, "index.html"), "utf8");
const distHtml = await readMaybe("dist/index.html");
const wingSource = await readFile(path.join(root, "src/components/Wing.tsx"), "utf8");
const entranceSource = await readFile(path.join(root, "src/components/Entrance.tsx"), "utf8");

const total = countExhibits(collectionSource);
const wing = collectionCount(collectionSource) + 1; // collection walk plus founding piece at the end
const word = countWords[total] ?? String(total);
const padded = String(total).padStart(3, "0");

if (total < 1) fail("collection count could not be derived from src/data/collection.ts");
else pass(`collection-derived count is ${total} exhibits`);

for (const [label, html] of [["source index", indexHtml], ["built dist", distHtml]]) {
  if (!html) {
    fail(`${label} html is missing`);
    continue;
  }
  if (!html.includes(`${word} works on view`)) fail(`${label} description is not synced to ${word} works`);
  else pass(`${label} description is synced to ${word} works`);
  if (/\bSix works\b|\bsix works\b/.test(html) && total !== 6) fail(`${label} still contains stale Six works copy`);
  else pass(`${label} has no stale Six works copy`);
}

if (!entranceSource.includes("ALL_EXHIBITS.length")) fail("Entrance plaque/lede no longer derives from ALL_EXHIBITS.length");
else pass("Entrance plaque/lede derives from ALL_EXHIBITS.length");

if (!wingSource.includes("WALK.length") || !wingSource.includes("slides.length - 1")) fail("Wing probe targets are not collection-length based");
else pass("Wing navigation/count logic is collection-length based, not six-work fixed");

const staleSixProbePatterns = [/expected\w*\s*=\s*6/i, /toHaveText\([^)]*06/i, /114\/120/];
for (const pattern of staleSixProbePatterns) {
  if (pattern.test(wingSource) || pattern.test(entranceSource) || pattern.test(indexHtml)) {
    fail(`stale six-work probe pattern present: ${pattern}`);
  }
}
if (!process.exitCode) {
  pass(`AUREL verifier complete: ${total} total exhibits, ${wing} walk slides, plaque ${padded}`);
}
