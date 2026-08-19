import { CRAFT } from '../data/products.js';

// Materials and making: three alternating photo-editorial rows. Everything
// is visible on scroll — no tabs, no accordions, no hidden panels.
export default function Craft() {
  return (
    <section className="craft" id="craft" aria-labelledby="craft-title">
      <div className="section-heading reveal">
        <p className="eyebrow">Materials &amp; making</p>
        <h2 id="craft-title">Built like the records you keep.</h2>
        <p>
          Nothing on the Reference is decorative. Each material earned its
          place by what it does to the sound, the weight, or the years.
        </p>
      </div>

      <div className="craft-rows">
        {CRAFT.map((row, i) => (
          <article className={`craft-row${i % 2 ? ' flip' : ''}`} key={row.id}>
            <figure className="craft-photo reveal">
              <img src={row.image} alt={row.alt} loading="lazy" decoding="async" />
            </figure>
            <div className="craft-copy reveal" style={{ '--d': '80ms' }}>
              <span className="craft-index mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{row.title}</h3>
              <p>{row.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
