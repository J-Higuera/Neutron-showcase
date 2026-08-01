(() => {
  document.documentElement.classList.add("js-enabled");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasGsap = window.gsap && window.ScrollTrigger;

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const setRouteLengths = () => {
    document.querySelectorAll(".route").forEach((path) => {
      if (typeof path.getTotalLength === "function") {
        path.style.setProperty("--path-length", Math.ceil(path.getTotalLength()));
      }
    });
  };

  setRouteLengths();

  if (!hasGsap || prefersReduced.matches) {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelectorAll(".route").forEach((path) => {
      path.style.strokeDashoffset = "0";
    });
    return;
  }

  const ctx = gsap.context(() => {
    gsap.to(".hero .reveal", {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.08
    });

    gsap.to(".control-board .route", {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.out",
      stagger: 0.12,
      delay: 0.22
    });

    gsap.fromTo(
      ".dispatch-sweep",
      { xPercent: -180, opacity: 0 },
      {
        xPercent: 520,
        opacity: 0.9,
        duration: 3.4,
        ease: "none",
        repeat: -1,
        repeatDelay: 2
      }
    );

    gsap.utils.toArray(".reveal:not(.hero .reveal)").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.58,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 84%",
          once: true
        }
      });
    });

    gsap.utils.toArray(".checkpoint-list li").forEach((item, index) => {
      gsap.fromTo(
        item,
        { scale: 0.985 },
        {
          scale: 1,
          duration: 0.32,
          delay: index * 0.025,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
            once: true
          }
        }
      );
    });

    gsap.to(".branch-spine", {
      opacity: 1,
      scaleX: 1,
      transformOrigin: "left center",
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".branch-board",
        start: "top 72%",
        once: true
      }
    });
  });

  window.addEventListener("pagehide", () => ctx.revert(), { once: true });
})();
