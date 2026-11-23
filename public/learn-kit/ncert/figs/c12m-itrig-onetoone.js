// Class 12 Maths, Inverse trigonometric functions: sine over the whole real line fails the horizontal line test, so it has no inverse function.
// Cut the domain down to [-pi/2, pi/2] and every horizontal line meets it at most once. Slide the line to count the meetings.
import { canvas, text, title, row, slider, choice, axes, line, dot, readout } from '../../kit.js';

const P = Math.PI;
export default function (host) {
  let dom = 'all', c = 0.5;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'The sine curve with a horizontal line, counting the points where they meet' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Does the horizontal line y = c meet sin x once?', col);
    const a = axes(ctx, w, h, col, { x: [-2 * P, 2 * P], y: [-1.4, 1.4], xt: [-2 * P, -P, 0, P, 2 * P], fx: (v) => (v === 0 ? '0' : (v / P) + 'π').replace('1π', 'π').replace('-1π', '−π').replace('-', '−'), l: 38, b: 28, t: 28, r: 12 });
    const lo = dom === 'all' ? -2 * P : -P / 2, hi = dom === 'all' ? 2 * P : P / 2;
    ctx.save(); a.clip();
    if (dom !== 'all') { const pts = []; for (let x = -2 * P; x <= 2 * P; x += 0.05) pts.push([a.X(x), a.Y(Math.sin(x))]); line(ctx, pts, col.line, 1.5); }
    const pts = []; for (let x = lo; x <= hi + 1e-9; x += 0.03) pts.push([a.X(x), a.Y(Math.sin(x))]); line(ctx, pts, col.s[0], 3);
    ctx.restore();
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a.L, a.Y(c)); ctx.lineTo(a.R, a.Y(c)); ctx.stroke();
    const xs = []; for (let k = -4; k <= 4; k++) { const b = Math.asin(c); [b + 2 * k * P, P - b + 2 * k * P].forEach((x) => { if (x >= lo - 1e-9 && x <= hi + 1e-9 && !xs.some((q) => Math.abs(q - x) < 1e-6)) xs.push(x); }); }
    xs.forEach((x) => dot(ctx, a.X(x), a.Y(c), 5, col.s[2], col.panel));
    out.innerHTML = `y = ${c.toFixed(2)} meets the ${dom === 'all' ? 'whole' : 'restricted'} curve at <b>${xs.length}</b> point${xs.length === 1 ? '' : 's'}${dom === 'all' ? ' (and more beyond the picture): many x for one y, so sin is <b>not one-one</b> on ℝ' : ': one x for each y, so sin is <b>one-one</b> on [−π/2, π/2] and has an inverse'}.`;
  };
  const r = row(host);
  choice(r, 'Domain', [['all', 'all of ℝ'], ['pr', '[−π/2, π/2]']], dom, (v) => { dom = v; cv.redraw(); });
  slider(r, { label: 'Line y = c', min: -1, max: 1, step: 0.01, value: 0.5, fmt: (v) => v.toFixed(2), oninput: (v) => { c = v; cv.redraw(); } });
  cv.redraw();
}
