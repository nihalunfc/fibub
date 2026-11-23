// Class 11 Maths, Relations and Functions: algebra of real functions. (f + g)(x) = f(x) + g(x), and likewise f − g, f·g, and f/g (only where g(x) is not 0).
// The orange curve is built from the blue and green curves at every x; slide x to check one value by hand.
import { canvas, text, title, row, slider, choice, readout, dot } from '../../kit.js';
import { plot, curve, r2 } from '../c11m-lib.js';

const PAIRS = { a: ['x²', (x) => x * x, 'x + 2', (x) => x + 2], b: ['x', (x) => x, '4 − x²', (x) => 4 - x * x], c: ['|x|', (x) => Math.abs(x), '1', () => 1] };
const OPS = { add: ['f + g', (a, b) => a + b], sub: ['f − g', (a, b) => a - b], mul: ['f · g', (a, b) => a * b], div: ['f / g', (a, b) => (Math.abs(b) < 1e-9 ? NaN : a / b)] };
export default function (host) {
  let p = 'a', op = 'add', x0 = 1;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Graphs of two functions and of their sum, difference, product or quotient' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const [fn, f, gn, g] = PAIRS[p], O = OPS[op][1], H = (x) => O(f(x), g(x));
    title(ctx, `f = ${fn} (blue),  g = ${gn} (green),  ${OPS[op][0]} (orange)`, col);
    const P = plot(ctx, w, h, col, { x: [-4, 4], y: [-6, 8], l: 22, b: 14, t: 30, r: 12, sx: 2, sy: 2 });
    curve(ctx, P, f, col.s[0], 2.2, 70); curve(ctx, P, g, col.s[2], 2.2, 70); curve(ctx, P, H, col.s[3], 3, 70);
    ctx.save(); P.clip(); ctx.strokeStyle = col.muted; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(P.X(x0), P.T); ctx.lineTo(P.X(x0), P.B); ctx.stroke(); ctx.restore();
    [[f, col.s[0]], [g, col.s[2]], [H, col.s[3]]].forEach(([q, c]) => { const y = q(x0); if (Number.isFinite(y) && y > -6 && y < 8) dot(ctx, P.X(x0), P.Y(y), 5, c, col.panel); });
    const a = f(x0), b = g(x0), v = H(x0);
    out.innerHTML = `At x = ${r2(x0, 1)}: f = ${r2(a)}, g = ${r2(b)}, so (${OPS[op][0]}) = <b>${Number.isFinite(v) ? r2(v) : 'not defined (g = 0)'}</b>.`;
  };
  const r = row(host);
  choice(r, 'Pair', Object.entries(PAIRS).map(([k, v]) => [k, `${v[0]}, ${v[2]}`]), p, (v) => { p = v; cv.redraw(); });
  choice(r, 'Combine', Object.entries(OPS).map(([k, v]) => [k, v[0]]), op, (v) => { op = v; cv.redraw(); });
  slider(r, { label: 'x', min: -3.9, max: 3.9, step: 0.1, value: x0, fmt: (v) => r2(v, 1), oninput: (v) => { x0 = v; cv.redraw(); } });
  cv.redraw();
}
