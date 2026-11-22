// Newton-Raphson, one tangent at a time. Start at x₀ (slide it). Draw the tangent to the curve there; where it
// crosses the x-axis is the next guess x₁ = x₀ − f(x₀)/f′(x₀). Press Step to repeat: the guesses race to the root,
// roughly doubling the number of correct digits each time. A bad start (where the slope is near zero) can throw the
// guess far away or send it to a different root.
import { canvas, axes, row, slider, choice, button, readout, dot, line, text } from '../kit.js';
import { curve, f2 } from './_math.js';

const FN = {
  sq2: ['x² − 2 (√2)', (x) => x * x - 2, (x) => 2 * x, [-3, 3], [-3, 5]], cube: ['x³ − 2x − 5', (x) => x ** 3 - 2 * x - 5, (x) => 3 * x * x - 2, [-3, 3], [-14, 20]],
  cos: ['cos x − x', (x) => Math.cos(x) - x, (x) => -Math.sin(x) - 1, [-2, 3], [-4, 2]], ex: ['eˣ − 3', (x) => Math.exp(x) - 3, (x) => Math.exp(x), [-2, 3], [-4, 17]],
};
export default function (host) {
  let k = 'sq2', x0 = 2.6, it = 0;
  const cv = canvas(host, { aspect: 0.78, max: 380, min: 260, label: 'Newton-Raphson tangent steps converging to a root' });
  const c = row(host), c2 = row(host);
  const xs = () => { const [, f, d] = FN[k], X = [x0]; for (let i = 0; i < 8; i++) { const x = X[i], s = d(x); X.push(Math.abs(s) < 1e-9 ? x : x - f(x) / s); } return X; };
  choice(c, 'Equation f(x) = 0', Object.entries(FN).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; it = 0; sl.set(x0 = Math.min(Math.max(x0, FN[k][3][0]), FN[k][3][1])); re(); });
  const sl = slider(c2, { label: 'start x₀', min: -3, max: 3, step: 0.05, value: x0, fmt: (v) => f2(v), oninput: (v) => { x0 = v; it = 0; re(); } });
  button(c2, 'Step ▶', () => { it = it >= 6 ? 0 : it + 1; re(); }); button(c2, 'Reset', () => { it = 0; re(); });
  const out = readout(host);
  function re() { cv.redraw(); const X = xs(), f = FN[k][1]; out.innerHTML = `Step ${it}: x<sub>${it}</sub> = <b>${f2(X[it], 6)}</b>, f = ${f2(f(X[it]), 6)}. Rule: x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f′(x<sub>n</sub>) = ${f2(X[it], 5)} − (${f2(f(X[it]), 5)})/(${f2(FN[k][2](X[it]), 5)}) = <b>${f2(X[it + 1], 6)}</b>. Guesses so far: ${X.slice(0, it + 1).map((v) => f2(v, 4)).join(' → ')}.`; }
  cv.draw = (ctx, w, h, col) => {
    const [, f, d, xr, yr] = FN[k], A = axes(ctx, w, h, col, { x: xr, y: yr, l: 34, b: 22, t: 22, r: 10 }), X = xs();
    line(ctx, [[A.L, A.Y(0)], [A.R, A.Y(0)]], col.muted, 1.5);
    curve(ctx, A, f, xr[0], xr[1], col.s[0], 3, { n: 300 });
    for (let i = 0; i <= it; i++) { const x = X[i], y = f(x), xn = X[i + 1]; const last = i === it;
      line(ctx, [[A.X(x), A.Y(0)], [A.X(x), A.Y(y)]], col.muted, 1, [3, 3]);
      ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip(); line(ctx, [[A.X(xr[0]), A.Y(y + d(x) * (xr[0] - x))], [A.X(xr[1]), A.Y(y + d(x) * (xr[1] - x))]], last ? col.s[1] : col.line, last ? 2.5 : 1.5); ctx.restore();
      dot(ctx, A.X(x), A.Y(0), last ? 5 : 3.5, last ? col.s[1] : col.s[2]); dot(ctx, A.X(x), A.Y(y), 4, col.s[0], col.ink);
      if (last) dot(ctx, A.X(xn), A.Y(0), 6, col.s[3], col.ink);
    }
    text(ctx, 'orange: latest tangent · pink: next guess', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
  };
  re();
  return { step(i) { it = Math.max(0, Math.min(6, i)); re(); } };
}
