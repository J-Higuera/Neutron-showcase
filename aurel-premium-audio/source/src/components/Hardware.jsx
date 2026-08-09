import { ACCESSORIES } from '../data/products.js';

export default function Hardware({ onAdd }) {
  return (
    <section className="hardware" id="hardware" aria-labelledby="hardware-title">
      <div className="section-heading reveal">
        <p className="eyebrow">The hardware around it</p>
        <h2 id="hardware-title">One voicing, matched at every link.</h2>
        <p>
          Everything here is measured against the same reference chain the
          headphones are voiced on - buy the pieces you need, skip the rest.
        </p>
      </div>

      <div className="hardware-grid">
        {ACCESSORIES.map((a, i) => (
          <article className="hardware-card reveal" key={a.id} style={{ '--d': `${i * 60}ms` }}>
            <div className="hardware-photo">
              <img src={a.image} alt={a.alt} loading="lazy" decoding="async" />
            </div>
            <div className="hardware-body">
              <h3>{a.name}</h3>
              <p>{a.blurb}</p>
              <div className="hardware-buy">
                <span className="price">${a.price.toLocaleString('en-US')}</span>
                <button
                  className="button button-secondary"
                  onClick={() => onAdd({ key: a.id, name: a.name, detail: null, price: a.price })}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
