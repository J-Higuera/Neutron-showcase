import "./styles.css";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const canvas = document.querySelector("#product-canvas");
const stage = document.querySelector(".product-stage");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function canUseWebGL() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (probe.getContext("webgl2") || probe.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

if (!canUseWebGL()) {
  stage.classList.add("webgl-unavailable");
} else {

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0.18, 9.8);
camera.lookAt(0, -0.1, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const keyLight = new THREE.DirectionalLight(0xfff4df, 3.2);
keyLight.position.set(4, 6, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xd8efff, 1.15);
fillLight.position.set(-5, 3, 2);
scene.add(fillLight);

const rimLight = new THREE.SpotLight(0xc49b5e, 3.2, 12, Math.PI / 5, 0.45, 1.6);
rimLight.position.set(-3.2, 3.8, -3.6);
scene.add(rimLight);

const product = new THREE.Group();
product.rotation.set(-0.06, -0.28, 0.02);
product.position.y = 0.02;
product.scale.setScalar(0.78);
scene.add(product);

const metal = new THREE.MeshPhysicalMaterial({
  color: 0xb7aa91,
  metalness: 0.94,
  roughness: 0.28,
  clearcoat: 0.32,
  clearcoatRoughness: 0.24,
  envMapIntensity: 1.45
});

const darkMetal = new THREE.MeshPhysicalMaterial({
  color: 0x252524,
  metalness: 0.72,
  roughness: 0.34,
  envMapIntensity: 1.15
});

const copper = new THREE.MeshPhysicalMaterial({
  color: 0x9d6c45,
  metalness: 0.86,
  roughness: 0.26,
  clearcoat: 0.2,
  envMapIntensity: 1.3
});

const leather = new THREE.MeshStandardMaterial({
  color: 0x151413,
  roughness: 0.82,
  metalness: 0.02,
  envMapIntensity: 0.42
});

const padMaterial = new THREE.MeshStandardMaterial({
  color: 0x0f0f0e,
  roughness: 0.9,
  metalness: 0.0,
  envMapIntensity: 0.34
});

const grilleMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x1c1c1b,
  metalness: 0.64,
  roughness: 0.38,
  transmission: 0.05,
  thickness: 0.25,
  envMapIntensity: 0.95
});

const cableMaterial = new THREE.MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.68,
  metalness: 0.08
});

function roundedBox(width, height, depth, radius, smoothness) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: radius * 0.36,
    bevelSize: radius * 0.36,
    bevelSegments: smoothness,
    steps: 1
  }).center();
}

function makeCup(side = 1) {
  const cup = new THREE.Group();
  cup.position.x = side * 1.7;
  cup.rotation.y = side * 0.18;

  const shell = new THREE.Mesh(
    roundedBox(1.42, 1.9, 0.58, 0.34, 18),
    metal
  );
  shell.rotation.y = Math.PI / 2;
  shell.castShadow = true;
  shell.receiveShadow = true;
  cup.add(shell);

  const rearGlass = new THREE.Mesh(
    roundedBox(1.04, 1.5, 0.08, 0.26, 16),
    grilleMaterial
  );
  rearGlass.position.z = 0.33;
  rearGlass.rotation.y = Math.PI / 2;
  cup.add(rearGlass);

  for (let i = -4; i <= 4; i += 1) {
    const slot = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 1.1, 0.018),
      copper
    );
    slot.position.set(i * 0.105, 0, 0.39);
    slot.rotation.y = Math.PI / 2;
    cup.add(slot);
  }

  const padOuter = new THREE.Mesh(
    new THREE.TorusGeometry(0.73, 0.16, 20, 96),
    padMaterial
  );
  padOuter.scale.y = 1.25;
  padOuter.position.z = -0.36;
  padOuter.rotation.z = Math.PI / 2;
  padOuter.castShadow = true;
  cup.add(padOuter);

  const driver = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.48, 0.035, 96),
    darkMetal
  );
  driver.position.z = -0.39;
  driver.rotation.x = Math.PI / 2;
  cup.add(driver);

  const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.26, 32), copper);
  jack.position.set(0, -1.03, -0.1);
  jack.rotation.x = Math.PI / 2;
  cup.add(jack);

  const yokeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.05, 0.09), metal);
  yokeLeft.position.set(-0.63, 0.44, 0.02);
  yokeLeft.castShadow = true;
  cup.add(yokeLeft);

  const yokeRight = yokeLeft.clone();
  yokeRight.position.x = 0.63;
  cup.add(yokeRight);

  const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.3, 24), metal);
  bridge.position.set(0, 1.02, 0.02);
  bridge.rotation.z = Math.PI / 2;
  bridge.castShadow = true;
  cup.add(bridge);

  return cup;
}

const leftCup = makeCup(-1);
const rightCup = makeCup(1);
product.add(leftCup, rightCup);

const bandCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2.25, 0.88, 0),
  new THREE.Vector3(-1.62, 2.15, 0.04),
  new THREE.Vector3(0, 2.68, 0.1),
  new THREE.Vector3(1.62, 2.15, 0.04),
  new THREE.Vector3(2.25, 0.88, 0)
]);
const band = new THREE.Mesh(new THREE.TubeGeometry(bandCurve, 96, 0.09, 18, false), metal);
band.castShadow = true;
product.add(band);

const cushionCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-1.36, 1.58, -0.12),
  new THREE.Vector3(-0.72, 1.96, -0.18),
  new THREE.Vector3(0, 2.08, -0.2),
  new THREE.Vector3(0.72, 1.96, -0.18),
  new THREE.Vector3(1.36, 1.58, -0.12)
]);
const cushion = new THREE.Mesh(new THREE.TubeGeometry(cushionCurve, 80, 0.16, 18, false), leather);
cushion.scale.y = 0.82;
cushion.castShadow = true;
product.add(cushion);

const cableCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(1.7, -1.92, -0.2),
  new THREE.Vector3(1.9, -2.45, -0.1),
  new THREE.Vector3(1.2, -3.0, 0.1),
  new THREE.Vector3(0.4, -3.28, 0.2),
  new THREE.Vector3(-0.2, -3.05, 0.1)
]);
const cable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 80, 0.035, 12, false), cableMaterial);
cable.castShadow = true;
product.add(cable);

const amp = new THREE.Group();
amp.position.set(0, -2.35, -0.35);
amp.rotation.x = -0.04;
product.add(amp);

const ampBody = new THREE.Mesh(roundedBox(3.6, 0.72, 1.35, 0.13, 10), darkMetal);
ampBody.rotation.x = Math.PI / 2;
ampBody.castShadow = true;
ampBody.receiveShadow = true;
amp.add(ampBody);

const display = new THREE.Mesh(roundedBox(1.1, 0.28, 0.045, 0.045, 8), grilleMaterial);
display.position.set(-0.82, 0.42, 0.12);
amp.add(display);

const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.24, 72), copper);
knob.position.set(1.18, 0.46, 0.12);
knob.rotation.x = Math.PI / 2;
knob.castShadow = true;
amp.add(knob);

for (let i = 0; i < 3; i += 1) {
  const port = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.055, 32), metal);
  port.position.set(-0.18 + i * 0.28, 0.48, 0.12);
  port.rotation.x = Math.PI / 2;
  amp.add(port);
}

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(3.2, 96),
  new THREE.ShadowMaterial({ color: 0x171717, opacity: 0.16 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.76;
floor.receiveShadow = true;
scene.add(floor);

let targetRotationX = product.rotation.x;
let targetRotationY = product.rotation.y;
let isVisible = true;

function resize() {
  const rect = stage.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width));
  const height = Math.max(320, Math.floor(rect.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.lookAt(0, -0.1, 0);
  camera.updateProjectionMatrix();
}

function onPointerMove(event) {
  if (reducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
  const rect = stage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  targetRotationY = -0.28 + x * 0.28;
  targetRotationX = -0.06 + y * 0.16;
}

stage.addEventListener("pointermove", onPointerMove);
stage.addEventListener("pointerleave", () => {
  targetRotationY = -0.28;
  targetRotationX = -0.06;
});

const observer = new IntersectionObserver(([entry]) => {
  isVisible = entry.isIntersecting;
});
observer.observe(stage);

document.addEventListener("visibilitychange", () => {
  isVisible = !document.hidden;
});

window.addEventListener("resize", resize, { passive: true });
resize();

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  if (!isVisible && !reducedMotion) return;

  const elapsed = clock.getElapsedTime();
  if (!reducedMotion) {
    targetRotationY += Math.sin(elapsed * 0.42) * 0.0009;
    product.rotation.x += (targetRotationX - product.rotation.x) * 0.055;
    product.rotation.y += (targetRotationY - product.rotation.y) * 0.055;
    product.position.y = Math.sin(elapsed * 0.7) * 0.035;
    knob.rotation.z = elapsed * 0.08;
  }

  renderer.render(scene, camera);
}

renderer.render(scene, camera);
stage.classList.add("webgl-ready");
animate();
}
