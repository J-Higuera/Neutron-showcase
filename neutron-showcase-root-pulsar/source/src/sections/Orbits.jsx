import { useEffect, useMemo, useRef, useState } from 'react';
import roster from '../generated-showcase-roster.json';
import CircularGallery from '../components/reactbits/CircularGallery.jsx';
import TiltedCard from '../components/reactbits/TiltedCard.jsx';
import StarBorder from '../components/reactbits/StarBorder.jsx';
import Magnet from '../components/reactbits/Magnet.jsx';

const ORBIT_ORDER = [
  'Systems & tools',
  'Art & culture',
  'Game worlds',
  'Food & craft',
  'Commerce',
  'Workbench',
];

const shortName = entry => entry.name.split('|')[0].trim();
const subName = entry => (entry.name.split('|')[1] ?? '').trim();
const thumb = entry => `thumbs/${entry.folder}.jpg`;

function WorldRow({ entry, index, flip }) {
  return (
    <article className={`world-row${flip ? ' flip' : ''}`} data-reveal>
      <div className="world-media">
        <TiltedCard
          imageSrc={thumb(entry)}
          altText={entry.name}
          containerHeight="100%"
          containerWidth="100%"
          imageHeight="100%"
          imageWidth="100%"
          rotateAmplitude={9}
          scaleOnHover={1.06}
          showMobileWarning={false}
          showTooltip={false}
          displayOverlayContent
          overlayContent={
            <span className="world-chip mono">
              W.{String(index).padStart(2, '0')} · {entry.motif.toUpperCase()}
            </span>
          }
        />
      </div>
      <div className="world-info">
        <p className="world-index mono">W.{String(index).padStart(2, '0')}</p>
        <h4 className="world-name">{shortName(entry)}</h4>
        {subName(entry) && <p className="world-subname">{subName(entry)}</p>}
        <p className="world-premise">{entry.premise}</p>
        <p className="world-mood">{entry.mood}</p>
        <div className="world-tags mono">
          <span>{entry.shape.toUpperCase()}</span>
          <span>{entry.state.toUpperCase()}</span>
        </div>
        <Magnet padding={40} magnetStrength={12}>
          <StarBorder
            as="a"
            href={entry.href}
            target="_blank"
            rel="noreferrer"
            color="#9db8ff"
            speed="6s"
            className="world-cta"
          >
            ENTER WORLD ↗
          </StarBorder>
        </Magnet>
      </div>
    </article>
  );
}

export default function Orbits() {
  const entries = roster.entries;

  const ringItems = useMemo(
    () => entries.map(e => ({ image: thumb(e), text: shortName(e), link: e.href })),
    [entries]
  );

  // The ring is the heaviest thing on the page (WebGL init + 22 textures).
  // Mounting it only when the user approaches keeps first paint clean for
  // the hero; once mounted it stays.
  const ringRef = useRef(null);
  const [ringMounted, setRingMounted] = useState(false);
  useEffect(() => {
    const el = ringRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      observed => {
        if (observed[0].isIntersecting) {
          setRingMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const orbits = useMemo(() => {
    let counter = 0;
    return ORBIT_ORDER.map((category, i) => {
      const worlds = entries
        .filter(e => e.category === category)
        .map(e => ({ entry: e, index: (counter += 1) }));
      return { category, number: String(i + 1).padStart(2, '0'), worlds };
    }).filter(o => o.worlds.length > 0);
  }, [entries]);

  return (
    <section className="worlds" id="worlds">
      <p className="section-eyebrow mono">— THE COLLECTION</p>
      <h2 className="section-title" data-reveal>
        TWENTY-TWO WORLDS
      </h2>
      <p className="worlds-lead">
        Six orbits, twenty-two bodies. Every one is a complete, deployed site —
        follow any of them in.
      </p>

      <div className="ring" data-reveal ref={ringRef}>
        {ringMounted && (
          <CircularGallery
            items={ringItems}
            bend={3}
            textColor="#cfe0ff"
            borderRadius={0.06}
            font='500 24px "Space Grotesk"'
            scrollSpeed={1}
            scrollEase={0.035}
          />
        )}
        <p className="ring-hint mono">DRAG TO SPIN · CLICK A WORLD TO ENTER</p>
      </div>

      <div className="orbit-list">
        {orbits.map(orbit => (
          <div className="orbit" key={orbit.category}>
            <div className="orbit-head mono" data-reveal>
              <span className="orbit-no">ORBIT {orbit.number}</span>
              <span className="orbit-cat">{orbit.category.toUpperCase()}</span>
              <span className="orbit-count">
                {orbit.worlds.length} {orbit.worlds.length === 1 ? 'BODY' : 'BODIES'}
              </span>
            </div>
            {orbit.worlds.map(({ entry, index }, i) => (
              <WorldRow
                key={entry.slug}
                entry={entry}
                index={index}
                flip={i % 2 === 1}
              />
            ))}
          </div>
        ))}
      </div>

    </section>
  );
}
