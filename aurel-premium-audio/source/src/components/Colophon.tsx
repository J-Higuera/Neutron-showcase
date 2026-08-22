import { ALL_EXHIBITS } from "../data/collection";
import { useReveal } from "../lib/useReveal";

// The back room: what this place actually is, and the registry that keeps
// the museum honest — every work, every maker, every license, linked.

export function Colophon() {
  const reveal = useReveal<HTMLDivElement>();
  const revealTable = useReveal<HTMLDivElement>();

  return (
    <section className="colophon" id="colophon">
      <div className="colophon-inner">
        <div className="colophon-note reveal" ref={reveal}>
          <p className="kicker">Colophon</p>
          <h2 className="intro-title">A real museum for objects that aren't.</h2>
          <p className="intro-note">
            Aurel is a demonstration piece — the institution is fictional; the
            craft is not. The rooms hang stills printed from the collection's own
            files; press Inspect and the work itself renders live on your device —
            the amber refracts, the iridescence interferes, the founding piece
            comes apart. The plaques measure the actual files, and the registry
            below credits every maker under their real name and license.
          </p>
          <p className="intro-note">
            Built with React 19, React Three Fiber, and three.js — every gallery
            renders in its own compact WebGL stage, awake only while you can see
            it. ACES tone mapping, image-based lighting from CC0 environments by
            Poly Haven, Draco-compressed geometry. Type set in Work Sans and IBM
            Plex Mono.
          </p>
        </div>

        <div className="registry reveal" ref={revealTable}>
          <p className="registry-title">Registry of works</p>
          <div className="registry-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Work</th>
                <th scope="col">Maker</th>
                <th scope="col">License</th>
              </tr>
            </thead>
            <tbody>
              {ALL_EXHIBITS.map((e) => (
                <tr key={e.id}>
                  <td className="mono">AU·{e.num}</td>
                  <td>{e.title}</td>
                  <td>{e.maker}</td>
                  <td>
                    {e.licenseUrl ? (
                      <a href={e.licenseUrl} target="_blank" rel="noreferrer">
                        {e.license}
                      </a>
                    ) : (
                      e.license
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <p className="registry-fine">
            Lighting environments: studio_small_03, st_fagans_interior,
            dikhololo_night — Poly Haven, CC0. Model optimization: glTF Transform.
            Room and entrance stills are printed from the same files Inspect
            renders live.
          </p>
        </div>
      </div>

      <footer className="site-footer">
        <span className="brand-mark">AUREL</span>
        <p>Museum of Dimensional Craft · a demonstration build · MMXXVI</p>
        <a href="#top">Back to the entrance ↑</a>
      </footer>
    </section>
  );
}
