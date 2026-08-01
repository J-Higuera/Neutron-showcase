(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const modeData = {
    integrate: {
      title: "Connector rail",
      status: "7 routes active",
      chips: ["api.gateway", "crm.sync", "agent.task", "queue.ingress"],
      labels: ["policy verified", "queue depth 37", "trace returned"],
      visual: "integrate",
    },
    orchestrate: {
      title: "Workflow timeline",
      status: "retry budget clean",
      chips: ["start", "policy check", "durable task", "deploy gate"],
      labels: ["deploy gate armed", "rollback ready", "SLO 99.95"],
      visual: "orchestrate",
    },
    secure: {
      title: "Checkpoint lane",
      status: "tenant isolated",
      chips: ["identity bound", "policy verified", "audit sealed", "drift detected"],
      labels: ["identity bound", "tenant isolated", "audit sealed"],
      visual: "secure",
    },
  };

  function setMode(mode, animate) {
    const data = modeData[mode] || modeData.integrate;
    const tabs = document.querySelectorAll(".mode-tab");
    const panels = document.querySelectorAll(".mode-panel");
    const mini = document.querySelector("[data-mini-interface]");
    const title = document.querySelector("[data-mini-title]");
    const status = document.querySelector("[data-mini-status]");
    const visual = document.querySelector("[data-mini-visual]");
    const stateLabel = document.querySelector("[data-state-label]");

    tabs.forEach((tab) => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.dataset.panel === mode;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });

    if (title) title.textContent = data.title;
    if (status) status.textContent = data.status;
    if (stateLabel) stateLabel.textContent = data.labels[0];

    if (visual) {
      visual.dataset.miniVisual = data.visual;
      visual.querySelectorAll(".mini-chip").forEach((chip, index) => {
        chip.textContent = data.chips[index] || "";
      });
    }

    if (mini) {
      mini.classList.toggle("is-secure", mode === "secure");
      mini.classList.toggle("is-orchestrate", mode === "orchestrate");
    }

    if (animate && window.gsap && !reduceMotion.matches) {
      gsap.fromTo(
        ".mode-panel.is-active",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" }
      );
      gsap.fromTo(
        ".mini-chip",
        { autoAlpha: 0, x: -10 },
        { autoAlpha: 1, x: 0, stagger: 0.045, duration: 0.32, ease: "power3.out" }
      );
      gsap.to(".feed-integrate", { autoAlpha: mode === "integrate" ? 0.24 : 0.08, duration: 0.28 });
      gsap.to(".feed-secure", { autoAlpha: mode === "secure" ? 0.28 : 0, duration: 0.28 });
    }
  }

  function initTabs() {
    document.querySelectorAll(".mode-tab").forEach((tab) => {
      tab.addEventListener("click", () => setMode(tab.dataset.mode, true));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        const tabs = Array.from(document.querySelectorAll(".mode-tab"));
        const index = tabs.indexOf(tab);
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        event.preventDefault();
        tabs[nextIndex].focus();
        setMode(tabs[nextIndex].dataset.mode, true);
      });
    });
  }

  function initForm() {
    const form = document.querySelector(".intake-form");
    const note = document.querySelector("[data-form-note]");
    if (!form || !note) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      note.textContent = "Stack received. A Nexus fabric map response is queued.";
      note.classList.add("is-sent");
      form.setAttribute("aria-busy", "false");
    });
  }

  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion.matches) {
      document.documentElement.classList.add("reduced-motion");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 0.78,
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    gsap.set(".route-line", { strokeDashoffset: 460 });
    gsap.to(".route-line", {
      strokeDashoffset: -120,
      duration: 3.8,
      ease: "none",
      repeat: -1,
      stagger: 0.18,
    });

    gsap.to(".gate, .node-core, .telemetry-b", {
      opacity: 0.62,
      duration: 1.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.15,
    });

    gsap.from(".hero-copy > *", {
      y: 20,
      autoAlpha: 0,
      duration: 0.68,
      ease: "power3.out",
      stagger: 0.08,
    });

    gsap.from(".fabric-stage", {
      y: 22,
      autoAlpha: 0,
      duration: 0.78,
      delay: 0.12,
      ease: "power3.out",
    });

    const states = [
      { trigger: "#model", label: "policy verified", route: ".route-policy", gate: ".gate-policy" },
      { trigger: "#modes", label: "queue depth 37", route: ".route-ingress", gate: ".gate-identity" },
      { trigger: "#capabilities", label: "trace returned", route: ".route-trace", gate: ".gate-policy" },
      { trigger: "#proof", label: "deploy gate armed", route: ".route-deploy", gate: ".gate-deploy" },
      { trigger: "#pricing", label: "rollback ready", route: ".route-workload", gate: ".gate-deploy" },
    ];

    states.forEach((state) => {
      ScrollTrigger.create({
        trigger: state.trigger,
        start: "top 62%",
        end: "bottom 42%",
        onEnter: () => setFabricState(state),
        onEnterBack: () => setFabricState(state),
      });
    });

    gsap.utils.toArray(".flow-step, .capability, .tier, .proof-callouts p").forEach((item, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 86%",
          once: true,
        },
        autoAlpha: 0,
        y: 18,
        duration: 0.48,
        delay: Math.min(index % 4, 3) * 0.035,
        ease: "power3.out",
      });
    });
  }

  function setFabricState(state) {
    const stateLabel = document.querySelector("[data-state-label]");
    if (stateLabel) stateLabel.textContent = state.label;

    if (!window.gsap || reduceMotion.matches) return;

    gsap.to(".route-line", { opacity: 0.34, duration: 0.22, overwrite: "auto" });
    gsap.to(state.route, { opacity: 1, duration: 0.22, overwrite: "auto" });
    gsap.fromTo(state.gate, { opacity: 1 }, { opacity: 0.46, duration: 0.55, repeat: 1, yoyo: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initForm();
    setMode("integrate", false);
    initMotion();
  });
})();
