// Learning curves: how training error and test error change as you give the model more examples. The data are made
// up (y = sin 2πx plus noise), each point is the average of 20 fresh draws, the fit is a polynomial. Try: a straight
// line (high bias: both curves meet high, more data will not help), degree 9 (high variance: a wide gap that closes
// slowly as data grows) and degree 3 (both drop towards the noise floor). Slide the number of examples to see the fit.
import { canvas, text, row, slider, choice, readout, title, axes, line, dot } from '../kit.js';
import { rng } from '../kit.js';
import { gauss } from './_ai.js';

const SIG = 0.3, NS = [8, 12, 16, 24, 32, 48, 64, 96, 128];
function fit(xs, ys, d) {
  const m = d + 1, A = Array.from({ length: m }, () => new Array(m + 1).fill(0));
  xs.forEach((x, k) => { const p = Array.from({ length: m }, (_, i) => x ** i); for (let i = 0; i < m; i++) { for (let j = 0; j < m; j++) A[i][j] += p[i] * p[j]; A[i][m] += p[i] * ys[k]; } });
  for (let i = 0; i < m; i++) A[i][i] += 1e-6;
  for (let i = 0; i < m; i++) { let b = i; for (let r = i + 1; r < m; r++) if (Math.abs(A[r][i]) > Math.abs(A[b][i])) b = r; [A[i], A[b]] = [A[b], A[i]];
    for (let r = 0; r < m; r++) if (r !== i) { const f = A[r][i] / A[i][i]; for (let c = i; c <= m; c++) A[r][c] -= f * A[i][c]; } }
  return A.map((r, i) => r[m] / r[i]);
}
const ev = (c, x) => c.reduce((s, v, i) => s + v * x ** i, 0);
const truth = (x) => Math.sin(2 * Math.PI * x);
export default function (host) {
  let deg = 9, n = 24; const R = rng(11);
  const cv = canvas(host, { aspect: 1.05, max: 520, min: 360, label: 'Training and test error against the number of training examples, and the fitted curve' });
  const ctl = row(host);
  choice(ctl, 'Model', [[1, 'Line (deg 1)'], [3, 'Cubic (deg 3)'], [9, 'Degree 9']], deg, (v) => { deg = v; calc(); });
  slider(ctl, { label: 'Examples', min: 8, max: 128, step: 1, value: n, fmt: (v) => Math.round(v), oninput: (v) => { n = Math.round(v); calc(); } });
  const out = readout(host);
  let curve = [], one = null;
  const draws = (m) => { const xs = Array.from({ length: m }, () => R()), ys = xs.map((x) => truth(x) + SIG * gauss(R)); return [xs, ys]; };
  function errs(c, xs, ys) { return xs.reduce((s, x, i) => s + (ev(c, x) - ys[i]) ** 2, 0) / xs.length; }
  function calc() {
    const R0 = rng(99), save = R; // fixed data for the curves so the picture does not jitter
    curve = NS.map((m) => { let tr = 0, te = 0; const K = 20;
      for (let k = 0; k < K; k++) { const xs = Array.from({ length: m }, () => R0()), ys = xs.map((x) => truth(x) + SIG * gauss(R0)), c = fit(xs.map((x) => 2 * x - 1), ys, deg);
        tr += errs(c, xs.map((x) => 2 * x - 1), ys); const gx = Array.from({ length: 40 }, (_, i) => i / 39); te += gx.reduce((s, x) => s + (ev(c, 2 * x - 1) - truth(x)) ** 2, 0) / 40 + SIG * SIG; }
      return [m, tr / K, te / K]; });
    const R1 = rng(1234 + n), xs = Array.from({ length: n }, () => R1()), ys = xs.map((x) => truth(x) + SIG * gauss(R1));
    one = { xs, ys, c: fit(xs.map((x) => 2 * x - 1), ys, deg) };
    const near = curve.reduce((b, r) => (Math.abs(r[0] - n) < Math.abs(b[0] - n) ? r : b));
    const gap = near[2] - near[1];
    out.innerHTML = `Degree ${deg}, about ${near[0]} examples: training error <b>${near[1].toFixed(3)}</b>, test error <b>${near[2].toFixed(3)}</b>, gap ${gap.toFixed(3)}. The noise floor is ${(SIG * SIG).toFixed(2)}: no model can beat it. ${deg === 1 ? 'Both curves sit high and close: the model is too simple, more data will not fix that.' : deg === 9 ? (gap > 0.15 ? 'A big gap: the model memorises the few examples. More data shrinks the gap.' : 'With this much data the gap has mostly closed.') : 'Both curves head for the noise floor.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const split = Math.round(h * 0.55);
    title(ctx, 'Error as the training set grows', col);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, split); ctx.clip();
    const ax = axes(ctx, w, split, col, { x: [0, 130], y: [0, 0.6], xlabel: 'training examples', ylabel: 'error (MSE)', t: 30, b: 34, l: 46, fy: (v) => v.toFixed(1) });
    ax.clip();
    line(ctx, [[0, SIG * SIG], [130, SIG * SIG]].map(([a, b]) => [ax.X(a), ax.Y(b)]), col.good, 1.5, [5, 4]);
    line(ctx, curve.map(([m, a]) => [ax.X(m), ax.Y(Math.min(a, 0.6))]), col.s[0], 2.5);
    line(ctx, curve.map(([m, , b]) => [ax.X(m), ax.Y(Math.min(b, 0.6))]), col.s[1], 2.5);
    line(ctx, [[ax.X(n), ax.Y(0)], [ax.X(n), ax.Y(0.6)]], col.muted, 1, [3, 3]);
    ctx.restore();
    text(ctx, 'test', ax.R - 30, ax.Y(Math.min(0.55, curve[curve.length - 1]?.[2] ?? 0.2)) - 10, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, 'training', ax.R - 52, ax.Y(0.04) - 10, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'noise floor', ax.L + 6, ax.Y(SIG * SIG) - 8, { color: col.good, size: 10 });
    ctx.save(); ctx.translate(0, split); 
    const bx = axes(ctx, w, h - split, col, { x: [0, 1], y: [-1.8, 1.8], xlabel: `the ${n} examples and the fitted curve`, t: 6, b: 30, l: 46, r: 14, fy: (v) => v.toFixed(1) });
    bx.clip();
    line(ctx, Array.from({ length: 81 }, (_, i) => [bx.X(i / 80), bx.Y(truth(i / 80))]), col.good, 1.5, [5, 4]);
    one.xs.forEach((x, i) => dot(ctx, bx.X(x), bx.Y(one.ys[i]), 2.6, col.s[2]));
    line(ctx, Array.from({ length: 101 }, (_, i) => { const x = i / 100; return [bx.X(x), bx.Y(Math.max(-1.8, Math.min(1.8, ev(one.c, 2 * x - 1))))]; }), col.s[3], 2.5);
    ctx.restore();
  };
  calc();
}
