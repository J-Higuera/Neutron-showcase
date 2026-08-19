// Kiln-status line: derived from the real date so the ledger never reads
// stale — firings land Fridays, cool over the weekend.
function kilnStatus() {
  const now = new Date();
  const friday = new Date(now);
  friday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7 || 7));
  const day = friday.toLocaleDateString('en-US', { weekday: 'long' });
  return now.getDay() === 6 || now.getDay() === 0
    ? 'KILN: cooling · cracked at 90°C'
    : `KILN: cone 6 loaded · fires ${day}`;
}

// One connected composition, centered over a single studio photograph:
// eyebrow, title, lede, actions — one column, one axis, nothing split.
export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-atmosphere" aria-hidden="true">
        <img src="./assets/potter-hands-centering-wet-clay-wheel.jpg" alt="" fetchPriority="high" />
      </div>

      <div className="hero-content">
        <p className="eyebrow">Portland ceramics studio</p>
        <h1 id="hero-title">Rainlight Kiln Ledger</h1>
        <p className="hero-lede">
          Wheel, handbuild, glaze, fire - every piece begins under Portland
          rainlight and leaves with kiln heat in its surface.
        </p>
        <div className="hero-actions" aria-label="Primary actions">
          <a className="button button-primary" href="#workshops">Book a workshop</a>
          <a className="button button-secondary" href="#work">Browse the work</a>
        </div>
      </div>

      <p className="hero-ledger mono" aria-label="Studio status">
        {kilnStatus()} · pickup after the kiln cools
      </p>

      <a className="scroll-cue mono" href="#journey" aria-label="Scroll to the process">
        <span>FOLLOW THE CLAY</span>
        <span className="cue-line" aria-hidden="true" />
      </a>
    </section>
  );
}
