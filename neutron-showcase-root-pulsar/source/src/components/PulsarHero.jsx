import { useEffect, useRef } from 'react';

// Hand-written WebGL pulsar. One draw call: every particle's position is derived
// procedurally in the vertex shader from a static random seed, so nothing is
// re-uploaded per frame. Four populations share the buffer, selected by seed.w:
// rotating core, Keplerian accretion disk, twin magnetic beam cones, far stars.
// The magnetic axis is misaligned with the spin axis — when a beam sweeps across
// the viewer's line of sight the whole hero pulses, like the real thing.

const PARTICLE_COUNT = 42000;
const CAM_TILT = 0.34;
const BEAM_TILT = 0.42; // magnetic axis offset from spin axis, radians
const SPIN_RATE = 0.55; // rad/s

const VERT = `
precision mediump float;
attribute vec4 aSeed;
uniform float uTime;
uniform float uAspect;
uniform float uPulse;
uniform vec2 uParallax;
uniform float uDpr;
varying vec3 vColor;
varying float vAlpha;

const float PI = 3.14159265;

mat3 rotY(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}
mat3 rotX(float a) {
  float c = cos(a), s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

void main() {
  vec3 p;
  vec3 col;
  float alpha;
  float size;

  vec3 iceWhite = vec3(0.82, 0.89, 1.0);
  vec3 periwinkle = vec3(0.49, 0.59, 1.0);
  vec3 violet = vec3(0.70, 0.61, 1.0);

  if (aSeed.w < 0.52) {
    // --- CORE: dense oblate sphere, differential rotation ---
    float theta = aSeed.x * 2.0 * PI;
    float cosPhi = aSeed.y * 2.0 - 1.0;
    float sinPhi = sqrt(max(0.0, 1.0 - cosPhi * cosPhi));
    float r = 0.55 * pow(aSeed.z, 0.62);
    float spin = uTime * (${SPIN_RATE.toFixed(2)} + 0.9 * (1.0 - r / 0.55));
    p = vec3(sinPhi * cos(theta), cosPhi * 0.92, sinPhi * sin(theta)) * r;
    p = rotY(spin) * p;
    float depth = 1.0 - r / 0.55;
    col = mix(periwinkle, iceWhite, depth * depth);
    col += vec3(0.25, 0.22, 0.15) * uPulse * depth;
    alpha = 0.20 + 0.55 * depth;
    size = (1.1 + 1.6 * depth) * (1.0 + 0.35 * uPulse);
  } else if (aSeed.w < 0.78) {
    // --- ACCRETION DISK: thin ring, Keplerian shear ---
    float r = mix(0.85, 2.35, pow(aSeed.x, 1.45));
    float omega = 0.95 / pow(r, 1.5);
    float ang = aSeed.y * 2.0 * PI + uTime * omega;
    float thick = (aSeed.z - 0.5) * 0.055 * r;
    p = vec3(cos(ang) * r, thick, sin(ang) * r);
    float fade = 1.0 - (r - 0.85) / 1.5;
    float clump = 0.75 + 0.25 * sin(ang * 3.0 + r * 6.0);
    col = mix(violet, periwinkle, fade) * clump;
    alpha = (0.05 + 0.30 * fade) * clump;
    size = 1.0 + 0.9 * fade;
  } else if (aSeed.w < 0.94) {
    // --- BEAMS: twin helical cones on the precessing magnetic axis ---
    float u = aSeed.x;
    float side = aSeed.y < 0.5 ? 1.0 : -1.0;
    float spin = uTime * ${SPIN_RATE.toFixed(2)};
    vec3 axis = rotY(spin) * vec3(sin(${BEAM_TILT.toFixed(2)}), cos(${BEAM_TILT.toFixed(2)}), 0.0);
    axis *= side;
    vec3 ortho1 = normalize(cross(axis, vec3(0.0, 0.0, 1.0)));
    vec3 ortho2 = normalize(cross(axis, ortho1));
    float dist = 0.30 + u * 2.7;
    float rad = 0.035 + u * u * 0.30;
    float helix = aSeed.z * 2.0 * PI + uTime * 3.0 + u * 9.0;
    p = axis * dist + (ortho1 * cos(helix) + ortho2 * sin(helix)) * rad;
    float head = 1.0 - u;
    col = mix(violet, iceWhite, head * head) + vec3(0.3, 0.25, 0.12) * uPulse;
    alpha = (0.10 + 0.50 * head * head) * (0.65 + 0.8 * uPulse);
    size = 1.3 + 1.7 * head + 1.2 * uPulse;
  } else {
    // --- FAR STARS: static field, slow twinkle ---
    float theta = aSeed.x * 2.0 * PI;
    float cosPhi = aSeed.y * 2.0 - 1.0;
    float sinPhi = sqrt(max(0.0, 1.0 - cosPhi * cosPhi));
    p = vec3(sinPhi * cos(theta), cosPhi, sinPhi * sin(theta)) * mix(3.4, 5.2, aSeed.z);
    float tw = 0.6 + 0.4 * sin(uTime * (0.4 + aSeed.z) + aSeed.x * 40.0);
    col = mix(iceWhite, periwinkle, aSeed.z) * tw;
    alpha = 0.5 * tw;
    size = 0.8 + aSeed.z * 0.9;
  }

  p = rotX(${CAM_TILT.toFixed(2)} + uParallax.y) * rotY(uParallax.x) * p;

  float persp = 1.55 / (3.4 - clamp(p.z, -2.5, 2.5));
  gl_Position = vec4(p.x * persp / uAspect, p.y * persp - 0.04, 0.0, 1.0);
  gl_PointSize = size * persp * 2.2 * uDpr;
  vColor = col;
  vAlpha = alpha;
}
`;

const FRAG = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 d = gl_PointCoord - vec2(0.5);
  float m = smoothstep(0.5, 0.05, length(d));
  gl_FragColor = vec4(vColor, vAlpha * m);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh));
  }
  return sh;
}

export default function PulsarHero() {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false });
    if (!gl) return undefined; // CSS nebula behind the canvas stands in

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);

    const seeds = new Float32Array(PARTICLE_COUNT * 4);
    for (let i = 0; i < seeds.length; i += 1) seeds[i] = Math.random();
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'aSeed');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);

    const uni = name => gl.getUniformLocation(program, name);
    const uTime = uni('uTime');
    const uAspect = uni('uAspect');
    const uPulse = uni('uPulse');
    const uParallax = uni('uParallax');
    const uDpr = uni('uDpr');

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onPointer = e => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.14;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.10;
    };
    window.addEventListener('pointermove', onPointer);

    let visible = true;
    const io = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
    });
    io.observe(canvas);

    let raf = 0;
    const t0 = performance.now();

    // Pulse: same beam math as the shader, camera-tilted. The beam axis can
    // only ever reach sin(BEAM_TILT + CAM_TILT) toward the viewer, so the dot
    // is normalized by that maximum — the flash fires at each closest pass,
    // once per beam per rotation.
    const beamDot = t => {
      const spin = t * SPIN_RATE;
      const tilt = CAM_TILT + eased.y;
      let best = 0;
      for (const side of [1, -1]) {
        const ay = Math.cos(BEAM_TILT) * side;
        const az = -Math.sin(BEAM_TILT) * Math.sin(spin) * side;
        const z = Math.sin(tilt) * ay + Math.cos(tilt) * az;
        best = Math.max(best, z);
      }
      return Math.min(1, best / Math.sin(BEAM_TILT + CAM_TILT));
    };
    const smooth = (a, b, x) => {
      const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return k * k * (3 - 2 * k);
    };

    const draw = now => {
      const t = reduced ? 7.0 : (now - t0) / 1000;
      eased.x += (target.x - eased.x) * 0.04;
      eased.y += (target.y - eased.y) * 0.04;
      const pulse = reduced ? 0 : smooth(0.988, 0.9995, beamDot(t));
      if (glow) glow.style.opacity = (pulse * 0.55).toFixed(3);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uAspect, canvas.width / Math.max(1, canvas.height));
      gl.uniform1f(uPulse, pulse);
      gl.uniform2f(uParallax, eased.x, eased.y);
      gl.uniform1f(uDpr, dpr);
      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
    };

    const loop = now => {
      if (visible) draw(now);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onLost = e => e.preventDefault();
    canvas.addEventListener('webglcontextlost', onLost);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onLost);
      io.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="pulsar-stage" aria-hidden="true">
      <div className="pulsar-nebula" />
      <canvas ref={canvasRef} className="pulsar-canvas" />
      <div ref={glowRef} className="pulsar-glow" />
    </div>
  );
}
