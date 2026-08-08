import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ClickSpark from './components/reactbits/ClickSpark.jsx';
import Hero from './sections/Hero.jsx';
import System from './sections/System.jsx';
import Orbits from './sections/Orbits.jsx';
import Colophon from './sections/Colophon.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = time => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Scroll reveals: armed only when JS + motion are available, so content
    // is never hidden for anyone else.
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
      gsap.ticker.remove(tick);
      lenis.destroy();
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
