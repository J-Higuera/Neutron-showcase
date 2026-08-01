(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const apertureField = document.querySelector("[data-aperture-field]");

  function buildApertures() {
    if (!apertureField || apertureField.children.length) return;

    const ranges = [
      { start: 1, end: 12, label: "Exhibition" },
      { start: 13, end: 24, label: "Artists" },
      { start: 25, end: 36, label: "Studio" },
      { start: 37, end: 48, label: "Collector visit" }
    ];

    for (let index = 1; index <= 48; index += 1) {
      const mark = document.createElement("a");
      const range = ranges.find((item) => index >= item.start && index <= item.end);
      mark.className = "aperture";
      mark.dataset.index = String(index);
      mark.dataset.range = range ? range.label : "";
      mark.href = getApertureTarget(index);
      mark.setAttribute("aria-label", `${String(index).padStart(2, "0")} ${range ? range.label : "Viewing room"}`);
      mark.textContent = String(index).padStart(2, "0");
      if (index <= 12 || reducedMotion.matches) mark.classList.add("is-lit");
      apertureField.appendChild(mark);
    }
  }

  function getApertureTarget(index) {
    if (index <= 12) return "#on-view";
    if (index <= 24) return "#artists";
    if (index <= 36) return "#studio";
    return index <= 44 ? "#works" : "#visit";
  }

  function initMotion() {
    if (reducedMotion.matches || !window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll(".reveal").forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "none";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      const lenis = new Lenis({
        duration: 0.9,
        smoothWheel: true,
        wheelMultiplier: 0.82,
        touchMultiplier: 1
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const apertures = gsap.utils.toArray(".aperture");
    gsap.timeline({
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
        onUpdate: (self) => {
          const litCount = Math.max(12, Math.ceil(self.progress * apertures.length));
          apertures.forEach((mark, index) => {
            mark.classList.toggle("is-lit", index < litCount);
          });
        }
      }
    }).to(apertures, {
      color: "#B32D23",
      borderColor: "#B32D23",
      stagger: 0.035,
      duration: 0.2,
      ease: "none"
    }, 0);

    gsap.utils.toArray("[data-parallax-frame] img").forEach((image) => {
      gsap.fromTo(image, {
        yPercent: -3
      }, {
        yPercent: 3,
        ease: "none",
        scrollTrigger: {
          trigger: image.closest("figure"),
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    gsap.set(".reveal", { opacity: 0, y: 28 });

    gsap.utils.toArray(".reveal").forEach((item, index) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        delay: (index % 3) * 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 86%",
          once: true
        }
      });
    });
  }

  buildApertures();
  initMotion();
})();
