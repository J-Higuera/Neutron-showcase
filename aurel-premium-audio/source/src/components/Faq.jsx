import { FAQ } from '../data/products.js';

// Support, answered in the open: a plain two-column grid of questions with
// their full answers visible — nothing folded away behind interaction.
export default function Faq() {
  return (
    <section className="faq" id="support" aria-labelledby="faq-title">
      <div className="section-heading reveal">
        <p className="eyebrow">Ownership &amp; support</p>
        <h2 id="faq-title">The part after the checkout.</h2>
      </div>
      <dl className="faq-grid">
        {FAQ.map(([q, a], i) => (
          <div className="faq-item reveal" key={q} style={{ '--d': `${(i % 2) * 70}ms` }}>
            <dt>{q}</dt>
            <dd>{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
