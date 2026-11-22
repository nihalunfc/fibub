// Area between two curves, built from thin strips. Each strip has height f(x) − g(x) and width Δx; add them up and the
// total approaches the integral ∫(f − g)dx. Pick a pair of curves and slide the number of strips: the strip sum climbs
// to the exact area. The curves cross at the limits of integration.
import { canvas, axes, row, slider, choice, readout, text, line } from '../kit.js';
import { curve, f2 } from './_math.js';

const PAIR = {
  a: ['y = √x and y = x²', Math.sqrt, (x) => x * x, 0, 1, 1 / 3],
  b: ['y = x and y = x³', (x) => x, (x) => x ** 3, 0, 1, 1 / 4],
  c: ['sin x and cos x', Math.cos, Math.sin, 0, Math.PI / 4, Math.SQRT2 - 1],
  d: ['4 − x² and x + 2', (x) => 4 - x * x, (x) => x + 2, -2, 1, 4.5],
  e: ['parabola y² = 4x vs line', (x) => 2 * Math.sqrt(x), (x) => x, 0, 4, 8 / 3],
};
export default function (host) {
  let k = 'a', n = 6;
  const cv = canvas(host, { aspect: 0.72, max: 360, min: 250, label: 'The area between two curves split into thin strips' });
  const c = row(host), c2 = row(host);
  choice(c, 'Curves', Object.entries(PAIR).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; re(); });
  slider(c2, { label: 'strips n', min: 1, max: 60, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; re(); } });
  const out = readout(host);
  const sum = () => { const [, f, g, a, b] = PAIR[k], dx = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += (f(a + (i + 0.5) * dx) - g(a + (i + 0.5) * dx)) * dx; return s; };
  function re() { cv.redraw(); const e = PAIR[k][5], s = sum(); out.innerHTML = `n = ${n} strips, each Δx = ${f2((PAIR[k][4] - PAIR[k][3]) / n, 3)} wide. Sum of strips = <b>${f2(s, 4)}</b>. Exact area ∫(top − bottom)dx = <b>${f2(e, 4)}</b>. Error ${f2(Math.abs(s - e), 4)}; more strips, smaller error. Top curve minus bottom curve is what you integrate, whichever order they are written.`; }
  cv.draw = (ctx, w, h, col) => {
    const [, f, g, a, b] = PAIR[k], span = b - a, xs = Array.from({ length: 80 }, (_, i) => a + (span * i) / 79), ys = xs.flatMap((x) => [f(x), g(x)]);
    const lo = Math.min(0, ...ys), hi = Math.max(...ys), A = axes(ctx, w, h, col, { x: [a - span * 0.1, b + span * 0.1], y: [lo - 0.1 * (hi - lo), hi + 0.12 * (hi - lo)], l: 32, b: 22, t: 22, r: 10 });
    const dx = span / n; ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.4;
    for (let i = 0; i < n; i++) { const xm = a + (i + 0.5) * dx, y1 = f(xm), y2 = g(xm); ctx.fillRect(A.X(a + i * dx), A.Y(Math.max(y1, y2)), A.X(a + (i + 1) * dx) - A.X(a + i * dx) - (n < 30 ? 1 : 0), Math.abs(A.Y(y1) - A.Y(y2))); }
    ctx.globalAlpha = 1;
    curve(ctx, A, f, a, b, col.s[0], 3); curve(ctx, A, g, a, b, col.s[1], 3);
    text(ctx, 'top curve', A.L + 6, A.T + 8, { color: col.muted, size: 10 });
  };
  re();
}
