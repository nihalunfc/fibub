// Class 10 Light: ray diagram for a concave or convex mirror (focal length 10 cm). Move the object (slider or drag it)
// and watch the three principal rays: parallel to the axis then through F; towards the pole and reflected at the same
// angle; and the one through (or towards) F, which comes out parallel. Where the reflected rays meet (or seem to meet,
// dashed) is the image. Maths: mirror formula 1/v + 1/u = 1/f, magnification m = -v/u, with the New Cartesian sign
// convention (distances measured from the pole; the direction of the incident light is positive).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout } from '../../kit.js';

export const F = 10;
/** Image distance v and magnification m for an object d cm in front of a mirror of focal length 10 cm. */
export function mirrorImage(type, d) {
  const f = type === 'concave' ? -F : F, u = -d, inv = 1 / f - 1 / u;
  if (Math.abs(inv) < 1e-9) return { v: Infinity, m: Infinity, f, u };
  const v = 1 / inv;
  return { v, m: -v / u, f, u };
}
export function mirrorNature(type, d) {
  if (type === 'convex') return 'virtual, erect, diminished, behind the mirror between P and F';
  if (d > 2 * F) return 'real, inverted, diminished, between F and C';
  if (d === 2 * F) return 'real, inverted, same size, at C';
  if (d > F) return 'real, inverted, enlarged, beyond C';
  if (d === F) return 'at infinity (parallel rays), real, inverted, highly enlarged';
  return 'virtual, erect, enlarged, behind the mirror';
}

/** Draw the whole scene. Returns the geometry so a caller can turn a pointer position into a distance. */
export function drawMirror(ctx, w, h, col, type, d, o = {}) {
  if (o.quiet) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h - 46); ctx.clip(); try { return drawMirror(ctx, w, h, col, type, d, { ...o, quiet: false, inner: true }); } finally { ctx.restore(); } }
  const conc = type === 'concave';
  const s = conc ? (w - 40) / 46 : (w - 28) / 66, mx = conc ? w - 24 : w - 14 - 20 * s, cy = Math.round(h * (o.cyf ?? 0.52));
  const ho = Math.max(18, Math.min(30, 4 * s)), half = h * (o.cyf ? 0.3 : 0.33), sg = conc ? -1 : 1;
  const xF = mx + sg * F * s, xC = mx + sg * 2 * F * s;
  // axis, mirror, hatching
  line(ctx, [[6, cy], [w - 6, cy]], col.line, 1);
  const R = 2 * F * s, a = Math.asin(Math.min(0.99, half / R)), cx0 = mx + sg * R * -1 * -1;
  ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath();
  if (conc) ctx.arc(mx - R, cy, R, -a, a); else ctx.arc(mx + R, cy, R, Math.PI - a, Math.PI + a);
  ctx.stroke(); ctx.lineWidth = 1;
  for (let k = -6; k <= 6; k++) { const ang = (k / 6) * a, px = conc ? mx - R + R * Math.cos(ang) : mx + R - R * Math.cos(ang), py = cy + R * Math.sin(ang); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 7, py + 5 * Math.sign(k || 1) * 0.3); ctx.stroke(); }
  ctx.restore();
  for (const [x, lab] of [[mx, 'P'], [xF, 'F'], [xC, 'C']]) { line(ctx, [[x, cy - 4], [x, cy + 4]], col.ink, 1.5); text(ctx, lab, x, cy + 15, { color: col.muted, size: 11, weight: 700, align: 'center' }); }
  if (!conc) text(ctx, 'behind the mirror', mx + 10 * s, cy - 14, { color: col.muted, size: 10, align: 'center' });
  const rc = [col.s[0], col.s[1], col.s[2]];
  const { v, m } = mirrorImage(type, d), xI = mx + v * s;
  const real = v < 0, xEnd = (x) => Math.max(8, x);
  const draw = (pts, c, dash) => line(ctx, pts, c, 1.8, dash);
  // object (or parallel rays from very far away)
  const yt = cy - ho, xo = mx - d * s;
  if (o.far) {
    for (const [dy, c] of [[-ho, rc[0]], [ho * 0.55, rc[1]]]) {
      const y = cy + dy; draw([[8, y], [mx, y]], c); arrow(ctx, w * 0.3, y, w * 0.3 + 14, y, c, 1.8, 6);
      draw([[mx, y], [xF, cy], [xEnd(xF - (mx - xF) * 0.6), cy - dy * 0.6]], c);
    }
    dot(ctx, xF, cy, 5, col.s[3], col.panel);
    if (!o.inner) text(ctx, 'rays from a far-away object are parallel', 10, h - 24, { color: col.muted, size: 11 });
    return { s, mx, cy };
  }
  arrow(ctx, xo, cy, xo, yt, col.ink, 3, 8); text(ctx, 'object', xo, cy + 28, { color: col.ink, size: 11, weight: 700, align: 'center' });
  if (o.rays !== false) {
    const lim = (x) => (real ? Math.max(8, Math.min(xI - 24, x)) : 8);
    const endX = real && Number.isFinite(xI) ? lim(xI - 24) : 8;
    // ray A: parallel to the axis, then through (or away from) F
    const sA = conc ? (cy - yt) / (xF - mx) : (yt - cy) / (mx - xF), yA = (x) => yt + sA * (x - mx);
    draw([[xo, yt], [mx, yt]], rc[0]); draw([[mx, yt], [endX, yA(endX)]], rc[0]);
    // ray B: towards the pole
    const kB = (cy - yt) / (mx - xo), yB = (x) => cy + kB * (mx - x);
    draw([[xo, yt], [mx, cy]], rc[1]); draw([[mx, cy], [endX, yB(endX)]], rc[1]);
    // ray C: the line through F; comes out parallel to the axis
    let yH = null;
    if (Math.abs(xo - xF) > 3) { yH = cy + (yt - cy) * (mx - xF) / (xo - xF); if (Math.abs(yH - cy) > half * 0.95) yH = null; }
    if (yH !== null) { draw([[xo, yt], [mx, yH]], rc[2]); draw([[mx, yH], [endX, yH]], rc[2]); }
    if (!real && Number.isFinite(xI)) { // virtual: dashed back-extensions behind the mirror
      const yI = cy - m * ho; draw([[mx, yt], [xI, yI]], rc[0], [4, 4]); draw([[mx, cy], [xI, yI]], rc[1], [4, 4]);
      if (yH !== null) draw([[mx, yH], [xI, yI]], rc[2], [4, 4]);
    }
  }
  if (Number.isFinite(xI)) {
    const hI = m * ho, yI = cy - hI;
    if (xI > 6 && xI < w - 6 && Math.abs(hI) < h * 0.32) {
      ctx.save(); if (!real) ctx.setLineDash([4, 3]); arrow(ctx, xI, cy, xI, yI, col.s[3], 3, 8); ctx.restore();
      text(ctx, 'image', xI, cy + (hI < 0 ? -hI + 16 : 28), { color: col.s[3], size: 11, weight: 700, align: 'center' });
    } else if (!o.inner) text(ctx, 'image is off the picture: very big or very far', 10, h - 24, { color: col.s[3], size: 11, weight: 700 });
  } else if (!o.inner) text(ctx, 'reflected rays are parallel: image at infinity', 10, h - 24, { color: col.s[3], size: 11, weight: 700 });
  return { s, mx, cy };
}

export default function (host) {
  let type = 'concave', d = 30, geo = { s: 7, mx: 376 }, rays = true;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Ray diagram for a concave or convex mirror with a movable object' });
  cv.c.style.touchAction = 'pan-y'; cv.c.style.cursor = 'ew-resize';
  const ctl = row(host);
  choice(ctl, 'Mirror', [['concave', 'Concave'], ['convex', 'Convex']], type, (t) => { type = t; update(); });
  const sl = slider(ctl, { label: 'Object distance', min: 4, max: 45, step: 1, value: d, fmt: (v) => `${v} cm`, oninput: (v) => { d = v; update(); } });
  choice(ctl, 'Rays', [['on', 'Show'], ['off', 'Hide']], 'on', (v) => { rays = v === 'on'; update(); });
  const out = readout(host);
  function update() {
    const { v, m } = mirrorImage(type, d);
    out.innerHTML = `f = ${type === 'concave' ? '−10' : '+10'} cm, u = −${d} cm → v = <b>${Number.isFinite(v) ? v.toFixed(1) : '∞'} cm</b>, m = <b>${Number.isFinite(m) ? m.toFixed(2) : '∞'}</b>. Image: ${mirrorNature(type, d)}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => { title(ctx, `${type === 'concave' ? 'Concave' : 'Convex'} mirror: drag the object`, col); geo = drawMirror(ctx, w, h, col, type, d, { rays }); };
  const drag = (e) => { const r = cv.c.getBoundingClientRect(); d = Math.max(4, Math.min(45, Math.round((geo.mx - (e.clientX - r.left)) / geo.s))); sl.set(d); update(); };
  cv.c.addEventListener('pointerdown', (e) => { cv.c.setPointerCapture(e.pointerId); drag(e); cv.c.onpointermove = drag; });
  cv.c.addEventListener('pointerup', () => { cv.c.onpointermove = null; });
  update();
}
