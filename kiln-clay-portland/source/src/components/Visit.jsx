const HOURS = [
  ['Tue - Thu', 'Workshops 6-9 pm'],
  ['Fri', 'Kiln loads · by appointment'],
  ['Sat', 'Open studio + Glaze Lab 11-4'],
  ['Sun - Mon', 'The kiln cools · closed'],
];

export default function Visit() {
  return (
    <section className="visit" id="visit" aria-labelledby="visit-title">
      <div className="visit-image reveal">
        <img
          src="./assets/close-up-ceramic-glaze-test-tiles-studio-wall.jpg"
          alt="Close-up of fired glaze test tiles on the studio wall"
          loading="lazy" decoding="async"
        />
      </div>
      <div className="visit-copy">
        <div className="section-heading reveal">
          <p className="eyebrow">Studio story &amp; visit</p>
          <h2 id="visit-title">A working clay room between rain glass and kiln brick.</h2>
          <p>
            Kiln &amp; Clay keeps the studio visible: wheels in use, ware boards
            drying, glaze buckets open, cone notes taped beside the kiln, and
            finished pieces waiting on the pickup shelf.
          </p>
        </div>

        <dl className="hours-ledger reveal" aria-label="Studio hours">
          {HOURS.map(([d, h]) => (
            <div key={d}><dt className="mono">{d}</dt><dd>{h}</dd></div>
          ))}
        </dl>

        <div className="visit-actions reveal">
          <a className="button button-primary"
            href="mailto:hello@kilnandclaypdx.studio?subject=Studio%20visit">
            Plan a visit
          </a>
          <a className="button button-secondary dark"
            href="mailto:hello@kilnandclaypdx.studio?subject=Firing%20notes%20newsletter&body=Add%20me%20to%20the%20firing%20notes%20list%3A%20">
            Get firing notes
          </a>
        </div>
        <p className="mono visit-footnote">Portland, Oregon · workshops, commissions, and shop visits by appointment</p>
      </div>
    </section>
  );
}
