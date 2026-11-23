// Class 12 Implicit differentiation: when y is tied to x by an equation such as x^2 + y^2 = 25, differentiate both sides with respect to x,
// treating y as a function of x (chain rule). For the circle: 2x + 2y dy/dx = 0, so dy/dx = -x/y. Slide the point round the curve and see
// the tangent turn with exactly that slope. Also shown: the ellipse x^2/16 + y^2/9 = 1 (dy/dx = -9x/(16y)) and the curve xy = 6 (dy/dx = -y/x).
import { canvas, text, title, line, dot, axes, row, slider, choice, readout } from '../../kit.js';

const C = {
  circle: { name: 'x² + y² = 25', P: (t) => [5 * Math.cos(t), 5 * Math.sin(t)], m: (x, y) => -x / y, rule: 'dy/dx = −x/y', rng: [0.1, 6.2] },
  ellipse: { name: 'x²/16 + y²/9 = 1', P: (t) => [4 * Math.cos(t), 3 * Math.sin(t)], m: (x, y) => -(9 * x) / (16 * y), rule: 'dy/dx = −9x/(16y)', rng: [0.1, 6.2] },
  hyper: { name: 'xy = 6', P: (t) => [t, 6 / t], m: (x, y) => -y / x, rule: 'dy/dx = −y/x', rng: [1, 6] },
};
export default function (host) {
  let key = 'circle', t = 0.9;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A tangent line sliding round a curve with its slope found by implicit differentiation' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Curve', Object.entries(C).map(([k, v]) => [k, v.name]), key, (v) => { key = v; t = key === 'hyper' ? 2 : 0.9; sl.set(t); sl2(); say(); });
  const sl = slider(ctl, { label: 'position', min: 0.1, max: 6.2, step: 0.02, value: t, fmt: (v) => v.toFixed(2), oninput: (v) => { t = v; say(); } });
  const sl2 = () => { const i = sl; i.set(t); };
  function say() {
    const c = C[key], tt = Math.min(Math.max(t, c.rng[0]), c.rng[1]), [x, y] = c.P(tt), m = c.m(x, y);
    out.innerHTML = `${c.name}. Differentiating both sides gives ${c.rule}. At (${x.toFixed(2)}, ${y.toFixed(2)}) the slope is <b>${Math.abs(y) < 0.05 ? 'vertical (y = 0)' : m.toFixed(3)}</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const c = C[key]; title(ctx, `Tangent to ${c.name}`, col);
    const ry = (7 * ((h - 26) - 40)) / (w - 42), A = axes(ctx, w, h, col, { x: [-7, 7], y: [-ry, ry], l: 28, r: 14, t: 40, b: 26, xt: [-5, 0, 5], yt: ry > 5.3 ? [-5, 0, 5] : [0] });
    ctx.save(); A.clip();
    const pts = []; if (key === 'hyper') { for (let x = 0.86; x <= 7; x += 0.1) pts.push([A.X(x), A.Y(6 / x)]); line(ctx, pts, col.s[0], 3); const q = []; for (let x = -7; x <= -0.86; x += 0.1) q.push([A.X(x), A.Y(6 / x)]); line(ctx, q, col.s[0], 3); }
    else { for (let a = 0; a <= 6.29; a += 0.05) { const [x, y] = c.P(a); pts.push([A.X(x), A.Y(y)]); } pts.push(pts[0]); line(ctx, pts, col.s[0], 3); }
    const tt = Math.min(Math.max(t, c.rng[0]), c.rng[1]), [x, y] = c.P(tt), m = c.m(x, y);
    const d = Math.abs(y) < 0.05 ? [0, 1] : [1, m], L = Math.hypot(d[0], d[1]), s = 5 / L;
    line(ctx, [[A.X(x - d[0] * s), A.Y(y - d[1] * s)], [A.X(x + d[0] * s), A.Y(y + d[1] * s)]], col.s[3], 2.5);
    ctx.restore();
    dot(ctx, A.X(x), A.Y(y), 6.5, col.s[3], col.ink);
    text(ctx, `slope ${Math.abs(y) < 0.05 ? '∞' : m.toFixed(2)}`, A.L + 8, A.T + 12, { color: col.s[3], size: 13, weight: 800, halo: col.panel });
  };
  say();
}
