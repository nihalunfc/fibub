// 6.4 The X-ray spectrum of a tube (a teaching model, not measured data). The continuous bremsstrahlung (Kramers'
// rule, intensity ~ (lambda/lambda_min - 1)/lambda^2) starts at the cut-off lambda_min = hc/eV, which depends only on
// the voltage; the K-alpha and K-beta lines appear, at wavelengths fixed by the target, once eV passes the K-shell
// binding energy. Line energies follow the screened hydrogen-like (Moseley) estimates.
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../../kit.js';

const HC = 1239.84; // eV nm
const TARGETS = [['cu', 'copper', 29], ['mo', 'molybdenum', 42], ['ag', 'silver', 47]];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 270, label: 'X-ray tube spectrum: continuous radiation with a sharp cut-off and characteristic lines' });
  let kV = 30, tg = 'mo';
  const ctl = row(host);
  const out = readout(host);
  const lines = () => {
    const Z = TARGETS.find((t) => t[0] === tg)[2], s = (Z - 1) ** 2;
    return { Z, Ka: 10.2 * s, Kb: 12.09 * s, edge: 13.6 * s }; // eV
  };
  const show = () => {
    const L = lines(), lmin = HC / (kV * 1000);
    out.innerHTML = `Cut-off λ<sub>min</sub> = hc/eV = <b>${fmt(lmin * 1000, 4)} pm</b> at ${kV} kV, for any target. Model K lines (Z = ${L.Z}): Kα ≈ 10.2(Z − 1)² eV = ${fmt(L.Ka / 1000, 3)} keV (${fmt(HC / L.Ka * 1000, 3)} pm), Kβ ≈ ${fmt(L.Kb / 1000, 3)} keV. ` +
      (kV * 1000 > L.edge ? 'The voltage is above the K-shell binding energy, so the lines appear.' : `<b>No K lines</b>: the electrons need more than about ${fmt(L.edge / 1000, 3)} keV to knock out a K electron.`);
  };
  slider(ctl, { label: 'Tube voltage (kV)', min: 5, max: 60, step: 1, value: kV, fmt: (v) => fmt(v, 3), oninput: (v) => { kV = v; cv.redraw(); show(); } });
  choice(ctl, 'Target', TARGETS.map((t) => [t[0], t[1]]), tg, (v) => { tg = v; cv.redraw(); show(); });

  cv.draw = (ctx, w, h, col) => {
    const lmax = 160, lmin = HC / (kV * 1000) * 1000; // pm
    const kr = (l) => (l <= lmin ? 0 : (l / lmin - 1) / (l * l));
    // scale so the continuum peak (at 2 lmin) at 30 kV sits near 1
    const ref = 1 / (4 * (HC / 30) ** 2);
    const a = axes(ctx, w, h, col, { x: [0, lmax], y: [0, 4.5], xlabel: 'wavelength (pm)', ylabel: 'intensity (model units)', yt: [0, 1, 2, 3, 4], t: 24 });
    ctx.save(); a.clip();
    const N = 500, xs = Array.from({ length: N + 1 }, (_, i) => 1 + ((lmax - 1) * i) / N);
    line(ctx, xs.map((l) => [a.X(l), a.Y(kr(l) / ref)]), col.s[0], 2);
    const L = lines();
    if (kV * 1000 > L.edge) {
      const strength = Math.min(1, (kV * 1000 / L.edge - 1) * 1.5);
      [[L.Ka, 2.6, 'Kα'], [L.Kb, 0.9, 'Kβ']].forEach(([E, hgt, lab]) => {
        const l = HC / E * 1000;
        line(ctx, [[a.X(l), a.Y(kr(l) / ref)], [a.X(l), a.Y(kr(l) / ref + hgt * strength)]], col.s[1], 3);
        text(ctx, lab, a.X(l) + 4, a.Y(kr(l) / ref + hgt * strength) + 2, { color: col.s[1], size: 11, weight: 700 });
      });
    }
    ctx.restore();
    line(ctx, [[a.X(lmin), a.T + 18], [a.X(lmin), a.B]], col.s[3], 1.5, [4, 4]);
    text(ctx, 'λ_min = hc/eV', a.X(lmin) + 4, a.T + 26, { color: col.s[3], size: 11, weight: 600 });
  };
  cv.redraw(); show();
}
