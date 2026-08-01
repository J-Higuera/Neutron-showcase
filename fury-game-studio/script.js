(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const projectSlates = Array.from(document.querySelectorAll(".project-slate"));
  let lenis = null;
  let lenisTick = null;
  let motionMedia = null;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  function setActiveProject(index) {
    projectSlates.forEach(function (slate, slateIndex) {
      slate.classList.toggle("is-active", slateIndex === index);
    });
  }

  function initMotion() {
    if (reducedMotion.matches || !window.gsap || !window.ScrollTrigger) {
      document.documentElement.classList.add("motion-reduced");
      document.querySelector(".project-lane")?.removeAttribute("style");
      setActiveProject(0);
      return;
    }

    document.documentElement.classList.remove("motion-reduced");

    if (window.Lenis) {
      lenis = new Lenis({
        duration: 0.88,
        smoothWheel: true,
        wheelMultiplier: 0.85,
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

    const routeLinePaths = gsap.utils.toArray(".route-lines path");
    routeLinePaths.forEach(function (path) {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length
      });
    });

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".hero-stage", {
        y: 18,
        autoAlpha: 0.94,
        duration: 0.72
      })
      .from(".wordmark span", {
        x: function (index) {
          return index === 0 ? -26 : 26;
        },
        opacity: 0,
        duration: 0.52,
        stagger: 0.08
      }, 0.12)
      .to(routeLinePaths, {
        strokeDashoffset: 0,
        duration: 0.78,
        stagger: 0.08
      }, 0.3)
      .from(".route-lines circle", {
        scale: 0,
        transformOrigin: "center",
        duration: 0.28,
        stagger: 0.07
      }, 0.72)
      .from(".route-ctas .route", {
        y: 16,
        opacity: 0,
        duration: 0.42,
        stagger: 0.08
      }, 0.55);

    motionMedia.add("(min-width: 993px)", function () {
      const lane = document.querySelector(".project-lane");
      const pin = document.querySelector(".lane-pin");
      if (!lane || !pin) return;

      const travel = function () {
        return Math.max(0, lane.scrollWidth - pin.clientWidth);
      };

      gsap.set(lane, { x: 0, y: 0 });
      gsap.to(lane, {
        x: function () {
          return -travel();
        },
        y: -28,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: function () {
            return "+=" + Math.max(720, travel() + 340);
          },
          pin: true,
          anticipatePin: 1,
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            const active = Math.min(projectSlates.length - 1, Math.round(self.progress * (projectSlates.length - 1)));
            setActiveProject(active);
          }
        }
      });
    });

    motionMedia.add("(min-width: 993px)", function () {
      gsap.to(".hero-media img", {
        yPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-stage",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".silhouette-a", {
        yPercent: -7,
        xPercent: 3,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".silhouette-b", {
        yPercent: 8,
        xPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".route-lines", {
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

    motionMedia.add("(min-width: 993px)", function () {
      gsap.utils.toArray(".press-strip, .manifesto-stack article, .quest-board, .partner-map, .exit-hub").forEach(function (element) {
        gsap.from(element, {
          y: 28,
          opacity: 0,
          duration: 0.58,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
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

  initMotion();

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", function () {
      destroyMotion();
      initMotion();
    });
  }
})();
