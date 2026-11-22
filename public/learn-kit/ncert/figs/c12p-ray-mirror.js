// Class 12 Ray Optics: image formed by a concave or convex spherical mirror. Drag the object (or use the slider) and
// watch the three principal rays: parallel to the axis then through (or from) F; through the pole, reflected at equal angle;
// aimed at F, then parallel to the axis. Where the reflected rays meet (solid) or seem to meet (dashed) is the image.
// New Cartesian convention: distances from the pole, positive along the incident light. Mirror formula 1/v + 1/u = 1/f,
// magnification m = -v/u; a concave mirror has f < 0, a convex one f > 0.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let kind = 'concave', d = 30, F = 10, geo = { s: 5, xm: 300 };
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 280, label: 'Ray diagram for a concave or convex mirror with a movable object' });
  cv.c.style.cursor = 'ew-resize';
  touchGuard(cv.c, (x) => Math.abs(x - (geo.xm - d * geo.s)) < 34);
  const ctl = row(host);
  choice(ctl, 'Mirror', [['concave', 'Concave'], ['convex', 'Convex']], kind, (v) => { kind = v; upd(); });
  const sd = slider(ctl, { label: 'Object distance', min: 3, max: 40, step: 1, value: d, fmt: (v) => `${v} cm`, oninput: (v) => { d = v; upd(); } });
  slider(ctl, { label: 'Focal length', min: 6, max: 15, step: 1, value: F, fmt: (v) => `${v} cm`, oninput: (v) => { F = v; upd(); } });
  const out = readout(host);
  const f = () => (kind === 'concave' ? -F : F);
  const img = () => { const inv = 1 / f() + 1 / d; return Math.abs(inv) < 1e-9 ? { v: Infinity, m: Infinity } : { v: 1 / inv, m: (1 / inv) / d }; };
  function nature() {
    const { v, m } = img();
    if (!Number.isFinite(v)) return 'at infinity: reflected rays are parallel';
    return `${v < 0 ? 'real, in front of the mirror' : 'virtual, behind the mirror'}, ${m < 0 ? 'inverted' : 'erect'}, ${Math.abs(m) > 1.01 ? 'magnified' : Math.abs(m) < 0.99 ? 'diminished' : 'same size'}`;
  }
  function upd() {
    const { v, m } = img();
    out.innerHTML = `f = ${f()} cm, u = −${d} cm → v = <b>${Number.isFinite(v) ? v.toFixed(1) : '∞'} cm</b>, m = −v/u = <b>${Number.isFinite(m) ? m.toFixed(2) : '∞'}</b>. Image ${nature()}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${kind === 'concave' ? 'Concave' : 'Convex'} mirror: drag the object`, col);
    const xm = Math.round(w * 0.72), s = (xm - 14) / 42, cy = Math.round(h * 0.56), half = h * 0.3, ho = Math.min(32, h * 0.12);
    geo = { s, xm };
    const fs = f() * s, xF = xm + fs, xC = xm + 2 * fs;
    line(ctx, [[6, cy], [w - 6, cy]], col.line, 1);
    // mirror arc
    const Rpx = 2 * Math.abs(fs), ang = Math.asin(Math.min(0.99, half / Rpx));
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3.5;
    ctx.beginPath(); if (kind === 'concave') ctx.arc(xm - Rpx, cy, Rpx, -ang, ang); else ctx.arc(xm + Rpx, cy, Rpx, Math.PI - ang, Math.PI + ang);
    ctx.stroke();
    ctx.lineWidth = 1.2; ctx.strokeStyle = col.muted;
    for (let k = -4; k <= 4; k++) { const y = cy + (k / 4) * half * 0.95, sag = Rpx - Math.sqrt(Rpx * Rpx - (y - cy) ** 2), x0 = kind === 'concave' ? xm - sag : xm + sag; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 8, y + 7); ctx.stroke(); }
    ctx.restore();
    for (const [x, lab] of [[xm, 'P'], [xF, 'F'], [xC, 'C']]) if (x > 4 && x < w - 4) { line(ctx, [[x, cy - 4], [x, cy + 4]], col.ink, 1.5); text(ctx, lab, x, cy + 15, { color: col.muted, size: 11, weight: 700, align: 'center' }); }
    const xo = xm - d * s, yt = cy - ho, { v, m } = img();
    arrow(ctx, xo, cy, xo, yt, col.ink, 3, 8); text(ctx, 'object', xo, cy + 28, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const sg = kind === 'concave' ? 1 : -1, r = [col.s[0], col.s[1], col.s[2]];
    const ext = (p, dir, c, len) => { const L = len / Math.hypot(dir[0], dir[1]); line(ctx, [p, [p[0] + dir[0] * L, p[1] + dir[1] * L]], c, 1.8); };
    // ray 1: parallel to axis, then through/from F
    line(ctx, [[xo, yt], [xm, yt]], r[0], 1.8);
    const d1 = [sg * (xF - xm), sg * (cy - yt)]; ext([xm, yt], d1, r[0], w);
    // ray 2: to the pole
    line(ctx, [[xo, yt], [xm, cy]], r[1], 1.8); ext([xm, cy], [-(xm - xo), cy - yt], r[1], w);
    // ray 3: aimed at F
    let y3 = null; if (Math.abs(xF - xo) > 3) { y3 = yt + (cy - yt) * (xm - xo) / (xF - xo); if (Math.abs(y3 - cy) > half * 0.95) y3 = null; }
    if (y3 !== null) { line(ctx, [[xo, yt], [xm, y3]], r[2], 1.8); ext([xm, y3], [-1, 0], r[2], w); }
    if (Number.isFinite(v)) {
      const xI = xm + v * s, yI = cy - m * ho;
      if (v > 0) { // virtual: dashed behind the mirror
        const bk = (p, c) => line(ctx, [p, [xI, yI]], c, 1.4, [4, 4]); bk([xm, yt], r[0]); bk([xm, cy], r[1]); if (y3 !== null) bk([xm, y3], r[2]);
      }
      if (xI > 4 && xI < w - 4 && Math.abs(m * ho) < h * 0.4) { ctx.save(); if (v > 0) ctx.setLineDash([4, 3]); arrow(ctx, xI, cy, xI, yI, col.s[3], 3, 8); ctx.restore(); text(ctx, 'image', xI, cy + (m < 0 ? -m * ho + 16 : 28), { color: col.s[3], size: 11, weight: 700, align: 'center' }); }
    }
  };
  const drag = (e) => { const rc = cv.c.getBoundingClientRect(); d = Math.max(3, Math.min(40, Math.round((geo.xm - (e.clientX - rc.left)) / geo.s))); sd.set(d); upd(); };
  cv.c.addEventListener('pointerdown', (e) => { cv.c.setPointerCapture(e.pointerId); drag(e); cv.c.onpointermove = drag; });
  cv.c.addEventListener('pointerup', () => { cv.c.onpointermove = null; });
  upd();
}
