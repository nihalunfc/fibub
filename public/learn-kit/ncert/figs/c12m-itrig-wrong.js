// Class 12 Maths, Inverse trigonometric functions: sin^-1 x is the inverse FUNCTION (the angle whose sine is x), not 1/sin x. The graphs
// are completely different: sin^-1 lives on [-1, 1] and rises slowly, 1/sin x = cosec x blows up near 0. Slide x to compare the two values.
import { canvas, text, title, row, slider, axes, line, dot, readout } from '../../kit.js';

const P = Math.PI;
export default function (host) {
  let x = 0.5;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Graphs of inverse sine of x and one over sine of x, which are different functions' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'sin⁻¹x is not 1/sin x', col);
    const a = axes(ctx, w, h, col, { x: [-1.5, 3], y: [-2, 4], l: 34, b: 24, t: 28, r: 12 });
    ctx.save(); a.clip();
    const g1 = []; for (let u = -1; u <= 1.0001; u += 0.01) g1.push([a.X(u), a.Y(Math.asin(u))]); line(ctx, g1, col.s[0], 3);
    const g2 = []; for (let u = 0.2; u <= 3; u += 0.02) g2.push([a.X(u), a.Y(1 / Math.sin(u))]); line(ctx, g2, col.s[2], 3);
    ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.X(x), a.B); ctx.lineTo(a.X(x), a.T); ctx.stroke(); ctx.restore();
    text(ctx, 'sin⁻¹x (angle)', a.X(-1.4), a.Y(-1.25), { color: col.s[0], size: 11.5, weight: 700 }); text(ctx, '1/sin x (cosec x)', a.X(1.0), a.Y(3.7), { color: col.s[2], size: 11.5, weight: 700 });
    if (x <= 1) dot(ctx, a.X(x), a.Y(Math.asin(x)), 5.5, col.s[0], col.panel); dot(ctx, a.X(x), Math.min(a.B, a.Y(1 / Math.sin(x))), 5.5, col.s[2], col.panel);
    out.innerHTML = `x = ${x.toFixed(2)}: <b>sin⁻¹x = ${x <= 1 ? Math.asin(x).toFixed(3) : 'not defined (x &gt; 1)'}</b> (an angle in radians); <b>1/sin x = ${(1 / Math.sin(x)).toFixed(3)}</b> (a ratio, with x taken as an angle). Different things.`;
  };
  slider(row(host), { label: 'x', min: 0.2, max: 3, step: 0.01, value: x, fmt: (v) => v.toFixed(2), oninput: (v) => { x = v; cv.redraw(); } });
  cv.redraw();
}
