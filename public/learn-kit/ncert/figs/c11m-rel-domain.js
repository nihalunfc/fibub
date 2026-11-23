// Class 11 Maths, Relations and Functions: domain and range read off a graph. The domain is every x for which the function gives a value
// (shadow on the x-axis); the range is every value y that is actually reached (shadow on the y-axis). Slide x to see an input turn into an output.
import { canvas, text, title, row, slider, choice, readout, dot } from '../../kit.js';
import { plot, curve, r2 } from '../c11m-lib.js';

const F = {
  sq: ['x² − 4x + 3', (x) => x * x - 4 * x + 3, 'all real x', '[−1, ∞)'], rt: ['√(x − 1)', (x) => (x >= 1 ? Math.sqrt(x - 1) : NaN), '[1, ∞)', '[0, ∞)'],
  rc: ['1/(x − 2)', (x) => (Math.abs(x - 2) < 1e-9 ? NaN : 1 / (x - 2)), 'all real x except 2', 'all real y except 0'], ci: ['√(9 − x²)', (x) => (Math.abs(x) <= 3 ? Math.sqrt(9 - x * x) : NaN), '[−3, 3]', '[0, 3]'],
  ab: ['|x| − 1', (x) => Math.abs(x) - 1, 'all real x', '[−1, ∞)'], sn: ['3 sin x', (x) => 3 * Math.sin(x), 'all real x', '[−3, 3]'],
};
export default function (host) {
  let k = 'rt', x0 = 3;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Graph of a function with its domain and range shown as shadows on the axes' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `f(x) = ${F[k][0]}`, col);
    const P = plot(ctx, w, h, col, { x: [-5, 7], y: [-4, 6], l: 22, b: 14, t: 28, r: 12, sx: 2, sy: 2 }), f = F[k][1];
    const xs = new Set(), ys = new Set();
    for (let x = -5; x <= 7; x += 0.004) { const y = f(x); if (Number.isFinite(y)) { xs.add(Math.round(P.X(x))); const yy = Math.round(P.Y(y)); if (yy >= P.T && yy <= P.B) ys.add(yy); } }
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; xs.forEach((px) => ctx.fillRect(px, P.B - 6, 1.2, 6)); ctx.fillStyle = col.s[2]; ys.forEach((py) => ctx.fillRect(P.L, py, 6, 1.2)); ctx.globalAlpha = 1;
    curve(ctx, P, f, col.ink, 2.4, 60);
    text(ctx, 'domain', P.R - 4, P.B - 12, { color: col.s[0], size: 11, weight: 800, align: 'right' }); text(ctx, 'range', P.L + 8, P.T + 8, { color: col.s[2], size: 11, weight: 800 });
    const y = f(x0);
    if (Number.isFinite(y) && Math.abs(y) < 4.2) { ctx.setLineDash([4, 3]); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(P.X(x0), P.B); ctx.lineTo(P.X(x0), P.Y(y)); ctx.lineTo(P.L, P.Y(y)); ctx.stroke(); ctx.setLineDash([]); dot(ctx, P.X(x0), P.Y(y), 6, col.s[3], col.panel); }
    out.innerHTML = `Domain: <b>${F[k][2]}</b>. Range: <b>${F[k][3]}</b>. At x = ${r2(x0, 1)}: ${Number.isFinite(y) ? `f(x) = <b>${r2(y)}</b>` : '<b>no value</b> (x is outside the domain)'}.`;
  };
  choice(row(host), 'Function', Object.entries(F).map(([a, v]) => [a, v[0]]), k, (v) => { k = v; cv.redraw(); });
  slider(row(host), { label: 'x', min: -4.5, max: 6.5, step: 0.1, value: x0, fmt: (v) => r2(v, 1), oninput: (v) => { x0 = v; cv.redraw(); } });
  cv.redraw();
}
