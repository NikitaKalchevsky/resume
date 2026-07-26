/* scene.js — three.js "MK" hero scene. Lazy, dependency-light, degrades to the
   CSS fallback when WebGL is unavailable or motion is reduced.
   Geometry + material constants ported from the design source (Resume 3D.dc.html). */

const canvas = document.getElementById('scene');
const hero = document.querySelector('.hero');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) { return false; }
}

// Letter outlines (unit-ish coords, ~1 wide × 1.4 tall) — from letterShape() source.
const M_PTS = [[0,0],[0.22,0],[0.22,0.95],[0.5,0.35],[0.78,0.95],[0.78,0],[1.0,0],[1.0,1.4],[0.8,1.4],[0.5,0.72],[0.2,1.4],[0,1.4]];
const K_PTS = [[0,0],[0.26,0],[0.26,0.32],[0.58,0],[0.88,0],[0.40,0.70],[0.88,1.4],[0.56,1.4],[0.26,0.98],[0.26,1.4],[0,1.4]];

const ACCENT = '#c67139';
const CREAM  = '#f2e7d3';
const SAGE   = '#7a8a5e';
const CLEAR  = '#1b1815';
const DEPTH  = 0.42;
const CLOUD_N = 5200;

if (canvas && !reduce && hasWebGL()) {
  import('https://esm.sh/three@0.161.0')
    .then((THREE) => init(THREE))
    .catch(() => { /* keep CSS fallback */ });
}

function init(THREE) {
  const shape = (pts) => {
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
    s.closePath();
    return s;
  };

  const samplePoints = (shp, count) => {
    const g = new THREE.ShapeGeometry(shp, 8);
    const pos = g.attributes.position, idx = g.index;
    const tris = []; let total = 0;
    const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
    for (let i = 0; i < idx.count; i += 3) {
      A.fromBufferAttribute(pos, idx.getX(i));
      B.fromBufferAttribute(pos, idx.getX(i + 1));
      C.fromBufferAttribute(pos, idx.getX(i + 2));
      const area = new THREE.Triangle(A.clone(), B.clone(), C.clone()).getArea();
      tris.push([A.clone(), B.clone(), C.clone(), area]); total += area;
    }
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let r = Math.random() * total, t = tris[0];
      for (let j = 0; j < tris.length; j++) { r -= tris[j][3]; if (r <= 0) { t = tris[j]; break; } }
      let u = Math.random(), v = Math.random();
      if (u + v > 1) { u = 1 - u; v = 1 - v; }
      out[i*3]   = t[0].x + u * (t[1].x - t[0].x) + v * (t[2].x - t[0].x);
      out[i*3+1] = t[0].y + u * (t[1].y - t[0].y) + v * (t[2].y - t[0].y);
      out[i*3+2] = (Math.random() - 0.5) * DEPTH;
    }
    g.dispose();
    return out;
  };

  const extrude = { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.045, bevelSegments: 4, curveSegments: 8 };

  function buildLetter(pts, color, x) {
    const shp = shape(pts);
    const holder = new THREE.Group();

    const solidGeo = new THREE.ExtrudeGeometry(shp, extrude);
    solidGeo.center();
    const solid = new THREE.Mesh(solidGeo, new THREE.MeshStandardMaterial({
      color: new THREE.Color(color), roughness: color === ACCENT ? 0.34 : 0.42, metalness: color === ACCENT ? 0.24 : 0.12
    }));

    const wire = new THREE.Mesh(solidGeo, new THREE.MeshBasicMaterial({
      color: new THREE.Color(color), wireframe: true, transparent: true, opacity: 0.5
    }));
    wire.visible = false;

    const cloudGeo = new THREE.BufferGeometry();
    cloudGeo.setAttribute('position', new THREE.BufferAttribute(samplePoints(shp, CLOUD_N), 3));
    cloudGeo.center();
    const cloud = new THREE.Points(cloudGeo, new THREE.PointsMaterial({
      color: new THREE.Color(color), size: 0.02, sizeAttenuation: true, transparent: true, opacity: 0.9
    }));
    cloud.visible = false;

    holder.add(solid, wire, cloud);
    holder.position.x = x;
    holder.userData = { solid, wire, cloud };
    return holder;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(new THREE.Color(CLEAR), 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 6.4);

  // Lights
  scene.add(new THREE.HemisphereLight(0xf5ead8, 0x2a241e, 0.9));
  const key = new THREE.DirectionalLight(0xfff1e0, 1.0); key.position.set(4, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(new THREE.Color(ACCENT), 0.8); rim.position.set(-5, 2, -6); scene.add(rim);
  const p1 = new THREE.PointLight(new THREE.Color(SAGE), 0.5, 30); p1.position.set(-4, -3, 3); scene.add(p1);
  const p2 = new THREE.PointLight(0xffffff, 0.4, 30); p2.position.set(3, -2, 4); scene.add(p2);

  // Letters — centered around the composition origin (M left, K right, symmetric).
  const letters = new THREE.Group();
  const M = buildLetter(M_PTS, ACCENT, -1.15);
  const K = buildLetter(K_PTS, CREAM, 1.15);
  letters.add(M, K);
  // Local half-extents of the MK block (for the responsive fit in resize()).
  const L_HW = 1.65, L_HH = 0.72;

  // Ambient background: sage wire icosahedron + accent torus
  const bg = new THREE.Group();
  const icosa = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.1, 1),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(SAGE), wireframe: true, transparent: true, opacity: 0.14 })
  );
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.012, 8, 120),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT), transparent: true, opacity: 0.5 })
  );
  torus.rotation.x = Math.PI / 2.6;
  bg.add(icosa, torus);

  // content = bg + letters, scaled/offset together so the MK always fits the panel.
  const content = new THREE.Group();
  content.add(bg, letters);
  const group = new THREE.Group();
  group.add(content);
  scene.add(group);

  // Reveal (hide the CSS fallback, show the mode chips)
  if (hero) hero.classList.add('scene-live');

  // ── Interaction state ──
  const pointer = { x: 0, y: 0 };
  let drag = false, lastX = 0, lastY = 0;
  const vel = { x: 0, y: 0 };
  const rot = { x: 0, y: 0 };
  let scrollRot = 0;

  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    if (drag) {
      vel.y = (e.clientX - lastX) * 0.006;
      vel.x = (e.clientY - lastY) * 0.006;
      rot.y += vel.y; rot.x += vel.x;
      lastX = e.clientX; lastY = e.clientY;
    }
  });
  canvas.addEventListener('pointerdown', (e) => { drag = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
  window.addEventListener('pointerup', () => { drag = false; });
  window.addEventListener('scroll', () => { scrollRot = window.scrollY * 0.0016; }, { passive: true });

  // Mode chips
  let mode = 'solid';
  function setMode(m) {
    mode = m;
    [M, K].forEach((L) => {
      L.userData.solid.visible = m === 'solid';
      L.userData.wire.visible  = m === 'wire';
      L.userData.cloud.visible = m === 'cloud';
    });
    document.querySelectorAll('.scene-modes button').forEach((b) => b.classList.toggle('active', b.getAttribute('data-mode') === m));
  }
  document.querySelectorAll('.scene-modes button').forEach((b) => {
    b.addEventListener('click', () => setMode(b.getAttribute('data-mode')));
  });

  // Resize
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // Visible half-extents of the frustum at the composition's depth (z = 0).
    const halfH = Math.tan((camera.fov / 2) * Math.PI / 180) * camera.position.z;
    const halfW = halfH * camera.aspect;
    const wide = w > 640;
    const padR = halfW * 0.06 + 0.15;
    const padV = halfH * 0.06 + 0.10;

    let scale, offsetX;
    if (wide) {
      // MK lives in the right zone; copy overlaps the left. Fit fully, never crop.
      const zoneL = -0.12 * halfW;
      const zoneR = halfW - padR;
      const sH = (0.92 * (zoneR - zoneL)) / (2 * L_HW);
      const sV = (halfH - padV) / L_HH;
      scale = Math.min(sH, sV);
      offsetX = (zoneL + zoneR) / 2;
      const overR = (offsetX + L_HW * scale) - (halfW - padR);
      if (overR > 0) offsetX -= overR; // guarantee right edge inside
    } else {
      // Narrow: centered behind the copy, scaled to fit width and height.
      const sH = (0.86 * 2 * halfW) / (2 * L_HW);
      const sV = (halfH - padV) / L_HH;
      scale = Math.min(sH, sV);
      offsetX = 0;
    }
    content.scale.setScalar(scale);
    group.position.x = offsetX;
    group.position.y = 0;
  }
  window.addEventListener('resize', resize);
  resize();

  // Loop
  const lerp = (a, b, t) => a + (b - a) * t;
  let running = true, t0 = performance.now();
  function frame(now) {
    if (!running) return;
    const t = (now - t0) / 1000;

    if (!drag) { rot.y += vel.y; rot.x += vel.x; vel.x *= 0.93; vel.y *= 0.93; }

    const targetY = rot.y + pointer.x * 0.5 + scrollRot;
    const targetX = rot.x + pointer.y * 0.25;
    letters.rotation.y = lerp(letters.rotation.y, targetY, 0.075);
    letters.rotation.x = lerp(letters.rotation.x, targetX, 0.075);

    letters.scale.setScalar(1 + Math.sin(t * 0.9) * 0.012); // subtle breathe
    content.position.y = Math.sin(t * 0.7) * 0.05;           // gentle bob

    bg.rotation.y += 0.0016;
    bg.rotation.z = Math.sin(t * 0.2) * 0.15;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Pause when tab hidden / page hidden — cleanup rAF
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { running = false; }
    else if (!running) { running = true; t0 = performance.now(); requestAnimationFrame(frame); }
  });
  window.addEventListener('pagehide', () => { running = false; renderer.dispose(); });
}
