// Tiny 3D helper for shared figures: a turntable camera you can drag (mouse or finger), simple projection with depth,
// and wireframe builders for the shapes physics and chemistry lessons need (ring, disc, rod, sphere, shell, cylinder,
// plate, box, cone). No libraries. Use with a kit.js canvas:
//   const cam = orbit(cv, { yaw: 0.6, pitch: 0.35 });   // drag on the canvas turns the view, double-click resets
//   cv.draw = (ctx, w, h, col) => { const P = cam.proj(w, h, scale); ...P([x, y, z]) -> [sx, sy, depth] ... }
// Axes: x to the right, y up, z towards the viewer (before turning).

export function orbit(cv, { yaw = 0.6, pitch = 0.35, min = -1.35, max = 1.35, onchange } = {}) {
  const start = { yaw, pitch };
  const cam = { yaw, pitch, dragging: false };
  const c = cv.c;
  c.style.touchAction = 'pan-y';
  c.style.cursor = 'grab';
  let px = 0, py = 0, id = null;
  c.addEventListener('pointerdown', (e) => { id = e.pointerId; px = e.clientX; py = e.clientY; cam.dragging = true; c.style.cursor = 'grabbing'; c.setPointerCapture?.(id); });
  c.addEventListener('pointermove', (e) => {
    if (!cam.dragging || e.pointerId !== id) return;
    cam.yaw += (e.clientX - px) * 0.01;
    cam.pitch = Math.max(min, Math.min(max, cam.pitch + (e.clientY - py) * 0.01));
    px = e.clientX; py = e.clientY;
    onchange && onchange(); cv.redraw();
  });
  const end = () => { cam.dragging = false; c.style.cursor = 'grab'; };
  c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
  c.addEventListener('dblclick', () => { cam.yaw = start.yaw; cam.pitch = start.pitch; cv.redraw(); });
  c.title = 'Drag to turn the view. Double-click to reset.';
  /** A projector for this frame: P([x,y,z]) → [screenX, screenY, depth] (depth larger = nearer the viewer). */
  cam.proj = (w, h, scale, cx = w / 2, cy = h / 2) => {
    const cy_ = Math.cos(cam.yaw), sy = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    return ([x, y, z]) => {
      const x1 = x * cy_ + z * sy, z1 = -x * sy + z * cy_;
      const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
      const f = 1 / (1 - z2 * 0.08); // gentle perspective
      return [cx + x1 * scale * f, cy - y2 * scale * f, z2];
    };
  };
  return cam;
}

/** Rotate a point about an axis through the origin: axis 'x' | 'y' | 'z' by angle a. */
export function rot([x, y, z], axis, a) {
  const c = Math.cos(a), s = Math.sin(a);
  if (axis === 'x') return [x, y * c - z * s, y * s + z * c];
  if (axis === 'y') return [x * c + z * s, y, -x * s + z * c];
  return [x * c - y * s, x * s + y * c, z];
}
/** Rotate about an arbitrary unit axis u through point o (Rodrigues). */
export function rotAbout(p, o, u, a) {
  const v = [p[0] - o[0], p[1] - o[1], p[2] - o[2]], c = Math.cos(a), s = Math.sin(a);
  const d = v[0] * u[0] + v[1] * u[1] + v[2] * u[2];
  const cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  return [0, 1, 2].map((i) => o[i] + v[i] * c + cr[i] * s + u[i] * d * (1 - c));
}

const circ = (r, n, f) => Array.from({ length: n + 1 }, (_, i) => f((i / n) * Math.PI * 2, r));

/** Wireframes: each returns a list of polylines (arrays of [x,y,z]). Sizes in model units. */
export const shapes = {
  ring: (R = 1) => [circ(R, 48, (t, r) => [r * Math.cos(t), 0, r * Math.sin(t)])],
  disc: (R = 1) => [
    circ(R, 48, (t, r) => [r * Math.cos(t), 0, r * Math.sin(t)]),
    circ(R * 0.66, 36, (t, r) => [r * Math.cos(t), 0, r * Math.sin(t)]),
    circ(R * 0.33, 24, (t, r) => [r * Math.cos(t), 0, r * Math.sin(t)]),
    ...[0, 1, 2, 3, 4, 5].map((k) => [[0, 0, 0], [R * Math.cos((k * Math.PI) / 3), 0, R * Math.sin((k * Math.PI) / 3)]]),
  ],
  cylinder: (R = 1, H = 1) => [
    circ(R, 40, (t, r) => [r * Math.cos(t), H / 2, r * Math.sin(t)]),
    circ(R, 40, (t, r) => [r * Math.cos(t), -H / 2, r * Math.sin(t)]),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const t = (k * Math.PI) / 4; return [[R * Math.cos(t), H / 2, R * Math.sin(t)], [R * Math.cos(t), -H / 2, R * Math.sin(t)]]; }),
  ],
  tube: (R = 1, H = 1) => shapes.cylinder(R, H),
  rod: (L = 2) => [[[-L / 2, 0, 0], [L / 2, 0, 0]]],
  sphere: (R = 1, n = 6) => {
    const out = [];
    for (let i = 1; i < n; i++) { const phi = (i / n) * Math.PI, y = R * Math.cos(phi), r = R * Math.sin(phi); out.push(circ(r, 40, (t) => [r * Math.cos(t), y, r * Math.sin(t)])); }
    for (let k = 0; k < n; k++) { const t = (k / n) * Math.PI; out.push(circ(R, 40, (p) => [R * Math.sin(p) * Math.cos(t), R * Math.cos(p), R * Math.sin(p) * Math.sin(t)])); }
    return out;
  },
  plate: (a = 2, b = 1.4) => {
    const out = [], A = a / 2, B = b / 2;
    for (let i = 0; i <= 4; i++) { const x = -A + (i / 4) * a; out.push([[x, 0, -B], [x, 0, B]]); }
    for (let j = 0; j <= 4; j++) { const z = -B + (j / 4) * b; out.push([[-A, 0, z], [A, 0, z]]); }
    return out;
  },
  box: (a = 1, b = 1, c = 1) => {
    const A = a / 2, B = b / 2, C = c / 2, v = (i) => [i & 1 ? A : -A, i & 2 ? B : -B, i & 4 ? C : -C];
    const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
    return E.map(([i, j]) => [v(i), v(j)]);
  },
  cone: (R = 1, H = 1.4) => [
    circ(R, 40, (t, r) => [r * Math.cos(t), -H / 2, r * Math.sin(t)]),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const t = (k * Math.PI) / 4; return [[R * Math.cos(t), -H / 2, R * Math.sin(t)], [0, H / 2, 0]]; }),
  ],
};

/** Draw polylines through a projector, nearer segments darker and thicker (simple depth cue). */
export function wire(ctx, P, polys, color, width = 1.6) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineCap = 'round';
  for (const poly of polys) {
    for (let i = 1; i < poly.length; i++) {
      const a = P(poly[i - 1]), b = P(poly[i]), d = (a[2] + b[2]) / 2;
      ctx.globalAlpha = Math.max(0.25, Math.min(1, 0.65 + d * 0.35));
      ctx.lineWidth = width * (d > 0 ? 1.25 : 0.85);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
  }
  ctx.restore();
}

/** Points along polylines (for "mass elements" dots). */
export function sample(polys, every = 1) {
  const out = [];
  polys.forEach((p) => p.forEach((q, i) => { if (i % every === 0) out.push(q); }));
  return out;
}
