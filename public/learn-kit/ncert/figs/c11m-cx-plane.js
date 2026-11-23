// Class 11 Maths, Complex Numbers: the Argand plane. The number z = x + iy is the point (x, y): real part across, imaginary part up. Its modulus |z| = √(x² + y²) is the
// distance from the origin, its argument is the angle from the positive real axis, and its conjugate x − iy is the mirror image in the real axis. Drag z.
import { canvas, text, title, row, choice, readout, touchGuard, dot, arrow } from '../../kit.js';
import { argandPlot, cstr, r2, pos } from '../c11m-lib.js';

export default function (host) {
  let z = [3, 2], show = 'conj', drag = false, P = null;
  const cv = canvas(host, { aspect: 0.98, max: 440, min: 290, label: 'The Argand plane with a draggable complex number, its modulus, argument and conjugate' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Drag the point z', col);
    P = argandPlot(ctx, w, h, col, { x: 22, y: 26, w: w - 34, h: h - 40 }, 5);
    const [x, y] = z, m = Math.hypot(x, y), th = Math.atan2(y, x), O = [P.X(0), P.Y(0)], Z = [P.X(x), P.Y(y)];
    ctx.setLineDash([4, 3]); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(Z[0], Z[1]); ctx.lineTo(Z[0], O[1]); ctx.moveTo(Z[0], Z[1]); ctx.lineTo(O[0], Z[1]); ctx.stroke(); ctx.setLineDash([]);
    if (m > 0.3) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(O[0], O[1], 22, 0, -th, th > 0); ctx.stroke(); }
    arrow(ctx, ...O, ...Z, col.s[0], 2.6, 9);
    if (show === 'conj' || show === 'both') { dot(ctx, P.X(x), P.Y(-y), 5.5, col.s[4], col.panel); text(ctx, 'z̄', P.X(x) + 9, P.Y(-y), { color: col.s[4], size: 13, weight: 800 }); }
    if (show === 'neg' || show === 'both') { dot(ctx, P.X(-x), P.Y(-y), 5.5, col.s[5], col.panel); text(ctx, '−z', P.X(-x) + 9, P.Y(-y), { color: col.s[5], size: 13, weight: 800 }); }
    dot(ctx, ...Z, 8, col.s[0], col.panel); text(ctx, 'z', Z[0] + 10, Z[1] - 10, { color: col.s[0], size: 14, weight: 800 });
    out.innerHTML = `z = <b>${cstr(x, y)}</b>: real part ${r2(x)}, imaginary part ${r2(y)}. Modulus |z| = √(${r2(x * x)} + ${r2(y * y)}) = <b>${r2(m, 2)}</b>. Argument = <b>${r2(th, 2)}</b> rad (${r2((th * 180) / Math.PI, 0)}°). Conjugate z̄ = ${cstr(x, -y)}.`;
  };
  const hit = (px, py) => P && Math.hypot(P.X(z[0]) - px, P.Y(z[1]) - py) < 20;
  const set = (e) => { const [px, py] = pos(cv.c, e); z = [Math.max(-4.8, Math.min(4.8, Math.round(P.ix(px) * 2) / 2)), Math.max(-4.8, Math.min(4.8, Math.round(P.iy(py) * 2) / 2))]; cv.redraw(); };
  cv.c.addEventListener('pointerdown', (e) => { if (hit(...pos(cv.c, e))) { drag = true; cv.c.setPointerCapture(e.pointerId); set(e); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag) set(e); }); cv.c.addEventListener('pointerup', () => { drag = false; });
  touchGuard(cv.c, hit);
  choice(row(host), 'Also show', [['none', 'nothing'], ['conj', 'conjugate z̄'], ['neg', '−z'], ['both', 'both']], show, (v) => { show = v; cv.redraw(); });
  cv.redraw();
}
