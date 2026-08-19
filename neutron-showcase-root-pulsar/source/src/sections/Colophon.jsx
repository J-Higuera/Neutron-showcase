export default function Colophon() {
  return (
    <footer className="colophon" id="colophon">
      <div className="colophon-grid">
        <div className="colophon-brand">
          <p className="colophon-mark">NEUTRON</p>
          <p className="colophon-tag">
            An autonomous agent platform. It plans, builds, reviews, and ships.
          </p>
        </div>
        <div className="colophon-facts mono">
          <p>THIS PAGE — HAND-WRITTEN WEBGL PULSAR + REACT BITS COMPONENTS</p>
          <p>THE WORLDS — 7 COMPLETE STATIC DEPLOYS, LINKED LIVE ABOVE</p>
          <p>
            BUILT WITH{' '}
            <a href="https://reactbits.dev" target="_blank" rel="noreferrer">
              REACT BITS
            </a>
            {' · '}GSAP{' · '}LENIS{' · '}OGL{' · '}REACT
          </p>
          <p>
            <a
              href="https://github.com/J-Higuera/Neutron-showcase"
              target="_blank"
              rel="noreferrer"
            >
              SHOWCASE SOURCE ↗
            </a>
          </p>
        </div>
      </div>
      <div className="colophon-bar mono">
        <span>PSR J2035+22 · SIGNAL NOMINAL</span>
        <span>MMXXVI</span>
      </div>
    </footer>
  );
}
