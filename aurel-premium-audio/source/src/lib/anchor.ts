// The anchor this load should open at: the URL fragment (a real deep
// link) or, failing that, the per-tab scroll memory. Resolved ONCE at
// startup and NEVER written back to the URL — an earlier build restored
// by planting the fragment, which then masqueraded as a deep link: scroll
// home, refresh, and the stale "#au-004" bounced the visitor straight
// back to the collection (owner round 10).

export const START_ANCHOR: string | null = (() => {
  const h = location.hash.replace(/^#/, "");
  if (h) return h;
  try {
    let a = sessionStorage.getItem("aurel-anchor");
    if (a === "collection") {
      a = sessionStorage.getItem("aurel-room") || a;
    }
    return a && a !== "top" ? a : null;
  } catch {
    return null;
  }
})();
