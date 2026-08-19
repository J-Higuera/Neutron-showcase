import { useEffect, useMemo, useState } from 'react';
import { upcomingSessions, formatSession, makeIcs } from '../data/workshops.js';

const initialForm = { name: '', email: '', party: '1', note: '' };

// Below the two-column breakpoint the booking panel becomes a modal overlay
// (same pattern as the shelf's piece modal) — as a stacked block it landed
// above the session list, off-screen, and picking a session looked like a
// no-op on phones.
function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 1100px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1100px)');
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
}

export default function Workshops() {
  const sessions = useMemo(() => upcomingSessions(6), []);
  const narrow = useNarrow();
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);

  const overlayOpen = narrow && !!selected;

  useEffect(() => {
    if (!overlayOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [overlayOpen]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function close() {
    setSelected(null);
    setSent(null);
    setErrors({});
  }

  function validate() {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Tell us who to save the wheel for.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'A real email - it is how we confirm the seat.';
    const party = Number(form.party);
    if (!party || party < 1 || party > selected.seats) errs.party = `Between 1 and ${selected.seats} for this session.`;
    return errs;
  }

  function submit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const subject = `Booking request - ${selected.title}, ${formatSession(selected.date)}`;
    const body = [
      `Hi Kiln & Clay,`,
      ``,
      `I'd like to request ${form.party} seat(s):`,
      ``,
      `Session: ${selected.title} (${selected.tag})`,
      `When: ${formatSession(selected.date)}`,
      `Name: ${form.name.trim()}`,
      form.note.trim() ? `Note: ${form.note.trim()}` : null,
      ``,
      `- sent from the studio site`,
    ].filter((l) => l !== null).join('\n');

    const icsBlob = new Blob([makeIcs(selected)], { type: 'text/calendar' });
    setSent({
      mailto: `mailto:hello@kilnandclaypdx.studio?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      icsUrl: URL.createObjectURL(icsBlob),
      session: selected,
    });
  }

  function pick(session) {
    setSelected(session);
    setSent(null);
    setErrors({});
  }

  const panelContent = (
    <>
      {selected && !sent && (
        <form className="booking-form" onSubmit={submit} noValidate>
          <p className="mono">request a seat</p>
          <h3>{selected.title}</h3>
          <p className="booking-when mono">{formatSession(selected.date)} · ${selected.price} per person</p>

          <label>
            Name
            <input type="text" value={form.name} onChange={set('name')}
              aria-invalid={!!errors.name} autoComplete="name" />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={set('email')}
              aria-invalid={!!errors.email} autoComplete="email" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            Seats
            <input type="number" min="1" max={selected.seats} value={form.party}
              onChange={set('party')} aria-invalid={!!errors.party} />
            {errors.party && <span className="field-error">{errors.party}</span>}
          </label>
          <label>
            Anything we should know? <span className="mono optional">optional</span>
            <textarea rows="2" value={form.note} onChange={set('note')}
              placeholder="First time, left-handed wheel, birthday table..." />
          </label>
          <button className="button button-primary" type="submit">Request this seat</button>
          <p className="booking-honest mono">
            Sends a prefilled email - the studio confirms every seat personally.
          </p>
        </form>
      )}

      {sent && (
        <div className="booking-done">
          <p className="mono">request drafted ✓</p>
          <h3>Your seat request is ready to send.</h3>
          <p>
            We opened a prefilled email for <strong>{sent.session.title}</strong>,
            {' '}{formatSession(sent.session.date)}. Didn't open? Use the button
            below - and put the session on your calendar meanwhile.
          </p>
          <div className="booking-done-actions">
            <a className="button button-primary" href={sent.mailto}>Open the email</a>
            <a className="button button-secondary dark" href={sent.icsUrl}
              download={`kiln-and-clay-${sent.session.id}.ics`}>
              Add to calendar (.ics)
            </a>
          </div>
          <button className="link-btn mono" onClick={() => { setSent(null); setForm(initialForm); }}>
            request another session
          </button>
        </div>
      )}
    </>
  );

  return (
    <section className="workshops" id="workshops" aria-labelledby="workshops-title">
      <div className="section-heading reveal">
        <p className="eyebrow">Workshops &amp; memberships</p>
        <h2 id="workshops-title">For first-timers and people with clay under their nails.</h2>
        <p>
          Beginner-friendly, small class sizes, materials and firing included.
          Pick a session - we confirm every request by email within a day.
        </p>
      </div>

      <div className="workshops-layout" data-narrow={narrow}>
        <ol className="session-list reveal" aria-label="Upcoming sessions">
          {sessions.map((s) => (
            <li key={s.key}>
              <button
                className="session-row"
                aria-pressed={selected?.key === s.key}
                aria-haspopup={narrow ? 'dialog' : undefined}
                onClick={() => pick(s)}
              >
                <span className="mono session-date">{formatSession(s.date)}</span>
                <span className="session-main">
                  <strong>{s.title}</strong>
                  <span>{s.tag}</span>
                </span>
                <span className="session-side mono">
                  <span>${s.price}</span>
                  <span className="session-seats">{s.seats} seats</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        {!narrow && (
          <div className="booking-panel reveal" aria-live="polite">
            {!selected && (
              <div className="booking-empty">
                <p className="mono">kiln-side notice</p>
                <h3>Pick a session to request a seat.</h3>
                <p>
                  Every workshop includes clay, tools, glazing, and firing. Your
                  pieces are ready for pickup two to four weeks after class -
                  boxed, once the kiln cools.
                </p>
              </div>
            )}
            {panelContent}
          </div>
        )}
      </div>

      {overlayOpen && (
        <div className="modal-backdrop booking-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="booking-panel booking-modal" role="dialog" aria-modal="true"
            aria-label={`Request a seat - ${selected.title}`}>
            <button className="modal-close" onClick={close} aria-label="Close booking">×</button>
            {panelContent}
          </div>
        </div>
      )}
    </section>
  );
}
