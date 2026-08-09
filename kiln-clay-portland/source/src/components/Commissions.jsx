import { useState } from 'react';

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

export default function Commissions() {
  const [open, setOpen] = useState('sample');

  const mail = `mailto:hello@kilnandclaypdx.studio?subject=${encodeURIComponent(
    'Commission inquiry - [project name]'
  )}&body=${encodeURIComponent(
    'Hi Kiln & Clay,\n\nProject: (restaurant set / tableware / gift run / other)\nQuantity: \nForms: \nTimeline: \n\nTell us anything else that matters:\n'
  )}`;

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

      <div className="commission-cta reveal">
        <div className="test-note" aria-label="Sample test tile note">
          <span className="note-pin" aria-hidden="true" />
          <p className="mono">test tile note / cone 6</p>
          <h3>Moss over iron-rich stoneware</h3>
          <dl>
            <div><dt>Sample</dt><dd>8 oz cup, soft foot</dd></div>
            <div><dt>Glaze</dt><dd>Celadon edge, thin interior</dd></div>
            <div><dt>Approval</dt><dd>Photo set before full run</dd></div>
          </dl>
        </div>
        <div className="commission-start">
          <h3>Start with the idea - we'll bring the tiles.</h3>
          <p>
            The email template asks the four questions every run starts with.
            Answer what you can; we fill the gaps together.
          </p>
          <a className="button button-primary" href={mail}>Start a commission</a>
        </div>
      </div>
    </section>
  );
}
