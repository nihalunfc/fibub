// Class 11 Maths, Linear Inequalities in two variables: the line ax + by = c cuts the plane into two half-planes.
// One side satisfies ax + by < c, the other ax + by > c. The line is solid when "=" is allowed (≤, ≥) and dashed
// when it is not (<, >). Drag the test point P: it is a solution when its side is shaded.
import { canvas, axes, row, slider, choice, readout, line, dot, text, title, touchGuard } from '../../kit.js';

export default function (host) {
  let a = 1, b = 1, c = 4, op = 'le', P = [1, 1], g;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'A line dividing the plane into two half-planes with one shaded and a draggable test point' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  const eq = () => `${f(a)}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}y`;
  const S = { lt: '<', le: '≤', gt: '>', ge: '≥' }, f = (v) => String(v).replace('-', '−');
  const holds = (x, y) => { const v = a * x + b * y; return { lt: v < c, le: v <= c + 1e-9, gt: v > c, ge: v >= c - 1e-9 }[op]; };
  choice(c1, 'sign', [['lt', '<'], ['le', '≤'], ['gt', '>'], ['ge', '≥']], op, (v) => { op = v; re(); });
  slider(c2, { label: 'a', min: -4, max: 4, step: 1, value: a, fmt: f, oninput: (v) => { a = v; re(); } });
  slider(c2, { label: 'b', min: -4, max: 4, step: 1, value: b, fmt: f, oninput: (v) => { b = v; re(); } });
  slider(c2, { label: 'c', min: -8, max: 8, step: 1, value: c, fmt: f, oninput: (v) => { c = v; re(); } });
  const re = () => { cv.redraw(); const v = a * P[0] + b * P[1]; out.innerHTML = `Region: <b>${eq()} ${S[op]} ${f(c)}</b>. At P = (${P[0].toFixed(1)}, ${P[1].toFixed(1)}): ${f(+v.toFixed(2))} ${S[op]} ${f(c)} is <b>${holds(...P) ? 'true: P is a solution' : 'false: P is not a solution'}</b>.${a === 0 && b === 0 ? ' (With a = b = 0 there is no line.)' : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${eq()} ${S[op]} ${f(c)}`, col); g = axes(ctx, w, h, col, { x: [-8, 8], y: [-8, 8], l: 26, b: 22, t: top + 4, r: 10, xt: [-8, -4, 0, 4, 8], yt: [-8, -4, 0, 4, 8] });
    ctx.save(); g.clip(); const n = 40;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = -8 + (i + 0.5) * 16 / n, y = -8 + (j + 0.5) * 16 / n, v = a * x + b * y, on = { lt: v < c, le: v <= c, gt: v > c, ge: v >= c }[op]; if (on) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.22; ctx.fillRect(g.X(x - 0.2), g.Y(y + 0.2), g.X(0.2) - g.X(-0.2) + 0.7, g.Y(-0.2) - g.Y(0.2) + 0.7); } }
    ctx.globalAlpha = 1; ctx.setLineDash(op === 'le' || op === 'ge' ? [] : [7, 5]);
    if (b !== 0) line(ctx, [[g.X(-9), g.Y((c + 9 * a) / b)], [g.X(9), g.Y((c - 9 * a) / b)]], col.s[0], 2.5); else if (a !== 0) line(ctx, [[g.X(c / a), g.Y(-9)], [g.X(c / a), g.Y(9)]], col.s[0], 2.5);
    ctx.setLineDash([]); ctx.restore();
    dot(ctx, g.X(P[0]), g.Y(P[1]), 8, holds(...P) ? col.s[2] : col.s[1], col.panel); text(ctx, 'P', g.X(P[0]) + 12, g.Y(P[1]) - 10, { color: col.ink, size: 12, weight: 700 });
  };
  let drag = false;
  const toXY = (e) => { const r = cv.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top; return [Math.max(-8, Math.min(8, -8 + (px - g.L) / (g.R - g.L) * 16)), Math.max(-8, Math.min(8, 8 - (py - g.T) / (g.B - g.T) * 16))]; };
  const near = (x, y) => g && Math.hypot(x - g.X(P[0]), y - g.Y(P[1])) < 24;
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(); if (near(e.clientX - r.left, e.clientY - r.top)) { drag = true; cv.c.setPointerCapture(e.pointerId); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag) { P = toXY(e); re(); } });
  cv.c.addEventListener('pointerup', () => (drag = false));
  touchGuard(cv.c, near);
  re();
}
