(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button");
  const mobileNav = document.getElementById("mobile-nav");
  const searchForm = document.querySelector(".search");
  const cartCounts = document.querySelectorAll("[data-cart-count]");
  const addSelectors = ["[data-add-item]", "[data-add-shortlist]"].join(",");
  let cartCount = 0;

  const specContent = {
    display: {
      label: "DISPLAY PROOF",
      title: "OLED clarity for contrast-critical work.",
      text:
        "The 14 inch OLED panel supports deep blacks, HDR playback, and P3 color coverage, so Chewa flags it for editing, presentations, and premium media review."
    },
    ports: {
      label: "PORT MAP",
      title: "Thunderbolt, HDMI, SD, and power clarity before checkout.",
      text:
        "Chewa shows which desk setups need a hub, which displays can connect directly, and whether USB-C Power Delivery can remove a second charger from your bag."
    },
    delivery: {
      label: "FULFILLMENT WINDOW",
      title: "Pickup and delivery dates are resolved before payment.",
      text:
        "For ZIP 94107, AeroBook Pro 14 is available for pickup today or Tue, Aug 18 delivery. Store transfer and signature requirements are listed in the cart."
    },
    protection: {
      label: "PROTECTION TERMS",
      title: "Accidental coverage is shown as a real term sheet.",
      text:
        "Eligible plans include two-year accidental damage handling, battery service review, repair routing, replacement options, and store credit paths."
    }
  };

  const recommendations = {
    laptops: {
      title: "Laptop systems ready to compare",
      items: ["AeroBook Pro 14 / 32GB / OLED / $1,449", "TransitBook Air / 18h / LTE / $1,199", "RiftStation 16 / 240Hz / RTX-class / $1,899"]
    },
    phones: {
      title: "Phone upgrades with carrier proof",
      items: ["Pixel-class Pro / 5x zoom / unlocked / $899", "Fold slate / multitask display / $1,299", "Mini flagship / 256GB / $749"]
    },
    tablets: {
      title: "Tablet picks by input and display",
      items: ["CanvasTab 12 / P3 / stylus-ready / $799", "FieldTab Mini / LTE / rugged cover / $549", "ReadTab Air / keyboard bundle / $629"]
    },
    monitors: {
      title: "Desk displays with power clarity",
      items: ["StudioView 5K Dock / 96W PD / $799", "PulsePanel 27 / 240Hz / $429", "ColorView 32 / HDR1000 / $999"]
    },
    audio: {
      title: "Audio picks by fit and codec",
      items: ["QuietBand Pro / ANC / 40h / $299", "StudioPods Max / lossless wired / $449", "CallBuds Mini / multipoint / $149"]
    },
    gaming: {
      title: "Gaming hardware with latency notes",
      items: ["RiftStation 16 / 240Hz / $1,899", "ZeroLag Keys / Hall-effect / $179", "PulsePanel 27 / 1ms / $429"]
    },
    storage: {
      title: "Storage matched to speed and endurance",
      items: ["VaultDrive 2TB / NVMe / $189", "CreatorCard 512GB / V90 / $149", "BackupDock Duo / RAID-ready / $279"]
    },
    smart: {
      title: "Smart-home gear with privacy proof",
      items: ["HomeHub Matter / Thread bridge / $129", "DoorCam Pro / local storage / $199", "RoomSensor Pack / privacy mode / $89"]
    },
    networking: {
      title: "Network kits by rooms and backhaul",
      items: ["MeshCore Wi-Fi 7 Kit / six rooms / $349", "Backhaul Node / 2.5GbE / $149", "SecureRouter Pro / Wi-Fi 7 / $249"]
    },
    cameras: {
      title: "Camera picks with storage warnings",
      items: ["FocusCam Mini / privacy shutter / $159", "CreatorCam 4K120 / $1,099", "SecureCam Local / no cloud required / $229"]
    }
  };

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 6);
  }

  function setHeaderHeight() {
    if (!header) return;
    const height = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-h", `${height}px`);
  }

  function updateCart() {
    cartCounts.forEach((count) => {
      count.textContent = String(cartCount);
    });
    document.querySelectorAll(".cart-chip").forEach((chip) => {
      chip.setAttribute("aria-label", `Shortlist contains ${cartCount} items`);
    });
  }

  function renderRecommendations(category) {
    const panelTitle = document.querySelector("[data-rec-title]");
    const list = document.querySelector("[data-rec-list]");
    const data = recommendations[category] || recommendations.laptops;
    if (!panelTitle || !list) return;

    panelTitle.textContent = data.title;
    list.innerHTML = "";
    data.items.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "recommend-row";
      row.innerHTML = `<span>0${index + 1}</span><strong>${item}</strong><button type="button" data-add-item>Add</button>`;
      list.appendChild(row);
    });
  }

  setHeaderState();
  setHeaderHeight();
  renderRecommendations("laptops");

  window.addEventListener("scroll", setHeaderState, { passive: true });
  window.addEventListener("resize", setHeaderHeight, { passive: true });

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      if (mobileNav && !mobileNav.hidden) {
        mobileNav.hidden = true;
        menuButton?.setAttribute("aria-expanded", "false");
      }
      target.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      document.getElementById("categories")?.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start"
      });
    });
  }

  document.querySelectorAll(".spec-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-spec");
      const content = key ? specContent[key] : null;
      const panel = document.querySelector("[data-spec-panel]");
      if (!content || !panel) return;

      document.querySelectorAll(".spec-tab").forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });

      panel.innerHTML = `<span class="mono">${content.label}</span><h3>${content.title}</h3><p>${content.text}</p>`;
      panel.classList.remove("is-swapping");
      void panel.offsetWidth;
      panel.classList.add("is-swapping");
    });
  });

  document.querySelectorAll(".category-card").forEach((card) => {
    card.setAttribute("aria-pressed", String(card.classList.contains("is-active")));
    card.addEventListener("click", () => {
      document.querySelectorAll(".category-card").forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      card.classList.add("is-active");
      card.setAttribute("aria-pressed", "true");
      renderRecommendations(card.getAttribute("data-category") || "laptops");
    });
  });

  const compareToggle = document.querySelector("[data-compare-toggle]");
  if (compareToggle) {
    const matrix = document.querySelector(".comparison-matrix");
    const mobileCards = document.querySelector(".mobile-compare-cards");
    const sync = () => {
      matrix?.classList.toggle("highlight-differences", compareToggle.checked);
      mobileCards?.classList.toggle("highlight-differences", compareToggle.checked);
    };
    compareToggle.addEventListener("change", sync);
    sync();
  }

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest(addSelectors);
    if (!addButton) return;
    cartCount += 1;
    updateCart();
    const previousText = addButton.textContent;
    addButton.textContent = "Added";
    addButton.classList.add("is-added");
    window.setTimeout(() => {
      addButton.textContent = previousText || "Add";
      addButton.classList.remove("is-added");
    }, 1100);
  });
})();
