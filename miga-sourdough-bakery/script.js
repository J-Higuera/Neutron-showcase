const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  document.documentElement.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.35) {
          element.classList.add("is-visible");
        }
      });
    }, 250);
  });
}

const bakeItems = [...document.querySelectorAll(".bake-item")];
let warmIndex = 0;

function warmNextBake() {
  if (!bakeItems.length || prefersReducedMotion) return;
  bakeItems.forEach((item) => item.classList.remove("is-warm"));
  bakeItems[warmIndex].classList.add("is-warm");
  warmIndex = (warmIndex + 1) % bakeItems.length;
}

warmNextBake();
window.setInterval(warmNextBake, 2600);
