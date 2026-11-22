// 9.3 The vacuum energy puzzle on one log-log plot. Quantum theory says empty space is full of jittering fields;
// adding up the zero-point energy of every wave up to a cut-off energy E_c gives roughly
// ρ_vac ≈ E_c⁴ / (16π² (ħc)³) (one field; the exact factor depends on the fields, the slope of 4 does not).
// The flat line is the measured dark energy, 5.3 × 10⁻¹⁰ J/m³ (Planck 2018 values). Slide the cut-off from the
// energy where they would agree (a few meV) up to the Planck energy (1.22 × 10²⁸ eV): the mismatch reaches about
// 120 powers of ten, or about 60 with a TeV cut-off.
import { canvas, axes, text, title, line, dot, row, slider, readout, arrow } from '../../kit.js';
import { criticalDensity, PLANCK18 as P, C, EV } from '../phys.js';

const HBARC = 1.054571817e-34 * C;
const rhoVac = (eV) => (eV * EV) ** 4 / (16 * Math.PI * Math.PI * HBARC ** 3);
const sup = (e) => String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 430, min: 320, label: 'Predicted vacuum energy against the cut-off energy, compared with the measured dark energy' });
  const OBS = P.OL * criticalDensity(P.H0) * C * C;
  let Ec = 1.22e28;
  const marks = [['electron', 5.11e5], ['proton', 9.38e8], ['LHC', 1.3e13], ['grand unification', 1e25], ['Planck', 1.22e28]];
  const ctl = row(host);
  slider(ctl, { label: 'Cut-off energy', min: 1e-3, max: 1.22e28, value: Ec, log: true, fmt: (v) => (v < 1 ? (v * 1000).toPrecision(2) + ' meV' : '10' + sup(Math.round(Math.log10(v))) + ' eV'), oninput: (v) => { Ec = v; show(); cv.redraw(); } });
  const out = readout(host);
  const show = () => {
    const d = Math.log10(rhoVac(Ec) / OBS);
    out.innerHTML = d > 0.5
      ? `Prediction: ${(rhoVac(Ec)).toExponential(1).replace('e+', ' × 10^').replace(/\^(\d+)/, (m, e) => sup(e))} J/m³. Measured: 5.3 × 10⁻¹⁰ J/m³. <b>Too big by about 10${sup(Math.round(d))}</b>, ${Math.round(d)} powers of ten.`
      : d < -0.5 ? `With such a low cut-off the estimate is <b>too small</b> by 10${sup(Math.round(-d))}, but every particle we know has far more energy than this.`
      : 'Near this cut-off, a few thousandths of an electronvolt, the rough estimate matches the measured dark energy. But we know particles and fields exist at far higher energies.';
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Predicted vacuum energy vs what we measure', col);
    const A = axes(ctx, w, h, col, { x: [1e-3, 1e29], y: [1e-12, 1e116], xlog: true, ylog: true, t: top + 10, l: 50,
      xt: [1, 1e8, 1e16, 1e24], yt: [1e-10, 1e20, 1e50, 1e80, 1e110],
      fx: (v) => '10' + sup(Math.round(Math.log10(v))), fy: (v) => '10' + sup(Math.round(Math.log10(v))),
      xlabel: 'Cut-off energy (eV)', ylabel: 'Energy density (J/m³)' });
    ctx.save(); A.clip();
    line(ctx, [[A.X(1e-3), A.Y(rhoVac(1e-3))], [A.X(1e29), A.Y(rhoVac(1e29))]], col.s[0], 2.5);
    line(ctx, [[A.L, A.Y(OBS)], [A.R, A.Y(OBS)]], col.s[1], 2.5);
    ctx.restore();
    for (const [lab, e] of marks) {
      dot(ctx, A.X(e), A.Y(rhoVac(e)), 3.5, col.s[0], col.panel);
      const right = e > 1e20;
      text(ctx, lab, A.X(e) + (right ? -8 : 7), A.Y(rhoVac(e)) + (right ? -2 : 4), { color: col.muted, size: 10.5, align: right ? 'right' : 'left', halo: col.panel });
    }
    text(ctx, 'measured dark energy', A.R - 4, A.Y(OBS) - 10, { color: col.s[1], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'quantum estimate', A.X(1e14) - 12, A.Y(rhoVac(1e14)) - 6, { color: col.s[0], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    const yP = A.Y(rhoVac(Ec)), yO = A.Y(OBS), x = A.X(Ec);
    if (Math.abs(yP - yO) > 16) arrow(ctx, x, yO, x, yP + (yP < yO ? 3 : -3), col.s[3], 2.2);
    dot(ctx, x, yP, 6, col.s[3], col.panel);
  };
  show(); cv.redraw();
}
