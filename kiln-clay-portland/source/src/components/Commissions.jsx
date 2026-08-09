import { useState } from 'react';
import Vessel from './Vessel.jsx';
import { GLAZES, glazeById } from '../data/glazes.js';
import { FORMS } from '../data/pieces.js';

const STEPS = [
  {
    id: 'sample', num: '01', title: 'Form samples', window: 'week 1-2',
    body: 'Scale, rim, foot, and hand-feel are tested before production starts. You handle a sample - or we video the turn for remote clients.',
    ledger: 'sample thrown · scale approved',
  },
  {
    id: 'tests', num: '02', title: 'Glaze decisions', window: 'week 2-3',
    body: 'Surface language is documented with tiles, notes, and side-by-side fired tests on your clay body. Nothing goes to the full run unproven.',
    ledger: 'tiles fired · surface chosen',
  },
  {
    id: 'approval', num: '03', title: 'Approval photos', window: 'week 3-4',
    body: 'A photo set of the first finished piece lands in your inbox before the batch fires. You approve the real thing, not a rendering.',
    ledger: 'photos sent · run approved',
  },
  {
    id: 'delivery', num: '04', title: 'Firing & delivery', window: 'week 4-6',
    body: 'Drying, bisque, glaze, and the final slow cool are built into the delivery date. Pieces are checked, wrapped, and arranged for pickup or shipping.',
    ledger: 'cone 6 · cooled · delivered',
  },
];

// Studio price guides per form — a sketch is a conversation starter, so the
// bench is honest that these are ranges, not checkout prices.
const PRICE_GUIDE = {
  mug: [36, 52], bowl: [44, 110], vase: [88, 150],
  pitcher: [105, 135], planter: [58, 84], plate: [42, 64],
};

function SketchBench() {
  const [form, setForm] = useState('mug');
  const [glaze, setGlaze] = useState('rain-ash');
  const g = glazeById(glaze);
  const [lo, hi] = PRICE_GUIDE[form];
  const formLabel = form[0].toUpperCase() + form.slice(1);

  const mail = `mailto:hello@kilnandclaypdx.studio?subject=${encodeURIComponent(
    `Commission sketch - ${formLabel} in ${g.name}`
  )}&body=${encodeURIComponent(
    `Hi Kiln & Clay,\n\nI sketched this on the site:\n\nForm: ${formLabel}\nGlaze: ${g.name} (tile ${g.stamp}, ${g.cone})\nStudio guide: $${lo}-$${hi} per piece\n\nQuantity I'm thinking about: \nWhat it's for: \nTimeline: \n`
  )}`;

  return (
    <div className="sketch-bench reveal" aria-labelledby="bench-title">
      <div className="bench-controls">
        <p className="mono bench-label">THE SKETCH BENCH</p>
        <h3 id="bench-title">Sketch your piece. We'll throw it.</h3>
        <p className="bench-lede">
          Pick a form and a fired glaze from the wall - the same tiles, the
          same gradients - and send the sketch straight to the studio bench.
        </p>

        <p className="mono bench-group-label" id="bench-form-label">FORM</p>
        <div className="bench-forms" role="group" aria-labelledby="bench-form-label">
          {FORMS.map((f) => (
            <button key={f} className="bench-form-chip" aria-pressed={form === f}
              onClick={() => setForm(f)}>
              <Vessel form={f} glaze={glaze} className="vessel-mini" title={`${f} form`} />
              <span>{f}</span>
            </button>
          ))}
        </div>

        <p className="mono bench-group-label" id="bench-glaze-label">GLAZE</p>
        <div className="bench-glazes" role="group" aria-labelledby="bench-glaze-label">
          {GLAZES.map((gz) => (
            <button key={gz.id} className="bench-glaze-chip" aria-pressed={glaze === gz.id}
              style={{ '--g0': gz.gradient[0], '--g1': gz.gradient[1], '--g2': gz.gradient[2] }}
              onClick={() => setGlaze(gz.id)}>
              <span className="glaze-chip" aria-hidden="true" />
              {gz.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bench-stage" style={{ '--g1': g.gradient[1] }}>
        <p className="mono bench-sketch-stamp">SKETCH / {formLabel} · TILE {g.stamp}</p>
        <Vessel form={form} glaze={glaze} className="vessel-lg bench-vessel" title={`Sketch: ${formLabel} in ${g.name}`} />
        <p className="bench-reading" aria-live="polite">
          <strong>{formLabel} in {g.name}.</strong> {g.line} Studio guide
          {' '}<span className="bench-price">${lo}-${hi}</span> per piece.
        </p>
        <a className="button button-primary" href={mail}>Send this sketch to the bench</a>
        <p className="mono bench-honest">Opens a prefilled email - quantity and timeline stay yours to fill in.</p>
      </div>
    </div>
  );
}

export default function Commissions() {
  const [open, setOpen] = useState('sample');

  return (
    <section className="commissions" id="commissions" aria-labelledby="commissions-title">
      <div className="section-heading split-heading reveal">
        <div>
          <p className="eyebrow">Commissions / studio proof</p>
          <h2 id="commissions-title">Small production runs with the test tile still in the conversation.</h2>
        </div>
        <p>
          Restaurants, interiors, gifts, and tableware sets move through a
          visible studio path - four checkpoints, each one logged, each one
          yours to approve.
        </p>
      </div>

      <SketchBench />

      <ol className="commission-steps reveal">
        {STEPS.map((s) => {
          const isOpen = open === s.id;
          return (
            <li key={s.id} className="commission-step" data-open={isOpen}>
              <button className="step-head" aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : s.id)}>
                <span className="mono step-num">{s.num}</span>
                <strong>{s.title}</strong>
                <span className="mono step-window">{s.window}</span>
                <span className="step-arrow" aria-hidden="true" />
              </button>
              <div className="step-body">
                <p>{s.body}</p>
                <p className="mono step-ledger">{s.ledger}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
