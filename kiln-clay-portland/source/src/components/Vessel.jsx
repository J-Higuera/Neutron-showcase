import { glazeById } from '../data/glazes.js';

// Every piece in the ledger renders as a drawn vessel wearing its real glaze
// gradient — one consistent visual language instead of mismatched photos,
// and the same gradients the test wall uses, so glaze → piece reads as one
// system. Forms sit on a shared baseline like pieces on one shelf.
const BODIES = {
  mug: (
    <>
      <path data-body d="M66 64 C66 59 134 59 134 64 L131 156 C131 163 69 163 69 156 Z" />
      <path data-handle d="M133 86 C159 88 159 126 132 130" fill="none" strokeWidth="11" strokeLinecap="round" />
      <ellipse data-rim cx="100" cy="63" rx="34" ry="5" />
    </>
  ),
  bowl: (
    <>
      <path data-body d="M32 94 C32 88 168 88 168 94 C168 132 138 158 100 158 C62 158 32 132 32 94 Z" />
      <ellipse data-rim cx="100" cy="92" rx="68" ry="7" />
    </>
  ),
  vase: (
    <>
      <path data-body d="M88 46 L112 46 C112 64 110 70 119 78 C143 96 147 128 129 149 C114 165 86 165 71 149 C53 128 57 96 81 78 C90 70 88 64 88 46 Z" />
      <ellipse data-rim cx="100" cy="46" rx="12" ry="3.4" />
    </>
  ),
  pitcher: (
    <>
      <path data-body d="M72 68 C74 60 118 58 126 64 L142 52 L140 76 C150 96 148 138 136 152 C120 166 80 166 68 152 C56 134 62 90 72 68 Z" />
      <path data-handle d="M134 94 C160 100 158 132 132 138" fill="none" strokeWidth="10" strokeLinecap="round" />
    </>
  ),
  planter: (
    <>
      <path data-body d="M58 64 L142 64 L133 150 C133 157 67 157 67 150 Z" />
      <path data-foot d="M64 162 L136 162 L131 172 L69 172 Z" />
      <ellipse data-rim cx="100" cy="63" rx="42" ry="5.5" />
    </>
  ),
  plate: (
    <>
      <path data-body d="M28 132 C28 125 172 125 172 132 C172 148 148 158 100 158 C52 158 28 148 28 132 Z" />
      <ellipse data-rim cx="100" cy="131" rx="72" ry="7.5" />
    </>
  ),
};

// Faint throwing lines across the body — the wheel's fingerprint.
const THROW_LINES = {
  mug: [88, 112, 136],
  bowl: [110, 128],
  vase: [96, 118, 138],
  pitcher: [96, 120, 142],
  planter: [92, 116, 138],
  plate: [142],
};

export default function Vessel({ form, glaze, className = '', title }) {
  const g = glazeById(glaze);
  const gid = `vg-${form}-${glaze}`;
  const [c0, c1, c2] = g.gradient;
  return (
    <svg
      className={`vessel ${className}`}
      viewBox="0 0 200 200"
      role="img"
      aria-label={title || `${form} in ${g.name}`}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={c0} />
          <stop offset="0.52" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`${gid}-sheen`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse className="vessel-shadow" cx="100" cy="172" rx="52" ry="8" />
      <g fill={`url(#${gid})`} stroke={`url(#${gid})`} strokeWidth="0">
        {BODIES[form]}
      </g>
      <g className="vessel-detail" stroke={c2} fill="none">
        {THROW_LINES[form].map((y) => (
          <path key={y} d={`M52 ${y} C 76 ${y + 4}, 124 ${y + 4}, 148 ${y}`} />
        ))}
      </g>
      <g fill={`url(#${gid}-sheen)`} pointerEvents="none">
        {BODIES[form]}
      </g>
    </svg>
  );
}
