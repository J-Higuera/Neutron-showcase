(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (!reducedMotion && window.Lenis) {
    const lenis = new Lenis({ duration: 1, smoothWheel: true, smoothTouch: false });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  if (!window.gsap || !window.ScrollTrigger || reducedMotion) return;

  gsap.utils.toArray(".route, .fabric-routes path, .ops-routes path").forEach((path) => {
    const length = path.getTotalLength ? path.getTotalLength() : 600;
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: "power2.out",
      scrollTrigger: { trigger: path.closest("section") || ".hero", start: "top 75%", once: true }
    });
  });

  gsap.from(".hero-copy", { y: 28, opacity: 0, duration: 0.85, ease: "power2.out" });
  gsap.from(".target", { scale: 0.96, opacity: 0, transformOrigin: "50% 50%", duration: 0.9, ease: "power2.out" });
  gsap.from(".diagnostics g", { y: 18, opacity: 0, stagger: 0.06, duration: 0.65, ease: "power2.out" });

  gsap.from(".lane", {
    y: 18,
    opacity: 0,
    stagger: 0.06,
    duration: 0.65,
    ease: "power2.out",
    scrollTrigger: { trigger: ".fabric", start: "top 76%", once: true }
  });

  gsap.from(".corridor li", {
    clipPath: "polygon(0 0,100% 0,100% 0,0 0)",
    y: 20,
    opacity: 0,
    stagger: 0.06,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: { trigger: ".process", start: "top 76%", once: true }
  });

  gsap.from(".soc-overlay span", {
    x: 24,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: { trigger: ".security", start: "top 72%", once: true }
  });

  gsap.from(".assessment-flow span", {
    y: 16,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: { trigger: ".assessment", start: "top 76%", once: true }
  });
})();
