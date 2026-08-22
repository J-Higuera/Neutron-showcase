/* The studio's fiction — audited for internal consistency (2026-08-19 review).
   Every number here coheres with every other; change with care. */

export const studio = {
  email: "hello@tripleplay.studio",
  address: ["2140 W Carroll Ave, Suite 3B", "Chicago, IL 60612"],
  facts: [
    { n: "14", label: "products shipped since 2019" },
    { n: "2", label: "builds at a time, never more" },
    { n: "$48k", label: "fixed-fee discovery" },
  ],
};

export type BoardRow = {
  client: string;
  phase: string;
  progress: number | null; // 0..1, null = open slot
  state: "build" | "steady" | "done" | "open";
};

export const board: BoardRow[] = [
  { client: "Redbird Provisions", phase: "Build · week 9 of 14", progress: 0.64, state: "build" },
  { client: "Cartwheel", phase: "Build · week 2 of 10", progress: 0.2, state: "build" },
  { client: "Bramble", phase: "Launch retainer · month 11", progress: 1, state: "steady" },
  { client: "Harbor & Line", phase: "Retainer · since 2023", progress: 1, state: "steady" },
  { client: "Ledgerline", phase: "Handed off · last summer", progress: null, state: "done" },
  { client: "Your project", phase: "Next discovery slot — October", progress: null, state: "open" },
];

export const cases = {
  harbor: {
    name: "Harbor & Line",
    sector: "Freight forwarding · Chicago · family-run since 1987",
    engagement: "Discovery → 14-week build → retainer",
    shipped: "Quayside, a quote-to-booking platform",
    arrived:
      "Thirty million dollars a year of freight, quoted out of Excel. A quote took six days — and by day six the customer had often booked elsewhere.",
    did:
      "Two weeks in their dispatch office, then a build that followed the room: a rate engine on live tariff feeds, a quote builder that composes in minutes, tracking customers check themselves.",
    stats: [
      { n: "38 min", label: "quote turnaround, down from 6 days" },
      { n: "61%", label: "win rate on quoted lanes, up from 34%" },
      { n: "$4.1M", label: "booked through Quayside in its first quarter" },
    ],
    quote:
      "The thing they built works the way freight actually works — my father uses it, and he distrusts computers professionally.",
    attribution: "Marty Halloran — CEO, Harbor & Line",
    caption: "the six-day spreadsheet, rebuilt as a 38-minute screen.",
  },
  bramble: {
    name: "Bramble",
    sector: "Consumer · garden care · seed-funded",
    engagement: "Discovery → 12-week build → launch retainer",
    shipped: "iOS & Android app, deck to launch in 19 weeks",
    arrived:
      "Seed funding, an 11,000-person waitlist, a beautiful deck — and nine months of runway, four already burned by another agency.",
    did:
      "Discovery kept the sharpest wedge: a daily care plan from what you grow and where you live. A build in hand by week five; launched in week nineteen.",
    stats: [
      { n: "19 wks", label: "from deck to both app stores" },
      { n: "4.8★", label: "across 2,140 ratings" },
      { n: "41%", label: "day-30 retention · Series A eight months later" },
    ],
    quote:
      "A working build in my hand by week five, and the score in my inbox every Friday since. When we raised the A, our lead investor asked who built it.",
    attribution: "Casey Munro — Founder, Bramble",
    caption: "the founder’s deck, made real.",
  },
  ledger: {
    name: "Ledgerline",
    sector: "B2B fintech · 140-person payroll company",
    engagement: "Discovery → 16-week build → paired handoff",
    shipped: "Ledgerline Contractor — payments & 1099s",
    arrived:
      "A payroll company whose customers kept asking for contractor payments — and whose own engineers had to own the product afterward. We treat that as a spec, not an insult.",
    did:
      "Sixteen weeks alongside two of her engineers: verified onboarding, audited payment runs, self-serve 1099s. The last two weeks were the handoff — they now deploy without us.",
    stats: [
      { n: "$18M", label: "processed in the first nine months" },
      { n: "94%", label: "of contractors self-onboard, no ticket" },
      { n: "100%", label: "of the codebase owned in-house since handoff" },
    ],
    quote:
      "They built it, paired with my engineers, handed over the keys — and actually left. I’ve never seen an agency do that on purpose.",
    attribution: "Dana Whitfield — VP Product, Ledgerline",
    caption: "a March payment run, built with her engineers, then handed over.",
  },
};

export const shapes = [
  {
    index: "01",
    title: "Discovery sprint",
    terms: ["6 weeks · fixed ", "$48,000", ""],
    body:
      "We make the riskiest piece of your idea real enough to test. You leave with a prototype, its evidence, and a priced build plan.",
    who: "both founding partners, twice a week, live.",
    fine: "If discovery says don’t build, we say so and stop. It has happened twice.",
  },
  {
    index: "02",
    title: "The build",
    terms: ["8–16 weeks · scoped from discovery, typically ", "$180k–$420k", ""],
    body:
      "Three or four senior people, one accountable partner. A demo every other Thursday, a scoreboard every Friday, your repo from the first commit.",
    who: "your accountable partner, in the standups and on every scoreboard.",
    fine: "Two builds at a time across the whole studio. Never more.",
  },
  {
    index: "03",
    title: "After launch",
    terms: ["retainer from ", "$9,000/mo", " · or a paired handoff"],
    body:
      "We stay on and ship what the numbers suggest — or hand the whole system to your engineers in two paired weeks. Both are first-class exits.",
    who: "the same people who built it.",
    fine: "Locked-in clients are a business model. It isn’t ours.",
  },
];

export const weekOne = [
  ["Monday", "We agree the one metric that decides whether this project succeeded."],
  ["Tuesday", "Repo, CI, and production accounts exist — in your name — with a walking skeleton deployed."],
  ["Wednesday", "We talk to the people who will live in the software."],
  ["Thursday", "The riskiest assumption gets named, and a test for it gets scoped."],
  ["Friday", "Your first scoreboard arrives. They don’t stop until the work does."],
] as const;

export const scoreboardAlways = [
  "Every Friday by 4 p.m., written by a partner on your build.",
  "The budget line comes from our books, not a burndown chart.",
  "If a week goes badly, the scoreboard says so in the first line.",
];

export const sampleScoreboard = {
  client: "Harbor & Line — build",
  week: "Week 07 / 14",
  stamp: "Friday, 3:56 p.m.",
  intro:
    "Every client gets this document every Friday, written by a partner — this one is week seven of the Harbor & Line build, shared with permission.",
  rule: "bad news travels fastest.",
  shipped: [
    "Rate engine reads live tariff feeds — the 6 a.m. CSV retyping ritual is gone.",
    "Quote builder works end to end; dispatch has quoted live freight with it since Wednesday.",
  ],
  slipped: [
    "Customer tracking page — the carrier’s sandbox was down three days. Back on plan by Wednesday.",
  ],
  decide: [
    "Multi-currency quoting: cut from launch, or move launch a week. We recommend cutting — your call by Tuesday.",
  ],
  budget: { spent: "$171,000", of: "$340,000", pct: 50, note: "on plan at week 7 of 14" },
  signed: "— Priya, keeper of the score",
};

export const team = [
  { initials: "MO", hue: 262, name: "Mara Oyelaran", role: "Founding partner · Product", bio: "Ran product at a freight marketplace; wrote the memo that became Quayside.", now: "This week: Redbird Provisions, week 9" },
  { initials: "TR", hue: 210, name: "Tomás Rivera", role: "Founding partner · Engineering", bio: "Two decades of shipping, firmware to payments. Led the Ledgerline handoff.", now: "This week: October discovery scoping" },
  { initials: "JP", hue: 150, name: "June Park", role: "Design principal", bio: "Every interface on this page is hers or passed through her review.", now: "This week: Bramble seasonal release" },
  { initials: "AO", hue: 32, name: "Adaeze Okafor", role: "Engineering lead · Platform & data", bio: "Built Quayside’s rate engine and Ledgerline’s audit trail.", now: "This week: Redbird Provisions, week 9" },
  { initials: "SB", hue: 300, name: "Silas Beck", role: "Product engineer", bio: "Shipped Bramble’s scan flow in week nine. Prototypes in production code.", now: "This week: Cartwheel build, week 2" },
  { initials: "PR", hue: 190, name: "Priya Raghavan", role: "Partner · Delivery", bio: "Writes every Friday scoreboard in the studio. The budget bar is hers.", now: "This week: two scoreboards, one hard call" },
  { initials: "NT", hue: 80, name: "Noel Tran", role: "Launch & growth", bio: "Instrumented all three launches on this page.", now: "This week: Cartwheel instrumentation, week 2" },
];

export const beliefs = [
  {
    title: "Small senior teams beat vendor armies.",
    body: "Seven people who have shipped together for years outrun forty who met last month.",
  },
  {
    title: "No handoffs. One motion.",
    body: "The person in your first call is in your standups — strategy, build, and launch are one play, run by the same people.",
  },
  {
    title: "The score gets kept out loud.",
    body: "Shipped, slipped, and burn — in writing, every Friday, signed by a partner. Bad news travels fastest here.",
  },
];

export const faq = [
  ["Who owns the IP?", "You do — completely, from the first commit. The repo, the cloud accounts, the design files all live in your name from day one of the build. If we disappeared mid-project, you’d lose nothing but our company."],
  ["What does it cost?", "Discovery is a fixed $48,000. Builds are scoped from what discovery proves — typically $180k–$420k, quoted as a number, not an hourly meter. Retainers start at $9,000/mo. Nothing is billed hourly, ever."],
  ["What stack do you build on?", "Boring on purpose: TypeScript, React and React Native, Node, Postgres, and one major cloud. Chosen so that any competent team — including yours, someday — can inherit the codebase without an archaeology degree."],
  ["What if it isn’t working?", "Two weeks’ notice, either direction, at any point. You keep everything, we run a handoff sprint, and the last scoreboard says exactly where things stand. The kill-switch is in the contract because trust needs an exit to be real."],
  ["I’m not technical. Is that a problem?", "Most of our founders aren’t. The scoreboard exists so you can govern the project without reading code: what shipped, what slipped, what it costs, what we need from you. You make the calls; we make them easy to make."],
  ["Who actually does the work?", "The seven people on this page. No subcontractors, no offshore bench, no bait-and-switch between the sales call and the standup — the partner you meet first is accountable to you throughout."],
  ["What happens after launch?", "Your choice of two first-class exits: we stay on retainer to watch the launch numbers and build what they argue for, or we hand the system to your team the way we did for Ledgerline — two paired weeks, graded by whether they can deploy without us in the room."],
  ["How many clients do you take?", "Two builds at a time across the whole studio, plus one discovery. That number is on our homepage because it’s load-bearing: it is how the work stays senior and the Fridays stay honest."],
] as const;
