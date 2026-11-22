// 2.4 How fast numerical methods converge. Roots: the error |x_n − r| for bisection, the secant method and
// Newton-Raphson on f(x) = cos x − x (root r = 0.739085...), on a log scale. Integrals: the error of the composite
// trapezoidal and Simpson rules for ∫₀¹ eˣ dx against the number of sub-intervals, on log-log axes (slopes −2 and −4).
import { canvas, axes, line, dot, text, title, row, choice, readout, fmt } from '../../kit.js';

const f = (x) => Math.cos(x) - x, df = (x) => -Math.sin(x) - 1;
let root = 0.7; for (let i = 0; i < 60; i++) root -= f(root) / df(root);
const EX = Math.E - 1;
const trap = (n) => { const h = 1 / n; let s = (1 + Math.E) / 2; for (let i = 1; i < n; i++) s += Math.exp(i * h); return s * h; };
const simp = (n) => { const h = 1 / n; let s = 1 + Math.E; for (let i = 1; i < n; i++) s += Math.exp(i * h) * (i % 2 ? 4 : 2); return s * h / 3; };

function roots(x0) {
  const out = { bis: [], sec: [], new: [] };
  let a = 0, b = 1.5; for (let i = 0; i < 14; i++) { const m = (a + b) / 2; out.bis.push(Math.abs(m - root)); (f(a) * f(m) <= 0) ? (b = m) : (a = m); }
  let p = x0, q = x0 + 0.3; for (let i = 0; i < 14; i++) { const d = f(q) - f(p); if (d === 0) break; const r = q - f(q) * (q - p) / d; p = q; q = r; out.sec.push(Math.abs(q - root)); }
  let x = x0; for (let i = 0; i < 14; i++) { x -= f(x) / df(x); out.new.push(Math.abs(x - root)); }
  for (const k in out) out[k] = out[k].map((e) => Math.max(e, 1e-16));
  return out;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Error against iteration or step count for root finders and integration rules' });
  let mode = 'roots', x0 = 0;
  const ctl = row(host);
  choice(ctl, 'Show', [['roots', 'Root finding'], ['quad', 'Integration']], mode, (v) => { mode = v; cv.redraw(); });
  choice(ctl, 'Start x₀', [[0, '0'], [1, '1'], [2, '2']], x0, (v) => { x0 = v; cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, W, H, col) => {
    if (mode === 'roots') {
      const R = roots(x0);
      title(ctx, 'Error of three root finders for cos x = x', col);
      const ax = axes(ctx, W, H, col, { x: [0, 14], y: [1e-16, 10], ylog: true, xlabel: 'iteration n', ylabel: '|x_n − root|', t: 30 });
      const plot = (arr, c) => { line(ctx, arr.map((e, i) => [ax.X(i + 1), ax.Y(e)]), c, 2); arr.forEach((e, i) => dot(ctx, ax.X(i + 1), ax.Y(e), 2.6, c)); };
      plot(R.bis, col.s[2]); plot(R.sec, col.s[1]); plot(R.new, col.s[0]);
      text(ctx, 'bisection (halves each step)', ax.R - 6, ax.T + 10, { color: col.s[2], size: 11, weight: 700, align: 'right' });
      text(ctx, 'secant (order 1.618)', ax.R - 6, ax.T + 25, { color: col.s[1], size: 11, weight: 700, align: 'right' });
      text(ctx, 'Newton (order 2)', ax.R - 6, ax.T + 40, { color: col.s[0], size: 11, weight: 700, align: 'right' });
      const nN = R.new.findIndex((e) => e < 1e-12) + 1, nB = R.bis.findIndex((e) => e < 1e-4) + 1;
      out.innerHTML = `Root 0.7390851. From x₀ = ${x0}, Newton reaches 12 correct digits after <b>${nN || '>14'}</b> steps: the number of correct digits roughly doubles each step. Bisection gains one binary digit per step (${nB} steps for 4 decimal places) but can never fail.`;
    } else {
      const ns = [2, 4, 8, 16, 32, 64, 128, 256];
      const T = ns.map((n) => Math.abs(trap(n) - EX)), S = ns.map((n) => Math.max(Math.abs(simp(n) - EX), 1e-16));
      title(ctx, 'Error of two integration rules for ∫₀¹ eˣ dx', col);
      const ax = axes(ctx, W, H, col, { x: [1.5, 300], y: [1e-14, 1], xlog: true, ylog: true, xlabel: 'number of sub-intervals n', ylabel: '|error|', t: 30 });
      const plot = (arr, c) => { line(ctx, arr.map((e, i) => [ax.X(ns[i]), ax.Y(e)]), c, 2); arr.forEach((e, i) => dot(ctx, ax.X(ns[i]), ax.Y(e), 3, c)); };
      plot(T, col.s[2]); plot(S, col.s[0]);
      text(ctx, 'trapezoid: slope −2', ax.R - 6, ax.T + 10, { color: col.s[2], size: 11, weight: 700, align: 'right' });
      text(ctx, 'Simpson: slope −4', ax.R - 6, ax.T + 25, { color: col.s[0], size: 11, weight: 700, align: 'right' });
      out.innerHTML = `Doubling n divides the trapezoid error by about <b>${fmt(T[2] / T[3], 3)}</b> (≈ 4 = 2²) and the Simpson error by about <b>${fmt(S[2] / S[3], 3)}</b> (≈ 16 = 2⁴). With n = 8: trapezoid error ${fmt(T[2], 3)}, Simpson ${fmt(S[2], 3)}.`;
    }
  };
  cv.redraw();
}
