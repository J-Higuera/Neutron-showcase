(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canAnimate = !reduceMotion.matches && window.gsap && window.ScrollTrigger;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (!reduceMotion.matches && window.Lenis) {
    const lenis = new Lenis({
      duration: 0.95,
      smoothWheel: true,
      wheelMultiplier: 0.82
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  if (!canAnimate) {
    return;
  }

  const mm = gsap.matchMedia();

  mm.add("(min-width: 721px)", () => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.75 }
    });

    tl.from(".hero-copy > *", {
      y: 24,
      opacity: 0,
      stagger: 0.08
    })
      .from(".discovery-frame", { y: 30, opacity: 0, scale: 0.98 }, "-=0.55")
      .from(".shelf-layer", { y: 22, opacity: 0, stagger: 0.08 }, "-=0.35");

    gsap.to(".hero-product", {
      y: -12,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    });

    gsap.to(".checkout-panel", {
      y: -24,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    });

    return () => tl.kill();
  });

  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.from(element, {
      y: 28,
      opacity: 0,
      duration: 0.65,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 86%",
        once: true
      }
    });
  });

  gsap.utils.toArray(".category-rail article").forEach((card, index) => {
    gsap.from(card, {
      x: 28,
      opacity: 0,
      duration: 0.45,
      delay: Math.min(index * 0.035, 0.3),
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".category-rail",
        start: "top 82%",
        once: true
      }
    });
  });

  gsap.utils.toArray(".comparison-table tbody tr").forEach((row) => {
    ScrollTrigger.create({
      trigger: row,
      start: "top 76%",
      end: "bottom 42%",
      onEnter: () => row.classList.add("is-lit"),
      onLeave: () => row.classList.remove("is-lit"),
      onEnterBack: () => row.classList.add("is-lit"),
      onLeaveBack: () => row.classList.remove("is-lit")
    });
  });

  reduceMotion.addEventListener("change", () => {
    window.location.reload();
  });
})();
