import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <a className="brand" href="#top" aria-label="Aurel — back to the entrance">
        <span className="brand-mark">AUREL</span>
        <span className="brand-sub">Museum of Dimensional Craft</span>
      </a>
      <nav className="site-nav" aria-label="Museum wayfinding">
        <a href="#collection">Collection</a>
        <a href="#lend">Lend a work</a>
        <a href="#colophon">Colophon</a>
      </nav>
    </header>
  );
}
