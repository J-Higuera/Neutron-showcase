import { useEffect, useState } from "react";

// Wayfinding rail — a museum map reduced to four rooms. The collection
// itself pages horizontally inside its wing, so the rail marks wings,
// not works. Scroll-spy lights the room you are standing in.

interface Room {
  href: string;
  label: string;
  title: string;
}

const ROOMS: Room[] = [
  { href: "#top", label: "ENT", title: "Entrance hall" },
  { href: "#collection", label: "COLL", title: "The permanent collection" },
  { href: "#lend", label: "LOAN", title: "Lend a work" },
  { href: "#colophon", label: "INFO", title: "Colophon" },
];

export function Rail() {
  const [active, setActive] = useState("#top");

  useEffect(() => {
    const sections = ROOMS.map((r) =>
      document.querySelector<HTMLElement>(r.href === "#top" ? "#top" : r.href)
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-42% 0px -42% 0px" }
    );
    for (const s of sections) if (s) io.observe(s);
    return () => io.disconnect();
  }, []);

  return (
    <nav className="rail" aria-label="Galleries">
      {ROOMS.map((r) => (
        <a
          key={r.href + r.label}
          href={r.href}
          title={r.title}
          className={active === r.href ? "active" : undefined}
        >
          <span className="rail-dot" aria-hidden="true" />
          <span className="rail-num">{r.label}</span>
        </a>
      ))}
    </nav>
  );
}
