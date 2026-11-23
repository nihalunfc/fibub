// Class 11 Maths, Straight Lines: the intercept form x/a + y/b = 1 of a line that cuts the x-axis at (a, 0) and the y-axis
// at (b, 0)... that is (0, b). Slide a and b: the line with the two axes bounds a triangle of area ½|ab|.
import { canvas, axes, row, slider, readout, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let a = 4, b = 3;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'A line with x-intercept a and y-intercept b and the triangle it cuts off' });
  const c1 = row(host), out = readout(host);
  const f = (v) => String(v).replace('-', '−');
  slider(c1, { label: 'x-intercept a', min: -6, max: 6, step: 1, value: a, fmt: f, oninput: (v) => { a = v || 1; re(); } });
  slider(c1, { label: 'y-intercept b', min: -6, max: 6, step: 1, value: b, fmt: f, oninput: (v) => { b = v || 1; re(); } });
  const re = () => { cv.redraw(); out.innerHTML = `x/${f(a)} + y/${f(b)} = 1. Cuts the axes at (${f(a)}, 0) and (0, ${f(b)}). Area of the triangle with the axes = ½ × |${f(a)}| × |${f(b)}| = <b>${Math.abs(a * b) / 2}</b>. Cleared of fractions: ${f(b)}x + ${f(a)}y = ${f(a * b)}.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `x/${f(a)} + y/${f(b)} = 1`, col), g = axes(ctx, w, h, col, { x: [-7, 7], y: [-7, 7], l: 26, b: 22, t: top + 4, r: 10, xt: [-6, -3, 0, 3, 6], yt: [-6, -3, 0, 3, 6] });
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0)); ctx.lineTo(g.X(a), g.Y(0)); ctx.lineTo(g.X(0), g.Y(b)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.save(); g.clip(); const m = -b / a; line(ctx, [[g.X(-8), g.Y(b + m * -8)], [g.X(8), g.Y(b + m * 8)]], col.s[0], 2.5); ctx.restore();
    dot(ctx, g.X(a), g.Y(0), 6, col.s[1], col.panel); dot(ctx, g.X(0), g.Y(b), 6, col.s[2], col.panel);
    text(ctx, `(${f(a)}, 0)`, g.X(a), g.Y(0) + (b > 0 ? 14 : -14), { color: col.s[1], size: 11, weight: 700, align: 'center' }); text(ctx, `(0, ${f(b)})`, g.X(0) + 8, g.Y(b) + (b > 0 ? -10 : 12), { color: col.s[2], size: 11, weight: 700 });
  };
  re();
}
