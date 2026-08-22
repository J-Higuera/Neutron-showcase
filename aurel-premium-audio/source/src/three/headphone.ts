import * as THREE from "three";

// Exhibit 001 — the founding piece, ported from the Aurel storefront build.
// Geometry is unchanged: lathe-profile cups with a real interior liner, a
// planar-magnet driver assembly behind smoked mesh, forked yokes, sliding
// rails, a flat-profile headband with leather cushion. The museum edition
// wears the Copper finish permanently, and every part registers an explode
// vector so Inspect mode can take the object apart.

const CUP_PROFILE: Array<[number, number]> = [
  [0.02, 0.0], [0.62, 0.0], [0.78, 0.02], [0.86, 0.07],
  [0.9, 0.16], [0.9, 0.3], [0.86, 0.4], [0.78, 0.46],
  [0.62, 0.5], [0.4, 0.52], [0.18, 0.52], [0.02, 0.52],
];

function cupShellGeometry(scale = 1): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [];
  for (const [r, y] of CUP_PROFILE) {
    pts.push(new THREE.Vector2(Math.max(0.02, r * scale), y));
  }
  return new THREE.LatheGeometry(pts, 96);
}

// The hub wears the brand mark: an "A" drawn once into a small canvas and
// mapped onto a disc. Cheap, crisp, and it reads as engraving at rest.
function makeMarkTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 128, 128);
  ctx.strokeStyle = "rgba(238, 228, 210, 0.88)";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(40, 92);
  ctx.lineTo(64, 36);
  ctx.lineTo(88, 92);
  ctx.stroke();
  ctx.fillStyle = "rgba(196, 154, 98, 0.9)";
  ctx.beginPath();
  ctx.arc(64, 80, 5.5, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export interface HeadphoneAnchors {
  driver: THREE.Object3D;
  grille: THREE.Object3D;
  pad: THREE.Object3D;
  cushion: THREE.Object3D;
  port: THREE.Object3D;
}

export interface HeadphoneBuild {
  group: THREE.Group;
  setExplode: (t: number) => void;
  anchors: HeadphoneAnchors;
}

export function buildHeadphone(): HeadphoneBuild {
  const group = new THREE.Group();

  // Copper — the museum finish: burnished shells, brass details,
  // espresso leather. Interior parts stay near-black by design.
  const materials = {
    shell: new THREE.MeshPhysicalMaterial({
      color: 0x9d6742, metalness: 0.88, roughness: 0.34,
      clearcoat: 0.4, clearcoatRoughness: 0.28, envMapIntensity: 1.3,
    }),
    rail: new THREE.MeshPhysicalMaterial({
      color: 0x6f4a30, metalness: 0.92, roughness: 0.24, envMapIntensity: 1.4,
    }),
    accent: new THREE.MeshPhysicalMaterial({
      color: 0xc59a62, metalness: 0.9, roughness: 0.22,
      clearcoat: 0.25, envMapIntensity: 1.45,
    }),
    leather: new THREE.MeshStandardMaterial({
      color: 0x241a12, roughness: 0.86, metalness: 0.02, envMapIntensity: 0.5,
    }),
    pad: new THREE.MeshStandardMaterial({
      color: 0x171006, roughness: 0.92, metalness: 0, envMapIntensity: 0.4,
    }),
    grille: new THREE.MeshPhysicalMaterial({
      color: 0x181715, metalness: 0.7, roughness: 0.42, envMapIntensity: 0.9,
    }),
    interior: new THREE.MeshStandardMaterial({
      color: 0x14110e, roughness: 0.94, metalness: 0.08,
      envMapIntensity: 0.35, side: THREE.BackSide,
    }),
    magnet: new THREE.MeshStandardMaterial({
      color: 0x211d19, roughness: 0.55, metalness: 0.65, envMapIntensity: 0.7,
    }),
    diaphragm: new THREE.MeshPhysicalMaterial({
      color: 0x2a241c, roughness: 0.3, metalness: 0.85,
      envMapIntensity: 1.0, side: THREE.DoubleSide,
    }),
    trace: new THREE.MeshPhysicalMaterial({
      color: 0xa96b35, roughness: 0.32, metalness: 0.9, envMapIntensity: 1.2,
    }),
    mesh: new THREE.MeshPhysicalMaterial({
      color: 0x0c0b0a, roughness: 0.6, metalness: 0.3,
      transparent: true, opacity: 0.45, side: THREE.DoubleSide,
      depthWrite: false,
    }),
  };

  const markTexture = makeMarkTexture();
  const markMaterial = new THREE.MeshBasicMaterial({
    map: markTexture, transparent: true, opacity: 0.9,
  });

  const CUP_X = 1.32;
  const CUP_TILT = 0.1;

  // Explode registry: each entry moves from its resting position along a
  // direction, scaled by the eased explode factor.
  interface ExplodePart {
    object: THREE.Object3D;
    base: THREE.Vector3;
    dir: THREE.Vector3;
    dist: number;
  }
  const parts: ExplodePart[] = [];
  function register(object: THREE.Object3D, dir: THREE.Vector3, dist: number) {
    parts.push({ object, base: object.position.clone(), dir: dir.normalize(), dist });
  }

  const anchors: Partial<HeadphoneAnchors> = {};

  function makeCup(side: number): THREE.Group {
    const cup = new THREE.Group();
    cup.name = side < 0 ? "cup-left" : "cup-right";

    const shell = new THREE.Mesh(cupShellGeometry(), materials.shell);
    shell.rotation.z = (side * -Math.PI) / 2;
    shell.castShadow = true;
    shell.receiveShadow = true;
    cup.add(shell);
    register(shell, new THREE.Vector3(side, 0, 0), 0.14);

    const liner = new THREE.Mesh(cupShellGeometry(0.965), materials.interior);
    liner.rotation.z = (side * -Math.PI) / 2;
    cup.add(liner);
    register(liner, new THREE.Vector3(side, 0, 0), 0.1);

    // ---- planar driver assembly, visible through the open back ----
    const driverGroup = new THREE.Group();
    driverGroup.name = "driver-assembly";

    const diaphragm = new THREE.Mesh(
      new THREE.CircleGeometry(0.52, 64),
      materials.diaphragm
    );
    driverGroup.add(diaphragm);

    const trace = new THREE.Mesh(
      new THREE.TorusGeometry(0.47, 0.014, 10, 72),
      materials.trace
    );
    trace.position.z = 0.015;
    driverGroup.add(trace);

    for (let i = -3; i <= 3; i += 1) {
      const w = Math.sqrt(Math.max(0.05, 0.52 * 0.52 - (i * 0.135) ** 2)) * 2;
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.92, 0.075, 0.05),
        materials.magnet
      );
      bar.position.set(0, i * 0.135, 0.05);
      driverGroup.add(bar);
    }

    driverGroup.rotation.y = (side * Math.PI) / 2;
    driverGroup.position.x = side * 0.22;
    cup.add(driverGroup);
    register(driverGroup, new THREE.Vector3(side, 0, 0), 0.46);
    if (side > 0) anchors.driver = driverGroup;

    const mesh = new THREE.Mesh(new THREE.CircleGeometry(0.76, 64), materials.mesh);
    mesh.rotation.y = (side * Math.PI) / 2;
    mesh.position.x = side * 0.5;
    cup.add(mesh);
    register(mesh, new THREE.Vector3(side, 0, 0), 0.72);

    const grille = new THREE.Group();
    grille.name = "grille";
    for (let i = 1; i <= 5; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.1 + i * 0.135, 0.014, 10, 72),
        materials.grille
      );
      grille.add(ring);
    }
    for (let i = 0; i < 12; i += 1) {
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.026, 1.55, 0.026),
        materials.grille
      );
      spoke.rotation.z = (i / 12) * Math.PI;
      grille.add(spoke);
    }
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.05, 48),
      materials.accent
    );
    hub.rotation.x = Math.PI / 2;
    grille.add(hub);
    const mark = new THREE.Mesh(new THREE.CircleGeometry(0.105, 48), markMaterial);
    mark.position.z = 0.028;
    grille.add(mark);
    grille.rotation.y = (side * Math.PI) / 2;
    grille.position.x = side * 0.56;
    cup.add(grille);
    register(grille, new THREE.Vector3(side, 0, 0), 1.2);
    if (side > 0) anchors.grille = grille;

    const trim = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.028, 14, 96),
      materials.accent
    );
    trim.rotation.y = Math.PI / 2;
    trim.position.x = side * 0.53;
    cup.add(trim);
    register(trim, new THREE.Vector3(side, 0, 0), 0.98);

    const pad = new THREE.Mesh(
      new THREE.TorusGeometry(0.66, 0.21, 22, 96),
      materials.pad
    );
    pad.rotation.y = Math.PI / 2;
    pad.scale.y = 1.14;
    pad.position.x = side * -0.12;
    pad.castShadow = true;
    cup.add(pad);
    register(pad, new THREE.Vector3(-side, 0, 0), 0.8);
    if (side < 0) anchors.pad = pad;

    const driver = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 0.52, 0.04, 64),
      materials.grille
    );
    driver.rotation.z = Math.PI / 2;
    driver.position.x = side * -0.05;
    cup.add(driver);
    register(driver, new THREE.Vector3(-side, 0, 0), 0.52);

    const felt = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.05, 12, 72),
      materials.interior.clone()
    );
    (felt.material as THREE.MeshStandardMaterial).side = THREE.FrontSide;
    felt.rotation.y = Math.PI / 2;
    felt.position.x = side * -0.08;
    cup.add(felt);
    register(felt, new THREE.Vector3(-side, 0, 0), 0.62);

    const yoke = new THREE.Group();
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(0.97, 0.045, 12, 48, Math.PI),
      materials.rail
    );
    arc.rotation.y = (side * Math.PI) / 2;
    yoke.add(arc);
    const pivotL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.12, 32),
      materials.accent
    );
    pivotL.rotation.z = Math.PI / 2;
    pivotL.position.set(side * 0.0, 0, 0.97);
    const pivotR = pivotL.clone();
    pivotR.position.set(side * 0.0, 0, -0.97);
    yoke.rotation.x = Math.PI / 2;
    yoke.position.x = 0;
    yoke.add(pivotL, pivotR);
    yoke.castShadow = true;
    cup.add(yoke);
    register(yoke, new THREE.Vector3(0, 1, 0), 0.5);

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.72, 24),
      materials.rail
    );
    stem.position.y = 1.28;
    stem.castShadow = true;
    cup.add(stem);
    register(stem, new THREE.Vector3(0, 1, 0), 0.72);

    for (let i = 0; i < 4; i += 1) {
      const notch = new THREE.Mesh(
        new THREE.TorusGeometry(0.055, 0.012, 8, 24),
        materials.accent
      );
      notch.rotation.x = Math.PI / 2;
      notch.position.y = 1.06 + i * 0.14;
      cup.add(notch);
      register(notch, new THREE.Vector3(0, 1, 0), 0.58);
    }

    cup.position.x = side * CUP_X;
    cup.rotation.y = side * -CUP_TILT;
    register(cup, new THREE.Vector3(side, 0, 0), 0.85);
    return cup;
  }

  group.add(makeCup(-1), makeCup(1));

  const bandCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.36, 1.62, 0),
    new THREE.Vector3(-1.12, 2.19, 0),
    new THREE.Vector3(0, 2.52, 0),
    new THREE.Vector3(1.12, 2.19, 0),
    new THREE.Vector3(1.36, 1.62, 0),
  ]);
  const band = new THREE.Mesh(
    new THREE.TubeGeometry(bandCurve, 96, 0.085, 20, false),
    materials.rail
  );
  band.scale.z = 2.1;
  band.castShadow = true;
  for (const x of [-1.36, 1.36]) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 14), materials.rail);
    cap.position.set(x, 1.62, 0);
    band.add(cap);
  }
  group.add(band);
  register(band, new THREE.Vector3(0, 1, 0), 1.05);

  const cushionCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.92, 2.02, 0),
    new THREE.Vector3(-0.5, 2.26, 0),
    new THREE.Vector3(0, 2.34, 0),
    new THREE.Vector3(0.5, 2.26, 0),
    new THREE.Vector3(0.92, 2.02, 0),
  ]);
  const cushion = new THREE.Mesh(
    new THREE.TubeGeometry(cushionCurve, 64, 0.1, 16, false),
    materials.leather
  );
  cushion.scale.z = 1.7;
  for (const x of [-0.92, 0.92]) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 12), materials.leather);
    cap.position.set(x, 2.02, 0);
    cushion.add(cap);
  }
  group.add(cushion);
  register(cushion, new THREE.Vector3(0, 1, 0), 0.68);
  anchors.cushion = cushion;

  for (const side of [-1, 1]) {
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.075, 0.16, 24),
      materials.accent
    );
    collar.position.set(side * CUP_X, -0.98, 0.08);
    group.add(collar);
    register(collar, new THREE.Vector3(side * 0.4, -1, 0), 0.55);
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.05, 12),
      materials.trace
    );
    pin.position.set(side * CUP_X, -1.05, 0.08);
    group.add(pin);
    register(pin, new THREE.Vector3(side * 0.4, -1, 0), 0.72);
    if (side > 0) anchors.port = collar;
  }

  group.rotation.x = 0.02;

  function setExplode(t: number): void {
    const k = easeInOutCubic(Math.min(1, Math.max(0, t)));
    for (const p of parts) {
      p.object.position.copy(p.base).addScaledVector(p.dir, p.dist * k);
    }
  }

  return { group, setExplode, anchors: anchors as HeadphoneAnchors };
}
