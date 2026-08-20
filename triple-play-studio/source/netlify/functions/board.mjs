// The studio board, served by an actual Node.js function when the site runs on
// Netlify. The page renders identical data statically everywhere else — this
// endpoint exists so the board is provably dynamic where the platform allows it.
export default async () => {
  const rows = [
    { client: "Redbird Provisions", phase: "Build · week 9 of 14", progress: 0.64, state: "build" },
    { client: "Cartwheel", phase: "Build · week 2 of 10", progress: 0.2, state: "build" },
    { client: "Bramble", phase: "Launch retainer · month 11", progress: 1, state: "steady" },
    { client: "Harbor & Line", phase: "Retainer · since 2023", progress: 1, state: "steady" },
    { client: "Ledgerline", phase: "Handed off · last summer", progress: null, state: "done" },
    { client: "Your project", phase: "Next discovery slot — October", progress: null, state: "open" },
  ];
  return new Response(JSON.stringify({ rows, servedBy: "node", at: new Date().toISOString() }), {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=300" },
  });
};
