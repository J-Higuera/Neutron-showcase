import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Journey from './components/Journey.jsx';
import GlazeExplorer from './components/GlazeExplorer.jsx';
import Gallery from './components/Gallery.jsx';
import Workshops from './components/Workshops.jsx';
import Commissions from './components/Commissions.jsx';
import Visit from './components/Visit.jsx';

gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

export default function App() {
  const [glazeFilter, setGlazeFilter] = useState(null);

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
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out' }
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

  // Selecting a glaze opens its ledger note in place; the note's own
  // "see the pieces" link carries the reader down to the filtered shelf —
  // no auto-scroll stealing the note they just asked for.
  function selectGlaze(id) {
    setGlazeFilter(id);
  }

  return (
    <>
      <a className="skip-link" href="#work">Skip to the work</a>
      <Header />
      <main id="main">
        <Hero />
        <Journey />
        <GlazeExplorer selected={glazeFilter} onSelect={selectGlaze} />
        <Gallery glazeFilter={glazeFilter} onClearGlaze={() => setGlazeFilter(null)} />
        <Workshops />
        <Commissions />
        <Visit />
      </main>
      <footer className="site-footer">
        <p>Kiln &amp; Clay - Portland ceramics studio</p>
        <p className="mono">wheel · handbuild · glaze · fire</p>
        <a href="#top">Back to the kiln window</a>
      </footer>
    </>
  );
}
