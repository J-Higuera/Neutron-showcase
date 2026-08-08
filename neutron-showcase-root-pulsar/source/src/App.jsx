import { useEffect } from 'react';
import ClickSpark from './components/reactbits/ClickSpark.jsx';
import Hero from './sections/Hero.jsx';
import System from './sections/System.jsx';
import Orbits from './sections/Orbits.jsx';
import Colophon from './sections/Colophon.jsx';

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    // Native scrolling only — no smooth-scroll library. Scroll reveals are
    // armed only when JS + motion are available, so content is never hidden
    // for anyone else.
    document.body.classList.add('reveal-armed');
    const io = new IntersectionObserver(
      observed => {
        observed.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

    return () => {
      io.disconnect();
      document.body.classList.remove('reveal-armed');
    };
  }, []);

  return (
    <ClickSpark
      sparkColor="#ffe7c4"
      sparkSize={8}
      sparkRadius={18}
      sparkCount={8}
      duration={450}
    >
      <main>
        <Hero />
        <System />
        <Orbits />
        <Colophon />
      </main>
    </ClickSpark>
  );
}
