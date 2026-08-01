(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const form = document.querySelector(".call-sheet");
  const note = document.querySelector(".form-note");

  if (form && note) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      note.textContent = "You are on the call sheet. Pixie will reply with the next available room.";
      form.setAttribute("aria-busy", "false");
    });
  }

  if (!window.gsap || !window.ScrollTrigger) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (reduceMotion.matches) {
    gsap.set(".cue-card, .portal-door, .method-strip li, .notice, .offer, .note-card", {
      clearProps: "all"
    });
    return;
  }

  const ctx = gsap.context(function () {
    gsap.from(".hero-copy > *", {
      y: 18,
      opacity: 0,
      duration: 0.72,
      ease: "power3.out",
      stagger: 0.09
    });

    gsap.from(".cue-card", {
      y: -24,
      opacity: 0,
      rotate: 0,
      duration: 0.95,
      ease: "back.out(1.35)",
      stagger: 0.08,
      delay: 0.22
    });

    gsap.to(".portal-door", {
      scale: 1.035,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "50% 80%"
    });

    gsap.utils.toArray(".section-heading, .pinned, .note-card, .notice, .studio-panel, .quote-block, .offer, .signup").forEach(function (element) {
      gsap.from(element, {
        y: 26,
        opacity: 0,
        duration: 0.68,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 84%",
          once: true
        }
      });
    });

    gsap.utils.toArray(".method-strip li").forEach(function (item, index) {
      gsap.from(item, {
        y: 18,
        opacity: 0.35,
        duration: 0.45,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".method-strip",
          start: "top 78%",
          end: "bottom 45%",
          scrub: 0.35
        },
        delay: index * 0.02
      });
    });

    gsap.matchMedia().add("(min-width: 1024px)", function () {
      const callBoardHeading = document.querySelector(".pathways-section .section-heading");

      if (!callBoardHeading) {
        return;
      }

      ScrollTrigger.create({
        trigger: ".call-board",
        start: "top 18%",
        end: "bottom 52%",
        pin: callBoardHeading,
        pinSpacing: false
      });
    });
  });

  reduceMotion.addEventListener("change", function () {
    ctx.revert();
  });
})();
