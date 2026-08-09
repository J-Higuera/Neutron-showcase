const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// The `js` class is set by an inline script in <head> so the reveal system's
// hidden state is never applied to a page whose script did not run.

const revealItems = [...document.querySelectorAll(".reveal")];

if (!reduceMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      if (entry.target.classList.contains("vortex-shell")) {
        entry.target.querySelector(".vortex-stage")?.classList.add("is-visible");
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.22, rootMargin: "0px 0px -8% 0px" });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  document.querySelector(".vortex-stage")?.classList.add("is-visible");
}

const vortex = document.querySelector(".vortex-stage");

if (vortex && !reduceMotion.matches) {
  const stacked = window.matchMedia("(max-width: 46rem)");
  let rect = null;
  let frame = 0;
  let pointer = null;

  const dropRect = () => { rect = null; };
  window.addEventListener("resize", dropRect, { passive: true });
  window.addEventListener("scroll", dropRect, { passive: true });

  const tilt = () => {
    frame = 0;
    if (!pointer) return;
    vortex.animate(
      { transform: `perspective(900px) rotateX(${pointer.y * -3}deg) rotateY(${pointer.x * 3}deg)` },
      { duration: 260, fill: "forwards", easing: "cubic-bezier(.16,1,.3,1)" }
    );
    pointer = null;
  };

  vortex.addEventListener("pointermove", (event) => {
    if (stacked.matches) return;
    // One layout read per enter/scroll/resize instead of one per pointer event.
    if (!rect) rect = vortex.getBoundingClientRect();
    pointer = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5
    };
    // Coalesce to one animation per frame; a fast mouse fires far more often.
    if (!frame) frame = requestAnimationFrame(tilt);
  });

  vortex.addEventListener("pointerleave", () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    pointer = null;
    rect = null;
    vortex.animate(
      { transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" },
      { duration: 420, fill: "forwards", easing: "cubic-bezier(.16,1,.3,1)" }
    );
  });

  if ("IntersectionObserver" in window) {
    const idle = new IntersectionObserver(([entry]) => {
      vortex.classList.toggle("is-idle", !entry.isIntersecting);
    }, { threshold: 0 });
    idle.observe(vortex);
  }
}
