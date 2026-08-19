import { PRESS } from '../data/products.js';

// Three short quotes, set large, no carousel — all of them visible at once.
export default function Press() {
  return (
    <section className="press" aria-label="What reviewers say">
      <div className="press-grid">
        {PRESS.map((p, i) => (
          <blockquote className="press-quote reveal" key={p.source} style={{ '--d': `${i * 70}ms` }}>
            <p>&ldquo;{p.quote}&rdquo;</p>
            <cite className="mono">{p.source}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
