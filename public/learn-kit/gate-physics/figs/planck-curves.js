// 5.5 Planck curves from Bose statistics. Spectral energy density per unit frequency u_ν = (8πhν³/c³)/(e^{hν/kT} − 1)
// for a chosen temperature, with the 3/4 and 1/2-temperature curves for comparison and the Rayleigh-Jeans line.
// The readout gives the peak frequency (2.821 kT/h), n, u and the mean photon energy (2.701 kT).
import { canvas, axes, line, row, slider, choice, readout, title, text } from '../../kit.js';

const h = 6.62607015e-34, k = 1.380649e-23, c = 2.99792458e8, hb = h / (2 * Math.PI);
const u = (nu, T) => (8 * Math.PI * h * nu ** 3 / c ** 3) / (Math.exp(h * nu / (k * T)) - 1);
const sci = (x) => { const e = Math.floor(Math.log10(x)); return `${(x / 10 ** e).toFixed(2)}×10^${e}`; };

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 250, label: 'Planck spectral energy density against frequency at several temperatures' });
  let T = 5800, rj = 'on';
  const ctl = row(host);
  slider(ctl, { label: 'Temperature', min: 1000, max: 12000, step: 100, value: T, fmt: (v) => `${v} K`, oninput: (v) => { T = v; cv.redraw(); show(); } });
  choice(ctl, 'Rayleigh-Jeans line', [['on', 'Show'], ['off', 'Hide']], rj, (v) => { rj = v; cv.redraw(); });
  const out = readout(host);
  const show = () => {
    const nup = 2.8214 * k * T / h, n = (2 * 1.2020569 / Math.PI ** 2) * (k * T / (hb * c)) ** 3, a = Math.PI ** 2 * k ** 4 / (15 * hb ** 3 * c ** 3);
    out.innerHTML = `T = ${T} K: u<sub>ν</sub> peaks at <b>${(nup / 1e12).toFixed(0)} THz</b> (hν = 2.821 kT); photon density <b>${sci(n)} m⁻³</b>, energy density <b>${sci(a * T ** 4)} J m⁻³</b>, mean photon energy <b>${(2.701 * k * T / 1.602176634e-19).toFixed(3)} eV</b>. Doubling T doubles the peak frequency, multiplies n by 8 and u by 16.`;
  };
  cv.draw = (ctx, w, hgt, col) => {
    const numax = 2.8214 * k * 12000 / h * 2.6, top = u(2.8214 * k * T / h, T) * 1.2;
    const ax = axes(ctx, w, hgt, col, { x: [0, numax / 1e12], y: [0, top], xlabel: 'frequency ν (THz)', ylabel: 'u_ν', fy: () => '', t: 34 });
    title(ctx, 'Blackbody spectrum: mode density × hν × Bose occupation', col);
    ctx.save(); ax.clip();
    const curve = (TT, ci, wd, dash) => { const pts = []; for (let i = 1; i <= 400; i++) { const nu = (i / 400) * numax; pts.push([ax.X(nu / 1e12), ax.Y(u(nu, TT))]); } line(ctx, pts, col.s[ci], wd, dash); };
    curve(T * 0.5, 4, 1.3, [5, 4]); curve(T * 0.75, 2, 1.3, [5, 4]); curve(T, 0, 2.6);
    if (rj === 'on') { const pts = []; for (let i = 1; i <= 200; i++) { const nu = (i / 200) * numax; pts.push([ax.X(nu / 1e12), ax.Y(8 * Math.PI * nu * nu * k * T / c ** 3)]); } line(ctx, pts, col.s[3], 1.6, [2, 3]); }
    const np = 2.8214 * k * T / h; line(ctx, [[ax.X(np / 1e12), ax.Y(0)], [ax.X(np / 1e12), ax.Y(u(np, T))]], col.s[0], 1, [3, 3]);
    ctx.restore();
    [['T', 0], ['0.75 T', 2], ['0.5 T', 4]].concat(rj === 'on' ? [['Rayleigh-Jeans (T)', 3]] : []).forEach(([lab, ci], i) => text(ctx, lab, ax.R - 6, ax.T + 14 + i * 15, { color: col.s[ci], size: 11, align: 'right', halo: col.panel }));
  };
  cv.redraw(); show();
}
