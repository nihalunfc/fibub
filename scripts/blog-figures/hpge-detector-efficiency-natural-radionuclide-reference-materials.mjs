// Figures for src/blog/discoveries/hpge-detector-efficiency-natural-radionuclide-reference-materials.md, made with the
// maths of the Curve fitter (src/lib/sci/phcurvefit.ts) and the Decay calculator (src/lib/sci/decay.ts).
// Run: node scripts/blog-figures/hpge-detector-efficiency-natural-radionuclide-reference-materials.mjs
import fs from 'node:fs';
import { fitCurve } from '../../src/lib/sci/phcurvefit.ts';
import { timeTo, decay, countFactor } from '../../src/lib/sci/decay.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/hpge-detector-efficiency-natural-radionuclide-reference-materials.md', import.meta.url);

// Inputs. "Paper": Jodłowski (2025), Applied Sciences 15, 9774 (CC BY 4.0).
// Paper, Table 4: the six calibration lines from the IAEA RGK-1, RGU-1 and RGTh-1 materials, energy (keV) and
// full-energy-peak efficiency (%) with its standard uncertainty.
const CAL = [[238.6, 4.73, 0.27], [351.9, 3.637, 0.075], [1001.0, 1.581, 0.040], [1460.8, 1.169, 0.018], [1764.5, 1.034, 0.021], [2204.2, 0.851, 0.018]];
// Paper, Table 5: efficiencies (%) measured with the commercial multinuclide source, corrected to the silica matrix.
const VAL = [['Sn-113', 391.7, 3.159], ['Cs-137', 661.7, 2.182], ['Mn-54', 834.8, 1.840], ['Zn-65', 1115.5, 1.481], ['Co-60', 1173.2, 1.425], ['Co-60', 1332.5, 1.292]];
// Paper, Table 6: bias of the multinuclide efficiencies against the RG curve (%), same order as VAL.
const BIAS = [-4.1, -0.9, 0.0, 1.0, 1.2, 1.4];
// Paper, Tables 2 and 5: half-life (days), activity on the certificate date and on the measurement date (Bq).
// Cs-137 and Co-60 half-lives are given in years in the paper; converted with 365.25 days per year.
const SRC = [['Sn-113', 115.09, 849, 196], ['Cs-137', 30.018 * 365.25, 828, 815], ['Mn-54', 312.19, 1316, 767], ['Zn-65', 244.01, 2381, 1193], ['Co-60', 5.2711 * 365.25, 2291, 2099]];
// Paper, Table 2: lines left out of the check. Half-life (days) and certificate activity (Bq).
const GONE = [['Cr-51', 27.704, 4275], ['Sr-85', 64.850, 583]];
const COUNT_H = 220; // paper: the multinuclide source was counted for about 220 hours

// 1. The paper's efficiency curve: a quadratic in ln(efficiency) against ln(energy), fitted with the Curve fitter's
// least squares. Unweighted (our choice; it reproduces the paper's residuals).
const x = CAL.map((c) => Math.log(c[0])), y = CAL.map((c) => Math.log(c[1]));
const fit = fitCurve('a + b*x + c*x^2', x, y, [0, 0, 0]);
const eff = (E) => Math.exp(fit.f(Math.log(E)));
const resid = CAL.map((c) => 100 * (c[1] / eff(c[0]) - 1));
const bias = VAL.map((v) => 100 * (v[2] / eff(v[1]) - 1));
const L10 = Math.log10;
const curveE = Array.from({ length: 61 }, (_, i) => 200 * (2400 / 200) ** (i / 60));
const fig1 = chart({
  title: 'Efficiency curve from natural reference materials', xLabel: 'Gamma-ray energy (keV)', yLabel: 'Efficiency (%)',
  series: [
    { name: 'Fitted curve', kind: 'line', x: curveE.map((e) => +L10(e).toFixed(4)), y: curveE.map((e) => +L10(eff(e)).toFixed(4)) },
    { name: 'RG reference lines', kind: 'dots', size: 4, x: CAL.map((c) => +L10(c[0]).toFixed(4)), y: CAL.map((c) => +L10(c[1]).toFixed(4)) },
    { name: 'Multinuclide source', kind: 'dots', size: 4, x: VAL.map((v) => +L10(v[1]).toFixed(4)), y: VAL.map((v) => +L10(v[2]).toFixed(4)) },
  ],
  xDomain: [L10(200), L10(2400)], yDomain: [L10(0.7), L10(6)],
  xTicks: [200, 300, 500, 1000, 2000].map(L10), yTicks: [0.8, 1, 2, 3, 5].map(L10),
  xFmt: (v) => String(Math.round(10 ** v)), yFmt: (v) => String(+(10 ** v).toPrecision(2)),
  desc: 'On log-log axes the six reference-material efficiencies fall on a gently curved line from 4.7% at 239 keV to 0.85% at 2204 keV; the six multinuclide-source points sit on the same line, the 392 keV point slightly below it.', height: 300,
});

// 2. How long the multinuclide source had been decaying: the Decay calculator's "when will it fall to" for each nuclide.
const days = SRC.map(([, T, a0, a]) => timeTo(a0, a, T));
const tMean = days.filter((_, i) => SRC[i][0] !== 'Cs-137').reduce((s, v) => s + v, 0) / 4;
const tt = Array.from({ length: 81 }, (_, i) => i * 5);
const fig2 = chart({
  title: 'Activity left in the multinuclide source', xLabel: 'Days after the certificate date', yLabel: 'Activity left (%)',
  series: [
    ...SRC.filter((s) => s[0] !== 'Cs-137').map(([n, T]) => ({ name: n, kind: 'line', x: tt, y: tt.map((t) => +(100 * decay(1, t, T)).toFixed(2)) })),
    { name: 'Paper (Table 5)', kind: 'dots', size: 4, colour: 'var(--ink)', x: days.map((d) => +d.toFixed(1)), y: SRC.map((s) => +(100 * s[3] / s[2]).toFixed(2)), noLegend: true },
  ],
  yDomain: [0, 100], xDomain: [0, 400], vlines: [{ x: +tMean.toFixed(0), text: `${tMean.toFixed(0)} days` }],
  desc: `Decay curves for Sn-113, Mn-54, Zn-65 and Co-60. Each nuclide's activity on the measurement date sits on its curve at about ${tMean.toFixed(0)} days after the certificate date.`, height: 300,
});

// 3. Facts.
const facts = {
  p: fit.p.map((v) => +v.toFixed(5)), r2: fit.r2.toFixed(5), s: fit.s.toFixed(5),
  resid: resid.map((v) => +v.toFixed(2)), bias: bias.map((v) => +v.toFixed(2)), paperBias: BIAS,
  meanAbsBias: (bias.reduce((s, v) => s + Math.abs(v), 0) / bias.length).toFixed(2),
  days: Object.fromEntries(SRC.map((s, i) => [s[0], +days[i].toFixed(1)])), tMean: tMean.toFixed(1),
  cs137At: decay(828, tMean, SRC[1][1]).toFixed(1),
  gone: Object.fromEntries(GONE.map(([n, T, a0]) => [n, +decay(a0, tMean, T).toFixed(1)])),
  countLoss: Object.fromEntries(SRC.map(([n, T]) => [n, +(100 * (1 - countFactor(COUNT_H / 24, T))).toFixed(2)])),
  typed: CAL.map((c) => `${Math.log(c[0]).toFixed(4)}\t${Math.log(c[1]).toFixed(4)}`),
};
// The same fit from the 4-decimal values a reader types into the Curve fitter.
const xr = facts.typed.map((r) => +r.split('\t')[0]), yr = facts.typed.map((r) => +r.split('\t')[1]);
const fr = fitCurve('a + b*x + c*x^2', xr, yr, [0, 0, 0]);
facts.typedFit = { p: fr.p.map((v) => +v.toFixed(4)), r2: fr.r2.toFixed(4) };
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'eff', figure(fig1, 'Figure 1. The paper\'s six reference-material efficiencies (Table 4), the quadratic in ln-ln fitted to them with the Curve fitter\'s maths, and the six efficiencies measured with the commercial multinuclide source (Table 5). Both axes are logarithmic.'));
  md = inject(md, 'decay', figure(fig2, 'Figure 2. Fraction of each nuclide left in the multinuclide source, from the Decay calculator\'s maths and the paper\'s half-lives. The dots are the paper\'s activities on the measurement date divided by the certificate activities; Cs-137 (hardly decays) is left out of the curves.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
