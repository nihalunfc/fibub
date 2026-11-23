// Class 11 Maths, Complex Numbers: adding complex numbers is adding vectors, tip to tail. z1 + z2 is the far corner of the parallelogram with sides z1 and z2;
// z1 − z2 is z1 + (−z2). The length of the sum is never more than |z1| + |z2| (the triangle inequality). Drag both points.
import { canvas, text, title, row, choice, readout, touchGuard, dot, arrow } from '../../kit.js';
import { argandPlot, cstr, r2, pos } from '../c11m-lib.js';

export default function (host) {
  let z1 = [3, 1], z2 = [1, 3], op = 'add', drag = -1, P = null;
  const cv = canvas(host, { aspect: 0.98, max: 440, min: 290, label: 'Two complex numbers added as vectors on the Argand plane, with the parallelogram' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, op === 'add' ? 'z1 + z2: complete the parallelogram' : 'z1 − z2 = z1 + (−z2)', col);
    P = argandPlot(ctx, w, h, col, { x: 22, y: 26, w: w - 34, h: h - 40 }, 7);
    const b = op === 'add' ? z2 : [-z2[0], -z2[1]], s = [z1[0] + b[0], z1[1] + b[1]], T = (p) => [P.X(p[0]), P.Y(p[1])], O = T([0, 0]);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(...T(z1)); ctx.lineTo(...T(s)); ctx.moveTo(...T(b)); ctx.lineTo(...T(s)); ctx.stroke(); ctx.setLineDash([]);
    if (op === 'sub') { arrow(ctx, ...O, ...T(b), col.s[5], 1.8, 8); }
    arrow(ctx, ...O, ...T(z1), col.s[0], 2.5, 9); arrow(ctx, ...O, ...T(z2), col.s[2], 2.5, 9); arrow(ctx, ...O, ...T(s), col.s[3], 3, 10);
    dot(ctx, ...T(z1), 8, col.s[0], col.panel); dot(ctx, ...T(z2), 8, col.s[2], col.panel);
    text(ctx, 'z1', T(z1)[0] + 9, T(z1)[1] - 9, { color: col.s[0], size: 13, weight: 800 }); text(ctx, 'z2', T(z2)[0] + 9, T(z2)[1] - 9, { color: col.s[2], size: 13, weight: 800 }); text(ctx, op === 'add' ? 'z1+z2' : 'z1−z2', T(s)[0] + 9, T(s)[1] - 9, { color: col.s[3], size: 13, weight: 800 });
    const m = (p) => Math.hypot(p[0], p[1]);
    out.innerHTML = `z1 = ${cstr(...z1)}, z2 = ${cstr(...z2)}. ${op === 'add' ? 'Sum' : 'Difference'} = (${r2(z1[0])} ${op === 'add' ? '+' : '−'} ${r2(z2[0])}) + (${r2(z1[1])} ${op === 'add' ? '+' : '−'} ${r2(z2[1])})i = <b>${cstr(...s)}</b>. Lengths: |z1| = ${r2(m(z1))}, |z2| = ${r2(m(z2))}, |result| = ${r2(m(s))} ≤ ${r2(m(z1) + m(z2))}.`;
  };
  const hit = (px, py) => (P ? [z1, z2].findIndex((p) => Math.hypot(P.X(p[0]) - px, P.Y(p[1]) - py) < 20) : -1);
  const set = (e) => { const [px, py] = pos(cv.c, e), v = [Math.max(-6.5, Math.min(6.5, Math.round(P.ix(px)))), Math.max(-6.5, Math.min(6.5, Math.round(P.iy(py))))]; drag ? (z2 = v) : (z1 = v); cv.redraw(); };
  cv.c.addEventListener('pointerdown', (e) => { drag = hit(...pos(cv.c, e)); if (drag >= 0) { cv.c.setPointerCapture(e.pointerId); set(e); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag >= 0) set(e); }); cv.c.addEventListener('pointerup', () => { drag = -1; });
  touchGuard(cv.c, (x, y) => hit(x, y) >= 0);
  choice(row(host), 'Operation', [['add', 'z1 + z2'], ['sub', 'z1 − z2']], op, (v) => { op = v; cv.redraw(); });
  cv.redraw();
}
