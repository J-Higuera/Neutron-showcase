/* Miga — entrance, scroll choreography, process stage.
   Everything is visible without JS; motion only ever starts from here. */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  /* ---------- header state (no dependencies) ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* progress bar fallback where CSS scroll-driven animations are missing */
  const progress = document.querySelector(".bake-progress");
  if (progress && !(window.CSS && CSS.supports("animation-timeline: scroll()"))) {
    let ticking = false;
    const paint = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }

  /* ---------- process stage activation (IntersectionObserver) ---------- */
  const steps = Array.from(document.querySelectorAll("[data-step]"));
  const slides = Array.from(document.querySelectorAll(".process-media img"));
  const count = document.querySelector("[data-process-count]");

  const activate = (index) => {
    steps.forEach((s, i) => s.classList.toggle("is-active", i === index));
    slides.forEach((img, i) => img.classList.toggle("is-active", i === index));
    if (count) count.textContent = String(index + 1).padStart(2, "0");
  };

  if (steps.length && "IntersectionObserver" in window) {
    const heading = document.querySelector(".process .section-heading");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activate(entry.target === heading ? 0 : steps.indexOf(entry.target));
      });
    }, { rootMargin: "-42% 0px -42% 0px", threshold: 0 });
    steps.forEach((s) => io.observe(s));
    if (heading) io.observe(heading);
  }

  /* ---------- motion ---------- */
  const entrance = document.querySelector(".entrance");

  if (!hasGsap || reduced) {
    if (entrance) entrance.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* hero intro — built paused, started either by the entrance or directly */
  const heroImg = document.querySelector("[data-hero-media] img");
  const heroLines = gsap.utils.toArray(".hero-title .line-inner");
  const heroFades = gsap.utils.toArray("[data-hero-fade]");

  gsap.set(heroLines, { yPercent: 115 });
  gsap.set(heroFades, { autoAlpha: 0, y: 26 });
  if (heroImg) gsap.set(heroImg, { scale: 1.12 });

  const heroTl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
  if (heroImg) heroTl.to(heroImg, { scale: 1, duration: 2.2, ease: "power2.out" }, 0);
  heroTl
    .to(heroLines, { yPercent: 0, duration: 1.15, stagger: 0.14 }, 0.1)
    .to(heroFades, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09 }, 0.45);

  /* entrance — first visit per tab session only, always skippable by its brevity */
  const seen = (() => {
    try { return sessionStorage.getItem("miga-entrance"); } catch { return "1"; }
  })();

  if (entrance && !seen) {
    const letters = entrance.querySelectorAll(".entrance-word span");
    const tag = entrance.querySelector(".entrance-tag");
    gsap.set(letters, { yPercent: 130 });
    gsap.set(tag, { opacity: 0 });
    entrance.classList.add("is-on");
    try { sessionStorage.setItem("miga-entrance", "1"); } catch { /* private mode */ }

    gsap.timeline({ onComplete: () => entrance.remove() })
      .to(letters, { yPercent: 0, duration: 0.85, stagger: 0.07, ease: "power4.out" }, 0.15)
      .to(tag, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.65)
      .to(entrance, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.85,
        ease: "power3.inOut",
        onStart: () => heroTl.play(),
      }, 1.55);
  } else {
    if (entrance) entrance.remove();
    heroTl.play();
  }

  /* scroll reveals — deliberately gentle, fire once, content never stays hidden */
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 34,
      autoAlpha: 0,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%", once: true },
    });
  });

  /* hero settles into a slow zoom as it scrolls away */
  const heroMedia = document.querySelector("[data-hero-media]");
  if (heroMedia) {
    gsap.fromTo(heroMedia, { scale: 1 }, {
      scale: 1.08,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  }

  /* parallax drifts — images carry a CSS scale headroom so edges never show */
  gsap.utils.toArray("[data-parallax]").forEach((img) => {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6,
      ease: "none",
      scrollTrigger: {
        trigger: img.closest("figure, section") || img,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
  gsap.utils.toArray("[data-parallax-deep]").forEach((img) => {
    gsap.fromTo(img, { yPercent: -9 }, {
      yPercent: 9,
      ease: "none",
      scrollTrigger: {
        trigger: img.closest("section") || img,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
