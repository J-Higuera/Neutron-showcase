import { ACOUSTICS, REFERENCE } from '../data/products.js';

// The measured story: a real response curve drawn as inline SVG, the
// four acoustic behaviors, and the full build ledger — all visible, no
// interaction required.
function ResponseCurve() {
  const trace = 'M0 84 C 60 82, 110 78, 170 79 S 290 84, 360 82 S 500 76, 570 79 S 680 88, 720 92';
  return (
    <figure className="curve-wrap">
      <svg className="response-curve" viewBox="0 0 720 160" role="img"
        aria-label="Frequency response: even balance from 20 hertz to 20 kilohertz with gentle upper-air extension">
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={i * 240} y1="0" x2={i * 240} y2="160" className="curve-grid" />
        ))}
        {[50, 80, 110].map((y) => (
          <line key={y} x1="0" y1={y} x2="720" y2={y} className="curve-grid" />
        ))}
        <path className="curve-area" d={`${trace} L 720 160 L 0 160 Z`} />
        <path className="curve-line" d={trace} fill="none" />
        <text x="8" y="152" className="curve-label">20 Hz</text>
        <text x="352" y="152" className="curve-label">1 kHz</text>
        <text x="662" y="152" className="curve-label">20 kHz</text>
        <text x="700" y="46" className="curve-label">+3 dB</text>
        <text x="704" y="76" className="curve-label">0 dB</text>
        <text x="700" y="106" className="curve-label">−3 dB</text>
      </svg>
      <figcaption className="curve-note mono">
        Studio rig · 1/12-octave smoothing · both drivers overlaid
      </figcaption>
    </figure>
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
