import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  ["#work", "Work"],
  ["#method", "How it works"],
  ["#configurator", "Your plan"],
  ["#team", "Team"],
  ["#faq", "FAQ"],
] as const;

type Action = { label: string; hint: string; run: () => void };

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        data-header
        data-scrolled={scrolled || undefined}
        className={
          "fixed inset-x-0 top-0 z-40 backdrop-blur-md transition-colors " +
          (scrolled ? "bg-ink/85 border-b border-edge-soft" : "bg-ink/40 border-b border-transparent")
        }
      >
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" aria-label="Triple Play Studio — home" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <svg viewBox="0 0 40 24" aria-hidden="true" className="h-5 w-9">
              <circle cx="8" cy="12" r="6" className="fill-bone" />
              <circle cx="23" cy="12" r="6" className="fill-cobalt" />
              <circle cx="34" cy="5" r="3.5" className="fill-bone/50" />
            </svg>
            Triple&nbsp;Play
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map(([href, label]) => (
              <a key={href} href={href} className="text-sm font-medium text-mute transition-colors hover:text-bone">
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 rounded-md border border-edge-soft px-2.5 py-1.5 text-xs text-mute transition-colors hover:border-edge hover:text-bone"
              aria-label="Open command palette"
            >
              <span aria-hidden="true" className="font-mono">⌘K</span>
            </button>
            <a
              href="#start"
              className="rounded-full border border-bone/70 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-bone hover:text-ink"
            >
              Start a project
            </a>
          </div>

          <button
            type="button"
            className="md:hidden rounded-md p-2 text-bone"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="site-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="md:hidden border-b border-edge-soft bg-pit/95 backdrop-blur-md"
            >
              <div className="flex flex-col px-5 py-3">
                {LINKS.map(([href, label]) => (
                  <a key={href} href={href} onClick={() => setMenuOpen(false)} className="py-3 text-base text-bone/90">
                    {label}
                  </a>
                ))}
                <a href="#start" onClick={() => setMenuOpen(false)} className="py-3 text-base font-medium text-cobalt-hot">
                  Start a project
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const actions: Action[] = [
    { label: "See the work", hint: "Section", run: () => go("#work") },
    { label: "Harbor & Line — Quayside", hint: "Case study", run: () => go("#case-harbor") },
    { label: "Bramble", hint: "Case study", run: () => go("#case-bramble") },
    { label: "Ledgerline", hint: "Case study", run: () => go("#case-ledger") },
    { label: "How it works — pricing", hint: "Section", run: () => go("#method") },
    { label: "Shape your engagement", hint: "Interactive", run: () => go("#configurator") },
    { label: "Meet the team", hint: "Section", run: () => go("#team") },
    { label: "What we believe", hint: "Section", run: () => go("#beliefs") },
    { label: "Founder FAQ", hint: "Section", run: () => go("#faq") },
    { label: "Start a project", hint: "Form", run: () => go("#start") },
    { label: "Email the studio", hint: "hello@tripleplay.studio", run: () => { window.location.href = "mailto:hello@tripleplay.studio"; } },
  ];

  const q = query.trim().toLowerCase();
  const filtered = q ? actions.filter((a) => (a.label + " " + a.hint).toLowerCase().includes(q)) : actions;

  function go(hash: string) {
    onClose();
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); filtered[Math.min(cursor, filtered.length - 1)]?.run(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, cursor, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/70 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-lg overflow-hidden rounded-xl border border-edge bg-pit shadow-2xl shadow-black/50"
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-edge-soft px-4">
              <span aria-hidden="true" className="font-mono text-xs text-dim">›</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
                placeholder="Where to?"
                className="w-full bg-transparent py-3.5 text-sm text-bone placeholder-dim outline-none"
                aria-label="Search sections and actions"
              />
              <kbd className="rounded border border-edge-soft px-1.5 py-0.5 font-mono text-[10px] text-dim">esc</kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto py-2" role="listbox" aria-label="Actions">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm text-dim">Nothing matches — try “work” or “pricing”.</li>
              )}
              {filtered.map((a, i) => (
                <li key={a.label} role="option" aria-selected={i === cursor}>
                  <button
                    type="button"
                    onClick={a.run}
                    onPointerEnter={() => setCursor(i)}
                    className={
                      "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors " +
                      (i === cursor ? "bg-cobalt-deep/30 text-bone" : "text-mute")
                    }
                  >
                    <span>{a.label}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-dim">{a.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
