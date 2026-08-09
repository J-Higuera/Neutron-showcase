const LINKS = [
  ['#reference', 'Reference'],
  ['#hardware', 'Hardware'],
  ['#acoustics', 'Acoustics'],
  ['#audition', 'Audition'],
];

export default function Header({ count, onOpenCart }) {
  return (
    <header className="site-header">
      <a className="brand" href="#reference">AUREL</a>
      <nav className="top-nav" aria-label="Sections">
        {LINKS.map(([href, label]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </nav>
      <button className="cart-button" onClick={onOpenCart} aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true" width="19" height="19">
          <path d="M4 7h16l-1.6 11a2 2 0 0 1-2 1.7H7.6a2 2 0 0 1-2-1.7L4 7Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M8.6 9.5V6.2a3.4 3.4 0 0 1 6.8 0v3.3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <span>Cart</span>
        {count > 0 && <span className="cart-count" aria-hidden="true">{count}</span>}
      </button>
    </header>
  );
}
