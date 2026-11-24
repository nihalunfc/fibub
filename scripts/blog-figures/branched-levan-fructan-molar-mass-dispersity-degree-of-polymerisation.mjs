// Figures for src/blog/discoveries/branched-levan-fructan-molar-mass-dispersity-degree-of-polymerisation.md,
// made with the maths of the Polymer molar mass tool (src/lib/sci/polymer.ts: averages, polyfit, analyseTrace,
// exampleTrace) and the repeat-unit mass from src/lib/sci/chem.ts.
// Run: node scripts/blog-figures/branched-levan-fructan-molar-mass-dispersity-degree-of-polymerisation.mjs
import fs from 'node:fs';
import { averages, polyfit, analyseTrace, exampleTrace } from '../../src/lib/sci/polymer.ts';
import { molarMass, parseFormula } from '../../src/lib/sci/chem.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/branched-levan-fructan-molar-mass-dispersity-degree-of-polymerisation.md', import.meta.url);

// Inputs from the paper: Qiu et al. (2026), Molecules 31(11): 1981 (CC BY 4.0). CoPS, a levan-type fructan:
// Mw 7.491 kDa, Mn 7.2 kDa, Mp 7.401 kDa, Mz 7.865 kDa, Mw/Mn 1.04; fructose 95.60 mol %, glucose 4.40 mol %.
const PAPER = { Mw: 7491, Mn: 7200, Mp: 7401, Mz: 7865, D: 1.04 };
const RU = molarMass(parseFormula('C6H10O5'));   // anhydrofructose residue, 162.14 g/mol

// A log-normal SEC peak with the paper's Mw and dispersity, read through a straight-line calibration.
// The calibration (log10 M = 7.5 - 0.15 t) and the 1 kDa to 100 kDa standards are OUR choice, not the paper's.
const c0 = 7.5, c1 = -0.15, t0 = 14, t1 = 34;
const rows = exampleTrace(PAPER.Mw, PAPER.D, c0, c1, t0, t1, 0.02);
const t = rows.map((r) => r[0]), h = rows.map((r) => r[1]);
const stds = [1e5, 5e4, 2e4, 1e4, 5e3, 2e3, 1e3].map((M) => [(c0 - Math.log10(M)) / -c1, M]);
const cal = polyfit(stds.map((s) => s[0]), stds.map((s) => Math.log10(s[1])), 1);
const res = analyseTrace(t, h, cal.f, cal.df, t0 + 0.5, t1 - 0.5);

// Analytic log-normal expectations, for comparison with the paper's four numbers.
const logNormal = { Mn: PAPER.Mw / PAPER.D, Mz: PAPER.Mw * PAPER.D, Mp: PAPER.Mw * Math.exp(-Math.log(PAPER.D) / 2) };

// Two chain lengths that reproduce all three of the paper's averages at once (found by search, see the article).
const MIX = { M: [6597, 10624], w: [0.778, 0.222] };
const mix = averages(MIX.M, MIX.w);

const fig1 = chart({
  title: 'A simulated SEC peak for a 7.5 kDa fructan', xLabel: 'Retention time (min)', yLabel: 'Detector signal',
  // Every tenth point, so the SVG stays small; the analysis below uses all of them.
  series: [{ name: '', noLegend: true, kind: 'line', x: t.filter((_, i) => i % 10 === 0), y: h.filter((_, i) => i % 10 === 0).map((y) => +y.toFixed(2)), colour: 'var(--c-blog)' }],
  xDomain: [t0, t1], yDomain: [0, 105],
  vlines: [{ x: t0 + 0.5, text: 'window' }, { x: t1 - 0.5, text: '', left: true }],
  desc: 'A simulated size-exclusion peak with the paper\'s weight-average molar mass and dispersity, on a straight-line calibration from 1 to 100 kDa.',
  height: 250,
});

const dist = res.dist.filter((p) => p.w > 0);
const wmax = Math.max(...dist.map((p) => p.w));
const fig2 = chart({
  title: 'The distribution and its four averages', xLabel: 'log₁₀ (molar mass / g mol⁻¹)', yLabel: 'Mass per unit log M (scaled)',
  series: [{ name: '', noLegend: true, kind: 'line', x: dist.map((p) => +p.logM.toFixed(4)), y: dist.map((p) => +(p.w / wmax).toFixed(4)), colour: 'var(--c-blog)' }],
  xDomain: [3.5, 4.3], yDomain: [0, 1.15],
  vlines: [
    { x: +Math.log10(res.Mn).toFixed(4), text: `Mn ${Math.round(res.Mn)}`, left: true, dy: 0 },
    { x: +Math.log10(res.Mw).toFixed(4), text: `Mw ${Math.round(res.Mw)}`, dy: 16 },
    { x: +Math.log10(res.Mz).toFixed(4), text: `Mz ${Math.round(res.Mz)}`, dy: 32 },
  ],
  desc: 'The mass distribution the tool reads from the simulated peak, against log molar mass, with the number-, weight- and z-average molar masses marked.',
  height: 265,
});

console.log(JSON.stringify({
  repeatUnit: +RU.toFixed(3),
  paper: PAPER,
  paperRatios: { MwOverMn: +(PAPER.Mw / PAPER.Mn).toFixed(4), MzOverMw: +(PAPER.Mz / PAPER.Mw).toFixed(4), MpOverMw: +(PAPER.Mp / PAPER.Mw).toFixed(4) },
  logNormal: { Mn: +logNormal.Mn.toFixed(1), Mz: +logNormal.Mz.toFixed(1), Mp: +logNormal.Mp.toFixed(1) },
  trace: { Mn: +res.Mn.toFixed(1), Mw: +res.Mw.toFixed(1), Mz: +res.Mz.toFixed(1), Mp: +res.Mp.toFixed(1), D: +res.D.toFixed(4), slices: res.slices, calR2: +cal.r2.toFixed(6) },
  dpFromMn: +(PAPER.Mn / RU).toFixed(2), dpFromMw: +(PAPER.Mw / RU).toFixed(2), dpTrace: +(res.Mn / RU).toFixed(4),
  glucose: { perChainAtDp44: +(0.044 * (PAPER.Mn / RU)).toFixed(2), dpForOneGlucose: +(1 / 0.044).toFixed(1), MnForOneGlucose: Math.round((1 / 0.044) * RU) },
  mix: { M: MIX.M, w: MIX.w, Mn: +mix.Mn.toFixed(1), Mw: +mix.Mw.toFixed(1), Mz: +mix.Mz.toFixed(1), D: +mix.D.toFixed(4), dp: +(mix.Mn / RU).toFixed(2) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'trace', figure(fig1, 'Figure 1. A simulated size-exclusion peak carrying the paper\'s weight-average molar mass (7,491 g mol⁻¹) and dispersity (1.04), read through a straight-line calibration of our own from 1 to 100 kDa. The dashed lines are the integration window. This is a simulation, not the paper\'s chromatogram.'));
  md = inject(md, 'dist', figure(fig2, 'Figure 2. The mass distribution the Polymer molar mass tool reads back from that peak, against log molar mass, with the three averages it reports. The whole peak spans less than a factor of two in molar mass: that is what a dispersity of 1.04 looks like.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
