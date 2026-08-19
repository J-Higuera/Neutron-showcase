import { useState } from 'react';

const initial = { name: '', email: '', chain: '' };

export default function Audition() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [drafted, setDrafted] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Tell us who is listening.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'A real email - it is how we schedule the session.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const body = [
      'Hi Aurel,',
      '',
      `I'd like to book an audition.`,
      '',
      `Name: ${form.name.trim()}`,
      form.chain.trim() ? `Current chain: ${form.chain.trim()}` : null,
      '',
      '- sent from the studio site',
    ].filter((l) => l !== null).join('\n');

    setDrafted(`mailto:studio@aurel.audio?subject=${encodeURIComponent('Audition request')}&body=${encodeURIComponent(body)}`);
  }

  return (
    <section className="audition" id="audition" aria-labelledby="audition-title">
      <div className="audition-layout">
        <div className="audition-intro">
          <div className="section-heading reveal">
            <p className="eyebrow">Audition</p>
            <h2 id="audition-title">Hear it before you keep it.</h2>
            <p>
              Auditions run in the studio's listening room or by shipped loaner,
              matched to your chain and the records you lean into. Every
              purchase starts with ears, not a spec sheet.
            </p>
          </div>
          <figure className="audition-photo reveal" style={{ '--d': '80ms' }}>
            <img
              src="./assets/analog-soundboard-knobs.jpg"
              alt="Channel strips and knobs of the studio's analog console"
              loading="lazy"
              decoding="async"
            />
            <figcaption>The chain your loaner is voiced against.</figcaption>
          </figure>
        </div>

        <form className="audition-form reveal" onSubmit={submit} noValidate>
          {!drafted ? (
            <>
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
                What will you listen through? <span className="optional">optional</span>
                <input type="text" value={form.chain} onChange={set('chain')}
                  placeholder="DAC, amplifier, source" />
              </label>
              <button className="button button-primary" type="submit">Request an audition</button>
              <p className="form-honest">Drafts an email - the studio replies personally within a day.</p>
            </>
          ) : (
            <div className="form-done" role="status">
              <h3>Your request is ready to send.</h3>
              <p>We prepared the email with your details - send it and the studio takes it from there.</p>
              <a className="button button-primary" href={drafted}>Open the email</a>
              <button className="link-btn" type="button"
                onClick={() => { setDrafted(null); setForm(initial); }}>
                start over
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
