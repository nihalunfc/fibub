// 11.6 A ladder of sizes from the Planck length, √(ħG/c³) = 1.616 × 10⁻³⁵ m, to the observable universe,
// 8.8 × 10²⁶ m across (2 × 46.5 billion light-years): about 62 powers of ten. On a log scale the half-way point is
// √(1.6 × 10⁻³⁵ × 8.8 × 10²⁶) ≈ 1.2 × 10⁻⁴ m: a grain about a tenth of a millimetre wide. The shaded part, below
// about 10⁻¹⁹ m (the smallest distances the LHC resolves), has never been probed by any experiment.
// Sizes: proton charge diameter 1.68 × 10⁻¹⁵ m; hydrogen atom ~10⁻¹⁰ m; Earth 1.27 × 10⁷ m; Sun 1.39 × 10⁹ m;
// Neptune's orbit 9 × 10¹² m across; Milky Way disc ~10²¹ m (about 100,000 light-years).
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

const sup = (e) => String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);
const LP = 1.616e-35, UNI = 8.8e26;
const ITEMS = [
  [LP, 'Planck length'], [1e-19, 'smallest the LHC can see'], [1.68e-15, 'proton'], [1e-10, 'atom'], [1e-7, 'virus'],
  [1.2e-4, 'grain of sand, 0.1 mm (half-way)'], [1.7, 'person'], [1.27e7, 'Earth'], [1.39e9, 'Sun'], [9e12, 'Neptune\'s orbit'],
  [9.46e15, 'one light-year'], [1e21, 'Milky Way'], [UNI, 'observable universe'],
];

export default function (host) {
  const cv = canvas(host, { aspect: 1.05, max: 520, min: 420, label: 'A ladder of sizes from the Planck length to the observable universe on a scale of powers of ten' });
  let e = Math.log10(1.68e-15);
  const ctl = row(host);
  slider(ctl, { label: 'Size (power of ten, metres)', min: -35, max: 27, step: 0.1, value: e, fmt: (v) => '10' + sup(Math.round(v)) + ' m', oninput: (v) => { e = v; cv.redraw(); show(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'From the Planck length to the universe', col);
    const T = top + 14, B = h - 16, x0 = Math.round(w * 0.3);
    const Y = (lg) => B - ((lg + 35.5) / 63) * (B - T);
    // unexplored band
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[3]; ctx.fillRect(x0 - 3, Y(-19), 14, Y(Math.log10(LP)) - Y(-19)); ctx.restore();
    text(ctx, 'never probed', x0 + 20, (Y(-19) + Y(Math.log10(LP))) / 2 - 8, { color: col.s[3], size: 11, weight: 700 });
    text(ctx, '(16 powers of ten)', x0 + 20, (Y(-19) + Y(Math.log10(LP))) / 2 + 8, { color: col.s[3], size: 10.5 });
    line(ctx, [[x0, Y(-35.4)], [x0, Y(27.2)]], col.ink, 2);
    ctx.font = '10px system-ui'; ctx.fillStyle = col.muted; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let k = -35; k <= 25; k += 5) {
      line(ctx, [[x0 - 5, Y(k)], [x0, Y(k)]], col.muted, 1);
      if (Math.abs(k) % 10 === 5) continue;
      text(ctx, '10' + sup(k) + ' m', x0 - 8, Y(k), { color: col.muted, size: 10, align: 'right' });
    }
    for (const [v, lab] of ITEMS) {
      const y = Y(Math.log10(v)), near = Math.abs(Math.log10(v) - e) < 0.8;
      line(ctx, [[x0, y], [x0 + 10, y]], near ? col.s[0] : col.ink, near ? 2.5 : 1.5);
      text(ctx, lab, x0 + 14, y, { color: near ? col.s[0] : col.ink, size: 11, weight: near ? 700 : 400, halo: col.panel });
    }
    dot(ctx, x0, Y(e), 6, col.s[0], col.panel);
  };
  const show = () => {
    const upP = e - Math.log10(LP), downU = Math.log10(UNI) - e;
    let best = ITEMS[0]; for (const it of ITEMS) if (Math.abs(Math.log10(it[0]) - e) < Math.abs(Math.log10(best[0]) - e)) best = it;
    out.innerHTML = `10<sup>${e.toFixed(1)}</sup> m, near the size of <b>${best[1].replace(' (half-way)', '')}</b>: ${upP.toFixed(0)} powers of ten above the Planck length and ${downU.toFixed(0)} below the size of the observable universe.`;
  };
  cv.redraw(); show();
}
