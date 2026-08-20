/* The living topology — one Three.js scene shared by the hero and the
   platform walkthrough. Exposes a camera rig plain-object that GSAP can
   tween, plus focus() to light one cluster and dim the rest. */

import * as THREE from 'three';

const CLUSTERS = [
  { key: 'strategy',      label: 'Strategy',      color: 0x45f0a1, y:  4.0 },
  { key: 'data',          label: 'Data fabric',   color: 0x40d8cc, y:  1.5 },
  { key: 'security',      label: 'Security',      color: 0xa8e85c, y: -2.5 },
  { key: 'automation',    label: 'Automation',    color: 0xe8c268, y: -4.0 },
  { key: 'observability', label: 'Observability', color: 0x7cc8e8, y:  2.5 },
];

const RING_R = 20;          // cluster ring radius
const NODES_PER = 78;       // nodes per discipline cluster
const CORE_NODES = 26;
const DIM = 0.16;           // brightness of unfocused clusters
const CORE_COLOR = new THREE.Color(0x45f0a1);

function gauss(scale) {
  // sum of uniforms ≈ gaussian; cheap and deterministic enough
  return (Math.random() + Math.random() + Math.random() - 1.5) * scale;
}

export function createGraph(canvas, labelsRoot, { reducedMotion = false } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (err) {
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0f0d, 0.0125);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);

  const world = new THREE.Group();
  scene.add(world);

  /* ---------- build node positions ---------- */
  const centers = CLUSTERS.map((c, i) => {
    const a = (i / CLUSTERS.length) * Math.PI * 2 - Math.PI / 2;
    return new THREE.Vector3(Math.cos(a) * RING_R, c.y, Math.sin(a) * RING_R);
  });

  const positions = [];   // Vector3 per node
  const nodeCluster = []; // cluster index per node (-1 = core)
  const hubIndex = [];    // node index of each cluster hub

  for (let ci = 0; ci < CLUSTERS.length; ci++) {
    hubIndex.push(positions.length);
    positions.push(centers[ci].clone()); // hub sits exactly on the center
    nodeCluster.push(ci);
    for (let n = 1; n < NODES_PER; n++) {
      positions.push(new THREE.Vector3(
        centers[ci].x + gauss(6.5),
        centers[ci].y + gauss(4.2),
        centers[ci].z + gauss(6.5)
      ));
      nodeCluster.push(ci);
    }
  }
  const coreStart = positions.length;
  for (let n = 0; n < CORE_NODES; n++) {
    positions.push(new THREE.Vector3(gauss(2.6), gauss(2.2), gauss(2.6)));
    nodeCluster.push(-1);
  }

  /* ---------- instanced node spheres ---------- */
  const nodeGeo = new THREE.IcosahedronGeometry(0.22, 1);
  const nodeMat = new THREE.MeshBasicMaterial();
  const nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, positions.length);
  const m4 = new THREE.Matrix4();
  const baseColors = [];
  for (let i = 0; i < positions.length; i++) {
    const ci = nodeCluster[i];
    const isHub = hubIndex.includes(i);
    const s = ci === -1 ? 0.9 + Math.random() * 0.5 : (isHub ? 2.1 : 0.7 + Math.random() * 0.7);
    m4.makeScale(s, s, s).setPosition(positions[i]);
    nodes.setMatrixAt(i, m4);
    const c = ci === -1 ? CORE_COLOR.clone() : new THREE.Color(CLUSTERS[ci].color);
    baseColors.push(c);
    nodes.setColorAt(i, c);
  }
  nodes.instanceMatrix.needsUpdate = true;
  world.add(nodes);

  /* ---------- edges ---------- */
  const edges = []; // [a, b]
  for (let ci = 0; ci < CLUSTERS.length; ci++) {
    const s = ci * NODES_PER, e = s + NODES_PER;
    for (let i = s + 1; i < e; i++) {
      // nearest same-cluster neighbour
      let best = -1, bd = Infinity;
      for (let j = s; j < e; j++) {
        if (j === i) continue;
        const d = positions[i].distanceToSquared(positions[j]);
        if (d < bd) { bd = d; best = j; }
      }
      if (best >= 0) edges.push([i, best]);
      if (Math.random() < 0.32) edges.push([i, hubIndex[ci]]);
    }
    // hub → core node, hub → next hub
    edges.push([hubIndex[ci], coreStart + (ci % CORE_NODES)]);
    edges.push([hubIndex[ci], hubIndex[(ci + 1) % CLUSTERS.length]]);
  }
  for (let i = coreStart + 1; i < positions.length; i++) edges.push([i, coreStart]);

  const ePos = new Float32Array(edges.length * 6);
  const eCol = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], k) => {
    positions[a].toArray(ePos, k * 6);
    positions[b].toArray(ePos, k * 6 + 3);
  });
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
  edgeGeo.setAttribute('color', new THREE.BufferAttribute(eCol, 3));
  const edgeMat = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.42,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  world.add(new THREE.LineSegments(edgeGeo, edgeMat));

  /* ---------- core ornament ---------- */
  const coreMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.5, 2),
    new THREE.MeshBasicMaterial({ color: CORE_COLOR })
  );
  const coreWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.6, 1),
    new THREE.MeshBasicMaterial({ color: CORE_COLOR, wireframe: true, transparent: true, opacity: 0.28 })
  );
  const glowTex = (() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 128;
    const g = cv.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(69,240,161,0.85)');
    grad.addColorStop(0.4, 'rgba(69,240,161,0.22)');
    grad.addColorStop(1, 'rgba(69,240,161,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(cv);
  })();
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, transparent: true, opacity: 0.8,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  glow.scale.setScalar(16);
  world.add(coreMesh, coreWire, glow);

  /* ---------- pulses travelling the edges ---------- */
  const PULSES = reducedMotion ? 0 : 34;
  const pulseMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.14, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xd9ffe9, transparent: true, opacity: 0.95 }),
    Math.max(PULSES, 1)
  );
  pulseMesh.visible = PULSES > 0;
  world.add(pulseMesh);
  const pulses = Array.from({ length: PULSES }, () => ({
    edge: (Math.random() * edges.length) | 0,
    t: Math.random(),
    speed: 0.25 + Math.random() * 0.45,
  }));

  /* ---------- cluster labels (DOM, projected) ---------- */
  const labels = CLUSTERS.map((c) => {
    const el = document.createElement('span');
    el.className = 'graph-label';
    el.textContent = c.label;
    labelsRoot.appendChild(el);
    return el;
  });

  /* ---------- brightness / focus state ---------- */
  const bright = CLUSTERS.map(() => 1);
  const target = CLUSTERS.map(() => 1);
  let coreBright = 1, coreTarget = 1;
  let focused = -1;

  function focus(ci) {
    focused = ci;
    for (let i = 0; i < CLUSTERS.length; i++) target[i] = ci === -1 ? 1 : (i === ci ? 1.0 : DIM);
    coreTarget = ci === -1 ? 1 : 0.45;
    labels.forEach((el, i) => el.classList.toggle('is-active', i === ci));
    if (reducedMotion) {
      // no easing frames will run — snap to the target state
      for (let i = 0; i < CLUSTERS.length; i++) bright[i] = target[i];
      coreBright = coreTarget;
      applyColors();
    }
  }

  const tmpColor = new THREE.Color();
  function applyColors() {
    for (let i = 0; i < positions.length; i++) {
      const ci = nodeCluster[i];
      const b = ci === -1 ? coreBright : bright[ci];
      tmpColor.copy(baseColors[i]).multiplyScalar(b);
      nodes.setColorAt(i, tmpColor);
    }
    nodes.instanceColor.needsUpdate = true;
    edges.forEach(([a, b], k) => {
      const ca = nodeCluster[a], cb = nodeCluster[b];
      const ba = ca === -1 ? coreBright : bright[ca];
      const bb = cb === -1 ? coreBright : bright[cb];
      tmpColor.copy(ca === -1 ? CORE_COLOR : baseColors[a]).multiplyScalar(0.55 * ba);
      tmpColor.toArray(eCol, k * 6);
      tmpColor.copy(cb === -1 ? CORE_COLOR : baseColors[b]).multiplyScalar(0.55 * bb);
      tmpColor.toArray(eCol, k * 6 + 3);
    });
    edgeGeo.attributes.color.needsUpdate = true;
  }
  applyColors();

  /* ---------- camera rig (GSAP tweens these numbers) ---------- */
  const rig = { theta: 0.85, phi: 1.18, radius: 54, tx: -5, ty: 0, tz: 0 };

  function poseForCluster(ci) {
    const c = centers[ci];
    const theta = Math.atan2(c.z, c.x) + 0.55;
    return {
      theta,
      phi: 1.05 + (ci % 2) * 0.22,
      radius: 27,
      tx: c.x * 0.6, ty: c.y * 0.55, tz: c.z * 0.6,
    };
  }
  const heroPose = { ...rig };

  /* ---------- pointer parallax + idle drift ---------- */
  let px = 0, py = 0, dxs = 0, dys = 0, drift = 0;
  if (!reducedMotion) {
    window.addEventListener('pointermove', (e) => {
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  /* ---------- render loop ---------- */
  const clock = new THREE.Clock();
  let active = true;          // section visibility gate
  let needsStatic = true;     // reduced-motion: render once per state change
  const camTarget = new THREE.Vector3();

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', () => { resize(); needsStatic = true; });
  resize();

  const projV = new THREE.Vector3();
  function placeLabels() {
    for (let i = 0; i < labels.length; i++) {
      projV.copy(centers[i]).applyMatrix4(world.matrixWorld).project(camera);
      const behind = projV.z > 1;
      labels[i].classList.toggle('is-hidden', behind || !active);
      if (!behind) {
        labels[i].style.left = `${(projV.x * 0.5 + 0.5) * 100}%`;
        labels[i].style.top = `${(-projV.y * 0.5 + 0.5) * 100 - 3.2}%`;
      }
    }
  }

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);

    if (active) {
      // ease brightness toward targets
      let moving = false;
      for (let i = 0; i < CLUSTERS.length; i++) {
        const d = target[i] - bright[i];
        if (Math.abs(d) > 0.002) { bright[i] += d * Math.min(1, dt * 5); moving = true; }
      }
      const cd = coreTarget - coreBright;
      if (Math.abs(cd) > 0.002) { coreBright += cd * Math.min(1, dt * 5); moving = true; }
      if (moving) applyColors();

      if (!reducedMotion) {
        drift += dt * 0.028;
        dxs += (px * 0.05 - dxs) * Math.min(1, dt * 3);
        dys += (py * 0.035 - dys) * Math.min(1, dt * 3);
        coreWire.rotation.y += dt * 0.25;
        coreWire.rotation.x += dt * 0.11;
        const pulse = 1 + Math.sin(clock.elapsedTime * 1.4) * 0.06;
        coreMesh.scale.setScalar(pulse);

        pulses.forEach((p, i) => {
          p.t += dt * p.speed;
          if (p.t >= 1) { p.t = 0; p.edge = (Math.random() * edges.length) | 0; }
          const [a, b] = edges[p.edge];
          m4.makeScale(1, 1, 1).setPosition(
            positions[a].x + (positions[b].x - positions[a].x) * p.t,
            positions[a].y + (positions[b].y - positions[a].y) * p.t,
            positions[a].z + (positions[b].z - positions[a].z) * p.t
          );
          pulseMesh.setMatrixAt(i, m4);
        });
        if (PULSES) pulseMesh.instanceMatrix.needsUpdate = true;
      }

      const th = rig.theta + drift + dxs;
      const ph = Math.max(0.35, Math.min(2.6, rig.phi + dys));
      camTarget.set(rig.tx, rig.ty, rig.tz);
      camera.position.set(
        camTarget.x + rig.radius * Math.sin(ph) * Math.cos(th),
        camTarget.y + rig.radius * Math.cos(ph),
        camTarget.z + rig.radius * Math.sin(ph) * Math.sin(th)
      );
      camera.lookAt(camTarget);

      if (!reducedMotion || needsStatic) {
        renderer.render(scene, camera);
        placeLabels();
        needsStatic = false;
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return {
    rig,
    heroPose,
    poseForCluster,
    focus,
    setActive(v) {
      active = v;
      needsStatic = true;
      if (!v) labels.forEach((el) => el.classList.add('is-hidden'));
    },
    poke() { needsStatic = true; },
  };
}
