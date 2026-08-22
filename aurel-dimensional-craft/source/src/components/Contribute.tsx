import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { loanExhibit } from "../data/collection";
import { useMuseum } from "../lib/store";
import { formatInt, formatMegapixels } from "../lib/format";
import { useReveal } from "../lib/useReveal";

// The loan desk — the museum's platform claim, kept honest on a static
// host. A dropped GLB is read entirely on the visitor's device (by the
// lazily-imported registrar), hung in the same rig as the permanent
// collection, and measured for its plaque. Nothing is uploaded anywhere;
// there is nowhere to upload to.

const PlinthView = lazy(() => import("../gl/PlinthView"));
const LoanView = lazy(() => import("../gl/LoanView"));

export function Contribute({ hasWebGL }: { hasWebGL: boolean }) {
  const { reduced, loan, setLoan, openInspect } = useMuseum();
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inspectRef = useRef<HTMLButtonElement>(null);
  const chooseRef = useRef<HTMLButtonElement>(null);
  const hallRef = useRef<HTMLDivElement>(null);
  const hadLoan = useRef(false);
  const reveal = useReveal<HTMLDivElement>();
  const revealPane = useReveal<HTMLDivElement>();

  // The branch swap unmounts whatever held focus: hand it somewhere real.
  // Hanging a work focuses the new hall (and announces it); returning the
  // loan focuses the choose-file button so a keyboard visitor isn't dropped
  // to <body>.
  useEffect(() => {
    if (loan) {
      hallRef.current?.focus();
      hadLoan.current = true;
    } else if (hadLoan.current) {
      chooseRef.current?.focus();
    }
  }, [loan]);

  async function processFile(file: File | undefined | null) {
    if (!file) return;
    // The drop lane must honor the same gate as the button: without WebGL a
    // parsed loan would hang in a hall that can never render it.
    if (!hasWebGL) {
      setError(
        "The loan desk needs WebGL to hang a work, and this browser has it switched off."
      );
      return;
    }
    if (!/\.(glb|gltf)$/i.test(file.name)) {
      setError(
        "The registrar reads .glb and .gltf. This file wears a different extension."
      );
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const { parseModel } = await import("../gl/registrar");
      const { object, stats } = await parseModel(file);
      if (stats.meshes === 0) {
        setError(
          "The file opened, but the registrar found no meshes to hang — an empty crate."
        );
        return;
      }
      setLoan({ fileName: file.name, bytes: file.size, object, stats });
    } catch {
      setError(
        "The registrar could not read this work. Self-contained .glb files hang best — a .gltf that points at sidecar files arrives without them."
      );
    } finally {
      setBusy(false);
    }
  }

  // Stable identity per loan: a fresh object each render would re-fire the
  // stage's fit effect on every museum-context update.
  const loanEx = useMemo(() => (loan ? loanExhibit(loan.fileName) : null), [loan]);

  return (
    <section className="contribute" id="lend">
      <div className="contribute-inner">
        <div className="contribute-copy reveal" ref={reveal}>
          <p className="kicker">Loans · open call</p>
          <h2 className="intro-title">Hang your own work.</h2>
          <p className="intro-note">
            The museum accepts loans, sight unseen. Drop a GLB into the frame and it
            receives the house treatment — hung, lit, measured, and plaqued in
            seconds, with the same rig the permanent collection hangs in.
          </p>
          <ol className="lend-steps">
            <li>
              <span>01</span> The registrar reads the file — entirely on your device.
            </li>
            <li>
              <span>02</span> The work is hung and lit in a room of its own.
            </li>
            <li>
              <span>03</span> A plaque is drawn from what is actually inside.
            </li>
          </ol>
          <p className="lend-assurance">
            Nothing uploads — there is nowhere to upload to. Reload, and the loan
            returns home.
          </p>
        </div>

        <div className="lend-pane-wrap reveal" ref={revealPane}>
          {!loan ? (
            <div
              className={`lend-pane${dragOver ? " drag" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                void processFile(e.dataTransfer.files?.[0]);
              }}
            >
              {hasWebGL ? (
                <Suspense fallback={null}>
                  <PlinthView reduced={reduced} />
                </Suspense>
              ) : (
                <div className="no-gl-card">
                  <p>The loan desk needs WebGL to hang a work.</p>
                </div>
              )}
              <div className="lend-invite">
                <p className="lend-invite-title" role="status">
                  {busy ? "The registrar is reading…" : "Drop a work here"}
                </p>
                <p className="lend-invite-sub">.glb preferred · .gltf if self-contained</p>
                <button
                  type="button"
                  ref={chooseRef}
                  className="btn btn-ghost"
                  disabled={busy || !hasWebGL}
                  onClick={() => inputRef.current?.click()}
                >
                  Choose a file
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                  className="visually-hidden"
                  onChange={(e) => {
                    void processFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                {error && (
                  <p className="lend-error" role="alert">
                    {error}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div
              className="lend-hall"
              ref={hallRef}
              tabIndex={-1}
              role="region"
              aria-label={`Loan hung: ${loanEx!.title} — measured and on view`}
              style={{ "--hue": 226 } as React.CSSProperties}
            >
              <div className="hall-stage lend-stage">
                <div className="hall-num" aria-hidden="true">
                  L·01
                </div>
                <Suspense fallback={null}>
                  <LoanView exhibit={loanEx!} reduced={reduced} object={loan.object} />
                </Suspense>
                <button
                  type="button"
                  ref={inspectRef}
                  className="inspect-chip"
                  onClick={() => openInspect(loanEx!, inspectRef.current, loan.object)}
                >
                  Inspect
                </button>
              </div>
              <div className="lend-plaque plaque">
                <p className="plaque-num">LOAN · L·01</p>
                <h3 className="plaque-title">{loanEx!.title}</h3>
                <p className="plaque-maker">
                  Private lender · {(loan.bytes / 1_000_000).toFixed(1)} MB
                </p>
                <dl className="plaque-data" aria-label="Measured from your file">
                  <div>
                    <dt>Triangles</dt>
                    <dd>{formatInt(loan.stats.triangles)}</dd>
                  </div>
                  <div>
                    <dt>Vertices</dt>
                    <dd>{formatInt(loan.stats.vertices)}</dd>
                  </div>
                  <div>
                    <dt>Materials</dt>
                    <dd>{loan.stats.materials}</dd>
                  </div>
                  <div>
                    <dt>Textures</dt>
                    <dd>
                      {loan.stats.textures} · {formatMegapixels(loan.stats.texturePixels)}
                    </dd>
                  </div>
                </dl>
                <p className="plaque-license">Remains yours · never uploaded</p>
                <button type="button" className="btn btn-ghost" onClick={() => setLoan(null)}>
                  Return the loan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
