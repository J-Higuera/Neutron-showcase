import { useRef, useState } from 'react';
import { CHAPTERS } from '../data/journey.js';

// The process as a user-driven chapter strip: native horizontal snap
// scrolling with visible controls. Nothing captures the wheel — vertical
// scrolling always passes straight by; stepping through the chapters is an
// invitation (swipe, drag, arrows, keyboard), never a relay. Reduced-motion
// and no-JS behave identically because this IS the browser's own scrolling.
export default function Journey() {
  const stripRef = useRef(null);
  const [index, setIndex] = useState(0);

  function cardStep() {
    const strip = stripRef.current;
    const card = strip?.querySelector('.journey-step');
    if (!strip || !card) return 1;
    const gap = parseFloat(getComputedStyle(strip).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function onScroll() {
    const strip = stripRef.current;
    // The strip clamps at max scroll with the last cards sharing the view,
    // so raw scrollLeft/step can never reach the final index — treat
    // "scrolled to the end" as the last chapter explicitly.
    const max = strip.scrollWidth - strip.clientWidth;
    const i = strip.scrollLeft >= max - 4
      ? CHAPTERS.length - 1
      : Math.min(CHAPTERS.length - 1, Math.max(0, Math.round(strip.scrollLeft / cardStep())));
    setIndex((prev) => (prev === i ? prev : i));
  }

  function go(delta) {
    stripRef.current?.scrollBy({ left: delta * cardStep(), behavior: 'smooth' });
  }

  return (
    <section className="journey" id="journey" aria-labelledby="journey-title">
      <div className="section-heading reveal">
        <p className="eyebrow">The process</p>
        <h2 id="journey-title">Follow the clay from rain to table.</h2>
        <p>
          From first pinch pot to dinnerware you use every week. Small classes,
          real firing, finished pieces you can pick up after the kiln cools.
        </p>
      </div>

      <div
        className="journey-strip reveal"
        ref={stripRef}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="The process in four chapters - swipe, drag, or use the arrow buttons"
      >
        {CHAPTERS.map((ch, i) => (
          <article className="journey-step" key={ch.id} aria-label={`Chapter ${i + 1} of ${CHAPTERS.length}: ${ch.title}`}>
            <img src={ch.photo} alt={ch.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
            <div className="journey-scrim" aria-hidden="true" />
            <div className="journey-copy">
              <p className="mono journey-num">{ch.num} / 04</p>
              <h3>{ch.title}</h3>
              <p>{ch.copy}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="journey-rail" aria-hidden="true">
        <span style={{ transform: `scaleX(${(index + 1) / CHAPTERS.length})` }} />
      </div>

      <div className="journey-controls">
        <button className="journey-arrow" aria-label="Previous chapter"
          onClick={() => go(-1)} disabled={index === 0}>←</button>
        <span className="mono journey-counter" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}
        </span>
        <button className="journey-arrow" aria-label="Next chapter"
          onClick={() => go(1)} disabled={index === CHAPTERS.length - 1}>→</button>
      </div>
    </section>
  );
}
