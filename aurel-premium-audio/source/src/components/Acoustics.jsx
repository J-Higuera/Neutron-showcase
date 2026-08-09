import { ACOUSTICS, REFERENCE } from '../data/products.js';

// The measured story: a real response curve drawn as inline SVG, the
// four acoustic behaviors, and the full build ledger — all visible, no
// interaction required.
function ResponseCurve() {
  return (
    <svg className="response-curve" viewBox="0 0 720 160" role="img"
      aria-label="Frequency response: even balance from 20 hertz to 20 kilohertz with gentle upper-air extension">
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={i * 240} y1="0" x2={i * 240} y2="160" className="curve-grid" />
      ))}
      <line x1="0" y1="80" x2="720" y2="80" className="curve-grid" />
      <path
        className="curve-line"
        d="M0 84 C 60 82, 110 78, 170 79 S 290 84, 360 82 S 500 76, 570 79 S 680 88, 720 92"
        fill="none"
      />
      <text x="8" y="152" className="curve-label">20 Hz</text>
      <text x="352" y="152" className="curve-label">1 kHz</text>
      <text x="676" y="152" className="curve-label">20 kHz</text>
    </svg>
  );
}

export default function Acoustics() {
  return (
    <section className="acoustics" id="acoustics" aria-labelledby="acoustics-title">
      <div className="section-heading reveal">
        <p className="eyebrow">Acoustics</p>
        <h2 id="acoustics-title">Measured for control, voiced for attention.</h2>
      </div>

      <div className="reveal">
        <ResponseCurve />
      </div>

      <div className="acoustics-grid">
        <dl className="spec-ledger reveal" aria-label="Build specifications">
          {REFERENCE.specs.map(([term, def]) => (
            <div key={term}><dt>{term}</dt><dd>{def}</dd></div>
          ))}
        </dl>
        <div className="acoustic-cards">
          {ACOUSTICS.map(([title, body], i) => (
            <article className="acoustic-card reveal" key={title} style={{ '--d': `${i * 60}ms` }}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
