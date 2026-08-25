import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const collectionPath = path.join(root, "src/data/collection.ts");
const indexPath = path.join(root, "index.html");
const countWords = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

function countExhibits(collectionSource) {
  // Count the permanent catalogue only. Visitor loans use L· numbers and are
  // generated at runtime, so they must not inflate public share metadata.
  const nums = [...collectionSource.matchAll(/\bnum:\s*["']\d{3}["']/g)];
  if (!nums.length) throw new Error("No exhibit numbers found in src/data/collection.ts");
  return nums.length;
}

function countInWords(count) {
  return countWords[count] ?? String(count);
}

const collectionSource = await readFile(collectionPath, "utf8");
const exhibitCount = countExhibits(collectionSource);
const word = countInWords(exhibitCount);
const description = `A museum for high-fidelity digital objects. ${word} works on view, rendered live in your browser — and the museum accepts loans: bring your own.`;
const ogDescription = `A museum for high-fidelity digital objects. ${word} works on view, rendered live in your browser.`;

let html = await readFile(indexPath, "utf8");
const original = html;
html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/s, `$1${description}$2`);
html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*("\s*\/?>)/s, `$1${ogDescription}$2`);

if (html === original && !html.includes(description)) {
  throw new Error("Metadata replacement did not change or confirm index.html");
}
await writeFile(indexPath, html);
console.log(`AUREL metadata synced from collection: ${exhibitCount} exhibits / ${word} works`);
