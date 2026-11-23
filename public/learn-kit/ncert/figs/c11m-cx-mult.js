// Class 11 Maths, Complex Numbers: multiplying complex numbers multiplies their lengths and ADDS their angles, so it turns and stretches the plane at once.
// |z1 z2| = |z1| |z2| and arg(z1 z2) = arg z1 + arg z2. Multiplying by i is a quarter turn. Drag z1 and z2.
import { canvas, text, title, row, button, readout, touchGuard, dot, arrow } from '../../kit.js';
import { argandPlot, cstr, r2, pos } from '../c11m-lib.js';

export default function (host) {
  let z1 = [2, 1], z2 = [1, 1], drag = -1, P = null;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'Two complex numbers and their product on the Argand plane with lengths multiplied and angles added' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Product = multiply lengths, add angles', col);
    P = argandPlot(ctx, w, h, col, { x: 22, y: 26, w: w - 34, h: h - 40 }, 6);
    const pr = [z1[0] * z2[0] - z1[1] * z2[1], z1[0] * z2[1] + z1[1] * z2[0]], T = (p) => [P.X(p[0]), P.Y(p[1])], O = T([0, 0]), ang = (p) => Math.atan2(p[1], p[0]), mod = (p) => Math.hypot(p[0], p[1]);
    [[z1, col.s[0], 20], [z2, col.s[2], 28], [pr, col.s[3], 38]].forEach(([p, c, rr]) => { if (mod(p) > 0.2) { ctx.strokeStyle = c; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(O[0], O[1], rr, 0, -ang(p), ang(p) > 0); ctx.stroke(); } });
    arrow(ctx, ...O, ...T(z1), col.s[0], 2.4, 9); arrow(ctx, ...O, ...T(z2), col.s[2], 2.4, 9); if (Math.abs(pr[0]) < 6.5 && Math.abs(pr[1]) < 6.5) arrow(ctx, ...O, ...T(pr), col.s[3], 3, 10);
    dot(ctx, ...T(z1), 8, col.s[0], col.panel); dot(ctx, ...T(z2), 8, col.s[2], col.panel); if (Math.abs(pr[0]) < 6.5 && Math.abs(pr[1]) < 6.5) dot(ctx, ...T(pr), 6, col.s[3], col.panel);
    text(ctx, 'z1', T(z1)[0] + 9, T(z1)[1] - 9, { color: col.s[0], size: 13, weight: 800 }); text(ctx, 'z2', T(z2)[0] + 9, T(z2)[1] - 9, { color: col.s[2], size: 13, weight: 800 }); text(ctx, 'z1·z2', T(pr)[0] + 9, T(pr)[1] - 9, { color: col.s[3], size: 13, weight: 800 });
    const d = (p) => r2((ang(p) * 180) / Math.PI, 0) + '°';
    out.innerHTML = `(${cstr(...z1)})(${cstr(...z2)}) = <b>${cstr(...pr)}</b>. Lengths: ${r2(mod(z1), 2)} × ${r2(mod(z2), 2)} = <b>${r2(mod(pr), 2)}</b>. Angles: ${d(z1)} + ${d(z2)} = <b>${d(pr)}</b> (up to full turns).`;
  };
  const hit = (px, py) => (P ? [z1, z2].findIndex((p) => Math.hypot(P.X(p[0]) - px, P.Y(p[1]) - py) < 20) : -1);
  const set = (e) => { const [px, py] = pos(cv.c, e), v = [Math.max(-3, Math.min(3, Math.round(P.ix(px)))), Math.max(-3, Math.min(3, Math.round(P.iy(py))))]; drag ? (z2 = v) : (z1 = v); cv.redraw(); };
  cv.c.addEventListener('pointerdown', (e) => { drag = hit(...pos(cv.c, e)); if (drag >= 0) { cv.c.setPointerCapture(e.pointerId); set(e); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag >= 0) set(e); }); cv.c.addEventListener('pointerup', () => { drag = -1; });
  touchGuard(cv.c, (x, y) => hit(x, y) >= 0);
  const r = row(host);
  button(r, 'z2 = i (quarter turn)', () => { z2 = [0, 1]; cv.redraw(); }); button(r, 'z2 = 2 (stretch)', () => { z2 = [2, 0]; cv.redraw(); }); button(r, 'z2 = 1 + i', () => { z2 = [1, 1]; cv.redraw(); });
  cv.redraw();
}
