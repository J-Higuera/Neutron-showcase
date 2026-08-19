import { useEffect, useState } from 'react';

const LINKS = [
  ['#work', 'The Work'],
  ['#workshops', 'Workshops'],
  ['#commissions', 'Commissions'],
  ['#visit', 'Visit'],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // The overlay menu owns the viewport while open; close on Escape and on
  // any anchor choice so navigation always lands unobstructed.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  // The menu overlay must NOT live inside .site-header: the header's
  // translateX(-50%) makes it the containing block for fixed descendants,
  // which would pin the "full-viewport" overlay inside the header pill.
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Kiln and Clay home">
          <span className="brand-mark" aria-hidden="true">K&amp;C</span>
          <span className="brand-name">Kiln &amp; Clay</span>
        </a>
        <nav className="top-nav" aria-label="Sections">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <a className="button button-primary header-cta" href="#workshops">Book</a>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          <span className="menu-icon" aria-hidden="true" data-open={open} />
          {open ? 'Close' : 'Menu'}
        </button>
      </header>
      <div id="mobile-menu" className="mobile-menu" data-open={open}>
        <nav aria-label="Sections">
          {LINKS.map(([href, label], i) => (
            <a key={href} href={href} style={{ '--i': i }} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="button button-primary" href="#workshops" onClick={() => setOpen(false)}>
            Book a workshop
          </a>
        </nav>
        <p className="mono menu-footnote">Portland, OR · pickup after the kiln cools</p>
      </div>
    </>
  );
}
