// Class 10 Circles: the two tangents from an outside point P are equal (PA = PB). Drag P and watch the two lengths stay equal.
// Slide "Fold along OP" and the lower half of the picture flips over the line OP: B lands exactly on A. The figure is a kite,
// OP bisects the angle APB, and ∠APB + ∠AOB = 180° because the angles at A and B are both 90°.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let dist = 2.4, ang = 0, fold = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Two tangents from an outside point, equal in length, with a fold slider showing the symmetry' });
  const ctl = row(host);
  const sd = slider(ctl, { label: 'Distance OP', min: 1.2, max: 3.4, step: 0.05, value: dist, fmt: (v) => v.toFixed(2) + ' r', oninput: (v) => { dist = v; say(); } });
  slider(ctl, { label: 'Fold along OP', min: 0, max: 1, step: 0.02, value: fold, fmt: (v) => (v >= 0.99 ? 'folded' : Math.round(v * 100) + '%'), oninput: (v) => { fold = v; say(); } });
  const out = readout(host); let G = {};
  function say() {
    const al = Math.acos(1 / dist), pa = Math.sqrt(dist * dist - 1), apb = 180 - 2 * ((al * 180) / Math.PI);
    out.innerHTML = `PA = PB = √(OP² − r²) = <b>${pa.toFixed(2)} r</b>. ∠AOB = ${(2 * al * 180 / Math.PI).toFixed(0)}° and ∠APB = <b>${apb.toFixed(0)}°</b>: together <b>180°</b>.`; cv.redraw();
  }
  cv.c.style.touchAction = 'none'; let on = false;
  const mv = (e) => { const r = cv.c.getBoundingClientRect(), x = e.clientX - r.left - G.cx, y = e.clientY - r.top - G.cy; dist = Math.max(1.2, Math.min(3.4, Math.hypot(x, y) / G.R)); ang = Math.atan2(y, x); sd.set(dist); say(); };
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(); if (Math.hypot(e.clientX - r.left - G.px, e.clientY - r.top - G.py) < 34) { on = true; cv.c.setPointerCapture(e.pointerId); e.preventDefault(); } });
  cv.c.addEventListener('pointermove', (e) => on && mv(e));
  cv.c.addEventListener('pointerup', () => (on = false)); cv.c.addEventListener('pointercancel', () => (on = false));
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Two tangents, equal lengths', col);
    const R = Math.min(w * 0.17, (h - 70) * 0.27), cx = w * 0.36, cy = h / 2 + 12;
    const px = cx + Math.cos(ang) * dist * R, py = cy + Math.sin(ang) * dist * R; G = { cx, cy, R, px, py };
    const al = Math.acos(1 / dist), A = [cx + Math.cos(ang + al) * R, cy + Math.sin(ang + al) * R], B0 = [cx + Math.cos(ang - al) * R, cy + Math.sin(ang - al) * R];
    // fold: reflect B across line OP by scaling its perpendicular part with cos(pi*fold)
    const ex = Math.cos(ang), ey = Math.sin(ang), rx = B0[0] - cx, ry = B0[1] - cy, par = rx * ex + ry * ey, perp = [rx - par * ex, ry - par * ey], f = Math.cos(Math.PI * fold);
    const B = [cx + par * ex + perp[0] * f, cy + par * ey + perp[1] * f];
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, [[cx, cy], [px, py]], col.muted, 1.5, [5, 4]);
    line(ctx, [[px, py], A], col.s[1], 3); line(ctx, [[px, py], B], col.s[2], fold > 0.97 ? 2 : 3); line(ctx, [[cx, cy], A], col.s[0], 1.5); line(ctx, [[cx, cy], B], col.s[0], 1.5);
    dot(ctx, cx, cy, 3.5, col.ink); dot(ctx, A[0], A[1], 5.5, col.s[1], col.panel); dot(ctx, B[0], B[1], 5.5, col.s[2], col.panel); dot(ctx, px, py, 7, col.s[3], col.ink);
    text(ctx, 'P', px + Math.cos(ang) * 14, py + Math.sin(ang) * 14, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'O', cx - 12, cy, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    text(ctx, 'A', A[0] + Math.cos(ang + al) * 13, A[1] + Math.sin(ang + al) * 13, { color: col.s[1], size: 13, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'B', B[0] + (B[0] - cx) / R * 13, B[1] + (B[1] - cy) / R * 13, { color: col.s[2], size: 13, weight: 700, align: 'center', halo: col.panel });
    const pa = Math.hypot(A[0] - px, A[1] - py), pb = Math.hypot(B[0] - px, B[1] - py);
    text(ctx, fold < 0.02 ? 'PA = PB (both ' + (pa / R).toFixed(2) + ' r)' : fold > 0.97 ? 'B has landed on A: PA = PB' : 'folding...', w / 2, h - 14, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
  };
  say();
}
