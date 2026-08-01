(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canAnimate = !prefersReduced.matches && window.gsap && window.ScrollTrigger;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  document.documentElement.classList.add("js-ready");

  const setPathLengths = () => {
    document.querySelectorAll(".route, .rail-live").forEach((path) => {
      if (typeof path.getTotalLength === "function") {
        path.style.setProperty("--path-length", Math.ceil(path.getTotalLength()));
      }
    });
  };

  setPathLengths();

  if (!canAnimate) {
    document.querySelectorAll(".reveal-block").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelectorAll(".route, .rail-live").forEach((path) => {
      path.style.strokeDashoffset = "0";
    });
    return;
  }

  const lenis = window.Lenis
    ? new Lenis({
        duration: 0.85,
        wheelMultiplier: 0.78,
        smoothWheel: true,
        smoothTouch: false
      })
    : null;

  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const ctx = gsap.context(() => {
      gsap.to(".hero .reveal-block", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08
      });

      gsap.to(".hero-blueprint .route", {
        strokeDashoffset: 0,
        duration: 1.35,
        ease: "power2.out",
        stagger: 0.16,
        delay: 0.25
      });

      gsap.fromTo(
        ".scanline",
        { xPercent: -220, opacity: 0 },
        {
          xPercent: 520,
          opacity: 0.78,
          duration: 3.6,
          ease: "none",
          repeat: -1,
          repeatDelay: 1.8
        }
      );

      gsap.utils.toArray(".reveal-block:not(.hero .reveal-block)").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.62,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            once: true
          }
        });
      });

      gsap.to(".rail-live", {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".route-map",
          start: "top 72%",
          end: "bottom 56%",
          scrub: 0.8
        }
      });

      gsap.utils.toArray(".route-callout").forEach((el) => {
        gsap.fromTo(
          el,
          { "--pulse": 0 },
          {
            "--pulse": 1,
            duration: 0.45,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 70%",
              once: true,
              onEnter: () => {
                gsap.fromTo(
                  el,
                  { scale: 1 },
                  { scale: 1.018, duration: 0.18, yoyo: true, repeat: 1, ease: "power1.out" }
                );
              }
            }
          }
        );
      });

      gsap.from(".proof-label", {
        opacity: 0,
        y: 18,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".proof-topology",
          start: "top 72%",
          once: true
        }
      });

      gsap.from(".phase", {
        opacity: 0,
        y: 26,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".phase-board",
          start: "top 72%",
          once: true
        }
      });
    });

    return () => {
      ctx.revert();
      if (lenis) {
        lenis.destroy();
      }
    };
  });
})();
