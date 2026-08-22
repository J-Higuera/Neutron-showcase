// Pure formatters, deliberately three-free: the page shell imports these,
// and the shell must never pull the GL chunk.

export function formatInt(n: number): string {
  return n.toLocaleString("en-US");
}

/** 34,600,000 px → "34.6 MP" */
export function formatMegapixels(px: number): string {
  if (px <= 0) return "untextured";
  const mp = px / 1_000_000;
  return `${mp >= 10 ? Math.round(mp) : mp.toFixed(1)} MP`;
}
