(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setupMotion() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (reduceMotion.matches) {
      gsap.set(".boot-target, .prompt-panel, .rig-panel, .preview-deck, .timeline-console, .workflow-cell, .tool-module, .review-room, .room-panel, .finale", {
        clearProps: "all"
      });
      gsap.set(".playhead", { xPercent: 0 });
      return;
    }

    if (typeof Lenis !== "undefined") {
      var lenis = new Lenis({
        duration: 0.9,
        smoothWheel: true,
        wheelMultiplier: 0.82
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    var boot = gsap.timeline({ defaults: { ease: "power3.out" } });
    boot
      .from(".cockpit", { opacity: 0, y: 24, duration: 0.75 })
      .from(".browser-bar", { opacity: 0, y: -12, duration: 0.4 }, "-=0.35")
      .from(".preview-window", { opacity: 0, scale: 0.985, duration: 0.62 }, "-=0.2")
      .from(".chip-stack span", { opacity: 0, y: 12, stagger: 0.055, duration: 0.42 }, "-=0.25")
      .from(".key-dot", { opacity: 0, scale: 0, transformOrigin: "center", stagger: 0.08, duration: 0.36 }, "-=0.12")
      .from(".timeline-console", { opacity: 0, y: 18, duration: 0.45 }, "-=0.22")
      .fromTo(".render-fill", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.88 }, "-=0.24")
      .fromTo(".playhead", { x: "-22vw" }, { x: 0, duration: 0.88 }, "<");

    gsap.utils.toArray(".workflow-cell").forEach(function (cell, index) {
      gsap.from(cell, {
        scrollTrigger: {
          trigger: cell,
          start: "top 82%",
          once: true
        },
        opacity: 0,
        y: 26,
        duration: 0.55,
        delay: Math.min(index * 0.035, 0.22),
        ease: "power3.out"
      });
    });

    gsap.matchMedia().add("(min-width: 1024px)", function () {
      gsap.to(".workflow-track", {
        x: function () {
          var track = document.querySelector(".workflow-track");
          if (!track) return 0;
          return Math.min(0, window.innerWidth - track.scrollWidth - 80);
        },
        ease: "none",
        scrollTrigger: {
          trigger: ".workflow",
          start: "top 18%",
          end: "+=900",
          scrub: 0.6,
          pin: false,
          invalidateOnRefresh: true
        }
      });
    });

    gsap.utils.toArray(".tool-module").forEach(function (module) {
      gsap.from(module, {
        scrollTrigger: {
          trigger: module,
          start: "top 78%",
          once: true
        },
        opacity: 0,
        y: 30,
        duration: 0.58,
        ease: "power3.out"
      });
    });

    gsap.utils.toArray(".motion-path").forEach(function (path) {
      var length = path.getTotalLength ? path.getTotalLength() : 0;
      if (!length) return;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: path.closest(".media-slot") || path,
          start: "top 72%",
          once: true
        }
      });
    });

    gsap.from(".review-room", {
      scrollTrigger: {
        trigger: ".review-room",
        start: "top 75%",
        once: true
      },
      opacity: 0,
      y: 24,
      duration: 0.65,
      ease: "power3.out"
    });

    gsap.from(".room-panel", {
      scrollTrigger: {
        trigger: ".room-rack",
        start: "top 76%",
        once: true
      },
      opacity: 0,
      y: 24,
      stagger: 0.08,
      duration: 0.58,
      ease: "power3.out"
    });

    gsap.fromTo(".final-rail span", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.7, ease: "power2.out" });
    gsap.from(".final-strip .media-slot", {
      scrollTrigger: {
        trigger: ".finale",
        start: "top 78%",
        once: true
      },
      opacity: 0,
      y: 18,
      stagger: 0.07,
      duration: 0.55,
      ease: "power3.out"
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupMotion);
  } else {
    setupMotion();
  }
})();
