// Class 12 Maths, Inverse trigonometric functions: each inverse is the mirror image (in the line y = x) of ONE one-one piece of the
// trigonometric curve, the principal branch. Pick a function, then slide "Reflect" to swing the bold branch over to its inverse.
import { canvas, text, title, row, choice, slider, axes, line, readout } from '../../kit.js';

const P = Math.PI, H = P / 2;
const F = {
  sin: ['sin', Math.sin, [-H, H], 'sin⁻¹: domain [−1, 1], range [−π/2, π/2]'],
  cos: ['cos', Math.cos, [0, P], 'cos⁻¹: domain [−1, 1], range [0, π]'],
  tan: ['tan', Math.tan, [-H + 0.001, H - 0.001], 'tan⁻¹: domain ℝ, range (−π/2, π/2)'],
  cot: ['cot', (x) => 1 / Math.tan(x), [0.001, P - 0.001], 'cot⁻¹: domain ℝ, range (0, π)'],
  sec: ['sec', (x) => 1 / Math.cos(x), [0, P], 'sec⁻¹: domain |x| ≥ 1, range [0, π] except π/2'],
  csc: ['cosec', (x) => 1 / Math.sin(x), [-H, H], 'cosec⁻¹: domain |x| ≥ 1, range [−π/2, π/2] except 0'],
};
const lab = (v) => { const k = Math.round(v / H); return Math.abs(v - k * H) > 1e-6 ? '' : k === 0 ? '0' : k === 1 ? 'π/2' : k === -1 ? '−π/2' : k === 2 ? 'π' : k === -2 ? '−π' : ''; };
export default function (host) {
  let key = 'sin', t = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 320, label: 'A trigonometric curve, its principal branch and the reflection of that branch giving the inverse function' });
  const out = readout(host);
  const seg = (f, a, b, map) => { const S = []; let cur = []; for (let x = a; x <= b + 1e-9; x += 0.015) { const y = f(x); if (!isFinite(y) || Math.abs(y) > 40 || (Math.abs(x - H) < 0.012 && key !== 'tan') || (key === 'csc' && Math.abs(x) < 0.012)) { if (cur.length) S.push(cur); cur = []; continue; } cur.push(map(x, y)); } if (cur.length) S.push(cur); return S; };
  cv.draw = (ctx, w, h, col) => {
    const [name, f, [a0, b0]] = F[key];
    title(ctx, `y = ${name} x and its principal branch`, col);
    const xt = [-P, -H, 0, H, P], yr = (4 * (h - 60)) / (w - 52), ax = axes(ctx, w, h, col, { x: [-4, 4], y: [-yr, yr], xt, yt: xt, fx: lab, fy: lab, l: 40, b: 30, t: 30, r: 12 });
    ctx.save(); ax.clip();
    line(ctx, [[ax.X(-4), ax.Y(-4)], [ax.X(4), ax.Y(4)]], col.muted, 1.2, [4, 4]);
    seg(f, -4, 4, (x, y) => [ax.X(x), ax.Y(y)]).forEach((s) => line(ctx, s, col.line, 1.5));
    seg(f, a0, b0, (x, y) => [ax.X(x), ax.Y(y)]).forEach((s) => line(ctx, s, col.s[0], 3));
    seg(f, a0, b0, (x, y) => [ax.X(x + (y - x) * t), ax.Y(y + (x - y) * t)]).forEach((s) => line(ctx, s, t > 0.02 ? col.s[2] : 'transparent', 3));
    ctx.restore();
    text(ctx, `${name} (principal branch)`, ax.L + 6, ax.T + 10, { color: col.s[0], size: 11, weight: 700 });
    if (t > 0.5) text(ctx, `${name === 'cosec' ? 'cosec' : name}⁻¹`, ax.R - 4, ax.T + 10, { color: col.s[2], size: 11.5, weight: 700, align: 'right' });
    out.textContent = F[key][3] + '. Grey: the whole trig curve (not one-one). Dashed: y = x.';
  };
  const r = row(host);
  choice(r, 'Function', Object.entries(F).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; cv.redraw(); });
  slider(r, { label: 'Reflect', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => (v >= 0.99 ? 'inverse' : v <= 0.01 ? 'original' : Math.round(v * 100) + '%'), oninput: (v) => { t = v; cv.redraw(); } });
  cv.redraw();
}
