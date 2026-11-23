// Class 11 Maths, Complex Numbers: the conjugate z̄ = x − iy is the mirror image of z in the real axis. z + z̄ = 2x (real), z − z̄ = 2iy (imaginary), z · z̄ = x² + y² = |z|² (real, never negative).
// That last fact is why dividing by a complex number works: multiply top and bottom by its conjugate to make the bottom real. Drag z.
import { canvas, text, title, readout, touchGuard, dot, arrow } from '../../kit.js';
import { argandPlot, cstr, r2, pos } from '../c11m-lib.js';

export default function (host) {
  let z = [2, 1.5], drag = false, P = null;
  const cv = canvas(host, { aspect: 0.98, max: 440, min: 290, label: 'A complex number, its conjugate, and the sum, difference and product with its conjugate on the Argand plane' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'z, its mirror image z̄, and what they make', col);
    P = argandPlot(ctx, w, h, col, { x: 28, y: 26, w: w - 40, h: h - 40 }, 6.5);
    const [x, y] = z, T = (p) => [P.X(p[0]), P.Y(p[1])];
    ctx.setLineDash([4, 3]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(...T([x, y])); ctx.lineTo(...T([x, -y])); ctx.stroke(); ctx.setLineDash([]);
    arrow(ctx, ...T([0, 0]), ...T([x, y]), col.s[0], 2.2, 8); arrow(ctx, ...T([0, 0]), ...T([x, -y]), col.s[4], 2.2, 8);
    const mk = (p, c, name, dx = 8, dy = -9) => { dot(ctx, ...T(p), 6, c, col.panel); text(ctx, name, T(p)[0] + dx, T(p)[1] + dy, { color: c, size: 12, weight: 800 }); };
    if (Math.abs(2 * x) < 6.4) mk([2 * x, 0], col.s[3], 'z+z̄ = 2x'); if (Math.abs(2 * y) < 6.4) mk([0, 2 * y], col.s[5], 'z−z̄ = 2iy', 8, -9); if (x * x + y * y < 6.4) mk([x * x + y * y, 0], col.s[2], '|z|²', -8, 16);
    dot(ctx, ...T([x, y]), 8, col.s[0], col.panel); text(ctx, 'z', T([x, y])[0] + 10, T([x, y])[1] - 8, { color: col.s[0], size: 14, weight: 800 }); mk([x, -y], col.s[4], 'z̄', 10, 8);
    out.innerHTML = `z = ${cstr(x, y)}, z̄ = ${cstr(x, -y)}. z + z̄ = <b>${r2(2 * x)}</b>, z − z̄ = <b>${r2(2 * y)}i</b>, z·z̄ = ${r2(x * x)} + ${r2(y * y)} = <b>${r2(x * x + y * y)}</b> = |z|².`;
  };
  const hit = (px, py) => P && Math.hypot(P.X(z[0]) - px, P.Y(z[1]) - py) < 20;
  const set = (e) => { const [px, py] = pos(cv.c, e); z = [Math.max(-3, Math.min(3, Math.round(P.ix(px) * 2) / 2)), Math.max(-3, Math.min(3, Math.round(P.iy(py) * 2) / 2))]; cv.redraw(); };
  cv.c.addEventListener('pointerdown', (e) => { if (hit(...pos(cv.c, e))) { drag = true; cv.c.setPointerCapture(e.pointerId); set(e); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag) set(e); }); cv.c.addEventListener('pointerup', () => { drag = false; });
  touchGuard(cv.c, hit);
  cv.redraw();
}
