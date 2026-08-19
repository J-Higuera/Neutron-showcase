import { useEffect, useRef, useState } from 'react';
import { FINISHES, REFERENCE } from '../data/products.js';
import { createViewer } from '../three/viewer.js';

// The storefront's centerpiece: the Reference in real 3D. Hold and drag to
// turn it a full 360°; pick a finish and the model re-materials live.
export default function Hero({ onAdd }) {
  const canvasRef = useRef(null);
  const viewerRef = useRef(null);
  const [finish, setFinish] = useState(FINISHES[0]);
  const [hintGone, setHintGone] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    try {
      const probe = document.createElement('canvas');
      if (!probe.getContext('webgl2') && !probe.getContext('webgl')) {
        setWebgl(false);
        return undefined;
      }
    } catch {
      setWebgl(false);
      return undefined;
    }
    const viewer = createViewer(canvasRef.current, {
      onFirstDrag: () => setHintGone(true),
    });
    viewer.setFinish(FINISHES[0].colors, true);
    viewerRef.current = viewer;
    return () => viewer.dispose();
  }, []);

  function pickFinish(f) {
    setFinish(f);
    viewerRef.current?.setFinish(f.colors);
  }

  return (
    <section className="hero" id="reference" aria-labelledby="hero-title">
      <div className="hero-intro">
        <p className="eyebrow reveal">Reference headphones · assembled in small runs</p>
        <h1 id="hero-title" className="reveal" style={{ '--d': '60ms' }}>Aurel Reference</h1>
        <p className="hero-lede reveal" style={{ '--d': '120ms' }}>
          Built for the space between signal and silence - a planar magnetic
          monitor for people who care about texture, headroom, and the
          physical feel of sound.
        </p>
      </div>

      <div className="stage-wrap reveal" style={{ '--d': '180ms', '--stage': `#${finish.colors.stage.toString(16)}` }}>
        {webgl ? (
          <>
            <canvas
              ref={canvasRef}
              className="product-canvas"
              tabIndex={0}
              aria-label="3D view of the Aurel Reference. Drag, or press the left and right arrow keys, to rotate it."
            />
            <p className="drag-hint mono" data-gone={hintGone} aria-hidden="true">
              HOLD + DRAG · 360°
            </p>
          </>
        ) : (
          <img
            className="stage-fallback"
            src="./assets/headphones-leather-closeup.jpg"
            alt="The Aurel Reference headphone, lambskin pads in close-up"
          />
        )}
      </div>

      <div className="buy-row reveal" style={{ '--d': '240ms' }}>
        <div className="finish-picker" role="group" aria-label="Finish">
          {FINISHES.map((f) => (
            <button
              key={f.id}
              className="finish-swatch"
              style={{
                '--c0': `#${f.colors.shell.toString(16).padStart(6, '0')}`,
                '--c1': `#${f.colors.accent.toString(16).padStart(6, '0')}`,
              }}
              aria-pressed={finish.id === f.id}
              onClick={() => pickFinish(f)}
            >
              <span className="swatch-dot" aria-hidden="true" />
              {f.name}
            </button>
          ))}
        </div>
        <p className="finish-blurb" aria-live="polite">{finish.blurb}</p>
        <div className="buy-actions">
          <span className="price">${REFERENCE.price.toLocaleString('en-US')}</span>
          <button
            className="button button-primary"
            onClick={() => onAdd({
              key: `${REFERENCE.id}:${finish.id}`,
              name: REFERENCE.name,
              detail: `${finish.name} finish`,
              price: REFERENCE.price,
            })}
          >
            Add to cart
          </button>
          <a className="button button-ghost" href="#audition">Book an audition</a>
        </div>
        <p className="avail mono">Run № 7 · ships within 5 days · 14-day home audition</p>
      </div>

      <ul className="spec-chips reveal" style={{ '--d': '300ms' }} aria-label="Key specifications">
        <li>Planar magnetic</li>
        <li>Open-back</li>
        <li>385 g</li>
        <li>4.4 mm balanced</li>
      </ul>
    </section>
  );
}
