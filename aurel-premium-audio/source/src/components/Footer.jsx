// A storefront's real footer: navigation, support, provenance, and the
// studio's address block — not a single throwaway line.
const COLUMNS = [
  {
    title: 'Shop',
    links: [
      ['#reference', 'Aurel Reference'],
      ['#hardware', 'Amplifier & DAC'],
      ['#hardware', 'Pads & cables'],
    ],
  },
  {
    title: 'Listen',
    links: [
      ['#audition', 'Book an audition'],
      ['#acoustics', 'Measurements'],
      ['#craft', 'Materials & making'],
    ],
  },
  {
    title: 'Support',
    links: [
      ['#support', 'Warranty & returns'],
      ['#support', 'Repairs'],
      ['mailto:studio@aurel.audio', 'studio@aurel.audio'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <p className="footer-mark">AUREL</p>
          <p className="footer-tag">
            Reference audio instruments, voiced and assembled in small runs.
          </p>
          <p className="footer-addr mono">
            Studio 4, Lindengracht 9 · Amsterdam<br />
            Listening room by appointment
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav className="footer-col" key={col.title} aria-label={col.title}>
            <p className="footer-head mono">{col.title}</p>
            {col.links.map(([href, label]) => (
              <a key={label} href={href}>{label}</a>
            ))}
          </nav>
        ))}
      </div>
      <div className="footer-line">
        <p>© {new Date().getFullYear()} Aurel Audio · Run № 7 now shipping</p>
        <a href="#reference">Back to the instrument</a>
      </div>
    </footer>
  );
}
