(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canAnimate = !reduceMotion.matches && window.gsap && window.ScrollTrigger;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (!reduceMotion.matches && window.Lenis) {
    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      wheelMultiplier: 0.78,
      touchMultiplier: 1
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  if (!canAnimate) return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", function () {
    gsap.from(".hero-copy > *", {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out"
    });

    gsap.from(".test-tile", {
      y: 28,
      opacity: 0,
      rotate: function (i) { return i % 2 ? 2 : -2; },
      duration: 0.72,
      stagger: 0.055,
      ease: "power3.out",
      delay: 0.1
    });

    gsap.to(".test-tile", {
      y: function (i) { return i % 2 ? -8 : -4; },
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    });

    const track = document.querySelector(".process-track");
    if (track && track.scrollWidth > track.clientWidth) {
      gsap.to(track, {
        scrollLeft: function () {
          return track.scrollWidth - track.clientWidth;
        },
        ease: "none",
        scrollTrigger: {
          trigger: ".process-shell",
          start: "top 18%",
          end: function () {
            return "+=" + Math.min(track.scrollWidth, 1500);
          },
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
    }

    gsap.utils.toArray(".offering-card, .surface-card, .proof-grid article").forEach(function (item, index) {
      gsap.from(item, {
        y: 26,
        opacity: 0,
        duration: 0.62,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 86%",
          once: true
        },
        delay: (index % 3) * 0.04
      });
    });
  });

  mm.add("(max-width: 768px)", function () {
    gsap.from(".test-tile", {
      opacity: 0,
      y: 12,
      duration: 0.45,
      stagger: 0.04,
      ease: "power2.out"
    });
  });
})();
