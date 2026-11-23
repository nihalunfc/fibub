// Class 12 Maths, Integrals (step player): integration by substitution as a change of ruler. To find the integral of
// 2x·cos(x²) dx from 0 to b, let u = x². Then du = 2x dx and the limits become u = 0 to b². The two shaded areas are
// the same number: the left one is measured with x, the right with u. The graph of the new integrand cos u is simpler.
import { canvas, axes, line, text, title, row, slider } from '../../kit.js';

export default function (host) {
  let step = 0, b = 1.2;
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 350, label: 'Substitution u = x squared: the same area drawn in x and in u' });
  const c = row(host); slider(c, { label: 'upper limit b', min: 0.3, max: 1.5, step: 0.05, value: b, fmt: (v) => v.toFixed(2), oninput: (v) => { b = v; cv.redraw(); } });
  const f = (x) => 2 * x * Math.cos(x * x), g2 = (u) => Math.cos(u);
  const T = ['Start: the integrand 2x cos(x²)', 'Choose u = x²', 'Then du = 2x dx', 'Rewrite: cos u du, limits 0 to b²', 'Integrate: sin u', 'Back to x: sin(x²)'];
  const MS = [['∫ 2x cos(x²) dx', ''], ['let u = x²', 'inner function'], ['du = 2x dx', 'differentiate u'], ['∫ cos u du', 'limits 0 → b²'], ['= sin u + C', 'a basic integral'], ['= sin(x²) + C', 'put x back']];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, T[step], col);
    const half = (h - t - 52) * 0.5;
    const area = (ox, oy, hh, xr, fn, hi, colr, xl, lab) => {
      const g = axes(ctx, w, oy + hh, col, { x: xr, y: [-1.6, 1.6], l: 36, b: 22, t: oy, r: 10, grid: false, yt: [-1, 0, 1] });
      ctx.save(); g.clip();
      if (hi > 0) { ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0)); for (let i = 0; i <= 60; i++) { const x = hi * i / 60; ctx.lineTo(g.X(x), g.Y(fn(x))); } ctx.lineTo(g.X(hi), g.Y(0)); ctx.closePath(); ctx.fillStyle = colr; ctx.globalAlpha = 0.28; ctx.fill(); ctx.globalAlpha = 1; }
      const pts = []; for (let i = 0; i <= 100; i++) { const x = xr[0] + (xr[1] - xr[0]) * i / 100; pts.push([g.X(x), g.Y(fn(x))]); } line(ctx, pts, colr, 2.5);
      ctx.restore();
      text(ctx, lab, g.L + 6, oy + 10, { color: colr, size: 11.5, weight: 700 });
      return g;
    };
    const A = Math.sin(b * b);
    area(0, t + 6, half, [0, 1.6], f, b, col.s[0], '', 'in x: y = 2x cos(x²)');
    if (step >= 3) area(0, t + 6 + half, half, [0, 2.4], g2, b * b, col.s[1], '', 'in u: y = cos u');
    else text(ctx, step >= 1 ? `u = x²,  du = 2x dx` : 'the area is hard to see directly', w / 2, t + 6 + half + half / 2, { color: col.muted, size: 13, align: 'center' });
    if (step >= 4) text(ctx, `area = sin(b²) = ${A.toFixed(3)}`, 10, h - 14, { color: col.s[1], size: 12, weight: 700 });
    if (step >= 5) text(ctx, 'same area in both pictures', w - 10, h - 14, { color: col.ink, size: 11.5, align: "right" });
    text(ctx, MS[step][0] + (MS[step][1] ? '   (' + MS[step][1] + ')' : ''), 10, h - 32, { color: col.ink, size: 12, weight: 600 });
  };
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
