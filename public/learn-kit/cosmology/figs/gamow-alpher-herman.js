// 6.1 Alpher and Herman's thermometer argument (1948). As the universe grows by a factor a, the number of atoms
// in each cubic metre falls as 1/a³ and the temperature of the light as 1/a, so T ∝ (atoms per m³)^(1/3): one
// straight line of slope 1/3 on log-log axes. Pin the line where elements were made (10⁹ K, when a few minutes
// old) with the atom density helium-making needs, slide today's atom density, and read off today's glow.
// The pin, 1.24 × 10²⁵ atoms per m³ at 10⁹ K, is today's measured value (η = 6.1 × 10⁻¹⁰ atoms per photon);
// in 1948 neither number was known well, which is why their estimate came out at about 5 K.
import { canvas, axes, text, title, line, dot, row, slider, readout, fmt } from '../../kit.js';
import { T_CMB } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 420, min: 300, label: 'Temperature of the cosmic light against the number of atoms per cubic metre, a straight line from element-making to today' });
  const TN = 1e9, NN = 1.24e25; // pin: atoms per m³ when the universe was at 10⁹ K
  let n0 = 0.25;
  const T0 = (n) => TN * Math.cbrt(n / NN);
  const ctl = row(host);
  slider(ctl, { label: 'Atoms per m³ today', min: 0.01, max: 30, value: n0, log: true, fmt: (v) => v.toPrecision(2), oninput: (v) => { n0 = v; show(); cv.redraw(); } });
  const out = readout(host);
  const show = () => {
    const T = T0(n0);
    out.innerHTML = `If space today holds <b>${n0.toPrecision(2)}</b> atoms per m³, the universe has grown <b>${fmt(TN / T, 2)}</b> times since the elements were made, so the leftover glow should be <b>${T.toPrecision(2)} K</b> today. (Measured: 0.25 atoms per m³ and 2.7255 K.)`;
  };
  const pw = (v) => (v === 1 ? '1' : '10' + String(Math.round(Math.log10(v))).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'One line from element-making to today', col);
    const A = axes(ctx, w, h, col, {
      x: [3e-3, 1e27], y: [0.1, 1e11], xlog: true, ylog: true, t: top + 12, l: 58,
      xt: [1, 1e5, 1e10, 1e15, 1e20, 1e25], yt: [1, 1e3, 1e6, 1e9], fx: pw, fy: pw,
      xlabel: 'Atoms per cubic metre (log scale)', ylabel: 'Temperature of the light (K)',
    });
    ctx.save(); A.clip();
    // the line T ∝ n^(1/3), and the measured universe for comparison
    line(ctx, [[A.X(3e-3), A.Y(T0(3e-3))], [A.X(1e27), A.Y(T0(1e27))]], col.s[0], 2.5);
    // 5 K and 2.7 K reference levels
    line(ctx, [[A.L, A.Y(5)], [A.R, A.Y(5)]], col.s[1], 1.2, [5, 4]);
    line(ctx, [[A.L, A.Y(T_CMB)], [A.R, A.Y(T_CMB)]], col.s[2], 1.2, [2, 3]);
    ctx.restore();
    text(ctx, '5 K: Alpher and Herman, 1948', A.R - 4, A.Y(5) - 9, { color: col.s[1], size: 11, weight: 600, align: 'right', halo: col.panel });
    text(ctx, '2.7 K: measured, 1965 onwards', A.R - 4, A.Y(T_CMB) + 10, { color: col.s[2], size: 11, weight: 600, align: 'right', halo: col.panel });
    // landmarks along the line
    const marks = [[NN, TN, 'elements made (a few minutes)'], [NN * (3000 / TN) ** 3, 3000, 'atoms form (3,000 K)']];
    marks.forEach(([n, T, s], k) => { dot(ctx, A.X(n), A.Y(T), 5, col.ink, col.panel); text(ctx, s, A.X(n) + (k ? 9 : -8), A.Y(T) + (k ? 10 : -10), { color: col.ink, size: 11, weight: 600, align: k ? 'left' : 'right', halo: col.panel }); });
    const T = T0(n0);
    dot(ctx, A.X(n0), A.Y(T), 7, col.s[1], col.panel);
    text(ctx, `today: ${T.toPrecision(2)} K`, A.X(n0) + 6, A.Y(T) - 30, { color: col.ink, size: 12, weight: 700, halo: col.panel });
  };
  show(); cv.redraw();
}
