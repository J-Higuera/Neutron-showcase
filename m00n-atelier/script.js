(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canAnimate = !reduceMotion.matches && window.gsap && window.ScrollTrigger;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const images = {
    abstract: "assets/abstract-mixed-media-artwork-on-dark-canvas-with-luminous-silver-blue-pigment-close-cropped-nocturne-gallery-mood.jpg",
    pigment: "assets/close-up-textured-canvas-pigment-strokes-in-deep-blue-violet-silver-tones-tactile-macro-detail.jpg",
    studio: "assets/contemporary-artist-studio-table-at-night-with-brushes-paper-pigment-canvas-fragments-warm-spotlight-moody-shadows.jpg",
    paper: "assets/experimental-collage-paper-fragment-or-painted-paper-study-with-irregular-edges-dark-creative-atelier-mood.jpg",
    framed: "assets/framed-contemporary-abstract-artwork-on-dark-gallery-wall-with-soft-spotlight-and-strong-negative-space.jpg",
    glow: "assets/projection-light-or-soft-circular-illumination-on-studio-wall-james-turrell-inspired-atmospheric-glow-without-literal-moon-photo.jpg"
  };

  const phaseData = [
    {
      title: "New Moon Studies",
      meta: "Moon Object No. 01, 2026 // pigment on dark ground // studies available on inquiry",
      note: "Raw dark-ground experiments, early marks, and obscured forms. Each work begins as a nocturne study and resolves as an object of light.",
      imgs: [images.abstract, images.pigment, images.paper]
    },
    {
      title: "Waxing Forms",
      meta: "Waxing Form No. 02, 2026 // collage, overpaint, soft transfer // original work",
      note: "Emerging color, layered collage, and abstract structures move forward from the dark field without losing the first pressure mark.",
      imgs: [images.paper, images.abstract, images.studio]
    },
    {
      title: "First Quarter Objects",
      meta: "Moon Object No. 04, 2026 // mixed media on canvas // 30 x 40 in // available on inquiry",
      note: "Sharper compositions and framed collectible pieces, built for rooms where the object has to hold silence and edge light.",
      imgs: [images.framed, images.pigment, images.abstract]
    },
    {
      title: "Waxing Gibbous Works",
      meta: "Gibbous Surface, 2026 // acrylic, graphite, projected scan // exhibition proposal ready",
      note: "A near-full state: luminous fields, brighter scan residue, and surfaces that retain the hand after digital layering.",
      imgs: [images.glow, images.abstract, images.paper]
    },
    {
      title: "Full Light Works",
      meta: "Full Light Work, 2026 // acrylic, graphite, projected scan // private collection",
      note: "The brightest exhibition-ready pieces, resolved as objects of light with silver-blue edges and a controlled gallery presence.",
      imgs: [images.abstract, images.framed, images.glow]
    },
    {
      title: "Waning Archive",
      meta: "Waning Study, 2026 // pigment, collage, digital transfer // edition of 12",
      note: "Fragments, scans, studies, and erased works remain in circulation as archival traces and intimate edition material.",
      imgs: [images.paper, images.pigment, images.studio]
    },
    {
      title: "Nocturne Editions",
      meta: "Nocturne Edition No. 03, 2026 // hand-finished transfer // edition available",
      note: "Smaller collectible editions and private-viewing works, each documented with dimensions, medium, and series notes.",
      imgs: [images.pigment, images.paper, images.glow]
    },
    {
      title: "Waning Crescent Archive",
      meta: "Crescent Index, 2026 // scan, graphite, erased pigment // private viewing",
      note: "The final room returns to the table: reduced marks, soft light, and objects held just before disappearance.",
      imgs: [images.studio, images.glow, images.abstract]
    }
  ];

  const tabs = Array.from(document.querySelectorAll(".phase-button"));
  const panel = document.querySelector("#phase-panel");
  const title = document.querySelector("#phase-title");
  const meta = document.querySelector("#phase-meta");
  const note = document.querySelector("#phase-note");
  const panelImages = [
    document.querySelector("#phase-img-1"),
    document.querySelector("#phase-img-2"),
    document.querySelector("#phase-img-3")
  ];

  function setPhase(index, shouldFocus) {
    const data = phaseData[index];
    if (!data) return;

    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    panel.setAttribute("aria-labelledby", `phase-tab-${index}`);
    title.textContent = data.title;
    meta.textContent = data.meta;
    note.textContent = data.note;
    panelImages.forEach((img, imgIndex) => {
      img.src = data.imgs[imgIndex];
    });

    if (canAnimate) {
      gsap.fromTo(
        panel.querySelectorAll(".phase-room__text > *, .phase-work"),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.045, overwrite: true }
      );
    }

    if (shouldFocus) {
      tabs[index].focus();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setPhase(index, false));
    tab.addEventListener("keydown", (event) => {
      const current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== current) {
        event.preventDefault();
        setPhase(next, true);
      }
    });
  });

  if (canAnimate) {
    const mm = gsap.matchMedia();

    if (window.Lenis) {
      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 0.82
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    mm.add("(min-width: 929px)", () => {
      const drift = gsap.to(".orbit-fragment", {
        y: (i) => [12, -18, 14, -10, 16, -12][i] || 10,
        x: (i) => [-8, 6, -10, 9, 7, -6][i] || 4,
        rotate: (i) => [-2, 1.5, 2.5, -1.5, 1, -2][i] || 1,
        duration: 5.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.18
      });

      gsap.to(".orbit-fragment", {
        yPercent: (i) => [10, -8, 7, -5, 8, -6][i] || 5,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.7
        }
      });

      return () => drift.kill();
    });

    gsap.utils.toArray(".section-head, .phase-room, .work-object, .process-copy, .process-image, .paper-note, .viewing-slip, .contact-shell").forEach((element) => {
      gsap.from(element, {
        y: 26,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 82%",
          once: true
        }
      });
    });

    gsap.to(".moonrise", {
      opacity: 0.24,
      y: -26,
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 75%",
        end: "bottom bottom",
        scrub: 0.8
      }
    });

    gsap.utils.toArray(".series-section").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onUpdate: (self) => {
          const index = Math.min(phaseData.length - 1, Math.max(0, Math.floor(self.progress * phaseData.length)));
          const activeIndex = tabs.findIndex((tab) => tab.classList.contains("is-active"));
          if (index !== activeIndex) setPhase(index, false);
        }
      });
    });
  }
})();
