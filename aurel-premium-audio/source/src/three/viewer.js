import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildHeadphone } from './headphone.js';

// The product viewer: hold + drag rotates the Reference a full 360° (yaw
// unlimited, pitch clamped), with inertia on release and a slow idle spin.
// Nothing captures the page: no wheel handling, and `touch-action: pan-y`
// on the canvas keeps vertical swipes scrolling the document.
export function createViewer(canvas, { onFirstDrag } = {}) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.set(0, 0.5, 8.2);
  camera.lookAt(0, 0.15, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const keyLight = new THREE.DirectionalLight(0xfff2dc, 2.6);
  keyLight.position.set(4, 6, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 20;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xdcecff, 0.9);
  fillLight.position.set(-5, 2.5, 3);
  scene.add(fillLight);

  const rimLight = new THREE.SpotLight(0xc49b5e, 220, 18, Math.PI / 5, 0.5, 2);
  rimLight.position.set(-3.4, 4.2, -4);
  scene.add(rimLight);

  const rig = new THREE.Group(); // yaw/pitch rotate this, model hangs inside
  scene.add(rig);
  const headphone = buildHeadphone();
  headphone.group.position.y = -0.72;
  rig.add(headphone.group);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(3.4, 96),
    new THREE.ShadowMaterial({ color: 0x171513, opacity: 0.22 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.98;
  floor.receiveShadow = true;
  scene.add(floor);

  // ---- interaction state ----
  let yaw = -0.55, pitch = 0.06;         // rendered orientation
  let targetYaw = yaw, targetPitch = pitch;
  let dragging = false;
  let lastX = 0, lastY = 0;
  let velYaw = 0;
  let lastInteraction = 0;
  let firstDragSeen = false;
  let inView = true, pageVisible = !document.hidden;
  let dirty = true;

  const PITCH_MIN = -0.55, PITCH_MAX = 0.45;

  function onPointerDown(e) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    velYaw = 0;
    lastInteraction = performance.now();
    canvas.setPointerCapture?.(e.pointerId);
    canvas.classList.add('grabbing');
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    targetYaw += dx * 0.011;
    targetPitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, targetPitch + dy * 0.006));
    velYaw = dx * 0.011;
    lastInteraction = performance.now();
    dirty = true;
    if (!firstDragSeen && Math.abs(dx) > 6) {
      firstDragSeen = true;
      onFirstDrag?.();
    }
  }

  function onPointerUp(e) {
    dragging = false;
    lastInteraction = performance.now();
    canvas.classList.remove('grabbing');
    canvas.releasePointerCapture?.(e.pointerId);
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  // Keyboard: the viewer is focusable; arrows rotate in steps.
  function onKeyDown(e) {
    const step = e.key === 'ArrowLeft' ? 0.35 : e.key === 'ArrowRight' ? -0.35 : 0;
    if (!step) return;
    targetYaw += step;
    lastInteraction = performance.now();
    dirty = true;
    e.preventDefault();
  }
  canvas.addEventListener('keydown', onKeyDown);

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) dirty = true;
  });
  observer.observe(canvas);
  const onVisibility = () => { pageVisible = !document.hidden; if (pageVisible) dirty = true; };
  document.addEventListener('visibilitychange', onVisibility);

  // ---- finish transitions (lerped colors) ----
  const lerpJobs = [];
  function setFinish(colors, instant = false) {
    canvas.dataset.finish = colors.shell.toString(16);
    const targets = [
      [headphone.materials.shell, colors.shell],
      [headphone.materials.rail, colors.rail],
      [headphone.materials.accent, colors.accent],
      [headphone.materials.leather, colors.leather],
      [headphone.materials.pad, colors.pad],
    ];
    if (instant || reducedMotion) {
      headphone.setFinish(colors);
      dirty = true;
      return;
    }
    const start = performance.now();
    for (const [mat, hex] of targets) {
      lerpJobs.push({ mat, from: mat.color.clone(), to: new THREE.Color(hex), start });
    }
    dirty = true;
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = Math.max(280, Math.floor(rect.width));
    const h = Math.max(280, Math.floor(rect.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dirty = true;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  let rafId = 0;
  let prev = performance.now();

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    if (!inView || !pageVisible) return;

    let animating = false;

    // inertia after release
    if (!dragging && Math.abs(velYaw) > 0.0004) {
      targetYaw += velYaw;
      velYaw *= 0.94;
      animating = true;
    }

    // idle auto-spin: gentle, only after 3.5s without interaction
    if (!reducedMotion && !dragging && now - lastInteraction > 3500) {
      targetYaw += 0.12 * dt;
      animating = true;
    }

    // finish color lerps
    for (let i = lerpJobs.length - 1; i >= 0; i -= 1) {
      const job = lerpJobs[i];
      const t = Math.min(1, (now - job.start) / 420);
      job.mat.color.lerpColors(job.from, job.to, t * t * (3 - 2 * t));
      if (t >= 1) lerpJobs.splice(i, 1);
      animating = true;
    }

    const prevYaw = yaw, prevPitch = pitch;
    yaw += (targetYaw - yaw) * 0.14;
    pitch += (targetPitch - pitch) * 0.14;
    if (Math.abs(yaw - prevYaw) > 0.00005 || Math.abs(pitch - prevPitch) > 0.00005) animating = true;

    rig.rotation.y = yaw;
    rig.rotation.x = pitch;

    if (animating || dirty) {
      renderer.render(scene, camera);
      canvas.dataset.yaw = yaw.toFixed(3);
      dirty = false;
    }
  }
  rafId = requestAnimationFrame(frame);

  return {
    setFinish,
    getYaw: () => rig.rotation.y,
    dispose() {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      pmrem.dispose();
    },
  };
}
