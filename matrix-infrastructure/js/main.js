/* Boot: WebGL graph, scroll choreography, reveals, CSF ring, form.
   Content is visible without JS; everything here only adds motion. */

import { createGraph } from './graph.js';

const doc = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsapOK = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
if (gsapOK) window.gsap.registerPlugin(window.ScrollTrigger);

/* ---------- webgl detection + graph boot ---------- */
function webglAvailable() {
  try {
    const cv = document.createElement('canvas');
    return !!(cv.getContext('webgl2') || cv.getContext('webgl'));
  } catch { return false; }
}

let graph = null;
const canvas = document.getElementById('graph');
const labelsRoot = document.querySelector('.graph-labels');
if (webglAvailable()) {
  graph = createGraph(canvas, labelsRoot, { reducedMotion });
}
if (!graph) doc.classList.add('no-webgl');

/* ---------- header state ---------- */
const head = document.querySelector('.site-head');
const onScroll = () => head.classList.toggle('is-scrolled', window.scrollY > 32);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- render gate: only run the scene near hero / walkthrough ---------- */
if (graph) {
  const zones = [document.querySelector('.hero'), document.querySelector('.walk')].filter(Boolean);
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    graph.setActive(visible.size > 0 && !document.hidden);
  }, { rootMargin: '10% 0px' });
  zones.forEach((z) => io.observe(z));
  document.addEventListener('visibilitychange', () => {
    graph.setActive(visible.size > 0 && !document.hidden);
  });
}

/* ---------- camera choreography across the walkthrough ---------- */
const steps = Array.from(document.querySelectorAll('.step'));

if (graph && gsapOK && !reducedMotion && steps.length) {
  const gsap = window.gsap;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.walk__steps',
      start: 'top 90%',
      end: 'bottom bottom',
      scrub: 0.9,
    },
  });
  const spacer = {};
  steps.forEach((_, i) => {
    tl.to(graph.rig, { ...graph.poseForCluster(i), duration: 1 });
    if (i < steps.length - 1) tl.to(spacer, { duration: 0.35 }); // hold on the cluster
  });

  // return to the hero pose when scrolling back above the walkthrough
  window.ScrollTrigger.create({
    trigger: '.walk__steps',
    start: 'top 90%',
    onLeaveBack: () => gsap.to(graph.rig, { ...graph.heroPose, duration: 0.8, ease: 'power2.out' }),
  });
}

/* focus follows the step actually in view (works with or without gsap) */
if (graph && steps.length) {
  const stepIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        graph.focus(Number(e.target.dataset.cluster));
        graph.poke();
      }
    });
  }, { rootMargin: '-42% 0px -42% 0px' });
  steps.forEach((s) => stepIO.observe(s));

  const walkExit = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (!e.isIntersecting) { graph.focus(-1); graph.poke(); } });
  }, { rootMargin: '-5% 0px' });
  walkExit.observe(document.querySelector('.walk__steps'));
}

/* ---------- reveals (JS-owned: nothing is hidden unless we animate it) ---------- */
if (gsapOK && !reducedMotion) {
  const gsap = window.gsap;
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.set(el, { y: 26, opacity: 0 });
    gsap.to(el, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // hero entrance
  gsap.from('.hero__inner > *', { y: 30, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.09, delay: 0.15 });
  gsap.from('.hero__stats .stat', { y: 18, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.7 });

  // stat count-up
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.8, ease: 'power2.out', delay: 0.75,
      onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('en-US'); },
    });
  });

  // operating-model rail draw
  const rail = document.querySelector('.rail__path');
  if (rail) {
    const len = rail.getTotalLength();
    gsap.set(rail, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(rail, {
      strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut',
      scrollTrigger: { trigger: '.rail', start: 'top 82%', once: true },
    });
  }
}

/* ---------- CSF ring ---------- */
(function buildRing() {
  const segsRoot = document.querySelector('.ring__segs');
  const labelsRootSvg = document.querySelector('.ring__labels');
  if (!segsRoot) return;

  const FNS = ['Govern', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover'];
  const COLORS = ['#45f0a1', '#40d8cc', '#a8e85c', '#7cc8e8', '#e8c268', '#8ff0b8'];
  const CX = 240, CY = 240, R = 186, GAP = 9, SPAN = 60 - GAP;
  const legend = Array.from(document.querySelectorAll('.security__legend li'));
  const NS = 'http://www.w3.org/2000/svg';

  const polar = (deg, r = R) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
  };

  const segs = FNS.map((name, i) => {
    const a0 = i * 60 + GAP / 2, a1 = a0 + SPAN;
    const [x0, y0] = polar(a0), [x1, y1] = polar(a1);
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`);
    path.setAttribute('stroke', COLORS[i]);
    path.classList.add('ring__seg');
    segsRoot.appendChild(path);

    const [lx, ly] = polar(a0 + SPAN / 2, R + 34);
    const label = document.createElementNS(NS, 'text');
    label.setAttribute('x', lx); label.setAttribute('y', ly);
    label.setAttribute('text-anchor', 'middle');
    label.classList.add('ring__label');
    label.textContent = name;
    labelsRootSvg.appendChild(label);
    return { path, label };
  });

  function setHot(i) {
    segs.forEach((s, k) => {
      s.path.classList.toggle('is-hot', k === i);
      s.path.classList.toggle('is-dim', i !== -1 && k !== i);
      s.label.classList.toggle('is-hot', k === i);
    });
    legend.forEach((li, k) => li.classList.toggle('is-hot', k === i));
  }
  legend.forEach((li, i) => {
    li.addEventListener('pointerenter', () => setHot(i));
    li.addEventListener('pointerleave', () => setHot(-1));
  });
  segs.forEach((s, i) => {
    s.path.addEventListener('pointerenter', () => setHot(i));
    s.path.addEventListener('pointerleave', () => setHot(-1));
  });

  if (gsapOK && !reducedMotion) {
    const gsap = window.gsap;
    segs.forEach((s, i) => {
      const len = s.path.getTotalLength();
      gsap.set(s.path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(s.path, {
        strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', delay: i * 0.12,
        scrollTrigger: { trigger: '.ring', start: 'top 80%', once: true },
      });
    });
  }
})();

/* ---------- briefing form ---------- */
(function form() {
  const form = document.querySelector('.briefing__form');
  if (!form) return;
  const status = form.querySelector('.briefing__status');
  const name = form.querySelector('#f-name');
  const email = form.querySelector('#f-email');

  function typeOut(text) {
    status.textContent = '';
    let i = 0;
    const tick = () => {
      status.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, reducedMotion ? 0 : 18);
    };
    tick();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const okName = name.value.trim().length > 1;
    const okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    name.setAttribute('aria-invalid', String(!okName));
    email.setAttribute('aria-invalid', String(!okMail));
    if (!okName || !okMail) {
      status.classList.add('is-error');
      typeOut('signal incomplete — operator and a valid address are required.');
      return;
    }
    status.classList.remove('is-error');
    form.querySelectorAll('input, button').forEach((el) => (el.disabled = true));
    typeOut(`briefing request logged for ${name.value.trim()} — expect signal within 48 hours.`);
  });
})();

/* ---------- footer year ---------- */
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
