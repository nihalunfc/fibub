// Class 11 Maths, Limits and Derivatives: the derivative as the slope of the tangent, seen as a new function. Top: f with its tangent at x0 (slide x0).
// Bottom: f'(x) drawn as the height equal to the tangent slope; the dot is the slope at the chosen x0. Where f rises, f' is positive; at the top or bottom of a hill, f' is 0.
import { canvas, text, title, dot, row, slider, readout, choice } from '../../kit.js';
import { plot, curve, r2 } from '../c11m-lib.js';

const FUNS = {
  sq: { n: 'x²', f: (x) => x * x, d: (x) => 2 * x, dn: '2x', x: [-3, 3], y: [-1, 9], y2: [-6, 6] },
  cu: { n: 'x³ − 3x', f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, dn: '3x² − 3', x: [-2.5, 2.5], y: [-4, 4], y2: [-4, 12] },
  sin: { n: 'sin x', f: Math.sin, d: Math.cos, dn: 'cos x', x: [-6.3, 6.3], y: [-1.6, 1.6], y2: [-1.6, 1.6] },
};
export default function (host) {
  let k = 'sq', x0 = 1;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 330, label: 'A curve with its tangent line and below it the graph of its derivative' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Function', [['sq', 'x²'], ['cu', 'x³ − 3x'], ['sin', 'sin x']], k, (v) => { k = v; x0 = Math.max(FUNS[v].x[0] + 0.3, Math.min(FUNS[v].x[1] - 0.3, x0)); cv.redraw(); });
  slider(ctl, { label: 'point x₀', min: -3, max: 3, step: 0.05, value: x0, fmt: (v) => r2(v, 2), oninput: (v) => { x0 = v; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const F = FUNS[k], top = title(ctx, `f(x) = ${F.n} and its slope function`, col), mid = top + (h - top) * 0.52;
    x0 = Math.max(F.x[0] + 0.1, Math.min(F.x[1] - 0.1, x0));
    const P1 = plot(ctx, w, h, col, { x: F.x, y: F.y, sx: k === 'sin' ? 2 : 1, sy: k === 'sq' ? 2 : 1, t: top + 4, b: h - mid + 4, nolabx: true, fy: (v) => r2(v, 0) });
    curve(ctx, P1, F.f, col.s[0], 2.5);
    const y0 = F.f(x0), m = F.d(x0);
    ctx.save(); P1.clip(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(P1.X(F.x[0]), P1.Y(y0 + m * (F.x[0] - x0))); ctx.lineTo(P1.X(F.x[1]), P1.Y(y0 + m * (F.x[1] - x0))); ctx.stroke(); ctx.restore();
    dot(ctx, P1.X(x0), P1.Y(y0), 6, col.s[3], col.panel);
    text(ctx, 'f', P1.L + 6, P1.T + 8, { color: col.s[0], size: 12, weight: 800 });
    const P2 = plot(ctx, w, h, col, { x: F.x, y: F.y2, sx: k === 'sin' ? 2 : 1, sy: k === 'sin' ? 1 : 4, t: mid + 6, b: 18, fy: (v) => r2(v, 0) });
    curve(ctx, P2, F.d, col.s[2], 2.5);
    ctx.save(); P2.clip(); ctx.strokeStyle = col.s[3]; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(P2.X(x0), P2.Y(0)); ctx.lineTo(P2.X(x0), P2.Y(m)); ctx.stroke(); ctx.restore();
    dot(ctx, P2.X(x0), P2.Y(m), 6, col.s[3], col.panel);
    text(ctx, "f ′ (the slope)", P2.L + 6, P2.T + 8, { color: col.s[2], size: 12, weight: 800 });
    ro.innerHTML = `At x₀ = ${r2(x0, 2)}: f = <b>${r2(y0, 3)}</b>, tangent slope f′(x₀) = ${F.dn} = <b>${r2(m, 3)}</b>. ${Math.abs(m) < 0.06 ? 'Slope 0: the tangent is flat, a top or bottom of a hill.' : m > 0 ? 'f is rising, so f′ is positive.' : 'f is falling, so f′ is negative.'}`;
  };
  cv.redraw();
}
