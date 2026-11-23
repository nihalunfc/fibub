// Class 11 Maths, Trigonometric Functions: graphs of the six trigonometric functions between −2π and 2π. sin and cos repeat every 2π and stay between −1 and 1;
// tan and cot repeat every π; cosec, sec and cot have vertical asymptotes where the denominator is zero.
import { canvas, text, title, row, slider, choice, readout, dot } from '../../kit.js';
import { plot, curve, r2, piLabel } from '../c11m-lib.js';

const F = {
  sin: ['sin x', Math.sin, 'all real x', '[−1, 1]', '2π', []], cos: ['cos x', Math.cos, 'all real x', '[−1, 1]', '2π', []], tan: ['tan x', Math.tan, 'x ≠ π/2 + nπ', 'all real y', 'π', [Math.PI / 2]],
  csc: ['cosec x', (x) => 1 / Math.sin(x), 'x ≠ nπ', 'y ≤ −1 or y ≥ 1', '2π', [0]], sec: ['sec x', (x) => 1 / Math.cos(x), 'x ≠ π/2 + nπ', 'y ≤ −1 or y ≥ 1', '2π', [Math.PI / 2]], cot: ['cot x', (x) => 1 / Math.tan(x), 'x ≠ nπ', 'all real y', 'π', [0]],
};
export default function (host) {
  let k = 'sin', x0 = 1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Graph of a trigonometric function with a point you can slide' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `y = ${F[k][0]}`, col);
    const T = 2 * Math.PI, P = plot(ctx, w, h, col, { x: [-T, T], y: [-3, 3], l: 22, b: 14, t: 28, r: 12, sx: Math.PI, sy: 1, fx: piLabel }), f = F[k][1], per = k === 'tan' || k === 'cot' || k === 'cot' ? Math.PI : Math.PI;
    ctx.save(); P.clip(); ctx.setLineDash([5, 4]); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.2;
    F[k][5].forEach((a0) => { for (let a = a0 - 4 * Math.PI; a <= 4 * Math.PI; a += Math.PI) { ctx.beginPath(); ctx.moveTo(P.X(a), P.T); ctx.lineTo(P.X(a), P.B); ctx.stroke(); } });
    ctx.restore(); ctx.setLineDash([]);
    curve(ctx, P, f, col.s[0], 2.6, 120);
    const y = f(x0);
    if (Number.isFinite(y) && Math.abs(y) < 3) { ctx.setLineDash([4, 3]); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(P.X(x0), P.Y(0)); ctx.lineTo(P.X(x0), P.Y(y)); ctx.stroke(); ctx.setLineDash([]); dot(ctx, P.X(x0), P.Y(y), 6, col.s[3], col.panel); }
    out.innerHTML = `Domain: ${F[k][2]}. Range: ${F[k][3]}. Period: <b>${F[k][4]}</b>. At x = ${r2(x0, 2)}: ${F[k][0]} = <b>${Number.isFinite(y) && Math.abs(y) < 1e6 ? r2(y) : 'not defined'}</b>.`;
  };
  choice(row(host), 'Function', Object.entries(F).map(([a, v]) => [a, v[0]]), k, (v) => { k = v; cv.redraw(); });
  slider(row(host), { label: 'x (rad)', min: -6.2, max: 6.2, step: 0.05, value: x0, fmt: (v) => r2(v, 2), oninput: (v) => { x0 = v; cv.redraw(); } });
  cv.redraw();
}
