import { useState, type FormEvent } from "react";
import { Reveal } from "../lib/fx";
import { studio } from "../data/fiction";

/* The intake form. On Netlify it submits for real (Netlify Forms picks up the
   mirror form declared in netlify.toml's build); everywhere else it validates
   and confirms locally — the mailto is the always-true escape hatch. */

type Status = { kind: "idle" | "error" | "ok"; text: string };

export function Start() {
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea"));
    let firstInvalid: (typeof fields)[number] | null = null;
    for (const f of fields) {
      const ok = f.checkValidity();
      f.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstInvalid) firstInvalid = f;
    }
    if (firstInvalid) {
      setStatus({
        kind: "error",
        text:
          firstInvalid.type === "email" && firstInvalid.value
            ? "That email doesn’t look right — mind checking it?"
            : "A few fields still need an answer — they’re marked above.",
      });
      firstInvalid.focus();
      return;
    }

    setSending(true);
    const data = new FormData(form);
    data.append("form-name", "project-brief");
    const onNetlify = window.location.hostname.includes("netlify");
    try {
      if (onNetlify) {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
        });
        if (!res.ok) throw new Error(String(res.status));
      }
      setSent(true);
      setStatus({
        kind: "ok",
        text: onNetlify
          ? "Brief received — for real, this one landed in the studio inbox. Expect a reply within two business days."
          : "Brief received. A founding partner reads every one — expect a reply within two business days.",
      });
    } catch {
      setStatus({ kind: "error", text: "Something interrupted the send — email us instead: hello@tripleplay.studio" });
    } finally {
      setSending(false);
    }
  }

  const inputCls =
    "w-full min-w-0 rounded-lg border border-edge-soft bg-ink px-3.5 py-2.5 text-sm text-bone placeholder-dim outline-none transition-colors focus:border-cobalt aria-[invalid=true]:border-[oklch(60%_0.19_25)]";
  const labelCls = "block text-xs font-medium text-mute";

  return (
    <section id="start" aria-labelledby="start-title" className="border-t border-edge-soft bg-gradient-to-b from-ink to-cobalt-deep/20 py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-[5fr_6fr]">
        <Reveal>
          <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-cobalt-hot">Start a project</p>
          <h2 id="start-title" className="font-serif text-[clamp(2.4rem,5vw,3.9rem)] leading-[1.05]">
            The October slot is real.<br />
            <em className="italic text-cobalt-hot">So is this form.</em>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mute">
            Tell us what you’re trying to make true. A founding partner reads every brief —
            expect a reply within two business days, usually with questions rather than a
            pitch. If we’re not the right studio, we’ll say so and try to point you at who is.
          </p>
          <p className="mt-4 text-sm text-mute">
            Prefer email?{" "}
            <a href={`mailto:${studio.email}`} className="font-medium text-cobalt-hot hover:underline">
              {studio.email}
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            name="project-brief"
            onSubmit={onSubmit}
            noValidate
            aria-label="Project inquiry"
            className="rounded-2xl border border-edge-soft bg-pit/80 p-6 shadow-2xl shadow-black/40 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>
                Your name
                <input name="name" type="text" autoComplete="name" required className={"mt-1.5 " + inputCls} />
              </label>
              <label className={labelCls}>
                Email
                <input name="email" type="email" autoComplete="email" required className={"mt-1.5 " + inputCls} />
              </label>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>
                Company or project
                <input name="company" type="text" autoComplete="organization" className={"mt-1.5 " + inputCls} />
              </label>
              <label className={labelCls}>
                Where are you today?
                <select name="stage" required defaultValue="" className={"mt-1.5 " + inputCls}>
                  <option value="" disabled>Choose one</option>
                  <option>An idea and a market I know</option>
                  <option>Funding and a deck</option>
                  <option>A prototype that needs to become real</option>
                  <option>A live product that needs a team</option>
                </select>
              </label>
            </div>
            <label className={labelCls + " mt-4"}>
              Budget you’re working with
              <select name="budget" required defaultValue="" className={"mt-1.5 " + inputCls}>
                <option value="" disabled>Choose a range</option>
                <option>$48k — discovery only</option>
                <option>$150k–$450k</option>
                <option>$450k+</option>
                <option>Honestly not sure yet</option>
              </select>
            </label>
            <label className={labelCls + " mt-4"}>
              What has to be true in six months for this to have been worth it?
              <textarea name="truth" rows={4} required className={"mt-1.5 resize-y " + inputCls} />
            </label>

            <button
              type="submit"
              disabled={sending || sent}
              className="mt-6 w-full rounded-lg bg-bone px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-cobalt-hot disabled:opacity-50"
            >
              {sent ? "Sent ✓" : sending ? "Sending…" : "Send the brief"}
            </button>
            <p
              role="status"
              aria-live="polite"
              tabIndex={-1}
              className={
                "mt-3 min-h-[1.4em] text-sm " +
                (status.kind === "ok" ? "font-medium text-leaf" : status.kind === "error" ? "text-[oklch(72%_0.16_25)]" : "text-mute")
              }
            >
              {status.text}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer aria-labelledby="footer-heading" className="border-t border-edge-soft bg-ink">
      <h2 id="footer-heading" className="sr-only">Studio information</h2>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
        <div>
          <p className="flex items-center gap-2.5 font-semibold">
            <svg viewBox="0 0 40 24" aria-hidden="true" className="h-5 w-9">
              <circle cx="8" cy="12" r="6" className="fill-bone" />
              <circle cx="23" cy="12" r="6" className="fill-cobalt" />
              <circle cx="34" cy="5" r="3.5" className="fill-bone/50" />
            </svg>
            Triple&nbsp;Play&nbsp;Studio
          </p>
          <p className="mt-4 text-sm leading-relaxed text-mute">
            {studio.address[0]}<br />{studio.address[1]}
          </p>
          <p className="mt-2 text-sm">
            <a href={`mailto:${studio.email}`} className="text-mute transition-colors hover:text-bone">{studio.email}</a>
          </p>
        </div>
        <nav aria-label="Work" className="text-sm">
          <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">Work</h3>
          {[["#case-harbor", "Harbor & Line"], ["#case-bramble", "Bramble"], ["#case-ledger", "Ledgerline"]].map(([h, l]) => (
            <a key={h} href={h} className="block py-1 text-mute transition-colors hover:text-bone">{l}</a>
          ))}
        </nav>
        <nav aria-label="Studio" className="text-sm">
          <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">Studio</h3>
          {[["#method", "How it works"], ["#configurator", "Your plan"], ["#team", "Team"], ["#beliefs", "Beliefs"], ["#faq", "FAQ"]].map(([h, l]) => (
            <a key={h} href={h} className="block py-1 text-mute transition-colors hover:text-bone">{l}</a>
          ))}
        </nav>
        <div className="text-sm">
          <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">Now</h3>
          <p className="leading-relaxed text-mute">Two builds in flight. Next discovery slot opens in October.</p>
          <p className="mt-4 text-xs leading-relaxed text-dim">
            Built with React, TypeScript &amp; Vite. Set in Instrument Serif &amp; Geist.
            No trackers, no cookies — we keep score of our work, not our visitors.
          </p>
        </div>
      </div>
      <div className="border-t border-edge-soft">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-5 text-xs text-dim sm:px-8">
          <span>© {new Date().getFullYear()} Triple Play Studio</span>
          <span>Strategy · Build · Launch — one motion</span>
        </div>
      </div>
    </footer>
  );
}
