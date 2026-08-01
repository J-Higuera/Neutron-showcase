(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const slots = Array.from(document.querySelectorAll(".slot"));
  const diagnosticTitle = document.querySelector("#diagnostic-title");
  const diagnosticCopy = document.querySelector("#diagnostic-copy");
  const diagnosticCode = document.querySelector("#diagnostic-code");
  const lanePaths = Array.from(document.querySelectorAll(".loadout-lanes .lane-path"));
  const loadoutConsole = document.querySelector(".loadout-console");
  let lenis = null;
  let lenisTick = null;
  let motionMedia = null;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  function setSlot(slot) {
    const activeIndex = slots.indexOf(slot);

    slots.forEach(function (item) {
      item.classList.toggle("active", item === slot);
    });

    lanePaths.forEach(function (path, index) {
      path.classList.toggle("active", index === activeIndex);
    });

    if (loadoutConsole && activeIndex >= 0) {
      loadoutConsole.style.setProperty("--active-lane", activeIndex);
    }

    if (!slot || !diagnosticTitle || !diagnosticCopy || !diagnosticCode) return;
    diagnosticTitle.textContent = slot.dataset.title;
    diagnosticCopy.textContent = slot.dataset.copy;
    diagnosticCode.textContent = slot.dataset.code;
  }

  slots.forEach(function (slot) {
    slot.addEventListener("mouseenter", function () {
      setSlot(slot);
    });
    slot.addEventListener("focus", function () {
      setSlot(slot);
    });
    slot.addEventListener("click", function () {
      setSlot(slot);
    });
  });

  function initMotion() {
    if (reducedMotion.matches || !window.gsap || !window.ScrollTrigger) {
      document.documentElement.classList.add("motion-reduced");
      document.querySelector(".pipeline-track")?.removeAttribute("style");
      setSlot(slots[0]);
      return;
    }

    document.documentElement.classList.remove("motion-reduced");

    if (window.Lenis) {
      lenis = new Lenis({
        duration: 0.82,
        smoothWheel: true,
        wheelMultiplier: 0.86,
        touchMultiplier: 1.08
      });
      lenis.on("scroll", ScrollTrigger.update);
      lenisTick = function (time) {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(lenisTick);
      gsap.ticker.lagSmoothing(0);
    }

    motionMedia = gsap.matchMedia();

    const coreLines = gsap.utils.toArray(".beast-core .lane, .beast-core .ape, .beast-core .jaw, .beast-core .eye");
    coreLines.forEach(function (path) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".deck-shell", { y: 18, autoAlpha: 0.94, duration: 0.64 })
      .from(".hero-copy > *", { y: 18, opacity: 0, duration: 0.48, stagger: 0.06 }, 0.12)
      .to(coreLines, { strokeDashoffset: 0, duration: 0.85, stagger: 0.035 }, 0.18)
      .from(".module-strip, .deck-label", { y: 12, opacity: 0, duration: 0.42, stagger: 0.07 }, 0.46)
      .from(".slot", { y: 18, opacity: 0, duration: 0.42, stagger: 0.035 }, 0.58);

    motionMedia.add("(min-width: 1089px)", function () {
      const pipeline = document.querySelector(".pipeline-track");
      const shell = document.querySelector(".pipeline-map");
      if (!pipeline || !shell) return;

      const travel = function () {
        return Math.max(0, pipeline.scrollWidth - shell.clientWidth);
      };

      gsap.set(pipeline, { x: 0 });
      gsap.to(pipeline, {
        x: function () {
          return -travel();
        },
        ease: "none",
        scrollTrigger: {
          trigger: shell,
          start: "top top",
          end: function () {
            return "+=" + Math.max(780, travel() + 360);
          },
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            const nodes = gsap.utils.toArray(".pipe-node");
            const active = Math.min(nodes.length - 1, Math.round(self.progress * (nodes.length - 1)));
            nodes.forEach(function (node, index) {
              node.classList.toggle("active", index <= active);
            });
          }
        }
      });

      gsap.to(".hero-media img", {
        yPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".beast-core", {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    });

    motionMedia.add("(min-width: 769px)", function () {
      gsap.utils.toArray(".section-head, .diagnostic-panel, .slot, .deploy-node, .instrument-grid div, .comm-stack blockquote, .deploy-panel").forEach(function (element) {
        gsap.from(element, {
          y: 22,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true
          }
        });
      });
    });
  }

  function destroyMotion() {
    if (motionMedia) {
      motionMedia.revert();
      motionMedia = null;
    }

    if (window.ScrollTrigger) {
      ScrollTrigger.getAll().forEach(function (trigger) {
        trigger.kill();
      });
    }

    if (window.gsap) {
      gsap.killTweensOf("*");
      if (lenisTick) {
        gsap.ticker.remove(lenisTick);
        lenisTick = null;
      }
    }

    if (lenis && typeof lenis.destroy === "function") {
      lenis.destroy();
      lenis = null;
    }
  }

  setSlot(slots[0]);
  initMotion();

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", function () {
      destroyMotion();
      initMotion();
    });
  }
})();
