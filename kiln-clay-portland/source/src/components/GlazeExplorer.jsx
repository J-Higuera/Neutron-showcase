import { GLAZES } from '../data/glazes.js';
import { PIECES } from '../data/pieces.js';

// The old decorative tile wall, reborn with a job: each tile is a real
// glaze family — select one to read its fired behavior and filter the
// ledger below to the pieces actually wearing it.
export default function GlazeExplorer({ selected, onSelect }) {
  const active = GLAZES.find((g) => g.id === selected) || null;

  return (
    <section className="glazes" id="glazes" aria-labelledby="glazes-title">
      <div className="section-heading reveal">
        <p className="eyebrow">The test wall</p>
        <h2 id="glazes-title">Glaze tests, not guesswork.</h2>
        <p>
          Four families earned a place on the wall. Pick a tile to read how it
          fires - and see every piece on the shelf wearing it.
        </p>
      </div>

      <div className="glaze-wall reveal" role="group" aria-label="Glaze families">
        {GLAZES.map((g) => {
          const count = PIECES.filter((p) => p.glaze === g.id).length;
          const isActive = selected === g.id;
          return (
            <button
              key={g.id}
              className="glaze-tile"
              style={{
                '--g0': g.gradient[0], '--g1': g.gradient[1], '--g2': g.gradient[2],
                '--tile-ink': g.ink,
              }}
              aria-pressed={isActive}
              onClick={() => onSelect(isActive ? null : g.id)}
            >
              <span className="stamp">{g.stamp}</span>
              <strong>{g.name}</strong>
              <small>{g.line}</small>
              <span className="mono tile-count">{count} pieces</span>
            </button>
          );
        })}
      </div>

      <div className="glaze-note" data-open={!!active} aria-live="polite">
        {active && (
          <div className="glaze-note-card">
            <span className="note-pin" aria-hidden="true" />
            <p className="mono">test tile {active.stamp} / {active.cone}</p>
            <h3>{active.name}</h3>
            <p>{active.behavior}</p>
            <dl>
              <div><dt>Surface</dt><dd>{active.surface}</dd></div>
              <div><dt>Firing</dt><dd>{active.cone}</dd></div>
              <div><dt>On the shelf</dt><dd>{PIECES.filter((p) => p.glaze === active.id).length} pieces below</dd></div>
            </dl>
            <a className="glaze-note-jump mono" href="#work">SEE THE PIECES ↓</a>
          </div>
        )}
      </div>
    </section>
  );
}
