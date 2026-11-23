// Class 12 Mean Value Theorem: if f is continuous on [a, b] and differentiable inside, there is a point c between a and b where the tangent is
// PARALLEL to the chord joining (a, f(a)) and (b, f(b)): f'(c) = (f(b) - f(a))/(b - a). When f(a) = f(b) the chord is flat and the theorem
// becomes Rolle's theorem: a point with a horizontal tangent. Move a and b; every such c is found numerically and drawn.
import { canvas, text, title, line, dot, axes, row, slider, choice, readout } from '../../kit.js';
import { plot } from '../c12m-lib.js';

const FN = {
  cubic: { f: (x) => (x ** 3) / 3 - x, d: (x) => x * x - 1, n: 'x³/3 − x', y: [-3, 4] },
  sq: { f: (x) => 0.5 * x * x, d: (x) => x, n: 'x²/2', y: [-1, 5] },
  sin: { f: (x) => 2 * Math.sin(x), d: (x) => 2 * Math.cos(x), n: '2 sin x', y: [-3, 3] },
};
export default function (host) {
  let key = 'cubic', a = -1.5, b = 1.8;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A chord and the tangents parallel to it, illustrating the mean value theorem' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'f(x) =', Object.entries(FN).map(([k, v]) => [k, v.n]), key, (v) => { key = v; say(); });
  slider(ctl, { label: 'a', min: -2.5, max: 1.5, step: 0.1, value: a, fmt: (v) => v.toFixed(1), oninput: (v) => { a = Math.min(v, b - 0.4); say(); } });
  slider(ctl, { label: 'b', min: -1.5, max: 2.5, step: 0.1, value: b, fmt: (v) => v.toFixed(1), oninput: (v) => { b = Math.max(v, a + 0.4); say(); } });
  const cs = () => {
    const F = FN[key], m = (F.f(b) - F.f(a)) / (b - a), out = [], N = 400; let prev = F.d(a) - m;
    for (let i = 1; i <= N; i++) { const x = a + ((b - a) * i) / N, g = F.d(x) - m; if (prev * g < 0) { let lo = x - (b - a) / N, hi = x; for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; (F.d(lo) - m) * (F.d(mid) - m) <= 0 ? (hi = mid) : (lo = mid); } out.push((lo + hi) / 2); } prev = g; }
    return { m, c: out };
  };
  function say() {
    const F = FN[key], r = cs(), rolle = Math.abs(F.f(a) - F.f(b)) < 0.02;
    out.innerHTML = `Chord slope (f(b) − f(a))/(b − a) = <b>${r.m.toFixed(3)}</b>. ${r.c.length ? `Tangent slope equals it at c = <b>${r.c.map((c) => c.toFixed(2)).join(', ')}</b>.` : 'No c found in this window.'} ${rolle ? '<b>f(a) = f(b): this is Rolle’s theorem, a horizontal tangent.</b>' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const F = FN[key]; title(ctx, 'Mean value theorem: a tangent parallel to the chord', col);
    const A = axes(ctx, w, h, col, { x: [-3, 3], y: F.y, l: 30, r: 14, t: 40, b: 28, xt: [-2, 0, 2], yt: [F.y[0] + 1, 0, F.y[1] - 1].sort((p, q) => p - q) });
    ctx.save(); A.clip(); plot(ctx, A.X, A.Y, F.f, -3, 3, col.muted, 2.5);
    const r = cs();
    line(ctx, [[A.X(a), A.Y(F.f(a))], [A.X(b), A.Y(F.f(b))]], col.s[0], 3);
    r.c.forEach((c) => { const x0 = c - 1.2, x1 = c + 1.2; line(ctx, [[A.X(x0), A.Y(F.f(c) + r.m * (x0 - c))], [A.X(x1), A.Y(F.f(c) + r.m * (x1 - c))]], col.s[3], 2.5, [6, 4]); });
    ctx.restore();
    r.c.forEach((c) => { dot(ctx, A.X(c), A.Y(F.f(c)), 6, col.s[3], col.ink); text(ctx, 'c', A.X(c) + 7, A.Y(F.f(c)) - 10, { color: col.s[3], size: 12, weight: 800, halo: col.panel }); });
    dot(ctx, A.X(a), A.Y(F.f(a)), 5.5, col.s[0], col.panel); dot(ctx, A.X(b), A.Y(F.f(b)), 5.5, col.s[0], col.panel);
    text(ctx, 'a', A.X(a), A.B + 10, { color: col.s[0], size: 12, weight: 800, align: 'center' }); text(ctx, 'b', A.X(b), A.B + 10, { color: col.s[0], size: 12, weight: 800, align: 'center' });
  };
  say();
}
