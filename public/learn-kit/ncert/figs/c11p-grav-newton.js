// Class 11 Gravitation: Newton's law of gravitation, F = G m1 m2 / r^2, G = 6.674e-11 N m^2/kg^2. Double either mass and F doubles; double the distance and F falls to a quarter (inverse square).
// The graph is F against r for the chosen masses; the dot is the current separation.
import { canvas, axes, line, text, title, dot, arrow, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  let m1 = 50, m2 = 50, r = 1;
  const G = 6.674e-11;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Two masses with equal and opposite gravitational forces, and a graph of force against distance' });
  const ctl = row(host);
  slider(ctl, { label: 'Mass 1', min: 10, max: 100, step: 5, value: 50, fmt: (v) => v + ' kg', oninput: (v) => { m1 = v; cv.redraw(); } });
  slider(ctl, { label: 'Mass 2', min: 10, max: 100, step: 5, value: 50, fmt: (v) => v + ' kg', oninput: (v) => { m2 = v; cv.redraw(); } });
  slider(ctl, { label: 'Distance r between centres', min: 0.5, max: 4, step: 0.1, value: 1, fmt: (v) => v.toFixed(1) + ' m', oninput: (v) => { r = v; cv.redraw(); } });
  const ro = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'F = G m₁m₂/r²: an inverse-square law', col);
    const F = (d) => G * m1 * m2 / (d * d), y0 = top + 36, sc = (w - 80) / 4, x1 = 40, rad = (m) => 6 + 6 * Math.cbrt(m / 100) * 2;
    const xa = x1, xb = x1 + r * sc;
    line(ctx, [[xa, y0 + 24], [xb, y0 + 24]], col.muted, 1, [4, 3]); text(ctx, 'r = ' + r.toFixed(1) + ' m', (xa + xb) / 2, y0 + 38, { color: col.muted, size: 10.5, align: 'center' });
    dot(ctx, xa, y0, rad(m1), col.s[0], col.panel); dot(ctx, xb, y0, rad(m2), col.s[2], col.panel);
    const len = 28 + 10 * Math.min(4, Math.log10(F(r) / F(4)) * 4) ;
    arrow(ctx, xa + rad(m1) + 2, y0, xa + rad(m1) + 2 + Math.min(len, Math.max(18, xb - xa - rad(m1) - rad(m2) - 8)), y0, col.s[1], 2.5);
    arrow(ctx, xb - rad(m2) - 2, y0, xb - rad(m2) - 2 - Math.min(len, Math.max(18, xb - xa - rad(m1) - rad(m2) - 8)), y0, col.s[1], 2.5);
    const A = axes(ctx, w, h, col, { x: [0, 4], y: [0, F(0.5) * 1.05], xt: [0, 1, 2, 3, 4], fy: (v) => (v === 0 ? '0' : fmt(v, 2)), xlabel: 'distance r (m)', ylabel: 'force F (N)', t: y0 + 52, l: 66 });
    const pts = []; for (let k = 0; k <= 100; k++) { const d = 0.4 + 3.6 * k / 100; pts.push([A.X(d), A.Y(F(d))]); }
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3); ctx.restore();
    dot(ctx, A.X(r), A.Y(Math.min(F(0.5), F(r))), 5.5, col.s[2], col.panel);
    ro.textContent = `F = 6.674×10⁻¹¹ × ${m1} × ${m2} / ${r.toFixed(1)}² = ${F(r).toExponential(2)} N, on each body (equal and opposite). The pull between two people is tiny; it only becomes big when one body is as heavy as a planet.`;
  };
  cv.redraw();
}
