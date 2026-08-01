(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const taglines = [
    "Hack the canopy. Rule the cabinet.",
    "Retro chaos from the neon jungle.",
    "Press start on the monkey mainframe."
  ];

  const tagline = document.querySelector(".tagline");
  const worlds = Array.from(document.querySelectorAll(".world-card"));
  let taglineIndex = 0;
  let taglineTimer = null;
  let lenis = null;
  let lenisTick = null;
  let motionMedia = null;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  function setActiveWorld(activeIndex) {
    worlds.forEach(function (world, index) {
      world.classList.toggle("is-active", index === activeIndex);
    });
  }

  function startTaglines() {
    if (!tagline || reducedMotion.matches) return;

    taglineTimer = window.setInterval(function () {
      taglineIndex = (taglineIndex + 1) % taglines.length;
      tagline.classList.add("is-swapping");
      window.setTimeout(function () {
        tagline.textContent = taglines[taglineIndex];
        tagline.classList.remove("is-swapping");
      }, 120);
    }, 2200);
  }

  function stopTaglines() {
    if (taglineTimer) {
      window.clearInterval(taglineTimer);
      taglineTimer = null;
    }
  }

  function initMotion() {
    if (reducedMotion.matches || !window.gsap || !window.ScrollTrigger) {
      document.documentElement.classList.add("motion-reduced");
      document.querySelector(".stage-lane")?.removeAttribute("style");
      setActiveWorld(0);
      return;
    }

    document.documentElement.classList.remove("motion-reduced");

    if (window.Lenis) {
      lenis = new Lenis({
        duration: 0.86,
        smoothWheel: true,
        wheelMultiplier: 0.86,
        touchMultiplier: 1.15
      });

      lenis.on("scroll", ScrollTrigger.update);
      lenisTick = function (time) {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(lenisTick);
      gsap.ticker.lagSmoothing(0);
    }

    motionMedia = gsap.matchMedia();

    motionMedia.add("(min-width: 993px)", function () {
      const lane = document.querySelector(".stage-lane");
      const pin = document.querySelector(".stage-pin");
      if (!lane || !pin) return;

      const travel = function () {
        return Math.max(0, lane.scrollWidth - pin.clientWidth);
      };

      gsap.set(lane, { x: 0, y: 0 });

      gsap.to(lane, {
        x: function () {
          return -travel();
        },
        y: -34,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: function () {
            return "+=" + Math.max(760, travel() + 360);
          },
          pin: true,
          anticipatePin: 1,
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            const active = Math.min(worlds.length - 1, Math.round(self.progress * (worlds.length - 1)));
            setActiveWorld(active);
          }
        }
      });
    });

    gsap.fromTo(
      ".cabinet-stage",
      { y: 18, opacity: 0.94 },
      { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }
    );

    gsap.to(".vines-a", {
      yPercent: -7,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(".vines-b", {
      yPercent: 9,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.utils.toArray(".power, .scoreboard, .terminal, .dock-panel").forEach(function (element) {
      gsap.from(element, {
        y: 32,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 82%",
          once: true
        }
      });
    });

    gsap.utils.toArray(".score-rows strong").forEach(function (score, index) {
      gsap.from(score, {
        opacity: 0,
        y: 10,
        duration: 0.45,
        delay: index * 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".scoreboard",
          start: "top 70%",
          once: true
        }
      });
    });

    startTaglines();
  }

  function destroyMotion() {
    stopTaglines();

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

  initMotion();

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", function () {
      destroyMotion();
      initMotion();
    });
  }
})();
