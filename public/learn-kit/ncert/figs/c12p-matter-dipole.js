// Class 12 Magnetism and Matter: how the field of a magnetic dipole (bar magnet, current loop) falls with distance.
// B_axial = μ0 2m/4πr³ and B_equatorial = μ0 m/4πr³ for r much larger than the magnet: both fall as 1/r³ (a straight line of slope −3 on the log graph),
// and the axial one is always twice the equatorial one.
import { canvas, text, title, row, slider, readout, arrow, axes, line, dot } from '../../kit.js';
import { barMagnet, si } from '../c12p-mmlib.js';

export default function (host) {
  let m = 1, r = 20;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Dipole field against distance on the axis and the equator' });
  const ctl = row(host);
  slider(ctl, { label: 'Magnetic moment m', min: 0.1, max: 10, step: 0.1, value: m, fmt: (x) => `${x.toFixed(1)} A m²`, oninput: (x) => { m = x; cv.redraw(); } });
  slider(ctl, { label: 'Distance r', min: 10, max: 100, step: 1, value: r, fmt: (x) => `${x} cm`, oninput: (x) => { r = x; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Both fall as 1/r³; axial = 2 × equatorial', col);
    const Bax = (rr) => 1e-7 * 2 * m / Math.pow(rr / 100, 3), Beq = (rr) => 1e-7 * m / Math.pow(rr / 100, 3);
    const ht = h * 0.4, cx = w * 0.3, cy = top + (ht - top) / 2 + 6, px = 1.1;
    barMagnet(ctx, cx, cy, 36, 14, col);
    const P = cx + 20 + r * 0.9, Q = cy - 10 - Math.min(r * 0.5, ht / 2 - 20);
    dot(ctx, P, cy, 4, col.s[2]); text(ctx, 'axial', P + 2, cy + 14, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); arrow(ctx, P, cy - 12, P + 40, cy - 12, col.s[2], 3, 9);
    dot(ctx, cx, Q, 4, col.s[3]); text(ctx, 'equatorial', cx + 38, Q, { color: col.s[3], size: 10.5, weight: 700 }); arrow(ctx, cx - 6, Q - 10, cx - 26, Q - 10, col.s[3], 3, 9);
    const g = axes(ctx, w, h, col, { x: [10, 100], y: [1e-7, 1e-1], ylog: true, t: ht + 10, b: 34, l: 58, r: 14, xt: [10, 25, 50, 75, 100], fx: (v) => v, fy: (v) => si(v, 'T').replace(/ /, ''), xlabel: 'distance r (cm)' });
    for (const [f, c] of [[Bax, col.s[2]], [Beq, col.s[3]]]) { ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip(); ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath(); for (let k = 0; k <= 60; k++) { const x = 10 + k * 1.5, X = g.X(x), Y = g.Y(f(x)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore(); dot(ctx, g.X(r), g.Y(f(r)), 5, c, col.ink); }
    out.innerHTML = `At r = ${r} cm with m = ${m.toFixed(1)} A m²: B_axial = <b>${si(Bax(r), 'T')}</b>, B_equatorial = <b>${si(Beq(r), 'T')}</b>. Double r and both drop to one eighth. (Earth's own field at the surface is about 50 µT: a strong bar magnet beats it only close by.)`;
  };
  cv.redraw();
}
