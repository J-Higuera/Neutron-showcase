// Kiln-status line: derived from the real date so the ledger never reads
// stale — firings land Fridays, cool over the weekend.
function kilnStatus() {
  const now = new Date();
  const friday = new Date(now);
  friday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7 || 7));
  const day = friday.toLocaleDateString('en-US', { weekday: 'long' });
  const hrs = now.getDay() === 6 || now.getDay() === 0
    ? 'KILN: cooling · cracked at 90°C'
    : `KILN: cone 6 loaded · fires ${day}`;
  return hrs;
}

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-atmosphere" aria-hidden="true">
        <img className="rain-pane" src="./assets/portland-rainy-street-soft-gray-light.jpg" alt="" fetchPriority="high" />
        <img className="kiln-pane" src="./assets/ceramic-kiln-interior-glowing-orange-heat.jpg" alt="" />
      </div>

      <div className="hero-content">
        <p className="eyebrow">Portland ceramics studio</p>
        <h1 id="hero-title">Rainlight<br />Kiln Ledger</h1>
        <p className="hero-lede">
          Wheel, handbuild, glaze, fire - every piece begins under Portland
          rainlight and leaves with kiln heat in its surface.
        </p>
        <div className="hero-actions" aria-label="Primary actions">
          <a className="button button-primary" href="#workshops">Book a workshop</a>
          <a className="button button-secondary" href="#work">Browse the work</a>
        </div>
      </div>

      <div className="hero-ledger mono" aria-label="Studio status">
        <span>{kilnStatus()}</span>
        <span className="ledger-dot" aria-hidden="true" />
        <span>SMALL CLASSES · MATERIALS INCLUDED</span>
        <span className="ledger-dot" aria-hidden="true" />
        <span>PICKUP AFTER THE KILN COOLS</span>
      </div>

      <a className="scroll-cue mono" href="#journey" aria-label="Scroll to the process">
        <span>FOLLOW THE CLAY</span>
        <span className="cue-line" aria-hidden="true" />
      </a>
    </section>
  );
}
