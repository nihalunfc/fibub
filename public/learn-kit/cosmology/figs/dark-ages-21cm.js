// 12.7 The sky-averaged ("global") 21 cm signal against frequency. The standard curve here is ILLUSTRATIVE: a
// smooth sketch with the shape of typical model predictions (a shallow dark-ages dip near 15-20 MHz, a deeper
// cosmic-dawn dip of about −150 mK near 70-80 MHz, a small emission bump as X-rays heat the gas, then zero once
// hydrogen is ionised), not a fitted model; real predictions vary widely in depth and position.
// The EDGES curve is the published best-fit flattened Gaussian (Bowman et al. 2018, Nature 555, 67): amplitude
// 0.53 K, centre 78.1 MHz, width 18.7 MHz, flattening τ = 7. SARAS 3 (Singh et al. 2022) rejected that profile.
// Redshift: z = 1420.4 MHz / ν − 1; ages from the Planck-like model in phys.js.
import { canvas, axes, text, title, line, row, slider, choice, readout } from '../../kit.js';
import { ageGyr, PLANCK18 as P } from '../phys.js';

const NU0 = 1420.405752;
const gs = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2);
const toy = (nu) => -38 * gs(nu, 17, 6) - 150 * gs(nu, 74, 11) + 28 * gs(nu, 112, 16) * (1 - Math.min(1, Math.max(0, (nu - 120) / 70)));
const edges = (nu) => { const A = 530, n0 = 78.1, w = 18.7, t = 7; const B = (4 * (nu - n0) ** 2 / (w * w)) * Math.log(-Math.log((1 + Math.exp(-t)) / 2) / t); return -A * (1 - Math.exp(-t * Math.exp(B))) / (1 - Math.exp(-t)); };
const era = (z) => (z > 35 ? 'the dark ages: no stars yet; the gas has cooled below the CMB and still absorbs a little' : z > 14 ? 'cosmic dawn: light from the first stars makes cold hydrogen absorb CMB radio waves strongly' : z > 6 ? 'heating and reionisation: X-rays warm the gas, then starlight strips the hydrogen of its electrons' : 'after reionisation: almost no neutral hydrogen left between galaxies, so the signal fades away');

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 460, min: 360, label: 'The 21 centimetre global signal against observed frequency, with redshift and the EDGES claim' });
  let nu = 75, showE = false;
  const ctl = row(host);
  slider(ctl, { label: 'Tune the radio (MHz)', min: 12, max: 200, step: 0.5, value: nu, fmt: (v) => v.toFixed(1), oninput: (v) => { nu = v; upd(); } });
  choice(ctl, 'EDGES 2018 claim', [[false, 'Hide'], [true, 'Show']], false, (v) => { showE = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, '21 cm signal from the whole sky (illustrative)', col) + 22;
    const yr = showE ? [-560, 60] : [-180, 60];
    const A = axes(ctx, w, h, col, { x: [10, 200], y: yr, t: top + 8, l: 52, r: 12, xlabel: 'Frequency we receive (MHz)', ylabel: 'Signal (mK)', xt: [25, 50, 75, 100, 125, 150, 175, 200] });
    // redshift ticks along the top
    ctx.save(); ctx.font = '600 10.5px system-ui'; ctx.fillStyle = col.muted; ctx.textAlign = 'center';
    for (const z of (w > 520 ? [50, 30, 20, 15, 10, 8] : [50, 20, 12, 8])) { const x = A.X(NU0 / (1 + z)); ctx.fillRect(x, A.T - 4, 1, 4); ctx.fillText(String(z), x, A.T - 8); }
    ctx.textAlign = 'left'; ctx.fillText('z =', A.L - 30, A.T - 8);
    ctx.restore();
    ctx.save(); A.clip();
    ctx.globalAlpha = 0.13; ctx.fillStyle = col.s[3];
    ctx.fillRect(A.X(88), A.T, A.X(108) - A.X(88), A.B - A.T);
    ctx.fillStyle = col.muted; ctx.fillRect(A.L, A.T, A.X(30) - A.L, A.B - A.T);
    ctx.globalAlpha = 1;
    line(ctx, [[A.L, A.Y(0)], [A.R, A.Y(0)]], col.muted, 1);
    const xs = []; for (let v = 10; v <= 200; v += 0.5) xs.push(v);
    if (showE) line(ctx, xs.filter((v) => v >= 50 && v <= 100).map((v) => [A.X(v), A.Y(edges(v))]), col.s[1], 2.5, [6, 3]);
    line(ctx, xs.map((v) => [A.X(v), A.Y(toy(v))]), col.s[0], 2.8);
    line(ctx, [[A.X(nu), A.T], [A.X(nu), A.B]], col.ink, 1.5, [3, 3]);
    ctx.restore();
    text(ctx, 'FM radio', A.X(98), A.B - 10, { color: col.s[3], size: 10.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'ionosphere', A.L + 3, A.B - 10, { color: col.muted, size: 10.5, weight: 700, halo: col.panel });
    text(ctx, 'standard picture', A.X(168), A.Y(36), { color: col.s[0], size: 11, weight: 700, align: 'center', halo: col.panel });
    if (showE) text(ctx, 'EDGES', A.X(96), A.Y(-450), { color: col.s[1], size: 11.5, weight: 700, halo: col.panel });
  };
  const upd = () => {
    const z = NU0 / nu - 1, age = ageGyr(z, P) * 1000;
    out.innerHTML = `${nu.toFixed(1)} MHz ↔ redshift <b>z = ${z.toFixed(1)}</b>: the wave left as 21.1 cm and arrives ${(0.2111 * (1 + z)).toFixed(2)} m long, from when the universe was <b>${age < 1000 ? Math.round(age) + ' million' : (age / 1000).toFixed(2) + ' billion'} years</b> old. That is ${era(z)}.${showE ? '<br>EDGES (2018) reported a dip at least twice as deep as standard physics allows, centred on 78 MHz. SARAS 3 (2022) did not see it.' : ''}`;
    cv.redraw();
  };
  upd();
}
