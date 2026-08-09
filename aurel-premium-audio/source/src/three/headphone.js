import * as THREE from 'three';

// A properly-proportioned open-back planar headphone, built from lathe
// profiles and connected parts: round tapered cups, concentric open-back
// grille with radial spokes, forked yokes that actually hold the cups,
// sliding rails that meet a flat-profile headband with a leather cushion.
// All finish-dependent surfaces share materials so a colorway swap is one
// material update, animated by the viewer.

function cupShellGeometry() {
  // Lathe profile of one ear cup, from the pad-side lip to the open back.
  const pts = [];
  const profile = [
    [0.02, 0.0], [0.62, 0.0], [0.78, 0.02], [0.86, 0.07],
    [0.9, 0.16], [0.9, 0.3], [0.86, 0.4], [0.78, 0.46],
    [0.62, 0.5], [0.4, 0.52], [0.18, 0.52], [0.02, 0.52],
  ];
  for (const [r, y] of profile) pts.push(new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(pts, 96);
}

export function buildHeadphone() {
  const group = new THREE.Group();

  const materials = {
    shell: new THREE.MeshPhysicalMaterial({
      metalness: 0.88, roughness: 0.34, clearcoat: 0.4, clearcoatRoughness: 0.28,
      envMapIntensity: 1.3,
    }),
    rail: new THREE.MeshPhysicalMaterial({
      metalness: 0.92, roughness: 0.24, envMapIntensity: 1.4,
    }),
    accent: new THREE.MeshPhysicalMaterial({
      metalness: 0.9, roughness: 0.22, clearcoat: 0.25, envMapIntensity: 1.45,
    }),
    leather: new THREE.MeshStandardMaterial({
      roughness: 0.86, metalness: 0.02, envMapIntensity: 0.5,
    }),
    pad: new THREE.MeshStandardMaterial({
      roughness: 0.92, metalness: 0, envMapIntensity: 0.4,
    }),
    grille: new THREE.MeshPhysicalMaterial({
      color: 0x181715, metalness: 0.7, roughness: 0.42, envMapIntensity: 0.9,
    }),
  };

  const CUP_X = 1.32;   // cup center distance from head center
  const CUP_TILT = 0.1; // slight toe-in

  function makeCup(side) {
    const cup = new THREE.Group();

    // Shell: lathe profile, axis pointing outward (x)
    const shell = new THREE.Mesh(cupShellGeometry(), materials.shell);
    shell.rotation.z = side * -Math.PI / 2;
    shell.castShadow = true;
    shell.receiveShadow = true;
    cup.add(shell);

    // Open-back grille: concentric rings + radial spokes + hub, recessed
    // into the outer face.
    const grille = new THREE.Group();
    for (let i = 1; i <= 4; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.14 + i * 0.15, 0.016, 10, 72),
        materials.grille
      );
      grille.add(ring);
    }
    for (let i = 0; i < 8; i += 1) {
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 1.46, 0.03),
        materials.grille
      );
      spoke.rotation.z = (i / 8) * Math.PI;
      grille.add(spoke);
    }
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.05, 48),
      materials.accent
    );
    hub.rotation.x = Math.PI / 2;
    grille.add(hub);
    grille.rotation.y = side * Math.PI / 2;
    grille.position.x = side * 0.56;
    cup.add(grille);

    // Accent ring around the open back
    const trim = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.028, 14, 96),
      materials.accent
    );
    trim.rotation.y = Math.PI / 2;
    trim.position.x = side * 0.53;
    cup.add(trim);

    // Lambskin pad: fat torus, slightly ovalized vertically
    const pad = new THREE.Mesh(
      new THREE.TorusGeometry(0.66, 0.21, 22, 96),
      materials.pad
    );
    pad.rotation.y = Math.PI / 2;
    pad.scale.y = 1.14;
    pad.position.x = side * -0.12;
    pad.castShadow = true;
    cup.add(pad);

    // Driver face behind the pad opening
    const driver = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 0.52, 0.04, 64),
      materials.grille
    );
    driver.rotation.z = Math.PI / 2;
    driver.position.x = side * -0.05;
    cup.add(driver);

    // Yoke: a fork that wraps the cup from the outside and pivots at top.
    const yoke = new THREE.Group();
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(0.97, 0.045, 12, 48, Math.PI),
      materials.rail
    );
    arc.rotation.y = side * Math.PI / 2;
    yoke.add(arc);
    const pivotL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.12, 32), materials.accent
    );
    pivotL.rotation.z = Math.PI / 2;
    pivotL.position.set(side * 0.0, 0, 0.97);
    const pivotR = pivotL.clone();
    pivotR.position.set(side * 0.0, 0, -0.97);
    // pivots sit at the arc ends — rotate the group so the fork stands
    // vertical: arc opens downward, ends at cup's front/back.
    yoke.rotation.x = Math.PI / 2;
    yoke.position.x = 0;
    yoke.add(pivotL, pivotR);
    yoke.castShadow = true;
    cup.add(yoke);

    // Slider stem rising from the yoke crown into the headband
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.72, 24),
      materials.rail
    );
    stem.position.y = 1.28;
    stem.castShadow = true;
    cup.add(stem);

    // Slider detents
    for (let i = 0; i < 4; i += 1) {
      const notch = new THREE.Mesh(
        new THREE.TorusGeometry(0.055, 0.012, 8, 24),
        materials.accent
      );
      notch.rotation.x = Math.PI / 2;
      notch.position.y = 1.06 + i * 0.14;
      cup.add(notch);
    }

    cup.position.x = side * CUP_X;
    cup.rotation.y = side * -CUP_TILT;
    return cup;
  }

  group.add(makeCup(-1), makeCup(1));

  // Headband: flat-profile arch (extruded along a curve via TubeGeometry
  // with elliptical scale), leather cushion beneath its crown.
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
  band.scale.z = 2.1; // flatten the round tube into a strap profile
  band.castShadow = true;
  group.add(band);

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
  group.add(cushion);

  // Detachable cable stubs at each cup base with copper collars
  for (const side of [-1, 1]) {
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.075, 0.16, 24),
      materials.accent
    );
    collar.position.set(side * CUP_X, -0.98, 0.08);
    group.add(collar);
  }

  // Everything hangs slightly forward like a headphone at rest
  group.rotation.x = 0.02;

  function setFinish(colors) {
    materials.shell.color.setHex(colors.shell);
    materials.rail.color.setHex(colors.rail);
    materials.accent.color.setHex(colors.accent);
    materials.leather.color.setHex(colors.leather);
    materials.pad.color.setHex(colors.pad);
  }

  return { group, materials, setFinish };
}
