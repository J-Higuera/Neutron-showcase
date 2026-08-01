import * as THREE from "three";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const smallScreen = window.matchMedia("(max-width: 50rem)");

function initConfluenceCanvas() {
  const canvas = document.querySelector("#confluence-canvas");
  const stage = document.querySelector(".hero-stage");

  if (!canvas || !stage) return;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uMotion: { value: prefersReducedMotion.matches ? 0 : 1 }
  };

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uMotion;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float river(vec2 p, float phase) {
        float x = p.x;
        float y = 0.5 + 0.13 * sin((x + phase) * 6.283) + 0.055 * sin((x - 0.18) * 13.0);
        return smoothstep(0.035, 0.0, abs(p.y - y));
      }

      void main() {
        vec2 p = vUv;
        float t = uTime * uMotion;
        float field = noise(p * 5.0 + vec2(t * 0.035, -t * 0.02));
        float warm = smoothstep(0.8, 0.15, distance(p, vec2(0.36, 0.42)));
        float cool = smoothstep(0.62, 0.05, distance(p, vec2(0.68, 0.28)));
        float r1 = river(p + vec2(0.0, 0.02 * sin(t * 0.18)), 0.04);
        float r2 = river(vec2(p.y, p.x) + vec2(0.16, -0.08), 0.2);

        vec3 deep = vec3(0.027, 0.036, 0.055);
        vec3 gold = vec3(0.969, 0.722, 0.294);
        vec3 blue = vec3(0.4, 0.851, 1.0);
        vec3 cyan = vec3(0.784, 0.957, 1.0);
        vec3 magenta = vec3(1.0, 0.31, 0.847);

        vec3 color = deep;
        color += gold * warm * (0.32 + field * 0.18);
        color += blue * cool * 0.18;
        color += cyan * (r1 + r2) * 0.45;
        color += magenta * smoothstep(0.97, 1.0, noise(p * 18.0 + t * 0.09)) * 0.16;

        float vignette = smoothstep(0.96, 0.18, distance(p, vec2(0.5)));
        gl_FragColor = vec4(color, vignette * 0.92);
      }
    `
  });

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(plane);

  let animationId = 0;
  let visible = true;
  let running = !prefersReducedMotion.matches;

  function resize() {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    uniforms.uResolution.value.set(width, height);
    renderer.render(scene, camera);
  }

  function render(time = 0) {
    uniforms.uTime.value = time * 0.001;
    renderer.render(scene, camera);
    if (running && visible) {
      animationId = requestAnimationFrame(render);
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && running && !animationId) {
      animationId = requestAnimationFrame(render);
    } else if (!visible && animationId) {
      cancelAnimationFrame(animationId);
      animationId = 0;
    }
  });

  observer.observe(stage);
  window.addEventListener("resize", resize, { passive: true });
  prefersReducedMotion.addEventListener("change", (event) => {
    running = !event.matches;
    uniforms.uMotion.value = event.matches ? 0 : 1;
    if (running && visible && !animationId) {
      animationId = requestAnimationFrame(render);
    } else if (!running && animationId) {
      cancelAnimationFrame(animationId);
      animationId = 0;
      render(0);
    }
  });

  resize();
  render(0);
}

function initMotion() {
  const gsapReady = window.gsap && window.ScrollTrigger;
  if (!gsapReady) return;

  gsap.registerPlugin(ScrollTrigger);

  if (prefersReducedMotion.matches) {
    gsap.set(".reveal", { opacity: 1, y: 0 });
    gsap.set(".river-a, .river-b, .river-glow, .cta-river", { strokeDashoffset: 0 });
    return;
  }

  gsap.set(".reveal", { willChange: "transform, opacity" });

  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTimeline
    .to(".hero-copy", { opacity: 1, y: 0, duration: 0.7 })
    .to(".hero-stage", { opacity: 1, y: 0, duration: 0.75 }, "-=0.45")
    .to(".river-a, .river-b, .river-glow", { strokeDashoffset: 0, duration: 1.25, stagger: 0.08 }, "-=0.35")
    .from(".float-card", { opacity: 0, y: 34, scale: 0.96, duration: 0.72, stagger: 0.08 }, "-=0.75");

  gsap.utils.toArray(".place .reveal, .formats .reveal, .works-head.reveal, .work-image.reveal, .process .reveal, .commission .reveal").forEach((element) => {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.72,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 82%",
        once: true
      },
      onComplete: () => gsap.set(element, { clearProps: "willChange" })
    });
  });

  gsap.utils.toArray(".format-card").forEach((element, index) => {
    gsap.from(element, {
      opacity: 0,
      y: 18,
      duration: 0.52,
      delay: index * 0.04,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".format-grid",
        start: "top 78%",
        once: true
      }
    });
  });

  gsap.utils.toArray(".work-label").forEach((label, index) => {
    gsap.from(label, {
      opacity: 0,
      x: smallScreen.matches ? 0 : 42,
      y: smallScreen.matches ? 18 : 0,
      duration: 0.58,
      delay: index * 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: label,
        start: "top 86%",
        once: true
      }
    });
  });

  gsap.from(".process-step", {
    opacity: 0,
    y: 22,
    duration: 0.55,
    stagger: 0.07,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".process-line",
      start: "top 82%",
      once: true
    }
  });

  gsap.to(".process-line", {
    "--line-scale": 1,
    scrollTrigger: {
      trigger: ".process-line",
      start: "top 80%",
      end: "bottom 65%",
      scrub: true
    }
  });

  gsap.to(".cta-river", {
    strokeDashoffset: 0,
    duration: 1,
    stagger: 0.12,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".commission",
      start: "top 76%",
      once: true
    }
  });

  gsap.from(".commission-button", {
    boxShadow: "0 0 0 rgba(102,217,255,0)",
    duration: 0.65,
    repeat: 1,
    yoyo: true,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: ".commission",
      start: "top 76%",
      once: true
    }
  });
}

function initSmoothScroll() {
  if (prefersReducedMotion.matches || !window.Lenis) return;

  const lenis = new window.Lenis({
    duration: 0.95,
    lerp: 0.09,
    wheelMultiplier: 0.85
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

document.addEventListener("DOMContentLoaded", () => {
  initConfluenceCanvas();
  initMotion();
  initSmoothScroll();
});
