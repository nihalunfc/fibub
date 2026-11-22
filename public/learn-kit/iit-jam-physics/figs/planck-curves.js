// 5.6 Planck's law per unit wavelength with a temperature slider, against the classical Rayleigh-Jeans law at the
// same temperature (dashed), which agrees at long wavelengths and runs away at short ones (the ultraviolet
// catastrophe). The faint curve is the Sun (5800 K) for comparison; the visible band is shaded. The readout gives the
// Wien peak, the Stefan-Boltzmann power per area and how far Rayleigh-Jeans is off at the peak.
import { canvas, axes, line, row, slider, choice, readout, fmt, title, text } from '../../kit.js';

const h = 6.62607015e-34, c = 2.99792458e8, k = 1.380649e-23, sigma = 5.670374e-8, b = 2.897772e-3;
// spectral radiance per unit wavelength, W m^-2 sr^-1 m^-1
const planck = (lam, T) => (2 * h * c * c / lam ** 5) / Math.expm1(h * c / (lam * k * T));
const rj = (lam, T) => 2 * c * k * T / lam ** 4;
const VIS = [[380, '#7a3cff'], [450, '#2f6bff'], [495, '#17a589'], [570, '#d4ac0d'], [590, '#e67e22'], [620, '#e74c3c'], [750, '#e74c3c']];

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 400, min: 260, label: 'Planck blackbody curves against wavelength for a chosen temperature, with the Rayleigh-Jeans law and the Sun for comparison' });
  let T = 5800, scale = 'fit';
  const ctl = row(host);
  slider(ctl, { label: 'Temperature', min: 1000, max: 12000, step: 50, value: T, fmt: (v) => fmt(v, 5) + ' K', oninput: (v) => { T = v; cv.redraw(); show(); } });
  choice(ctl, 'Height', [['fit', 'Fit this curve'], ['sun', 'Fixed: Sun = 1']], scale, (v) => { scale = v; cv.redraw(); });
  const out = readout(host);
  const show = () => {
    const lp = b / T, M = sigma * T ** 4, ratio = rj(lp, T) / planck(lp, T);
    out.innerHTML = `At <b>${fmt(T, 5)} K</b>: peak at <b>λ<sub>max</sub> = ${fmt(lp * 1e9, 4)} nm</b> (Wien, b/T); power per area <b>σT⁴ = ${fmt(M / 1e6, 3)} MW/m²</b>, ${fmt((T / 5800) ** 4, 3)} times the Sun's. At the peak the Rayleigh–Jeans law is already <b>${fmt(ratio, 3)} times</b> too big, because hc/λkT = 4.97 there is not small.`;
  };
  cv.draw = (ctx, w, hh, col) => {
    const xmax = 3000;  // nm
    const peakSun = planck(b / 5800, 5800), peakT = planck(b / T, T);
    const ymax = scale === 'fit' ? peakT * 1.3 : Math.max(peakSun, peakT) * 1.2;
    const norm = scale === 'fit' ? peakT : peakSun;
    const ax = axes(ctx, w, hh, col, { x: [0, xmax], y: [0, ymax / norm], xlabel: 'wavelength λ (nm)', ylabel: scale === 'fit' ? 'radiance (peak = 1)' : 'radiance (Sun peak = 1)', t: 34 });
    title(ctx, `Blackbody at ${fmt(T, 5)} K: Planck (solid) and Rayleigh–Jeans (dashed)`, col);
    ctx.save(); ax.clip();
    // visible band
    for (let i = 0; i < VIS.length - 1; i++) {
      ctx.globalAlpha = 0.13; ctx.fillStyle = VIS[i][1];
      ctx.fillRect(ax.X(VIS[i][0]), ax.T, ax.X(VIS[i + 1][0]) - ax.X(VIS[i][0]), ax.B - ax.T);
    }
    ctx.globalAlpha = 1;
    const curve = (f, TT) => { const pts = []; for (let i = 1; i <= 400; i++) { const l = (i / 400) * xmax; const v = f(l * 1e-9, TT) / norm; pts.push([ax.X(l), ax.Y(Math.min(v, ymax / norm * 3))]); } return pts; };
    if (Math.abs(T - 5800) > 60) line(ctx, curve(planck, 5800), col.muted, 1.3, [2, 3]);
    line(ctx, curve(rj, T), col.s[1], 2, [7, 5]);
    line(ctx, curve(planck, T), col.s[0], 2.8);
    const lp = b / T * 1e9;
    if (lp < xmax) {
      line(ctx, [[ax.X(lp), ax.B], [ax.X(lp), ax.Y(peakT / norm)]], col.s[4], 1.5, [3, 3]);
      text(ctx, `λmax ${fmt(lp, 3)} nm`, ax.X(lp) + 6, ax.Y(peakT / norm) - 10, { color: col.s[4], size: 11, weight: 700, halo: col.panel });
    }
    text(ctx, 'visible', ax.X(565), ax.B - 10, { color: col.muted, size: 11, align: 'center', halo: col.panel });
    text(ctx, 'Rayleigh–Jeans → ∞', ax.X(xmax * 0.06), ax.T + 14, { color: col.s[1], size: 11, weight: 700, halo: col.panel });
    ctx.restore();
  };
  cv.redraw(); show();
}
