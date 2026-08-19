import { PHILOSOPHY_STATS } from '../data/products.js';

// The dark band: one statement about why the instrument exists, over the
// studio's own listening room, with the three numbers that back it up.
export default function Philosophy() {
  return (
    <section className="philosophy" aria-labelledby="philosophy-title">
      <img
        className="philosophy-photo"
        src="./assets/listening-lab-console.jpg"
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className="philosophy-inner">
        <p className="eyebrow reveal">Why open-back planar</p>
        <h2 id="philosophy-title" className="reveal" style={{ '--d': '60ms' }}>
          A speaker collapses a room into two points.
          This holds the room open.
        </h2>
        <p className="philosophy-lede reveal" style={{ '--d': '120ms' }}>
          The Reference is voiced in the same room every unit is measured in —
          against the master files, not against other headphones. Open backs
          keep reflections out of the cup; the planar film starts and stops
          with the record instead of ringing past it.
        </p>
        <dl className="philosophy-stats reveal" style={{ '--d': '180ms' }}>
          {PHILOSOPHY_STATS.map(([value, label]) => (
            <div key={label}>
              <dt className="mono">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
