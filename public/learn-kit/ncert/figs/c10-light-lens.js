// Class 10 Light: ray diagram for a convex or concave lens (focal length 10 cm). Move the object (slider or drag it)
// and watch the three principal rays: parallel to the axis then through the far focus; through the optical centre,
// straight on; through the near focus, then parallel to the axis. Where the refracted rays meet (or seem to meet,
// dashed) is the image. Maths: lens formula 1/v - 1/u = 1/f, magnification m = v/u (New Cartesian sign convention).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout } from '../../kit.js';

export const F = 10;
export function lensImage(type, d) {
  const f = type === 'convex' ? F : -F, u = -d, inv = 1 / f + 1 / u;
  if (Math.abs(inv) < 1e-9) return { v: Infinity, m: Infinity, f, u };
  const v = 1 / inv;
  return { v, m: v / u, f, u };
}
export function lensNature(type, d) {
  if (type === 'concave') return 'virtual, erect, diminished, on the object’s side between O and F';
  if (d > 2 * F) return 'real, inverted, diminished, between F and 2F on the other side';
  if (d === 2 * F) return 'real, inverted, same size, at 2F on the other side';
  if (d > F) return 'real, inverted, enlarged, beyond 2F on the other side';
  if (d === F) return 'at infinity (parallel rays), real, inverted, highly enlarged';
  return 'virtual, erect, enlarged, on the object’s side';
}

export function drawLens(ctx, w, h, col, type, d, o = {}) {
  if (o.quiet) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h - 46); ctx.clip(); try { return drawLens(ctx, w, h, col, type, d, { ...o, quiet: false, inner: true }); } finally { ctx.restore(); } }
  const conv = type === 'convex', lx = Math.round(w * 0.52), s = (lx - 14) / 33, cy = Math.round(h * (o.cyf ?? 0.52));
  const ho = Math.max(18, Math.min(30, 4 * s)), half = h * (o.cyf ? 0.3 : 0.33);
  const xF1 = lx - F * s, xF2 = lx + F * s;
  line(ctx, [[6, cy], [w - 6, cy]], col.line, 1);
  // lens outline
  ctx.save(); ctx.strokeStyle = col.ink; ctx.fillStyle = col.soft; ctx.lineWidth = 2.5; ctx.globalAlpha = 1;
  const bulge = conv ? 9 : -5, edge = conv ? 1 : 9;
  ctx.beginPath(); ctx.moveTo(lx - edge, cy - half);
  ctx.quadraticCurveTo(lx - edge - bulge * 1.6 + (conv ? 0 : 0), cy, lx - edge, cy + half);
  ctx.lineTo(lx + edge, cy + half); ctx.quadraticCurveTo(lx + edge + bulge * 1.6, cy, lx + edge, cy - half); ctx.closePath();
  ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
  for (const [x, lab] of [[lx, 'O'], [xF1, 'F'], [xF2, 'F'], [lx - 2 * F * s, '2F'], [lx + 2 * F * s, '2F']]) { line(ctx, [[x, cy - 4], [x, cy + 4]], col.ink, 1.5); text(ctx, lab, x, cy + 15, { color: col.muted, size: 11, weight: 700, align: 'center' }); }
  const rc = [col.s[0], col.s[1], col.s[2]], dr = (pts, c, dash) => line(ctx, pts, c, 1.8, dash);
  const { v, m } = lensImage(type, d), xI = lx + v * s, real = v > 0, yt = cy - ho, xo = lx - d * s;
  if (o.far) {
    for (const [dy, c] of [[-ho, rc[0]], [ho * 0.6, rc[1]]]) {
      const y = cy + dy; dr([[8, y], [lx, y]], c); arrow(ctx, w * 0.2, y, w * 0.2 + 14, y, c, 1.8, 6);
      const k = -dy / (F * s); dr([[lx, y], [Math.min(w - 8, xF2 + F * s * 0.8), y + k * (F * s * 1.8)]], c);
    }
    dot(ctx, xF2, cy, 5, col.s[3], col.panel);
    if (!o.inner) text(ctx, 'rays from a far-away object are parallel', 10, h - 24, { color: col.muted, size: 11 });
    return { s, lx, cy };
  }
  arrow(ctx, xo, cy, xo, yt, col.ink, 3, 8); text(ctx, 'object', xo, cy + 28, { color: col.ink, size: 11, weight: 700, align: 'center' });
  if (o.rays !== false) {
    const endX = real && Number.isFinite(xI) ? Math.min(w - 8, xI + 26) : w - 8;
    const sA = conv ? (cy - yt) / (F * s) : (yt - cy) / (F * s), yA = (x) => yt + sA * (x - lx);
    dr([[xo, yt], [lx, yt]], rc[0]); dr([[lx, yt], [endX, yA(endX)]], rc[0]);
    const kB = (cy - yt) / (lx - xo), yB = (x) => yt + kB * (x - xo);
    dr([[xo, yt], [endX, yB(endX)]], rc[1]);
    const xT = conv ? xF1 : xF2; let yH = null;
    if (Math.abs(xo - xT) > 3) { yH = cy + (yt - cy) * (lx - xT) / (xo - xT); if (Math.abs(yH - cy) > half * 0.95) yH = null; }
    if (yH !== null) { dr([[xo, yt], [lx, yH]], rc[2]); dr([[lx, yH], [endX, yH]], rc[2]); }
    if (!real && Number.isFinite(xI)) { const yI = cy - m * ho; dr([[lx, yt], [xI, yI]], rc[0], [4, 4]); dr([[xo, yt], [xI, yI]], rc[1], [4, 4]); if (yH !== null) dr([[lx, yH], [xI, yI]], rc[2], [4, 4]); }
  }
  if (Number.isFinite(xI)) {
    const hI = m * ho, yI = cy - hI;
    if (xI > 6 && xI < w - 6 && Math.abs(hI) < h * 0.32) {
      ctx.save(); if (!real) ctx.setLineDash([4, 3]); arrow(ctx, xI, cy, xI, yI, col.s[3], 3, 8); ctx.restore();
      text(ctx, 'image', xI, cy + (hI < 0 ? -hI + 16 : 28), { color: col.s[3], size: 11, weight: 700, align: 'center' });
    } else if (!o.inner) text(ctx, 'image is off the picture: very big or very far', 10, h - 24, { color: col.s[3], size: 11, weight: 700 });
  } else if (!o.inner) text(ctx, 'refracted rays are parallel: image at infinity', 10, h - 24, { color: col.s[3], size: 11, weight: 700 });
  return { s, lx, cy };
}

export default function (host) {
  let type = 'convex', d = 30, geo = { s: 6, lx: 200 }, rays = true;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Ray diagram for a convex or concave lens with a movable object' });
  cv.c.style.touchAction = 'pan-y'; cv.c.style.cursor = 'ew-resize';
  const ctl = row(host);
  choice(ctl, 'Lens', [['convex', 'Convex'], ['concave', 'Concave']], type, (t) => { type = t; update(); });
  const sl = slider(ctl, { label: 'Object distance', min: 4, max: 32, step: 1, value: d, fmt: (v) => `${v} cm`, oninput: (v) => { d = v; update(); } });
  choice(ctl, 'Rays', [['on', 'Show'], ['off', 'Hide']], 'on', (v) => { rays = v === 'on'; update(); });
  const out = readout(host);
  function update() {
    const { v, m } = lensImage(type, d);
    out.innerHTML = `f = ${type === 'convex' ? '+10' : '−10'} cm, u = −${d} cm → v = <b>${Number.isFinite(v) ? v.toFixed(1) : '∞'} cm</b>, m = <b>${Number.isFinite(m) ? m.toFixed(2) : '∞'}</b>. Image: ${lensNature(type, d)}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => { title(ctx, `${type === 'convex' ? 'Convex' : 'Concave'} lens: drag the object`, col); geo = drawLens(ctx, w, h, col, type, d, { rays }); };
  const drag = (e) => { const r = cv.c.getBoundingClientRect(); d = Math.max(4, Math.min(32, Math.round((geo.lx - (e.clientX - r.left)) / geo.s))); sl.set(d); update(); };
  cv.c.addEventListener('pointerdown', (e) => { cv.c.setPointerCapture(e.pointerId); drag(e); cv.c.onpointermove = drag; });
  cv.c.addEventListener('pointerup', () => { cv.c.onpointermove = null; });
  update();
}
