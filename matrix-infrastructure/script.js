/* =========================================================
   MATRIX — interaction layer
   Precise, system-like motion. Reduced-motion aware.
   ========================================================= */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const svgNS = 'http://www.w3.org/2000/svg';

  /* ---------- year ---------- */
  const y = $('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- hero lattice: route lengths + draw + pulses ---------- */
  const routesG = $('.routes');
  if (routesG) {
    const routes = $$('.route', routesG);
    routes.forEach((r, i) => {
      const len = r.getTotalLength();
      r.style.setProperty('--len', len.toFixed(1));
      r.style.setProperty('--d', (0.15 + i * 0.13) + 's');
    });
    // trigger draw once in view
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { routesG.classList.add('drawn'); io.disconnect(); } });
    }, { threshold: 0.2 });
    io.observe(routesG);

    // signal pulses travelling the primary (non-ring) routes
    if (!reduce) {
      const pulsesG = $('.pulses');
      const primary = routes.filter((r) => !r.classList.contains('route--ring'));
      const pulses = primary.map((path, i) => {
        const c = document.createElementNS(svgNS, 'circle');
        c.setAttribute('r', '3.2');
        c.setAttribute('class', 'pulse-dot');
        c.setAttribute('fill', i % 2 ? '#38F2D7' : '#B7FF3C');
        pulsesG.appendChild(c);
        return { path, node: c, len: path.getTotalLength(), t: Math.random(), spd: 0.0016 + Math.random() * 0.0016 };
      });
      let raf;
      const tick = () => {
        for (const p of pulses) {
          p.t += p.spd;
          if (p.t > 1) p.t -= 1;
          const pt = p.path.getPointAtLength(p.t * p.len);
          p.node.setAttribute('cx', pt.x);
          p.node.setAttribute('cy', pt.y);
          p.node.setAttribute('opacity', (0.4 + 0.6 * Math.sin(p.t * Math.PI)).toFixed(2));
        }
        raf = requestAnimationFrame(tick);
      };
      // pause when tab hidden
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(tick);
      });
      raf = requestAnimationFrame(tick);
    }
  }

  /* ---------- core readout tickers ---------- */
  const tickers = {
    load:   { el: $('[data-ticker="load"]'),   base: 0.62, jit: 0.06, fmt: (v) => v.toFixed(2) },
    routes: { el: $('[data-ticker="routes"]'), base: 10,   jit: 0,    fmt: () => '10' },
    drift:  { el: $('[data-ticker="drift"]'),  states: ['low', 'low', 'low', 'nominal'], fmt: null }
  };
  if (!reduce) {
    setInterval(() => {
      const l = tickers.load;
      if (l.el) l.el.textContent = l.fmt(Math.max(0.4, Math.min(0.88, l.base + (Math.random() - 0.5) * l.jit)));
      const d = tickers.drift;
      if (d.el) d.el.textContent = d.states[Math.floor(Math.random() * d.states.length)];
    }, 2600);
  }

  /* ---------- reveal on scroll (shards, proof reads, bands) ---------- */
  const revealTargets = $$('.shard, .pread, .band');
  if (revealTargets.length) {
    if (reduce) {
      revealTargets.forEach((el) => el.classList.add('in'));
    } else {
      const rio = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
      }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
      revealTargets.forEach((el) => rio.observe(el));
    }
  }

  /* ---------- flow connector markers ---------- */
  const markersG = $('.flow__markers');
  if (markersG) {
    for (let i = 0; i < 7; i++) {
      const c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('cx', (60 + i * 175).toString());
      c.setAttribute('cy', '30');
      c.setAttribute('r', '3');
      c.setAttribute('opacity', '0.8');
      markersG.appendChild(c);
    }
  }

  /* ---------- SECURITY radial wheel ---------- */
  const segG = $('.wheel__seg');
  if (segG) {
    const svg = $('.wheel__svg');
    const cx = 240, cy = 240, r = 175, gap = 4;
    const fns = [
      { id: 'govern',   label: 'GOVERN',   color: '#B7FF3C' },
      { id: 'identify', label: 'IDENTIFY', color: '#00FF7A' },
      { id: 'protect',  label: 'PROTECT',  color: '#00FF7A' },
      { id: 'detect',   label: 'DETECT',   color: '#38F2D7' },
      { id: 'respond',  label: 'RESPOND',  color: '#F6B743' },
      { id: 'recover',  label: 'RECOVER',  color: '#00FF7A' }
    ];
    const seg = 360 / fns.length;
    const polar = (deg, rad = r) => {
      const a = (deg - 90) * Math.PI / 180;
      return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
    };
    const arc = (a0, a1, rad = r) => {
      const [x0, y0] = polar(a0, rad), [x1, y1] = polar(a1, rad);
      const large = a1 - a0 > 180 ? 1 : 0;
      return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${rad} ${rad} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    };
    const legend = $$('.security__legend li');
    const setActive = (id) => {
      $$('path', segG).forEach((p) => p.classList.toggle('active', p.dataset.fn === id));
      legend.forEach((li) => li.classList.toggle('active', li.dataset.fn === id));
    };

    fns.forEach((fn, i) => {
      const a0 = i * seg + gap / 2;
      const a1 = (i + 1) * seg - gap / 2;
      const p = document.createElementNS(svgNS, 'path');
      p.setAttribute('d', arc(a0, a1));
      p.setAttribute('stroke', fn.color);
      p.setAttribute('opacity', '0.55');
      p.dataset.fn = fn.id;
      p.setAttribute('tabindex', '0');
      p.setAttribute('role', 'button');
      p.setAttribute('aria-label', fn.label + ' function');
      // draw-in
      if (!reduce) {
        const L = 2 * Math.PI * r * (seg - gap) / 360;
        p.style.strokeDasharray = L;
        p.style.strokeDashoffset = L;
        p.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(0.22,0.61,0.36,1) ' + (i * 0.12 + 0.2) + 's, stroke-width .3s, opacity .3s';
      }
      segG.appendChild(p);

      // label
      const [lx, ly] = polar(a0 + seg / 2 - gap / 2, r);
      const t = document.createElementNS(svgNS, 'text');
      t.setAttribute('x', lx.toFixed(1));
      t.setAttribute('y', (ly + 4).toFixed(1));
      t.setAttribute('text-anchor', lx < cx - 10 ? 'end' : lx > cx + 10 ? 'start' : 'middle');
      t.setAttribute('class', 'wheel__seglabel');
      t.textContent = fn.label;
      segG.parentNode.insertBefore(t, segG.nextSibling);

      const on = () => setActive(fn.id);
      p.addEventListener('mouseenter', on);
      p.addEventListener('focus', on);
      p.addEventListener('click', on);
    });

    // draw when in view
    const wio = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          $$('path', segG).forEach((p) => { p.style.strokeDashoffset = '0'; });
          wio.disconnect();
        }
      });
    }, { threshold: 0.3 });
    wio.observe(svg);

    // legend hover drives wheel
    legend.forEach((li) => {
      const h = () => setActive(li.dataset.fn);
      li.addEventListener('mouseenter', h);
      li.addEventListener('focus', h);
      li.setAttribute('tabindex', '0');
    });

    // gentle auto-cycle when idle
    if (!reduce) {
      let idx = 0, hovered = false;
      segG.addEventListener('mouseenter', () => { hovered = true; });
      segG.addEventListener('mouseleave', () => { hovered = false; });
      $('.security__legend')?.addEventListener('mouseenter', () => { hovered = true; });
      $('.security__legend')?.addEventListener('mouseleave', () => { hovered = false; });
      setInterval(() => {
        if (hovered || document.hidden) return;
        setActive(fns[idx % fns.length].id);
        idx++;
      }, 2200);
    } else {
      setActive('govern');
    }
  }

  /* ---------- terminal typing line ---------- */
  const typed = $('.typed');
  if (typed) {
    const full = typed.dataset.type || '';
    if (reduce) {
      typed.textContent = full;
    } else {
      let i = 0;
      const type = () => {
        typed.textContent = full.slice(0, i);
        if (i <= full.length) { i++; setTimeout(type, 55 + Math.random() * 40); }
      };
      // start when terminal in view
      const tio = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { type(); tio.disconnect(); } });
      }, { threshold: 0.4 });
      tio.observe($('.terminal'));
    }
  }

  /* ---------- terminal form (client-side only) ---------- */
  const form = $('.terminal__form');
  if (form) {
    const status = $('.terminal__status', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#f-name', form).value.trim();
      const email = $('#f-email', form).value.trim();
      const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !okEmail) {
        status.textContent = okEmail ? '> operator name required' : '> valid signal address required';
        status.classList.add('err');
        return;
      }
      status.classList.remove('err');
      const seq = [
        '> handshake ok — ' + name,
        '> mapping operating layer…',
        '> dependency risk queued',
        '> briefing request logged. matrix will respond on this channel.'
      ];
      let i = 0;
      status.textContent = seq[0];
      form.querySelector('button').disabled = true;
      if (reduce) { status.textContent = seq[seq.length - 1]; form.reset(); return; }
      const run = () => {
        status.textContent = seq[i];
        if (++i < seq.length) setTimeout(run, 620);
        else form.reset();
      };
      run();
    });
  }
})();
