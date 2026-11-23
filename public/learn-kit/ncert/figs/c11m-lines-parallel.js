// Class 11 Maths, Straight Lines: two parallel lines Ax + By + C1 = 0 and Ax + By + C2 = 0 are a fixed distance apart:
// d = |C1 − C2| / √(A² + B²). Slide C2 to move the second line away and watch the perpendicular gap grow.
import { canvas, axes, row, slider, readout, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let A = 3, B = 4, C1 = -6, C2 = 4;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'Two parallel lines and the perpendicular distance between them' });
  const c1 = row(host), out = readout(host);
  const f = (v) => String(v).replace('-', '−');
  slider(c1, { label: 'A', min: 1, max: 5, step: 1, value: A, fmt: f, oninput: (v) => { A = v; re(); } });
  slider(c1, { label: 'B', min: 1, max: 5, step: 1, value: B, fmt: f, oninput: (v) => { B = v; re(); } });
  slider(c1, { label: 'C₁', min: -15, max: 15, step: 1, value: C1, fmt: f, oninput: (v) => { C1 = v; re(); } });
  slider(c1, { label: 'C₂', min: -15, max: 15, step: 1, value: C2, fmt: f, oninput: (v) => { C2 = v; re(); } });
  const re = () => { cv.redraw(); out.innerHTML = `d = |C₁ − C₂| / √(A² + B²) = |${f(C1)} − ${f(C2)}| / √(${A * A} + ${B * B}) = ${Math.abs(C1 - C2)} / ${Math.hypot(A, B).toFixed(2)} = <b>${(Math.abs(C1 - C2) / Math.hypot(A, B)).toFixed(2)}</b>. Make the coefficients of x and y match first, then use the constants.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Distance between parallel lines', col), g = axes(ctx, w, h, col, { x: [-8, 8], y: [-8, 8], l: 26, b: 22, t: top + 4, r: 10, xt: [-8, -4, 0, 4, 8], yt: [-8, -4, 0, 4, 8] }), n2 = A * A + B * B;
    const ln = (C, c) => { const px = -A * C / n2, py = -B * C / n2; ctx.save(); g.clip(); line(ctx, [[g.X(px + B * 30), g.Y(py - A * 30)], [g.X(px - B * 30), g.Y(py + A * 30)]], c, 2.5); ctx.restore(); return [px, py]; };
    const p1 = ln(C1, col.s[0]), p2 = ln(C2, col.s[1]);
    ctx.setLineDash([5, 4]); line(ctx, [[g.X(p1[0]), g.Y(p1[1])], [g.X(p2[0]), g.Y(p2[1])]], col.ink, 2); ctx.setLineDash([]); dot(ctx, g.X(p1[0]), g.Y(p1[1]), 4.5, col.s[0]); dot(ctx, g.X(p2[0]), g.Y(p2[1]), 4.5, col.s[1]);
    text(ctx, 'd = ' + (Math.abs(C1 - C2) / Math.sqrt(n2)).toFixed(2), (g.X(p1[0]) + g.X(p2[0])) / 2 + 14, (g.Y(p1[1]) + g.Y(p2[1])) / 2 - 6, { color: col.ink, size: 11.5, weight: 700 });
  };
  re();
}
