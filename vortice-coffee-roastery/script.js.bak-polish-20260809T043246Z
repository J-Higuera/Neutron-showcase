const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.documentElement.classList.add("js");

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
  vortex.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(max-width: 46rem)").matches) return;
    const rect = vortex.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    vortex.style.setProperty("--tilt-x", `${y * -5}deg`);
    vortex.style.setProperty("--tilt-y", `${x * 5}deg`);
    vortex.animate(
      { transform: `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)` },
      { duration: 260, fill: "forwards", easing: "cubic-bezier(.16,1,.3,1)" }
    );
  });

  vortex.addEventListener("pointerleave", () => {
    vortex.animate(
      { transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" },
      { duration: 420, fill: "forwards", easing: "cubic-bezier(.16,1,.3,1)" }
    );
  });
}
