// 12.1 The whole history of the universe as ΛCDM tells it, on a logarithmic time axis (seconds after the start),
// with the temperature of the radiation drawn above it. Temperature: T = 2.7255 K / a, with the time for each a
// from the Planck-like model in phys.js; before a = 10⁻⁸ the radiation-era law T ∝ t^(−1/2) is used (it ignores
// the small steps when particles annihilate, so early temperatures are approximate). The step player lights up
// one era at a time, each with the module that teaches it.
import { canvas, axes, text, title, line } from '../../kit.js';
import { ageGyr, PLANCK18 as P, GYR, T_CMB } from '../phys.js';

const L10 = Math.log10;
const ERAS = [
  { a: -36, b: -32, name: 'Inflation', t: 'Module 11' },
  { a: -6, b: 3.1, name: 'First second + first elements', t: 'Module 6' },
  { a: 12.2, b: 13.08, name: 'Atoms form: the CMB', t: 'Modules 6-7' },
  { a: 13.08, b: 16.5, name: 'Dark ages, first stars', t: 'Lessons 10.5, 12.7' },
  { a: 16.5, b: 17.64, name: 'Galaxies, cosmic web', t: 'Modules 8, 10' },
  { a: 17.39, b: 17.64, name: 'Dark energy takes over', t: 'Module 9' },
];

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 330, label: 'The history of the universe on a logarithmic time axis, with the temperature of the light' });
  let step = 0;
  // temperature curve
  const pts = [];
  const a8 = 1e-8, t8 = L10(ageGyr(1 / a8 - 1, P) * GYR);
  for (let la = -8; la <= 0.0001; la += 0.08) { const a = 10 ** la; pts.push([L10(ageGyr(1 / a - 1, P) * GYR), L10(T_CMB / a)]); }
  const T8 = L10(T_CMB / a8);
  const early = [];
  for (let lt = -32; lt < t8; lt += 0.5) early.push([lt, T8 - 0.5 * (lt - t8)]);
  const curve = [...early, ...pts];
  const marks = [[0, '1 s'], [L10(3.156e7), '1 yr'], [L10(3.156e16), '1 Gyr']];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The history of the universe in ΛCDM', col) + 4;
    const A = axes(ctx, w, h, col, { x: [-36, 18], y: [0, 28], t: top + 6, l: 44, xlabel: 'Seconds after the start (log scale)', ylabel: 'Temperature (K)', xt: [-36, -24, -12, 0, 12], yt: [0, 7, 14, 21, 28], fx: (v) => '10' + String(v).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]), fy: (v) => (v === 0 ? '1' : '10' + String(v).replace(/[0-9]/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])) });
    ctx.save(); A.clip();
    ERAS.forEach((e, i) => {
      if (i > step) return;
      ctx.globalAlpha = i === step ? 0.28 : 0.1;
      ctx.fillStyle = i === step ? col.s[0] : col.muted;
      const x0 = A.X(e.a), x1 = Math.max(A.X(e.b), x0 + 4);
      ctx.fillRect(x0, A.T, x1 - x0, A.B - A.T);
    });
    ctx.globalAlpha = 1;
    marks.forEach(([x, s]) => { line(ctx, [[A.X(x), A.B], [A.X(x), A.B - 10]], col.muted, 1); text(ctx, s, A.X(x), A.B - 16, { color: col.muted, size: 10, align: 'center', halo: col.panel }); });
    line(ctx, curve.map(([x, y]) => [A.X(x), A.Y(y)]), col.s[1], 2.5);
    ctx.restore();
    const e = ERAS[step], cx = (A.X(e.a) + A.X(e.b)) / 2;
    const y = A.Y(23);
    const al = cx > w * 0.7 ? 'right' : cx < w * 0.3 ? 'left' : 'center';
    const lx = al === 'right' ? Math.min(cx, A.R - 2) : al === 'left' ? Math.max(cx - 8, A.L + 4) : cx;
    text(ctx, e.name, lx, y, { color: col.ink, size: 12, weight: 700, align: al, halo: col.panel });
    text(ctx, e.t, lx, y + 15, { color: col.s[0], size: 11.5, weight: 700, align: al, halo: col.panel });
    text(ctx, 'today', A.X(17.64) - 2, A.Y(4.5), { color: col.ink, size: 10.5, align: 'right', halo: col.panel });
    text(ctx, 'temperature of the light', A.X(-22), A.Y(16), { color: col.s[1], size: 11, weight: 700, halo: col.panel });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, ERAS.length - 1); cv.redraw(); } };
}
