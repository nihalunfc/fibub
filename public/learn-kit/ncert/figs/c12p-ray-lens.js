// Class 12 Ray Optics: image formed by a thin convex or concave lens. Drag the object (or use the slider). Principal rays:
// parallel to the axis then through the far focus; through the optical centre undeviated; through the near focus then parallel.
// New Cartesian convention: lens formula 1/v - 1/u = 1/f, magnification m = v/u, power P = 1/f in metres (dioptres).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let kind = 'convex', d = 30, F = 10, geo = { s: 5, lx: 200 };
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 280, label: 'Ray diagram for a convex or concave lens with a movable object' });
  cv.c.style.cursor = 'ew-resize';
  touchGuard(cv.c, (x) => Math.abs(x - (geo.lx - d * geo.s)) < 34);
  const ctl = row(host);
  choice(ctl, 'Lens', [['convex', 'Convex'], ['concave', 'Concave']], kind, (v) => { kind = v; upd(); });
  const sd = slider(ctl, { label: 'Object distance', min: 3, max: 40, step: 1, value: d, fmt: (v) => `${v} cm`, oninput: (v) => { d = v; upd(); } });
  slider(ctl, { label: 'Focal length', min: 6, max: 15, step: 1, value: F, fmt: (v) => `${v} cm`, oninput: (v) => { F = v; upd(); } });
  const out = readout(host);
  const f = () => (kind === 'convex' ? F : -F);
  const img = () => { const inv = 1 / f() - 1 / d; return Math.abs(inv) < 1e-9 ? { v: Infinity, m: Infinity } : { v: 1 / inv, m: (1 / inv) / -d }; };
  function upd() {
    const { v, m } = img();
    const nat = !Number.isFinite(v) ? 'at infinity: refracted rays are parallel' : `${v > 0 ? 'real, on the far side' : 'virtual, on the object’s side'}, ${m < 0 ? 'inverted' : 'erect'}, ${Math.abs(m) > 1.01 ? 'magnified' : Math.abs(m) < 0.99 ? 'diminished' : 'same size'}`;
    out.innerHTML = `f = ${f()} cm (power ${(100 / f()).toFixed(1)} D), u = −${d} cm → v = <b>${Number.isFinite(v) ? v.toFixed(1) : '∞'} cm</b>, m = v/u = <b>${Number.isFinite(m) ? m.toFixed(2) : '∞'}</b>. Image ${nat}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${kind === 'convex' ? 'Convex' : 'Concave'} lens: drag the object`, col);
    const lx = Math.round(w * 0.5), s = (lx - 14) / 42, cy = Math.round(h * 0.56), half = h * 0.32, ho = Math.min(32, h * 0.12);
    geo = { s, lx };
    const xF1 = lx - f() * s, xF2 = lx + f() * s;
    line(ctx, [[6, cy], [w - 6, cy]], col.line, 1);
    // lens outline
    const conv = kind === 'convex', bulge = conv ? 9 : -6, edge = conv ? 2 : 9;
    ctx.save(); ctx.strokeStyle = col.ink; ctx.fillStyle = col.soft; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(lx - edge, cy - half); ctx.quadraticCurveTo(lx - edge - bulge * 1.6, cy, lx - edge, cy + half); ctx.lineTo(lx + edge, cy + half); ctx.quadraticCurveTo(lx + edge + bulge * 1.6, cy, lx + edge, cy - half); ctx.closePath();
    ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
    for (const [x, lab] of [[lx, 'O'], [xF1, 'F'], [xF2, 'F']]) if (x > 4 && x < w - 4) { line(ctx, [[x, cy - 4], [x, cy + 4]], col.ink, 1.5); text(ctx, lab, x, cy + 15, { color: col.muted, size: 11, weight: 700, align: 'center' }); }
    const xo = lx - d * s, yt = cy - ho, { v, m } = img(), r = [col.s[0], col.s[1], col.s[2]];
    arrow(ctx, xo, cy, xo, yt, col.ink, 3, 8); text(ctx, 'object', xo, cy + 28, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const sg = f() > 0 ? 1 : -1, ext = (p, dir, c) => { const L = w / Math.hypot(dir[0], dir[1]); line(ctx, [p, [p[0] + dir[0] * L, p[1] + dir[1] * L]], c, 1.8); };
    line(ctx, [[xo, yt], [lx, yt]], r[0], 1.8); ext([lx, yt], [sg * (xF2 - lx), sg * (cy - yt)], r[0]);
    line(ctx, [[xo, yt], [lx, cy]], r[1], 1.8); ext([lx, cy], [lx - xo, cy - yt], r[1]);
    let y3 = null; if (Math.abs(xF1 - xo) > 3) { y3 = yt + (cy - yt) * (lx - xo) / (xF1 - xo); if (Math.abs(y3 - cy) > half * 0.95) y3 = null; }
    if (y3 !== null) { line(ctx, [[xo, yt], [lx, y3]], r[2], 1.8); ext([lx, y3], [1, 0], r[2]); }
    if (Number.isFinite(v)) {
      const xI = lx + v * s, yI = cy - m * ho;
      if (v < 0) { const bk = (p, c) => line(ctx, [p, [xI, yI]], c, 1.4, [4, 4]); bk([lx, yt], r[0]); bk([lx, cy], r[1]); if (y3 !== null) bk([lx, y3], r[2]); }
      if (xI > 4 && xI < w - 4 && Math.abs(m * ho) < h * 0.4) { ctx.save(); if (v < 0) ctx.setLineDash([4, 3]); arrow(ctx, xI, cy, xI, yI, col.s[3], 3, 8); ctx.restore(); text(ctx, 'image', xI, cy + (m < 0 ? -m * ho + 16 : 28), { color: col.s[3], size: 11, weight: 700, align: 'center' }); }
    }
  };
  const drag = (e) => { const rc = cv.c.getBoundingClientRect(); d = Math.max(3, Math.min(40, Math.round((geo.lx - (e.clientX - rc.left)) / geo.s))); sd.set(d); upd(); };
  cv.c.addEventListener('pointerdown', (e) => { cv.c.setPointerCapture(e.pointerId); drag(e); cv.c.onpointermove = drag; });
  cv.c.addEventListener('pointerup', () => { cv.c.onpointermove = null; });
  upd();
}
