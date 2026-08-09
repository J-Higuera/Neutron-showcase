import { useEffect, useState } from 'react';
import PulsarHero from '../components/PulsarHero.jsx';
import DecryptedText from '../components/reactbits/DecryptedText.jsx';
import StarBorder from '../components/reactbits/StarBorder.jsx';
import Magnet from '../components/reactbits/Magnet.jsx';

export default function Hero() {
  // The title animation starts only after two painted frames — if it starts
  // during the initial mount storm, dropped frames make the letters appear to
  // freeze and then pop in at once.
  const [play, setPlay] = useState(false);
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPlay(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const scrollToWorlds = () => {
    document.getElementById('worlds')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="hero" id="hero">
      <PulsarHero />

      <div className="hero-frame mono">
        <span>NEUTRON · SHOWCASE ROOT</span>
        <span>PSR J2035+22</span>
      </div>

      <div className="hero-center">
        <p className="hero-kicker mono">
          <DecryptedText
            text="AN AUTONOMOUS SYSTEM AND ITS WORLDS"
            animateOn="view"
            sequential
            speed={28}
            characters="NEUTRON0123456789·"
          />
        </p>
        <h1 className={`hero-title${play ? ' play' : ''}`} aria-label="NEUTRON">
          {'NEUTRON'.split('').map((ch, i) => (
            <span key={i} style={{ animationDelay: `${0.35 + i * 0.07}s` }}>
              {ch}
            </span>
          ))}
        </h1>
        <p className="hero-sub">
          One system. Twenty-two worlds in orbit — each one planned, designed,
          built, reviewed, and shipped by AI agents.
        </p>
        <div className="hero-actions">
          <Magnet padding={60} magnetStrength={9}>
            <StarBorder
              as="button"
              color="#9db8ff"
              speed="5s"
              className="hero-cta"
              onClick={scrollToWorlds}
            >
              DESCEND INTO ORBIT
            </StarBorder>
          </Magnet>
        </div>
      </div>

      <div className="hero-foot mono">
        <span>BEAM SWEEP · 0.088 HZ</span>
        <span className="hero-scrollcue">
          SCROLL
          <i />
        </span>
        <span>22 BODIES · 6 ORBITS</span>
      </div>
    </header>
  );
}
