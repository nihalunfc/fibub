// Class 11 Gravitation: gravitational potential energy U = -G M m / r (zero at infinity, negative everywhere else: an attractive well). Units: GMm/R = 1, so the Earth's surface is at U = -1.
// Total energy E = KE + U is a flat line. KE = E - U is the gap between the line and the curve. If E < 0 the body is trapped (turning point where E meets U); if E >= 0 it escapes.
import { canvas, axes, line, text, title, dot, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let E = -0.4, r = 1.5;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'The gravitational potential energy well with the total energy line and a particle you can move' });
  const ctl = row(host);
  slider(ctl, { label: 'Total energy E (units of GMm/R)', min: -0.95, max: 0.3, step: 0.05, value: -0.4, fmt: (v) => v.toFixed(2), oninput: (v) => { E = v; cv.redraw(); } });
  slider(ctl, { label: 'Particle at distance r', min: 1, max: 6, step: 0.1, value: 1.5, fmt: (v) => v.toFixed(1) + ' R', oninput: (v) => { r = v; cv.redraw(); } });
  const ro = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Potential energy well: U = −GMm/r', col);
    const A = axes(ctx, w, h, col, { x: [1, 6], y: [-1.1, 0.4], xt: [1, 2, 3, 4, 5, 6], yt: [-1, -0.5, 0], xlabel: 'distance from centre r (in Earth radii R)', ylabel: 'energy (GMm/R)', t: top + 8, l: 46 });
    const U = (x) => -1 / x, pts = []; for (let k = 0; k <= 120; k++) { const x = 1 + 5 * k / 120; pts.push([A.X(x), A.Y(U(x))]); }
    line(ctx, pts, col.s[0], 3);
    line(ctx, [[A.L, A.Y(E)], [A.R, A.Y(E)]], col.s[1], 2.5, [7, 4]);
    text(ctx, 'total energy E', A.R - 4, A.Y(E) - 10, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel });
    const bound = E < 0, rmax = bound ? -1 / E : Infinity;
    const rr = Math.min(r, bound ? rmax : 6), ke = E - U(rr);
    if (r <= rmax + 1e-9) { line(ctx, [[A.X(r), A.Y(U(r))], [A.X(r), A.Y(E)]], col.s[2], 5); dot(ctx, A.X(r), A.Y(U(r)), 6, col.ink, col.panel); text(ctx, 'KE', A.X(r) + 8, (A.Y(U(r)) + A.Y(E)) / 2, { color: col.s[2], size: 11, weight: 700, halo: col.panel }); }
    else { dot(ctx, A.X(r), A.Y(U(r)), 6, col.bad, col.panel); text(ctx, 'not allowed (KE < 0)', A.X(r), A.Y(U(r)) + 18, { color: col.bad, size: 10.5, weight: 700, align: 'center', halo: col.panel }); }
    if (bound && rmax <= 6) { dot(ctx, A.X(rmax), A.Y(E), 5, col.s[3], col.panel); text(ctx, 'turning point', A.X(rmax), A.Y(E) + 16, { color: col.s[3], size: 10.5, weight: 700, align: 'center', halo: col.panel }); }
    text(ctx, 'surface', A.X(1) + 4, A.Y(-1) + 14, { color: col.muted, size: 10 });
    ro.textContent = bound ? `E < 0: bound. It can rise only to r = ${rmax.toFixed(2)} R (where KE = 0).${r <= rmax ? ` Here U = ${U(r).toFixed(2)}, so KE = E − U = ${(E - U(r)).toFixed(2)}.` : ' The particle you placed is beyond that, which is not possible with this energy.'}` : `E ≥ 0: the line never meets the curve again, so the body goes to infinity. Escape needs KE at the surface of at least GMm/R, so that E = 0.`;
  };
  cv.redraw();
}
