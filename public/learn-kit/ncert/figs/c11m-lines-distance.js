// Class 11 Maths, Straight Lines: the perpendicular distance of a point P(x0, y0) from the line Ax + By + C = 0 is
// d = |A x0 + B y0 + C| / √(A² + B²). Drag P: the shortest path to the line is the perpendicular, and its length matches
// the formula. The sign of Ax0 + By0 + C tells which side of the line P is on.
import { canvas, axes, row, slider, readout, line, dot, text, title, touchGuard } from '../../kit.js';

export default function (host) {
  let A = 3, B = 4, C = -12, P = [4, 3], g, drag = false;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'A point and a line with the perpendicular distance between them' });
  const c1 = row(host), out = readout(host);
  const f = (v) => String(v).replace('-', '−');
  slider(c1, { label: 'A', min: -5, max: 5, step: 1, value: A, fmt: f, oninput: (v) => { A = v; if (!A && !B) { B = 1; sb.set(1); } re(); } });
  const sb = slider(c1, { label: 'B', min: -5, max: 5, step: 1, value: B, fmt: f, oninput: (v) => { B = v; if (!A && !B) { A = 1; sa.set(1); } re(); } });
  const sa = { set() {} };
  slider(c1, { label: 'C', min: -15, max: 15, step: 1, value: C, fmt: f, oninput: (v) => { C = v; re(); } });
  const re = () => { cv.redraw(); const N = A * P[0] + B * P[1] + C, d = Math.abs(N) / Math.hypot(A, B); out.innerHTML = `d = |${f(A)}(${P[0].toFixed(1)}) + ${f(B)}(${P[1].toFixed(1)}) + ${f(C)}| / √(${A * A} + ${B * B}) = |${N.toFixed(1)}| / ${Math.hypot(A, B).toFixed(2)} = <b>${d.toFixed(2)}</b>. P is on the ${N > 0 ? 'positive' : N < 0 ? 'negative' : '(on the line)'} side.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${f(A)}x ${B < 0 ? '−' : '+'} ${Math.abs(B)}y ${C < 0 ? '−' : '+'} ${Math.abs(C)} = 0`, col); g = axes(ctx, w, h, col, { x: [-8, 8], y: [-8, 8], l: 26, b: 22, t: top + 4, r: 10, xt: [-8, -4, 0, 4, 8], yt: [-8, -4, 0, 4, 8] });
    const n2 = A * A + B * B, N = A * P[0] + B * P[1] + C, fx = P[0] - A * N / n2, fy = P[1] - B * N / n2;
    ctx.save(); g.clip(); const dx = -B, dy = A, L = 30; line(ctx, [[g.X(fx - dx * L), g.Y(fy - dy * L)], [g.X(fx + dx * L), g.Y(fy + dy * L)]], col.s[0], 2.5); ctx.restore();
    ctx.setLineDash([5, 4]); line(ctx, [[g.X(P[0]), g.Y(P[1])], [g.X(fx), g.Y(fy)]], col.s[1], 2.2); ctx.setLineDash([]);
    dot(ctx, g.X(fx), g.Y(fy), 4.5, col.s[0]); dot(ctx, g.X(P[0]), g.Y(P[1]), 8, col.s[1], col.panel); text(ctx, 'P', g.X(P[0]) + 12, g.Y(P[1]) - 10, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'd = ' + (Math.abs(N) / Math.sqrt(n2)).toFixed(2), (g.X(P[0]) + g.X(fx)) / 2 + 14, (g.Y(P[1]) + g.Y(fy)) / 2, { color: col.s[1], size: 11.5, weight: 700 });
  };
  const near = (x, y) => g && Math.hypot(x - g.X(P[0]), y - g.Y(P[1])) < 24;
  const toXY = (e) => { const r = cv.c.getBoundingClientRect(); return [Math.round(Math.max(-8, Math.min(8, -8 + (e.clientX - r.left - g.L) / (g.R - g.L) * 16)) * 2) / 2, Math.round(Math.max(-8, Math.min(8, 8 - (e.clientY - r.top - g.T) / (g.B - g.T) * 16)) * 2) / 2]; };
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(); if (near(e.clientX - r.left, e.clientY - r.top)) { drag = true; cv.c.setPointerCapture(e.pointerId); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag) { P = toXY(e); re(); } });
  cv.c.addEventListener('pointerup', () => (drag = false));
  touchGuard(cv.c, near);
  re();
}
