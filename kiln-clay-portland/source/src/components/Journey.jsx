import { useEffect, useRef } from 'react';
import { CHAPTERS } from '../data/journey.js';

// The scroll spine: on desktop the stage pins while the four chapters
// crossfade under one continuous kiln rail. On mobile and reduced-motion
// the same chapters stack as full-width photo cards — no pin, native feel.
export default function Journey() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return undefined;
    const gsap = window.gsap;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const root = rootRef.current;
      const stage = root.querySelector('.journey-stage');
      const steps = gsap.utils.toArray('.journey-step', root);
      const rail = root.querySelector('.journey-rail span');

      // Switch the stage from stacked cards to the pinned crossfade layout
      // only while this pin actually exists (reduced-motion and mobile keep
      // the stacked default).
      document.documentElement.classList.add('journey-pin');

      gsap.set(steps, { autoAlpha: 0 });
      gsap.set(steps[0], { autoAlpha: 1 });

      // 400px of scroll per chapter: enough to read, short enough that the
      // pin never feels like a toll booth on the way to the shop — and the
      // stage carries an explicit skip link besides.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'center center',
          end: () => '+=' + steps.length * 400,
          scrub: 0.3,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      steps.forEach((step, i) => {
        if (i === 0) return;
        const at = i;
        const prevCopy = steps[i - 1].querySelector('.journey-copy');
        const nextCopy = step.querySelector('.journey-copy');
        // Photos crossfade; copy hands off cleanly — out early, in late —
        // so two chapter titles never ghost over each other mid-scrub.
        tl.to(prevCopy, { autoAlpha: 0, y: -12, duration: 0.1 }, at - 0.35);
        tl.to(steps[i - 1], { autoAlpha: 0, duration: 0.28 }, at - 0.28);
        tl.fromTo(step, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.28 }, at - 0.28);
        tl.fromTo(nextCopy, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.14 }, at - 0.14);
      });
      // Hold on the last chapter for a beat so it registers before unpin.
      tl.to({}, { duration: 0.4 });
      if (rail) tl.fromTo(rail, { scaleX: 0 }, { scaleX: 1, duration: tl.duration() }, 0);

      return () => {
        document.documentElement.classList.remove('journey-pin');
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="journey" id="journey" aria-labelledby="journey-title" ref={rootRef}>
      <div className="section-heading reveal">
        <p className="eyebrow">The process</p>
        <h2 id="journey-title">Follow the clay from rain to table.</h2>
        <p>
          From first pinch pot to dinnerware you use every week. Small classes,
          real firing, finished pieces you can pick up after the kiln cools.
        </p>
      </div>

      <div className="journey-stage">
        {CHAPTERS.map((ch, i) => (
          <article className="journey-step" key={ch.id} data-step={i}>
            <img src={ch.photo} alt={ch.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
            <div className="journey-scrim" aria-hidden="true" />
            <div className="journey-copy">
              <p className="mono journey-num">{ch.num} / 04</p>
              <h3>{ch.title}</h3>
              <p>{ch.copy}</p>
              <p className="mono journey-ledger">{ch.ledger}</p>
            </div>
          </article>
        ))}
        <div className="journey-rail" aria-hidden="true"><span /></div>
        <a className="journey-skip mono" href="#work">SKIP TO THE SHELF ↓</a>
      </div>
    </section>
  );
}
