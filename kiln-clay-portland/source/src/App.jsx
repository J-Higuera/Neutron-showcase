import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Journey from './components/Journey.jsx';
import Gallery, { PieceModal } from './components/Gallery.jsx';
import Workshops from './components/Workshops.jsx';
import Commissions from './components/Commissions.jsx';
import Visit from './components/Visit.jsx';
import { PIECES } from './data/pieces.js';

gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

// Today's pull: one available piece featured in the hero, rotating with the
// real date so the ledger stays alive without anyone touching it.
function todaysPull() {
  const available = PIECES.filter((p) => p.status === 'available');
  const day = Math.floor(Date.now() / 86400000);
  return available[day % available.length];
}

export default function App() {
  const [glazeFilter, setGlazeFilter] = useState(null);
  const [modalPiece, setModalPiece] = useState(null);
  const featured = todaysPull();

  // Global motion: hero intro (behind the pre-paint .anim gate) and gentle
  // section reveals. Every non-animating path removes the gate instead.
  useEffect(() => {
    const docEl = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      docEl.classList.remove('anim');
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-content > *',
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.11, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.hero-ledger, .scroll-cue',
        { opacity: 0 },
        { opacity: 1, duration: 0.7, delay: 0.55, ease: 'power2.out' }
      );

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <a className="skip-link" href="#work">Skip to the work</a>
      <Header />
      <main id="main">
        <Hero />
        <Journey />
        <Gallery
          glazeFilter={glazeFilter}
          onGlazeSelect={setGlazeFilter}
          onOpenPiece={setModalPiece}
          featured={featured}
        />
        <Workshops />
        <Commissions />
        <Visit />
      </main>
      <footer className="site-footer">
        <p>Kiln &amp; Clay - Portland ceramics studio</p>
        <a href="#top">Back to the kiln window</a>
      </footer>
      {modalPiece && <PieceModal piece={modalPiece} onClose={() => setModalPiece(null)} />}
    </>
  );
}
