// Class 10 Quadratic Equations: a word problem becomes a quadratic. A rectangular plot is 3 m longer than it is wide.
// If the breadth is x, the area is x(x + 3). Setting that equal to the area you want gives x² + 3x - area = 0.
// Slide x until the plot's area meets the target line on the graph: that x is the (positive) root.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let x = 2, T = 40;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 290, label: 'A rectangular plot whose area x(x+3) is compared with a target area on a graph' });
  const ctl = row(host);
  choice(ctl, 'Target area', [[18, '18 m²'], [40, '40 m²'], [70, '70 m²']], T, (v) => { T = v; go(); });
  slider(ctl, { label: 'Breadth x', min: 0.5, max: 8, step: 0.5, value: x, fmt: (v) => v + ' m', oninput: (v) => { x = v; go(); } });
  const out = readout(host);
  const go = () => {
    const A = x * (x + 3), root = (-3 + Math.sqrt(9 + 4 * T)) / 2;
    out.innerHTML = `Breadth ${x} m, length ${x + 3} m, area = ${x} × ${x + 3} = <b>${A} m²</b>. Equation for the target: x² + 3x − ${T} = 0, whose positive root is <b>x = ${+root.toFixed(2)}</b> m. ${Math.abs(A - T) < 0.01 ? '<b>Match!</b>' : A < T ? 'Too small: make the plot wider.' : 'Too big: make it narrower.'}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Plot: length = breadth + 3, area = ${T} m²`, col);
    const ph = h * 0.40, sc = Math.min((w - 40) / 12, ph / 11);
    const bw = (x + 3) * sc, bh = x * sc, ox = (w - 11 * sc) / 2, oy = 50;
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = Math.abs(x * (x + 3) - T) < 0.01 ? 0.9 : 0.55; ctx.fillRect(ox, oy, bw, bh); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(ox, oy, bw, bh);
    text(ctx, `x + 3 = ${x + 3}`, ox + bw / 2, oy - 8, { color: col.ink, size: 11, align: 'center', weight: 600 });
    text(ctx, `x = ${x}`, ox + bw + 6, oy + bh / 2, { color: col.ink, size: 11, weight: 600 });
    ctx.save(); ctx.translate(0, ph + 62);
    const A = axes(ctx, w, h - ph - 62, col, { x: [0, 8], y: [0, 90], l: 40, t: 8, b: 38, xlabel: 'breadth x (m)', ylabel: 'area (m²)' });
    const pts = []; for (let i = 0; i <= 80; i++) { const v = i / 10; pts.push([A.X(v), A.Y(v * (v + 3))]); }
    line(ctx, pts, col.s[0], 3);
    line(ctx, [[A.L, A.Y(T)], [A.R, A.Y(T)]], col.s[3], 2, [6, 4]);
    text(ctx, `target ${T}`, A.L + 6, A.Y(T) - 9, { color: col.s[3], size: 11, weight: 700 });
    const root = (-3 + Math.sqrt(9 + 4 * T)) / 2;
    dot(ctx, A.X(root), A.Y(T), 5, col.s[1], col.panel);
    dot(ctx, A.X(x), A.Y(x * (x + 3)), 6, col.s[2], col.panel);
    ctx.restore();
  };
  go();
}
