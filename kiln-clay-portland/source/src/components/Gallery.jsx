import { useEffect, useRef, useState } from 'react';
import { PIECES, FORMS, STATUS_LABEL } from '../data/pieces.js';
import { GLAZES, glazeById } from '../data/glazes.js';
import Vessel from './Vessel.jsx';

function PieceModal({ piece, onClose }) {
  const closeRef = useRef(null);
  const glaze = glazeById(piece.glaze);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const mail = `mailto:hello@kilnandclaypdx.studio?subject=${encodeURIComponent(
    `Inquiry - ${piece.name} (${glaze.name})`
  )}&body=${encodeURIComponent(
    `Hi Kiln & Clay,\n\nI'm interested in "${piece.name}" - ${piece.form}, ${glaze.name}, listed at $${piece.price}.\n\n`
  )}`;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="piece-modal" role="dialog" aria-modal="true" aria-labelledby="piece-title">
        <button className="modal-close" ref={closeRef} onClick={onClose} aria-label="Close piece details">×</button>
        <div className="piece-stage" style={{ '--g1': glaze.gradient[1] }}>
          <Vessel form={piece.form} glaze={piece.glaze} className="vessel-lg" title={piece.name} />
          <span className={`status-chip status-${piece.status}`}>{STATUS_LABEL[piece.status]}</span>
        </div>
        <div className="piece-info">
          <p className="mono">ledger / {piece.form} · {glaze.stamp}</p>
          <h3 id="piece-title">{piece.name}</h3>
          <p className="piece-note">{piece.note}</p>
          <dl>
            <div><dt>Glaze</dt><dd>
              <span className="glaze-chip" style={{ '--g0': glaze.gradient[0], '--g1': glaze.gradient[1], '--g2': glaze.gradient[2] }} aria-hidden="true" />
              {glaze.name}
            </dd></div>
            <div><dt>Size</dt><dd>{piece.dims}</dd></div>
            <div><dt>Detail</dt><dd>{piece.foot}</dd></div>
            <div><dt>Price</dt><dd>${piece.price}</dd></div>
          </dl>
          {piece.status === 'available' ? (
            <a className="button button-primary" href={mail}>Inquire about this piece</a>
          ) : piece.status === 'kiln' ? (
            <a className="button button-secondary dark" href={mail}>Ask about the firing timeline</a>
          ) : (
            <p className="mono sold-line">SOLD · commissions welcome for similar work</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Gallery({ glazeFilter, onClearGlaze }) {
  const [formFilter, setFormFilter] = useState(null);
  const [openPiece, setOpenPiece] = useState(null);

  const shown = PIECES.filter(
    (p) => (!glazeFilter || p.glaze === glazeFilter) && (!formFilter || p.form === formFilter)
  );
  const activeGlaze = glazeFilter ? glazeById(glazeFilter) : null;

  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <div className="section-heading reveal">
        <p className="eyebrow">Small-batch shop</p>
        <h2 id="work-title">The shelf, as it stands today.</h2>
        <p>
          Wheel-thrown forms, handbuilt objects, cone-fired surfaces. Every
          piece is one of a small batch - when it leaves the shelf, it's gone.
        </p>
      </div>

      <div className="work-filters reveal" aria-label="Filter the shelf">
        <div className="filter-row" role="group" aria-label="Filter by form">
          <button className="filter-chip" aria-pressed={!formFilter} onClick={() => setFormFilter(null)}>
            All forms
          </button>
          {FORMS.map((f) => (
            <button key={f} className="filter-chip" aria-pressed={formFilter === f}
              onClick={() => setFormFilter(formFilter === f ? null : f)}>
              {f}s
            </button>
          ))}
        </div>
        {activeGlaze && (
          <button className="filter-chip glaze-filter-chip" onClick={onClearGlaze}>
            <span className="glaze-chip" style={{ '--g0': activeGlaze.gradient[0], '--g1': activeGlaze.gradient[1], '--g2': activeGlaze.gradient[2] }} aria-hidden="true" />
            {activeGlaze.name} × clear
          </button>
        )}
        <p className="mono filter-count" aria-live="polite">{shown.length} / {PIECES.length} pieces</p>
      </div>

      <div className="work-grid">
        {shown.map((p) => {
          const g = glazeById(p.glaze);
          return (
            <button key={p.id} className="piece-card reveal" onClick={() => setOpenPiece(p)}
              aria-haspopup="dialog">
              <span className={`status-chip status-${p.status}`}>{STATUS_LABEL[p.status]}</span>
              <Vessel form={p.form} glaze={p.glaze} title={`${p.name} - ${p.form} in ${g.name}`} />
              <span className="piece-meta">
                <strong>{p.name}</strong>
                <span className="mono">{p.form} · {g.name}</span>
                <span className="piece-price">${p.price}</span>
              </span>
            </button>
          );
        })}
        {shown.length === 0 && (
          <p className="empty-shelf mono">
            Nothing on the shelf wears that combination right now - the kiln
            may fix that. <a href="#commissions">Commission it instead.</a>
          </p>
        )}
      </div>

      {openPiece && <PieceModal piece={openPiece} onClose={() => setOpenPiece(null)} />}
    </section>
  );
}
