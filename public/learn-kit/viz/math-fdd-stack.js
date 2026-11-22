// Read a graph from its derivatives. f, f′ and f″ are stacked; slide the vertical line. Where f′ > 0 the graph rises,
// where f′ = 0 it has a flat point (maximum, minimum or neither), and where f″ changes sign the bend changes: that is
// an inflection. The readout tells you which of the cases you are standing on.
import { canvas, axes, row, slider, choice, readout, line, dot, text } from '../kit.js';
import { curve, f2 } from './_math.js';

const FN = {
  cubic: ['x³ − 3x', (x) => x ** 3 - 3 * x, (x) => 3 * x * x - 3, (x) => 6 * x, [-3, 3]],
  quart: ['x⁴ − 2x²', (x) => x ** 4 - 2 * x * x, (x) => 4 * x ** 3 - 4 * x, (x) => 12 * x * x - 4, [-2, 2]],
  sin: ['sin x', Math.sin, Math.cos, (x) => -Math.sin(x), [-Math.PI * 1.5, Math.PI * 1.5]],
  xex: ['x e⁻ˣ', (x) => x * Math.exp(-x), (x) => (1 - x) * Math.exp(-x), (x) => (x - 2) * Math.exp(-x), [-1, 5]],
  flat: ['x³ (flat inflection)', (x) => x ** 3, (x) => 3 * x * x, (x) => 6 * x, [-2, 2]],
};
export default function (host) {
  let k = 'cubic', t = 0.5;
  const cv = canvas(host, { aspect: 1.15, max: 460, min: 340, label: 'A function with its first and second derivative stacked' });
  const c = row(host);
  choice(c, 'Function', Object.entries(FN).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; t = 0.5; ts.set(0.5); re(); });
  const ts = slider(c, { label: 'position', min: 0, max: 1, step: 0.005, value: t, fmt: (v) => f2(FN[k][4][0] + v * (FN[k][4][1] - FN[k][4][0])), oninput: (v) => { t = v; re(); } });
  const out = readout(host);
  const X0 = () => FN[k][4][0] + t * (FN[k][4][1] - FN[k][4][0]);
  function re() { cv.redraw(); const [nm, f, f1, f2_, d] = FN[k], x = X0(), a = f1(x), b = f2_(x);
    const near = Math.abs(a) < (d[1] - d[0]) * 0.012;
    out.innerHTML = `At x = ${f2(x)}: f = ${f2(f(x))}, f′ = <b>${f2(a)}</b> (${near ? 'flat' : a > 0 ? 'rising' : 'falling'}), f″ = <b>${f2(b)}</b> (${Math.abs(b) < (d[1] - d[0]) * 0.01 ? 'no bend: possible inflection' : b > 0 ? 'bends up, like a cup' : 'bends down, like a cap'}). ${near ? (b > 0 ? '<b>f′ = 0 and f″ > 0: a local minimum.</b>' : b < 0 ? '<b>f′ = 0 and f″ < 0: a local maximum.</b>' : '<b>f′ = 0 and f″ = 0: the test fails here; look at the sign of f′ on both sides.</b>') : ''}`; }
  cv.draw = (ctx, w, h, col) => {
    const [, f, f1, f2_, d] = FN[k], x = X0(), ph = h / 3;
    [[f, 'f(x)', col.s[0]], [f1, "f′(x): slope of f", col.s[1]], [f2_, 'f″(x): bend of f', col.s[2]]].forEach(([g, nm, c], i) => {
      ctx.save(); ctx.translate(0, i * ph); ctx.beginPath(); ctx.rect(0, 0, w, ph); ctx.clip();
      const xs = Array.from({ length: 101 }, (_, j) => d[0] + ((d[1] - d[0]) * j) / 100), ys = xs.map(g), lo = Math.min(...ys), hi = Math.max(...ys), pad = (hi - lo) * 0.12 || 1;
      const A = axes(ctx, w, ph, col, { x: d, y: [lo - pad, hi + pad], l: 30, b: i === 2 ? 20 : 8, t: 14, r: 10, xt: i === 2 ? undefined : [], yt: [0] });
      ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip();
      // shade where the quantity is positive
      ctx.globalAlpha = 0.14; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(A.X(xs[0]), A.Y(0)); xs.forEach((q, j) => ctx.lineTo(A.X(q), A.Y(Math.max(0, ys[j])))); ctx.lineTo(A.X(xs[100]), A.Y(0)); ctx.fill(); ctx.globalAlpha = 1;
      ctx.restore();
      curve(ctx, A, g, d[0], d[1], c, 2.5);
      line(ctx, [[A.X(x), A.T], [A.X(x), A.B]], col.muted, 1.5, [4, 3]); dot(ctx, A.X(x), A.Y(g(x)), 5, c, col.ink);
      text(ctx, nm, A.L + 6, A.T + 6, { color: c, size: 11, weight: 700 });
      ctx.restore();
    });
  };
  re();
}
