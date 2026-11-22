// 7.3 Fermi level and occupancy in silicon. The energy axis runs up the page: valence band (shaded) below Ev = 0,
// conduction band above Ec = 1.12 eV. The curve is the Fermi-Dirac occupancy f(E) at the chosen temperature, centred on
// the Fermi level E_F, which is worked out from the doping by charge neutrality (all dopants ionised, n p = n_i²).
import { canvas, axes, line, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

const kB = 8.617333e-5, EG = 1.12;
const sci = (x) => { const e = Math.floor(Math.log10(x)); const m = x / 10 ** e; return `${m.toFixed(2)}×10${String(e).replace(/[-0-9]/g, (c) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)])}`; };

/** Carrier densities (cm⁻³) and E_F (eV above Ev) for silicon with net doping N (positive donors, negative acceptors). */
export function siState(T, N) {
  const kT = kB * T, Nc = 2.8e19 * (T / 300) ** 1.5, Nv = 1.04e19 * (T / 300) ** 1.5;
  const ni = Math.sqrt(Nc * Nv) * Math.exp(-EG / (2 * kT));
  const half = Math.abs(N) / 2, maj = half + Math.sqrt(half * half + ni * ni), min = ni * ni / maj;
  const n = N >= 0 ? maj : min, p = N >= 0 ? min : maj;
  const EF = EG - kT * Math.log(Nc / n), Ei = EG / 2 + 0.5 * kT * Math.log(Nv / Nc);
  return { kT, Nc, Nv, ni, n, p, EF, Ei };
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Band diagram of silicon with the Fermi level and the Fermi-Dirac occupancy curve' });
  let type = 'n', lg = 16, T = 300;
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Doping', [['i', 'Intrinsic'], ['n', 'n-type (donors)'], ['p', 'p-type (acceptors)']], type, (v) => { type = v; re(); });
  slider(ctl, { label: 'Dopant density (cm⁻³)', min: 12, max: 19, step: 0.1, value: lg, fmt: (v) => sci(10 ** v), oninput: (v) => { lg = v; re(); } });
  slider(ctl, { label: 'Temperature T (K)', min: 50, max: 800, step: 5, value: T, fmt: (v) => `${v} K`, oninput: (v) => { T = v; re(); } });
  const out = readout(host);
  const net = () => (type === 'i' ? 0 : type === 'n' ? 10 ** lg : -(10 ** lg));
  const show = () => {
    const s = siState(T, net());
    const where = s.EF > s.Ei ? 'above' : 'below';
    out.innerHTML = `kT = ${fmt(s.kT * 1000, 3)} meV, n<sub>i</sub> = ${sci(s.ni)} cm⁻³. Electrons n = <b>${sci(s.n)}</b>, holes p = <b>${sci(s.p)}</b> cm⁻³ (n·p = n<sub>i</sub>²). E<sub>F</sub> is ${fmt(Math.abs(s.EF - s.Ei) * 1000, 3)} meV ${where} the intrinsic level${type !== 'i' && s.ni > 10 ** lg / 3 ? ': so hot that the sample is turning intrinsic' : ''}.${s.EF > EG - 3 * s.kT || s.EF < 3 * s.kT ? ' E<sub>F</sub> is within 3kT of a band edge, so the simple Boltzmann formulas are no longer accurate (degenerate doping).' : ''} Very low temperatures would also freeze carriers back onto the dopants, which this model ignores.`;
  };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Silicon: bands, Fermi level and f(E)', col);
    const s = siState(T, net());
    const ax = axes(ctx, W, H, col, { x: [0, 1], y: [-0.3, 1.42], t: 40, xlabel: 'occupation probability f(E)', ylabel: 'energy E (eV)', xt: [0, 0.5, 1] });
    ctx.save(); ax.clip();
    ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.fillRect(ax.L, ax.Y(0), ax.R - ax.L, ax.Y(-0.3) - ax.Y(0));
    ctx.fillStyle = col.s[2]; ctx.fillRect(ax.L, ax.Y(1.42), ax.R - ax.L, ax.Y(EG) - ax.Y(1.42)); ctx.globalAlpha = 1;
    line(ctx, [[ax.L, ax.Y(0)], [ax.R, ax.Y(0)]], col.s[0], 2);
    line(ctx, [[ax.L, ax.Y(EG)], [ax.R, ax.Y(EG)]], col.s[2], 2);
    line(ctx, [[ax.L, ax.Y(s.Ei)], [ax.R, ax.Y(s.Ei)]], col.muted, 1, [2, 4]);
    line(ctx, [[ax.L, ax.Y(s.EF)], [ax.R, ax.Y(s.EF)]], col.s[3], 2, [6, 4]);
    const pts = [];
    for (let E = -0.3; E <= 1.42; E += 0.002) pts.push([ax.X(1 / (Math.exp((E - s.EF) / s.kT) + 1)), ax.Y(E)]);
    line(ctx, pts, col.ink, 2);
    ctx.restore();
    text(ctx, 'Ec (conduction band)', ax.R - 4, ax.Y(EG) - 9, { color: col.s[2], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'Ev (valence band)', ax.R - 4, ax.Y(0) + 10, { color: col.s[0], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'E_F', ax.L + 6, ax.Y(s.EF) - 9, { color: col.s[3], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'E_i', ax.L + 40, ax.Y(s.Ei) + 9, { color: col.muted, size: 11, halo: col.panel });
  };
  re();
}
