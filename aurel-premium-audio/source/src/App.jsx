import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Hardware from './components/Hardware.jsx';
import Acoustics from './components/Acoustics.jsx';
import Audition from './components/Audition.jsx';
import CartDrawer from './components/CartDrawer.jsx';

const CART_KEY = 'aurel-cart-v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* private mode */ }
  }, [cart]);

  // Scroll reveals: IntersectionObserver adds .in once per element. The
  // pre-paint .anim gate holds reveal targets hidden only when motion is
  // allowed; without it (reduced motion, no JS, dead-man) everything is
  // simply visible.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function addItem(item) {
    setCart((prev) => {
      const existing = prev.find((p) => p.key === item.key);
      if (existing) {
        return prev.map((p) => (p.key === item.key ? { ...p, qty: Math.min(9, p.qty + 1) } : p));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setLastAdded({ key: item.key, at: Date.now() });
    setCartOpen(true);
  }

  function setQty(key, qty) {
    setCart((prev) => (qty <= 0
      ? prev.filter((p) => p.key !== key)
      : prev.map((p) => (p.key === key ? { ...p, qty: Math.min(9, qty) } : p))));
  }

  const count = useMemo(() => cart.reduce((n, p) => n + p.qty, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((n, p) => n + p.qty * p.price, 0), [cart]);

  return (
    <>
      <a className="skip-link" href="#reference">Skip to the product</a>
      <Header count={count} onOpenCart={() => setCartOpen(true)} />
      <main id="main">
        <Hero onAdd={addItem} />
        <Hardware onAdd={addItem} />
        <Acoustics />
        <Audition />
      </main>
      <footer className="site-footer">
        <p><strong>AUREL</strong> - reference audio instruments, assembled in small runs.</p>
        <a href="#reference">Back to the instrument</a>
      </footer>
      <CartDrawer
        open={cartOpen}
        cart={cart}
        subtotal={subtotal}
        lastAdded={lastAdded}
        onClose={() => setCartOpen(false)}
        onSetQty={setQty}
      />
    </>
  );
}
