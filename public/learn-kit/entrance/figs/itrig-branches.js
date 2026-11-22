// Inverse trigonometric functions: the principal branch of sin⁻¹, cos⁻¹ or tan⁻¹, and the zig-zag graph of
// sin⁻¹(sin x), cos⁻¹(cos x) or tan⁻¹(tan x). Move x and read off the value and the rule that brings x into range.
import { canvas, axes, line, dot, row, slider, choice, readout, fmt, text } from '../../kit.js';

const PI = Math.PI;
const F = {
  sin: { f: Math.sin, inv: Math.asin, dom: [-1, 1], range: '[−π/2, π/2]', lo: -PI / 2, hi: PI / 2 },
  cos: { f: Math.cos, inv: Math.acos, dom: [-1, 1], range: '[0, π]', lo: 0, hi: PI },
  tan: { f: Math.tan, inv: Math.atan, dom: [-6, 6], range: '(−π/2, π/2)', lo: -PI / 2, hi: PI / 2 },
};
const pis = (v) => { const q = v / PI; return Math.abs(q) < 1e-9 ? '0' : `${fmt(q, 3)}π`; };

export default function (host) {
  let fn = 'sin', mode = 'inv', x = 0.5;
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 240, label: 'Graph of an inverse trigonometric function or of the composite sin inverse of sin x' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Function', [['sin', 'sin⁻¹'], ['cos', 'cos⁻¹'], ['tan', 'tan⁻¹']], fn, (v) => { fn = v; clampX(); re(); });
  choice(ctl, 'Graph', [['inv', 'y = f⁻¹(x)'], ['comp', 'y = f⁻¹(f(x))']], mode, (v) => { mode = v; clampX(); re(); });
  const xs = slider(ctl, { label: 'x', min: -10, max: 10, step: 0.05, value: x, fmt: (v) => fmt(v, 3), oninput: (v) => { x = v; clampX(); re(); } });
  const clampX = () => { if (mode === 'inv') { const [a, b] = F[fn].dom; x = Math.max(a, Math.min(b, x)); xs.set(x); } };
  const out = readout(host);
  const show = () => {
    const g = F[fn];
    if (mode === 'inv') {
      out.innerHTML = `${fn}⁻¹(${fmt(x, 3)}) = <b>${fmt(g.inv(x), 4)}</b> rad = ${fmt(g.inv(x) * 180 / PI, 4)}°. Domain ${fn === 'tan' ? 'all real x' : '[−1, 1]'}, principal range ${g.range}.`;
    } else {
      const y = fn === 'tan' && Math.abs(Math.cos(x)) < 1e-9 ? NaN : g.inv(g.f(x));
      out.innerHTML = Number.isNaN(y) ? `tan x is undefined at x = ${pis(x)}.` : `${fn}⁻¹(${fn} ${fmt(x, 3)}) = <b>${fmt(y, 4)}</b> = ${pis(y)}. It equals x only when x is in ${g.range}; outside, the graph zig-zags (sin, cos) or steps down by π (tan) so the value stays in range.`;
    }
  };
  cv.draw = (ctx, w, h, col) => {
    const g = F[fn];
    if (mode === 'inv') {
      const [a, b] = g.dom;
      const { X, Y } = axes(ctx, w, h, col, { x: [a, b], y: [g.lo - 0.4, g.hi + 0.4], xlabel: 'x', ylabel: 'y (radians)', yt: fn === 'cos' ? [0, PI / 2, PI] : [-PI / 2, 0, PI / 2], fy: pis });
      [g.lo, g.hi].forEach((v) => line(ctx, [[X(a), Y(v)], [X(b), Y(v)]], col.muted, 1, [4, 4]));
      const pts = []; for (let t = a; t <= b + 1e-9; t += (b - a) / 300) pts.push([X(t), Y(g.inv(Math.max(-1e9, Math.min(1e9, t))))]);
      line(ctx, pts, col.s[0], 2.5);
      dot(ctx, X(x), Y(g.inv(x)), 5, col.s[1]);
    } else {
      const { X, Y, clip } = axes(ctx, w, h, col, { x: [-10, 10], y: [-2, 4], xlabel: 'x (radians)', ylabel: 'y', xt: [-3 * PI, -2 * PI, -PI, 0, PI, 2 * PI, 3 * PI], fx: pis });
      ctx.save(); clip();
      line(ctx, [[X(-10), Y(-10)], [X(10), Y(10)]], col.muted, 1, [5, 4]);
      let seg = [], prev = null;
      for (let t = -10; t <= 10.0001; t += 0.01) {
        const y = g.inv(g.f(t));
        if (prev !== null && Math.abs(y - prev) > 1) { line(ctx, seg, col.s[0], 2.5); seg = []; }
        seg.push([X(t), Y(y)]); prev = y;
      }
      line(ctx, seg, col.s[0], 2.5);
      ctx.restore();
      const y = g.inv(g.f(x));
      if (Number.isFinite(y)) dot(ctx, X(x), Y(y), 5, col.s[1]);
      text(ctx, 'dashed: y = x', X(2.2), Y(3.6), { color: col.muted, size: 11 });
    }
  };
  re();
}
