// Class 12 Maths, Inverse trigonometric functions: sin^-1 x + cos^-1 x = pi/2 for every x in [-1, 1]. The two curves are mirror images about
// the level y = pi/4, so they always add to pi/2. Slide x to see the two angles share a right angle.
import { canvas, text, title, row, slider, axes, line, dot, readout } from '../../kit.js';

const P = Math.PI;
export default function (host) {
  let x = 0.5;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'The graphs of inverse sine and inverse cosine and their constant sum' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'sin⁻¹x + cos⁻¹x = π/2', col);
    const yt = [-P / 2, 0, P / 4, P / 2, P], a = axes(ctx, w, h, col, { x: [-1, 1], y: [-1.8, 3.4], xt: [-1, -0.5, 0, 0.5, 1], yt, fy: (v) => ({ [-P / 2]: '−π/2', 0: '0', [P / 4]: 'π/4', [P / 2]: 'π/2', [P]: 'π' }[v] ?? ''), l: 40, b: 28, t: 30, r: 12 });
    const g = (f) => { const p = []; for (let u = -1; u <= 1.0001; u += 0.01) p.push([a.X(u), a.Y(f(u))]); return p; };
    line(ctx, g(Math.asin), col.s[0], 2.8); line(ctx, g(Math.acos), col.s[2], 2.8); line(ctx, g(() => P / 2), col.ink, 1.8, [5, 4]);
    text(ctx, 'sin⁻¹x', a.X(0.55), a.Y(Math.asin(0.55)) + 16, { color: col.s[0], size: 11.5, weight: 700 }); text(ctx, 'cos⁻¹x', a.X(-0.95), a.Y(Math.acos(-0.95)) + 4, { color: col.s[2], size: 11.5, weight: 700 }); text(ctx, 'sum = π/2', a.X(-0.2), a.Y(P / 2) - 9, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(a.X(x), a.B); ctx.lineTo(a.X(x), a.T); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, a.X(x), a.Y(Math.asin(x)), 5.5, col.s[0], col.panel); dot(ctx, a.X(x), a.Y(Math.acos(x)), 5.5, col.s[2], col.panel);
    out.innerHTML = `x = ${x.toFixed(2)}: sin⁻¹x = <b>${Math.asin(x).toFixed(4)}</b>, cos⁻¹x = <b>${Math.acos(x).toFixed(4)}</b>, sum = <b>${(Math.asin(x) + Math.acos(x)).toFixed(4)}</b> = π/2 = ${(P / 2).toFixed(4)}.`;
  };
  slider(row(host), { label: 'x', min: -1, max: 1, step: 0.01, value: x, fmt: (v) => v.toFixed(2), oninput: (v) => { x = v; cv.redraw(); } });
  cv.redraw();
}
