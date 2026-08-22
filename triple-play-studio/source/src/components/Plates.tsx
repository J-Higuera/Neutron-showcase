/* Editorial plates — the site's imagery (owner, 2026-08-22: REAL photos).
   Each case opens with a photograph of its world — the Antwerp terminal at
   dusk, USDA seed beds under an irrigation boom, the PostGirot payments
   datacentre — graded into the studio palette, with the case's schematic
   drawn OVER the photograph. Licenses verified from Wikimedia Commons
   metadata (CC BY 4.0 / Public domain / CC0); credits in the footer and
   CREDITS.md. */

const INK = "oklch(88% 0.01 262 / 0.75)";
const DIM = "oklch(85% 0.012 262 / 0.4)";
const LABEL = "oklch(92% 0.008 262 / 0.9)";

function PlateFrame({ children, label, photo, alt }: { children: React.ReactNode; label: string; photo: string; alt: string }) {
  return (
    <figure className="plate pointer-events-none relative mb-10 select-none overflow-hidden rounded-xl border border-edge-soft bg-pit/40">
      <img
        src={photo}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-70 [filter:saturate(0.7)_contrast(1.05)_brightness(0.72)]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-ink/70" />
      <svg viewBox="0 0 1200 190" className="relative block h-[150px] w-full sm:h-[190px]" preserveAspectRatio="xMidYMid slice">
        {children}
      </svg>
      {/* label lives outside the svg — the band crops from the sides on
          phones and would swallow it */}
      <figcaption className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.25em] sm:left-6 sm:top-4" style={{ color: LABEL }}>
        {label}
      </figcaption>
    </figure>
  );
}

/* Harbor & Line — lanes into Chicago */
export function LanesPlate() {
  const cobalt = "oklch(80% 0.13 264 / 0.95)";
  const ports: Array<[string, number, number]> = [
    ["SHA", 120, 132], ["PUS", 300, 146], ["RTM", 560, 124], ["HAM", 740, 142],
  ];
  const hub: [number, number] = [1020, 78];
  return (
    <PlateFrame label="Plate 01 · Four lanes, one desk — CHI" photo="img/harbor.webp" alt="Container cranes at the Port of Antwerp at dusk">
      <line x1="0" y1="150" x2="1200" y2="150" stroke={DIM} strokeWidth="1" />
      {ports.map(([n, x, y]) => (
        <g key={n}>
          <path d={`M ${x} ${y} Q ${(x + hub[0]) / 2} ${Math.min(y, hub[1]) - 58}, ${hub[0]} ${hub[1]}`} fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="5 6" />
          <circle cx={x} cy={y} r="4" fill="none" stroke={INK} strokeWidth="1.4" />
          <text x={x - 12} y={y + 20} fontSize="10" letterSpacing="1.5" fill={LABEL} className="font-mono">{n}</text>
        </g>
      ))}
      <circle cx={hub[0]} cy={hub[1]} r="7" fill="none" stroke={cobalt} strokeWidth="1.6" />
      <circle cx={hub[0]} cy={hub[1]} r="2.4" fill={cobalt} />
      <text x={hub[0] - 14} y={hub[1] - 16} fontSize="10" letterSpacing="1.5" fill={cobalt} className="font-mono">CHI</text>
      <text x={hub[0] + 26} y={hub[1] + 6} fontSize="9" fill={DIM} className="font-mono">38 min / quote</text>
    </PlateFrame>
  );
}

/* Bramble — a planting bed */
export function GardenPlate() {
  const leaf = "oklch(80% 0.12 152 / 0.95)";
  return (
    <PlateFrame label="Plate 02 · North bed, drip line, week 19" photo="img/bramble.webp" alt="Seed beds under an irrigation boom, from above">
      {[0, 1, 2].map((row) => (
        <line key={row} x1="90" y1={62 + row * 34} x2="1110" y2={62 + row * 34} stroke={DIM} strokeWidth="1" />
      ))}
      {Array.from({ length: 14 }, (_, i) => {
        const x = 120 + i * 72;
        const row = i % 3;
        const y = 62 + row * 34;
        const grown = (i * 7) % 4 !== 0;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={grown ? 6.5 : 3.5} fill="none" stroke={grown ? leaf : INK} strokeWidth="1.3" />
            {grown && <path d={`M ${x} ${y - 6.5} q 4 -7 10 -9`} fill="none" stroke={leaf} strokeWidth="1.2" />}
          </g>
        );
      })}
      <path d="M 90 168 C 300 152, 620 178, 1110 158" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="2 5" />
      <text x="1042" y="150" fontSize="9" fill={DIM} className="font-mono">moisture</text>
    </PlateFrame>
  );
}

/* Ledgerline — a payment run, boxed and audited */
export function LedgerPlate() {
  const amber = "oklch(84% 0.12 82 / 0.95)";
  const steps = ["ONBOARD", "VERIFY W-9", "RUN · $18M", "1099s"];
  return (
    <PlateFrame label="Plate 03 · One run, fully audited" photo="img/ledger.webp" alt="IBM 1410 in the PostGirot payments datacentre">
      {steps.map((t, i) => {
        const x = 120 + i * 260;
        return (
          <g key={t}>
            <rect x={x} y={62} width="180" height="46" rx="6" fill="none" stroke={i === 2 ? amber : INK} strokeWidth="1.4" />
            <text x={x + 16} y={89} fontSize="11" letterSpacing="1.5" fill={i === 2 ? amber : LABEL} className="font-mono">{t}</text>
            {i < steps.length - 1 && (
              <path d={`M ${x + 190} 85 h 52 m -8 -6 l 8 6 l -8 6`} fill="none" stroke={INK} strokeWidth="1.3" />
            )}
          </g>
        );
      })}
      {Array.from({ length: 22 }, (_, i) => (
        <line key={i} x1={124 + i * 46} y1="130" x2={130 + i * 46} y2="130" stroke={DIM} strokeWidth="2" />
      ))}
      <text x="1042" y="134" fontSize="9" fill={DIM} className="font-mono">audit trail</text>
    </PlateFrame>
  );
}
