// Euler's method for dy/dx = f(x, y). From the start point, walk along the slope for a step h, re-read the slope there,
// and walk again. Pick an equation and shrink h: the zig-zag follows the exact curve better and better (the error
// shrinks roughly in proportion to h). Press Step to take one step at a time.
import { canvas, axes, row, slider, choice, button, readout, dot, line, text } from '../kit.js';
import { curve, f2 } from './_math.js';

const EQ = {
  grow: ['dy/dx = y, y(0) = 1', (x, y) => y, (x) => Math.exp(x), 1],
  decay: ['dy/dx = −2y, y(0) = 2', (x, y) => -2 * y, (x) => 2 * Math.exp(-2 * x), 2],
  lin: ['dy/dx = x + y, y(0) = 1', (x, y) => x + y, (x) => 2 * Math.exp(x) - x - 1, 1],
  logi: ['dy/dx = y(1 − y/4), y(0) = 0.5', (x, y) => y * (1 - y / 4), (x) => 4 / (1 + 7 * Math.exp(-x)), 0.5],
};
export default function (host) {
  let k = 'grow', h = 0.5, shown = 99;
  const cv = canvas(host, { aspect: 0.75, max: 380, min: 260, label: 'Euler method steps against the exact solution' });
  const c = row(host), c2 = row(host);
  choice(c, 'Equation', Object.entries(EQ).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; shown = 99; re(); });
  slider(c2, { label: 'step h', min: 0.05, max: 1, step: 0.05, value: h, fmt: (v) => f2(v), oninput: (v) => { h = v; shown = 99; re(); } });
  button(c2, 'Step ▶', () => { const N = Math.floor(2 / h + 1e-9); shown = shown >= N ? 1 : Math.min(N, (shown === 99 ? 0 : shown) + 1); re(); });
  button(c2, 'All', () => { shown = 99; re(); });
  const out = readout(host);
  const path = () => { const [, f, , y0] = EQ[k], N = Math.floor(2 / h + 1e-9), P = [[0, y0]]; for (let i = 0; i < N; i++) { const [x, y] = P[i]; P.push([x + h, y + h * f(x, y)]); } return P; };
  function re() { cv.redraw(); const P = path(), m = Math.min(shown, P.length - 1), [x, y] = P[m], ex = EQ[k][2](x);
    out.innerHTML = `After ${m} step${m === 1 ? '' : 's'} (x = ${f2(x)}): Euler gives y ≈ <b>${f2(y, 4)}</b>, exact y = ${f2(ex, 4)}, error ${f2(Math.abs(y - ex), 4)} (${f2(Math.abs(y - ex) / Math.abs(ex) * 100, 1)}%). Each step: y_new = y + h · f(x, y).`; }
  cv.draw = (ctx, w, h2, col) => {
    const [, f, ex] = EQ[k], P = path(), ys = [...P.map((p) => p[1]), ...[0, 1, 2].map(ex)], lo = Math.min(0, ...ys), hi = Math.max(...ys) * 1.08;
    const A = axes(ctx, w, h2, col, { x: [0, 2], y: [lo, hi], l: 36, b: 34, t: 22, r: 10, xlabel: 'x' });
    // slope field in the background
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip(); ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) for (let j = 0; j <= 7; j++) { const x = (2 * i) / 10, y = lo + ((hi - lo) * j) / 7, s = f(x, y), dx = 0.07, dy = s * dx * ((hi - lo) / 2) * 0 + s * 0.07 * ((hi - lo) / 2) / 1; const a = Math.atan2(-(A.Y(y + s * 0.1) - A.Y(y)), A.X(x + 0.1) - A.X(x)); ctx.beginPath(); ctx.moveTo(A.X(x) - Math.cos(a) * 7, A.Y(y) + Math.sin(a) * 7); ctx.lineTo(A.X(x) + Math.cos(a) * 7, A.Y(y) - Math.sin(a) * 7); ctx.stroke(); }
    ctx.restore();
    curve(ctx, A, ex, 0, 2, col.s[0], 3);
    const m = Math.min(shown, P.length - 1); line(ctx, P.slice(0, m + 1).map(([x, y]) => [A.X(x), A.Y(y)]), col.s[1], 2.5);
    P.slice(0, m + 1).forEach(([x, y]) => dot(ctx, A.X(x), A.Y(y), 3.5, col.s[1], col.ink));
    text(ctx, 'blue exact · orange Euler steps · grey = slope field', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
  };
  re();
}
