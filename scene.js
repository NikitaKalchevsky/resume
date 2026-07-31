// 3D "MK" hero scene. Loaded only when WebGL is available and the visitor
// has not asked to reduce motion. Exposes window.MKScene.
import * as THREE from 'https://esm.sh/three@0.161.0';

const ACCENT = '#c67139', CREAM = '#f2e7d3', SAGE = '#8fa073', DARK = '#1b1815';

// Letter outlines as polygon point lists, drawn on a 0..1 x 0..1.4 box.
const M_PTS = [[0,0],[.22,0],[.22,.95],[.5,.35],[.78,.95],[.78,0],[1,0],[1,1.4],[.8,1.4],[.5,.72],[.2,1.4],[0,1.4]];
const K_PTS = [[0,0],[.26,0],[.26,.32],[.58,0],[.88,0],[.4,.7],[.88,1.4],[.56,1.4],[.26,.98],[.26,1.4],[0,1.4]];

function toShape(pts){
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  return s;
}

// Uniform area sampling over the triangulated letter face, jittered in Z.
function samplePoints(shape, count, depth){
  const g = new THREE.ShapeGeometry(shape, 8);
  const pos = g.attributes.position, idx = g.index, tris = [];
  let total = 0;
  const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
  for (let i = 0; i < idx.count; i += 3){
    A.fromBufferAttribute(pos, idx.getX(i));
    B.fromBufferAttribute(pos, idx.getX(i + 1));
    C.fromBufferAttribute(pos, idx.getX(i + 2));
    const area = new THREE.Triangle(A.clone(), B.clone(), C.clone()).getArea();
    tris.push([A.clone(), B.clone(), C.clone(), area]);
    total += area;
  }
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++){
    let r = Math.random() * total, t = tris[0];
    for (let j = 0; j < tris.length; j++){ r -= tris[j][3]; if (r <= 0){ t = tris[j]; break; } }
    let u = Math.random(), v = Math.random();
    if (u + v > 1){ u = 1 - u; v = 1 - v; }
    out[i * 3]     = t[0].x + u * (t[1].x - t[0].x) + v * (t[2].x - t[0].x);
    out[i * 3 + 1] = t[0].y + u * (t[1].y - t[0].y) + v * (t[2].y - t[0].y);
    out[i * 3 + 2] = (Math.random() - .5) * depth;
  }
  g.dispose();
  return out;
}

export function initScene(canvas, host, opts = {}){
  const motion = opts.motion == null ? 1 : opts.motion;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(new THREE.Color(DARK), 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(new THREE.Color(DARK), 8, 22);
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
  camera.position.set(0, 0, 8.4);

  scene.add(new THREE.HemisphereLight(0xf5ead8, 0x2a241e, .9));
  const key = new THREE.DirectionalLight(0xfff3e4, 3.4); key.position.set(5, 6, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(new THREE.Color(ACCENT), 3.2); rim.position.set(-7, -2, -3); scene.add(rim);
  const fill = new THREE.PointLight(new THREE.Color(SAGE), 22, 24); fill.position.set(-2, 4, 5); scene.add(fill);
  const front = new THREE.PointLight(0xffe9d2, 18, 22); front.position.set(3, 1, 6); scene.add(front);

  const shapeM = toShape(M_PTS), shapeK = toShape(K_PTS);
  const depth = .42;
  const extrude = { depth, bevelEnabled: true, bevelThickness: .05, bevelSize: .045, bevelSegments: 4, curveSegments: 2 };
  const geoM = new THREE.ExtrudeGeometry(shapeM, extrude); geoM.center();
  const geoK = new THREE.ExtrudeGeometry(shapeK, extrude); geoK.center();

  const group = new THREE.Group();
  const solid = new THREE.Group(), wire = new THREE.Group(), cloud = new THREE.Group();
  group.add(solid, wire, cloud);
  scene.add(group);

  const meshM = new THREE.Mesh(geoM, new THREE.MeshStandardMaterial({ color: new THREE.Color(ACCENT), roughness: .34, metalness: .24 }));
  meshM.position.set(-.62, 0, 0);
  const meshK = new THREE.Mesh(geoK, new THREE.MeshStandardMaterial({ color: new THREE.Color(CREAM), roughness: .42, metalness: .12 }));
  meshK.position.set(.62, 0, 0);
  solid.add(meshM, meshK);

  const wM = new THREE.Mesh(geoM, new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT), wireframe: true, transparent: true, opacity: .55 }));
  wM.position.copy(meshM.position);
  const wK = new THREE.Mesh(geoK, new THREE.MeshBasicMaterial({ color: new THREE.Color(CREAM), wireframe: true, transparent: true, opacity: .4 }));
  wK.position.copy(meshK.position);
  wire.add(wM, wK);

  const mkPoints = (shape, color, offset) => {
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(samplePoints(shape, 5200, depth * 1.6), 3));
    bg.center();
    const p = new THREE.Points(bg, new THREE.PointsMaterial({ color: new THREE.Color(color), size: .028, sizeAttenuation: true, transparent: true, opacity: .92 }));
    p.position.set(offset, 0, 0);
    return p;
  };
  cloud.add(mkPoints(shapeM, ACCENT, -.62), mkPoints(shapeK, CREAM, .62));

  const blob = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.1, 1),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(SAGE), wireframe: true, transparent: true, opacity: .14 })
  );
  scene.add(blob);
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, .012, 8, 120),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT), transparent: true, opacity: .35 })
  );
  halo.rotation.x = 1.2;
  scene.add(halo);

  let variant = opts.variant || 'solid';
  let baseScale = 1, baseY = 0;

  function setVariant(v){
    variant = v;
    solid.visible = v === 'solid';
    wire.visible = v === 'wire';
    cloud.visible = v === 'cloud';
  }
  setVariant(variant);

  function resize(){
    const r = host.getBoundingClientRect();
    const w = Math.max(320, r.width), h = Math.max(320, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Three tiers: on wide screens the mark sits in the right half beside the
    // headline; mid widths pull it in and down; narrow puts it behind, dimmed
    // by the scrim.
    const tier = w > 1080 ? 2 : w > 760 ? 1 : 0;
    baseScale = [1.05, 1.32, 1.72][tier];
    baseY = [.2, .5, .45][tier];
    group.position.x = [0, 1.75, 2.45][tier];
    group.position.z = [-1.2, -.6, 0][tier];
    blob.position.set([1, 2, 2.6][tier], -.2, -3.4);
    halo.position.set([0, 1.5, 2][tier], 0, -.6);
    camera.fov = 36 / Math.max(.62, Math.min(1, w / 1180));
    camera.updateProjectionMatrix();
  }
  resize();

  const pointer = { x: 0, y: 0 };
  const drag = { active: false, x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0 };

  const onMove = e => {
    const r = host.getBoundingClientRect();
    pointer.x = (e.clientX - r.left) / r.width - .5;
    pointer.y = (e.clientY - r.top) / r.height - .5;
    if (drag.active){
      drag.vy += (e.clientX - drag.lastX) * .006;
      drag.vx += (e.clientY - drag.lastY) * .006;
      drag.lastX = e.clientX; drag.lastY = e.clientY;
    }
  };
  const onDown = e => { drag.active = true; drag.lastX = e.clientX; drag.lastY = e.clientY; canvas.classList.add('grabbing'); };
  const onUp = () => { drag.active = false; canvas.classList.remove('grabbing'); };
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('resize', resize);

  const cur = { rx: 0, ry: 0 };
  const t0 = performance.now();
  let raf = 0;

  function frame(now){
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;
    const m = motion;
    const scrolled = window.scrollY || document.documentElement.scrollTop || 0;
    const sp = Math.min(1.4, scrolled / Math.max(400, window.innerHeight));

    drag.x += drag.vx; drag.y += drag.vy;
    drag.vx *= .93; drag.vy *= .93;

    const baseRy = pointer.x * .85 * m + drag.y;
    const baseRx = pointer.y * .5 * m + drag.x;
    let spin, bob;
    if (variant === 'solid'){ spin = Math.sin(t * .35) * .14 * m + sp * 2.0; bob = Math.sin(t * .7) * .1 * m; }
    else if (variant === 'wire'){ spin = t * .34 * m + sp * 3.4; bob = Math.sin(t * 1.1) * .06 * m; }
    else { spin = Math.sin(t * .22) * .4 * m + sp * 1.5; bob = Math.sin(t * .5) * .14 * m; }

    cur.ry += (baseRy + spin - cur.ry) * .075;
    cur.rx += (baseRx - cur.rx) * .075;
    group.rotation.y = cur.ry;
    group.rotation.x = cur.rx;
    group.position.y = bob + baseY;
    group.scale.setScalar((variant === 'cloud' ? 1 + Math.sin(t * .9) * .05 * m : 1) * baseScale);
    if (variant === 'cloud') cloud.children.forEach((p, i) => { p.rotation.z = Math.sin(t * .4 + i) * .05; });

    blob.rotation.y = t * .06;
    blob.rotation.x = t * .03;
    halo.rotation.z = t * .12 * m;
    halo.rotation.x = 1.2 + Math.sin(t * .3) * .2;

    camera.position.z = 8.4 + sp * 1.6;
    camera.position.x = pointer.x * .5;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  if (opts.still){
    resize();
    renderer.render(scene, camera);
  } else {
    raf = requestAnimationFrame(frame);
  }

  return {
    setVariant,
    destroy(){
      cancelAnimationFrame(raf);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', resize);
      renderer.dispose();
    }
  };
}
