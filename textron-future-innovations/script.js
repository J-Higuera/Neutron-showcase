(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const bayContent = {
    propulsion: {
      title: "Propulsion",
      copy: "Distributed electric propulsion mapped against thermal margin, charging cadence, and inspection access.",
      metric: "DEP / thermal clear"
    },
    avionics: {
      title: "Avionics",
      copy: "Glass cockpit and flight-control evidence tracked against pilot workload, redundancy, and dispatch readiness.",
      metric: "Flight deck / checked"
    },
    autonomy: {
      title: "Autonomy",
      copy: "Sensing, relay, and payload flexibility are evaluated as mission systems, not as detached software demos.",
      metric: "ISR / relay valid"
    },
    certification: {
      title: "Certification",
      copy: "Test points, inspection records, and configuration control are organized around a credible certification path.",
      metric: "Evidence / in scope"
    },
    support: {
      title: "Support",
      copy: "Parts availability, mobile service, AOG response, and monitoring are planned before fielding begins.",
      metric: "Lifecycle / sustained"
    }
  };

  const loopContent = {
    design: {
      title: "Design evidence",
      copy: "Digital requirements, manufacturability reviews, and open architecture choices are captured before the test article enters flight activity.",
      metric: "Factory",
      output: "Configuration-controlled design package"
    },
    test: {
      title: "Test discipline",
      copy: "Flight-test telemetry, propulsion data, sensor checks, and range operations convert performance assumptions into measured proof.",
      metric: "Range",
      output: "Telemetry blocks and inspection records"
    },
    certify: {
      title: "Certification path",
      copy: "Evidence is organized around airworthiness, safety cases, maintainability, and operator readiness rather than launch-day claims.",
      metric: "Authority",
      output: "Reviewable certification evidence"
    },
    deploy: {
      title: "Deployment readiness",
      copy: "Program teams connect production cadence, training, support materials, and mission configuration before handoff.",
      metric: "Operator",
      output: "Fieldable capability package"
    },
    sustain: {
      title: "Lifecycle sustainment",
      copy: "Service facilities, mobile service units, AOG response, parts shipping, and monitoring keep aircraft and mission systems available.",
      metric: "Network",
      output: "Maintained fleet availability"
    }
  };

  let activeBayModule = "propulsion";
  let activeLoopStep = "design";

  function setBayModule(key) {
    const content = bayContent[key];
    if (!content) return;
    const changed = activeBayModule !== key;
    activeBayModule = key;

    document.querySelectorAll(".module-card").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.module === key);
      button.setAttribute("aria-pressed", button.dataset.module === key ? "true" : "false");
    });

    document.querySelectorAll(".bay-line").forEach((line) => {
      const active = line.dataset.line === key;
      line.classList.toggle("is-active", active);
      if (!active) {
        line.style.strokeDasharray = "";
        line.style.strokeDashoffset = "";
      }
    });

    const title = document.querySelector("[data-bay-title]");
    const copy = document.querySelector("[data-bay-copy]");
    const metric = document.querySelector("[data-bay-metric]");
    title.textContent = content.title;
    copy.textContent = content.copy;
    metric.textContent = content.metric;

    if (changed && !reduceMotion.matches && window.gsap) {
      gsap.fromTo(".bay-readout", { y: 8, opacity: 0.7 }, { y: 0, opacity: 1, duration: 0.28, ease: "power2.out" });
      const activeLine = document.querySelector(".bay-line.is-active");
      if (activeLine) {
        const length = activeLine.getTotalLength();
        gsap.fromTo(
          activeLine,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" }
        );
      }
    }
  }

  function setLoopStep(key) {
    const content = loopContent[key];
    if (!content) return;
    if (activeLoopStep === key) return;
    activeLoopStep = key;

    document.querySelectorAll(".loop-node").forEach((node) => {
      node.classList.toggle("is-active", node.dataset.loop === key);
      node.setAttribute("aria-pressed", node.dataset.loop === key ? "true" : "false");
    });

    document.querySelector("[data-loop-title]").textContent = content.title;
    document.querySelector("[data-loop-copy]").textContent = content.copy;
    document.querySelector("[data-loop-metric]").textContent = content.metric;
    document.querySelector("[data-loop-output]").textContent = content.output;

    if (!reduceMotion.matches && window.gsap) {
      gsap.fromTo(".loop-copy", { opacity: 0.84 }, { opacity: 1, duration: 0.22, ease: "power2.out" });
    }
  }

  document.querySelectorAll(".module-card").forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("is-active") ? "true" : "false");
    button.addEventListener("click", () => setBayModule(button.dataset.module));
    button.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: hover)").matches) setBayModule(button.dataset.module);
    });
  });

  document.querySelectorAll(".loop-node").forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("is-active") ? "true" : "false");
    button.addEventListener("click", () => setLoopStep(button.dataset.loop));
  });

  const form = document.querySelector(".contact-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = form.querySelector(".form-note");
    note.textContent = "Briefing request staged. A Textron systems contact would route this intake by sector.";
    form.setAttribute("aria-busy", "true");
    window.setTimeout(() => form.removeAttribute("aria-busy"), 350);
  });

  function initMotion() {
    if (reduceMotion.matches || !window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      const lenis = new Lenis({
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.78
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 761px)", () => {
      gsap.from(".hero-copy > *", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power3.out"
      });

      gsap.from(".certification-bay", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      gsap.utils.toArray(".phase-card, .capability-card, .briefing-grid a").forEach((element) => {
        gsap.from(element, {
          y: 24,
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
            once: true
          }
        });
      });

      const loopKeys = Object.keys(loopContent);
      ScrollTrigger.create({
        trigger: ".loop-panel",
        start: "top 18%",
        end: "+=1500",
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => {
          const index = Math.min(loopKeys.length - 1, Math.floor(self.progress * loopKeys.length));
          setLoopStep(loopKeys[index]);
        }
      });
    });
  }

  window.addEventListener("load", initMotion, { once: true });
})();
