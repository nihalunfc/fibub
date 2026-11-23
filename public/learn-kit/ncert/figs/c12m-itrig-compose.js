// Class 12 Maths, Inverse trigonometric functions: f(f^-1(x)) = x only on the domain of the inverse, but f^-1(f(x)) = x only on the principal
// range. Outside it the graph of f^-1(f(x)) is a zig-zag or saw-tooth. Pick a composite and drag the probe.
import { canvas, text, title, row, slider, choice, axes, line, dot, readout } from '../../kit.js';

const P = Math.PI, H = P / 2, tn = Math.tan;
const C = {
  sis: ['sin⁻¹(sin x)', (x) => Math.asin(Math.sin(x)), [-7, 7], [-H, H], 'only for x in [−π/2, π/2]'],
  cic: ['cos⁻¹(cos x)', (x) => Math.acos(Math.cos(x)), [-7, 7], [0, P], 'only for x in [0, π]'],
  tit: ['tan⁻¹(tan x)', (x) => Math.atan(tn(x)), [-7, 7], [-H, H], 'only for x in (−π/2, π/2)'],
  ssi: ['sin(sin⁻¹ x)', (x) => (Math.abs(x) <= 1 ? Math.sin(Math.asin(x)) : NaN), [-3, 3], [-1, 1], 'on [−1, 1] only (not defined outside)'],
  cci: ['cos(cos⁻¹ x)', (x) => (Math.abs(x) <= 1 ? Math.cos(Math.acos(x)) : NaN), [-3, 3], [-1, 1], 'on [−1, 1] only (not defined outside)'],
  tti: ['tan(tan⁻¹ x)', (x) => tn(Math.atan(x)), [-3, 3], [-3, 3], 'for every real x'],
};
const lab = (v) => { const k = Math.round(v / H); return Math.abs(v - k * H) > 1e-6 ? '' : ['−2π', '−3π/2', '−π', '−π/2', '0', 'π/2', 'π', '3π/2', '2π'][k + 4] ?? ''; };
export default function (host) {
  let key = 'sis', x = 2.2;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'The graph of a composite of a trigonometric function and its inverse with a movable probe' });
  const out = readout(host);
  const sl = slider(row(host), { label: 'x', min: -7, max: 7, step: 0.01, value: x, fmt: (v) => v.toFixed(2), oninput: (v) => { x = v; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const [name, f, [lo, hi], [r0, r1], note] = C[key], big = hi > 4, xs = big ? [lo, hi] : [-3, 3];
    title(ctx, `y = ${name}`, col);
    const tk = big ? [-2 * P, -P, 0, P, 2 * P] : [-2, -1, 0, 1, 2], a = axes(ctx, w, h, col, { x: xs, y: [-3.5, 3.5], xt: tk, fx: big ? lab : undefined, yt: [-P, -H, 0, H, P, 3], fy: lab, l: 40, b: 28, t: 28, r: 12 });
    ctx.save(); a.clip();
    line(ctx, [[a.X(xs[0]), a.Y(xs[0])], [a.X(xs[1]), a.Y(xs[1])]], col.line, 1.5, [4, 4]);
    let cur = [], prev = null; for (let u = xs[0]; u <= xs[1] + 1e-9; u += 0.01) { const v = f(u); if (!isFinite(v) || (prev !== null && Math.abs(v - prev) > 1.2)) { if (cur.length > 1) line(ctx, cur, col.s[0], 3); cur = []; } if (isFinite(v)) cur.push([a.X(u), a.Y(v)]); prev = isFinite(v) ? v : null; } line(ctx, cur, col.s[0], 3);
    ctx.restore();
    const px = Math.max(xs[0], Math.min(xs[1], key === 'sis' || key === 'cic' || key === 'tit' ? x : x / 7 * 3)), v = f(px);
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(a.X(px), a.B); ctx.lineTo(a.X(px), isFinite(v) ? a.Y(v) : a.T); ctx.stroke(); ctx.setLineDash([]);
    if (isFinite(v)) dot(ctx, a.X(px), a.Y(v), 6, col.s[2], col.panel);
    out.innerHTML = `At x = ${px.toFixed(2)}: ${name} = <b>${isFinite(v) ? v.toFixed(3) : 'not defined'}</b>${isFinite(v) && Math.abs(v - px) < 1e-6 ? ' (equals x)' : isFinite(v) ? ' (differs from x)' : ''}. Where does it equal x? ${note}.`;
  };
  choice(row(host), 'Composite', Object.entries(C).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; cv.redraw(); });
  cv.redraw();
}
