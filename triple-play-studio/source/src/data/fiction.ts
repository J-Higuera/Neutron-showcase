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
      "Thirty million dollars a year of freight, quoted out of Excel and a shared inbox. A quote took six days to assemble; by day six the customer had often booked elsewhere. The second-generation CEO knew the business was leaking at the quote stage — he just couldn’t see the leak.",
    did:
      "We spent the first two weeks of discovery in their dispatch office, pricing live shipments by hand until we could do it badly ourselves. The build followed the room, not a spec: a rate engine that reads the tariff feeds dispatchers were retyping, a quote builder that composes in minutes, and tracking that customers check themselves instead of calling.",
    stats: [
      { n: "38 min", label: "quote turnaround, down from 6 days" },
      { n: "61%", label: "win rate on quoted lanes, up from 34%" },
      { n: "$4.1M", label: "booked through Quayside in its first quarter" },
    ],
    quote:
      "They sat in our dispatch office for two weeks before writing a line of code. The thing they built works the way freight actually works — my father uses it, and he distrusts computers professionally.",
    attribution: "Marty Halloran — CEO, Harbor & Line",
    caption: "Quayside’s quote builder — the six-day spreadsheet, rebuilt as a 38-minute screen. Price a lane yourself.",
  },
  bramble: {
    name: "Bramble",
    sector: "Consumer · garden care · seed-funded",
    engagement: "Discovery → 12-week build → launch retainer",
    shipped: "iOS & Android app, deck to launch in 19 weeks",
    arrived:
      "Casey Munro had left a landscape architecture career with a conviction: garden care fails because advice isn’t tied to your plants and your weather. They had $2.8M in seed funding, an 11,000-person waitlist, a beautiful deck — and nine months of runway. An agency had already burned four of the last twelve on a design system.",
    did:
      "Discovery killed half the deck and kept the sharpest wedge: a daily care plan built from what you actually grow, where you actually live. A build was in Casey’s hand by week five. We shipped the scan flow in week nine, launched in week nineteen, and stayed on as the launch retainer — reading the instruments, shipping the next thing.",
    stats: [
      { n: "19 wks", label: "from deck to both app stores" },
      { n: "4.8★", label: "across 2,140 ratings" },
      { n: "41%", label: "day-30 retention · Series A eight months later" },
    ],
    quote:
      "I’d been burned once — four months, no product. Triple Play put a working build in my hand by week five, and the score in my inbox every Friday since. When we raised the A, our lead investor asked who built it. That’s the review that matters.",
    attribution: "Casey Munro — Founder, Bramble",
    caption: "Bramble’s morning screen — the founder’s deck, made real. Check something off.",
  },
  ledger: {
    name: "Ledgerline",
    sector: "B2B fintech · 140-person payroll company",
    engagement: "Discovery → 16-week build → paired handoff",
    shipped: "Ledgerline Contractor — payments & 1099s",
    arrived:
      "An eleven-year-old payroll company whose customers kept asking for contractor payments — and an internal roadmap with no room to build it. Dana Whitfield, the VP of Product, needed the product and needed her own engineers to own it afterward. Most studios treat that second requirement as an insult. We treat it as a spec.",
    did:
      "Sixteen weeks alongside two of her engineers: contractor onboarding that verifies tax details up front, payment runs with full audit trails, and a document center that generates 1099s without a support ticket. The final two weeks were the paired handoff — by the end of them, her team was deploying without us in the room.",
    stats: [
      { n: "$18M", label: "processed in the first nine months" },
      { n: "94%", label: "of contractors self-onboard, no ticket" },
      { n: "100%", label: "of the codebase owned in-house since handoff" },
    ],
    quote:
      "Their exit was as impressive as their entrance. They built it, instrumented it, paired with my engineers for two weeks, handed over the keys — and actually left. I’ve never seen an agency do that on purpose.",
    attribution: "Dana Whitfield — VP Product, Ledgerline",
    caption: "A March payment run in Ledgerline Contractor — built with her engineers, then handed to them. Approve it.",
  },
};

export const shapes = [
  {
    index: "01",
    title: "Discovery sprint",
    terms: ["6 weeks · fixed ", "$48,000", ""],
    body:
      "We take your ambition apart and make the riskiest piece real enough to test. You end with a working prototype, the evidence it produced, and a scoped build plan with a price on it.",
    who: "both founding partners, twice a week, live.",
    fine: "If discovery says you shouldn’t build, we say so and stop. It has happened twice. Both founders still send us referrals.",
  },
  {
    index: "02",
    title: "The build",
    terms: ["8–16 weeks · scoped from discovery, typically ", "$180k–$420k", ""],
    body:
      "A senior team of three or four, one accountable partner, production habits from day one. A demo every other Thursday. A scoreboard every Friday. Your repo, your accounts, from the first commit.",
    who: "your accountable partner — in the standups, at the Thursday demo, and on every Friday scoreboard.",
    fine: "We run two builds at a time across the whole studio. Never more.",
  },
  {
    index: "03",
    title: "After launch",
    terms: ["retainer from ", "$9,000/mo", " · or a paired handoff"],
    body:
      "Either we stay on to read the instruments and ship what they suggest — or we spend two paired weeks handing the whole system to your engineers, the way we did for Ledgerline. Both are first-class exits.",
    who: "the same people who built it. Nobody new to educate.",
    fine: "Locked-in clients are a business model. It isn’t ours.",
  },
];

export const weekOne = [
  ["Monday", "A working session on the one metric that decides whether this project succeeded. Everything else gets ranked against it."],
  ["Tuesday", "Repo, CI, staging, and production accounts exist — in your name. We ship a walking skeleton to production before we design anything."],
  ["Wednesday", "We talk to the people the software is for. Users, dispatchers, contractors — whoever will live in it."],
  ["Thursday", "The riskiest assumption gets named and a prototype to test it gets scoped. Risk goes first, not last."],
  ["Friday", "Your first scoreboard arrives. They don’t stop until the work does."],
] as const;

export const scoreboardAlways = [
  "Sent every Friday by 4 p.m., in the same format since 2019.",
  "Written by a partner on your build — never generated, never delegated.",
  "The budget line comes from our books, not a burndown chart.",
  "If a week goes badly, the scoreboard says so in the first line.",
];

export const sampleScoreboard = {
  client: "Harbor & Line — build",
  week: "Week 07 / 14",
  stamp: "Friday, 3:56 p.m.",
  intro:
    "Every client gets this document, every Friday, written by a partner — not a dashboard link, not a status theater deck. This one is from week seven of the Harbor & Line build, shared with their permission.",
  rule: "bad news travels fastest.",
  shipped: [
    "Rate engine now reads live tariff feeds. The nightly CSV import — and the 6 a.m. retyping ritual — is gone.",
    "Quote builder works end to end behind a flag. Dispatch has been quoting live freight with it since Wednesday.",
    "Customs document upload, with scanning and a retention policy your auditor will like.",
  ],
  slipped: [
    "Customer-facing tracking page. The carrier’s API sandbox was down Tuesday–Thursday. We’ve stubbed it against recorded traffic and expect to be back on plan by next Wednesday.",
  ],
  decide: [
    "Multi-currency quoting: cut it from launch scope, or move launch one week. Our recommendation is attached (cut it — 2 of 214 quotes last quarter were non-USD). We need your call by Tuesday.",
  ],
  budget: { spent: "$171,000", of: "$340,000", pct: 50, note: "on plan at week 7 of 14" },
  next: ["Tracking page recovery; invoice export; usability round two with the dispatch team."],
  signed: "— Priya, keeper of the score",
};

export const team = [
  { initials: "MO", hue: 262, name: "Mara Oyelaran", role: "Founding partner · Product", bio: "Ran product at a freight marketplace before founding the studio. Wrote the week-one memo that became Quayside.", now: "This week: Redbird Provisions, week 9" },
  { initials: "TR", hue: 210, name: "Tomás Rivera", role: "Founding partner · Engineering", bio: "Two decades of shipping, from embedded firmware to payments. Led the Ledgerline handoff — and insisted it be graded.", now: "This week: October discovery scoping" },
  { initials: "JP", hue: 150, name: "June Park", role: "Design principal", bio: "Every interface on this page is hers or was reviewed by her. Believes a good empty state is worth two features.", now: "This week: Bramble seasonal release" },
  { initials: "AO", hue: 32, name: "Adaeze Okafor", role: "Engineering lead · Platform & data", bio: "Built Quayside’s rate engine and the audit trail under Ledgerline’s payment runs. Allergic to clever schemas.", now: "This week: Redbird Provisions, week 9" },
  { initials: "SB", hue: 300, name: "Silas Beck", role: "Product engineer", bio: "Shipped Bramble’s scan flow in week nine. Prototypes in production code because throwaway code never gets thrown away.", now: "This week: Cartwheel build, week 2" },
  { initials: "PR", hue: 190, name: "Priya Raghavan", role: "Partner · Delivery", bio: "Writes every Friday scoreboard in the studio. The budget bar is hers, and it has never once been decorative.", now: "This week: two scoreboards, one hard call" },
  { initials: "NT", hue: 80, name: "Noel Tran", role: "Launch & growth", bio: "Instrumented all three launches on this page. Reads retention curves the way dispatchers read tariff sheets.", now: "This week: Cartwheel instrumentation, week 2" },
];

export const beliefs = [
  {
    title: "Small senior teams beat vendor armies.",
    body: "Seven people who have shipped together for years will outrun forty who met last month, every time. Coordination is where agency budgets go to die; we carry none.",
  },
  {
    title: "No handoffs. One motion.",
    body: "The person in your first call is in your standups. Strategy, build, and launch are not phases passed between departments — they’re one continuous play, run by the same people. It’s the whole reason for the name.",
  },
  {
    title: "The score gets kept out loud.",
    body: "Shipped, slipped, and burn — in writing, every Friday, signed by a partner. Radical transparency isn’t a virtue we claim; it’s a document we send. Bad news travels fastest here, and that is precisely why our clients sleep.",
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
