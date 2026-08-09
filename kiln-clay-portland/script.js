(function () {
  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var canAnimate = !reduceMotion.matches && window.gsap && window.ScrollTrigger;

  if (!canAnimate) {
    // Restore the pre-paint hold (.anim) so the page is fully visible on
    // every non-animating path: reduced motion, missing GSAP, old browsers.
    docEl.classList.remove("anim");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", function () {
    gsap.fromTo(".hero-copy > *",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" });

    gsap.fromTo(".test-tile",
      { y: 28, opacity: 0, rotate: function (i) { return i % 2 ? 2 : -2; } },
      { y: 0, opacity: 1, rotate: 0, duration: 0.72, stagger: 0.055, ease: "power3.out", delay: 0.1 });

    gsap.to(".test-tile", {
      y: function (i) { return i % 2 ? -8 : -4; },
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    });

    var shell = document.querySelector(".process-shell");
    var track = document.querySelector(".process-track");
    var railFill = document.querySelector(".process-rail span");
    var distance = function () {
      return track ? Math.max(0, track.scrollWidth - track.clientWidth) : 0;
    };

    if (shell && track && distance() > 0) {
      // .scrub-on switches the track from a snap scroller to a clipped,
      // transform-driven plane (see styles.css) — animating scrollLeft on a
      // `scroll-snap-type: mandatory` container makes the browser's snap
      // logic fight every frame the tween writes.
      docEl.classList.add("scrub-on");

      var tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: shell,
          start: "center center",
          end: function () { return "+=" + distance(); },
          scrub: 0.3,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      tl.to(track, { scrollLeft: function () { return distance(); } }, 0);
      if (railFill) tl.to(railFill, { scaleX: 1 }, 0);
      tl.to(".ring-lines", { rotation: 32, transformOrigin: "50% 50%" }, 0);
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

    return function () {
      docEl.classList.remove("scrub-on");
    };
  });

  mm.add("(max-width: 768.99px)", function () {
    gsap.fromTo(".hero-copy > *",
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: "power2.out" });

    gsap.fromTo(".test-tile",
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power2.out", delay: 0.05 });
  });
})();
