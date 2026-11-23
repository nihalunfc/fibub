// Class 11 Maths, Linear Inequalities: a system of inequalities in two variables. Each inequality shades a
// half-plane; the solution of the system is where ALL the shaded regions overlap (here the darkest part).
// Switch the system, tick constraints on and off, and drag P to test a point against every inequality.
import { canvas, axes, row, choice, readout, line, dot, text, title, touchGuard } from '../../kit.js';

const SYS = {
  a: { name: 'x ≥ 0, y ≥ 0, x + y ≤ 6, 2x + y ≤ 8', c: [[1, 0, 0, 'ge', 'x ≥ 0'], [0, 1, 0, 'ge', 'y ≥ 0'], [1, 1, 6, 'le', 'x + y ≤ 6'], [2, 1, 8, 'le', '2x + y ≤ 8']] },
  b: { name: 'a strip: 2 ≤ x + y ≤ 5', c: [[1, 1, 2, 'ge', 'x + y ≥ 2'], [1, 1, 5, 'le', 'x + y ≤ 5'], [1, 0, 0, 'ge', 'x ≥ 0'], [0, 1, 0, 'ge', 'y ≥ 0']] },
  c: { name: 'no solution: x + y ≥ 6 and x + y ≤ 3', c: [[1, 1, 6, 'ge', 'x + y ≥ 6'], [1, 1, 3, 'le', 'x + y ≤ 3'], [1, 0, 0, 'ge', 'x ≥ 0']] },
};
export default function (host) {
  let k = 'a', P = [2, 2], g;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 280, label: 'Several half-planes overlapping to give the solution region of a system of inequalities' });
  const c1 = row(host), out = readout(host);
  const sat = (c, x, y) => (c[3] === 'le' ? c[0] * x + c[1] * y <= c[2] + 1e-9 : c[0] * x + c[1] * y >= c[2] - 1e-9);
  choice(c1, 'system', [['a', 'triangle-like'], ['b', 'strip'], ['c', 'empty']], k, (v) => { k = v; re(); });
  const re = () => { cv.redraw(); const C = SYS[k].c, ok = C.map((c) => sat(c, ...P)); out.innerHTML = `P = (${P[0].toFixed(1)}, ${P[1].toFixed(1)}): ` + C.map((c, i) => `${c[4]} ${ok[i] ? '✓' : '✗'}`).join(' · ') + `. <b>${ok.every(Boolean) ? 'P is in the solution region.' : 'P breaks at least one inequality.'}</b>`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, SYS[k].name, col, 15); g = axes(ctx, w, h, col, { x: [-1, 8], y: [-1, 8], l: 26, b: 22, t: top + 4, r: 10, xt: [0, 2, 4, 6, 8], yt: [0, 2, 4, 6, 8] });
    const C = SYS[k].c, n = 45; ctx.save(); g.clip();
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = -1 + (i + 0.5) * 9 / n, y = -1 + (j + 0.5) * 9 / n, m = C.filter((c) => sat(c, x, y)).length; if (m === C.length) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.55; ctx.fillRect(g.X(x - 0.1), g.Y(y + 0.1), g.X(0.2) - g.X(0) + 1, g.Y(0) - g.Y(0.2) + 1); } else if (m === C.length - 1) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.1; ctx.fillRect(g.X(x - 0.1), g.Y(y + 0.1), g.X(0.2) - g.X(0) + 1, g.Y(0) - g.Y(0.2) + 1); } }
    ctx.globalAlpha = 1;
    C.forEach((c, i) => { const [a, b, d] = c; if (b !== 0) line(ctx, [[g.X(-2), g.Y((d + 2 * a) / b)], [g.X(10), g.Y((d - 10 * a) / b)]], col.s[(i + 1) % 8], 1.8); else line(ctx, [[g.X(d / a), g.Y(-2)], [g.X(d / a), g.Y(10)]], col.s[(i + 1) % 8], 1.8); });
    ctx.restore();
    const ok = C.every((c) => sat(c, ...P)); dot(ctx, g.X(P[0]), g.Y(P[1]), 8, ok ? col.s[2] : col.s[1], col.panel);
  };
  let drag = false;
  const near = (x, y) => g && Math.hypot(x - g.X(P[0]), y - g.Y(P[1])) < 24;
  const toXY = (e) => { const r = cv.c.getBoundingClientRect(); return [Math.max(-1, Math.min(8, -1 + (e.clientX - r.left - g.L) / (g.R - g.L) * 9)), Math.max(-1, Math.min(8, 8 - (e.clientY - r.top - g.T) / (g.B - g.T) * 9))]; };
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(); if (near(e.clientX - r.left, e.clientY - r.top)) { drag = true; cv.c.setPointerCapture(e.pointerId); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag) { P = toXY(e); re(); } });
  cv.c.addEventListener('pointerup', () => (drag = false));
  touchGuard(cv.c, near);
  re();
}
