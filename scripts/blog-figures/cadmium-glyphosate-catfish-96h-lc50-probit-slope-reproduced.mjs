// Figures for src/blog/discoveries/cadmium-glyphosate-catfish-96h-lc50-probit-slope-reproduced.md, made with the
// maths of the LC50 probit analysis tool (src/lib/sci/probit.ts: fitQuantal, lcp, predict).
// Run: node scripts/blog-figures/cadmium-glyphosate-catfish-96h-lc50-probit-slope-reproduced.mjs
import fs from 'node:fs';
import { fitQuantal, lcp, predict } from '../../src/lib/sci/probit.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/cadmium-glyphosate-catfish-96h-lc50-probit-slope-reproduced.md', import.meta.url);

// From the preprint's running text: Sunday and Ayi (2026), doi:10.21203/rs.3.rs-10208580/v1 (CC BY 4.0).
// Five fixed-ratio mixtures of cadmium chloride and glyphosate potassium (1:2), 30 sub-adult Clarias gariepinus per
// treatment in three replicates of 10, no control deaths, 96 h static test.
const CD = [6.18, 12.36, 18.54, 24.72, 30.90]; // cadmium chloride component, mg/L
const TOTAL = CD.map((c) => c * 3); // cadmium chloride + glyphosate potassium together, mg/L
// Cumulative 96 h mortality stated in the text as percentages of 30 fish: 13.33, 16.67, 33.33, 43.33 and 60.00 %.
const DEAD = [13.33, 16.67, 33.33, 43.33, 60.0].map((p) => Math.round((p / 100) * 30));
const PAPER = { slope: 2.027, slopeSe: 0.496, lc50: 28.1, lo: 21.628, hi: 47.653, chi2: 2.085, p: 0.555, sprague: 2.81, nas: 0.28 };

const groups = (conc) => [{ conc: 0, n: 30, r: 0 }, ...conc.map((c, i) => ({ conc: c, n: 30, r: DEAD[i] }))];
const fit = fitQuantal(groups(CD), 'probit');
const fitT = fitQuantal(groups(TOTAL), 'probit');
const L = (f, p) => lcp(f, p, 0.95);
const r50 = L(fit, 0.5);

const report = {
  dead: DEAD,
  onCadmiumScale: {
    slope: +fit.b.toFixed(4), slopeSe: +Math.sqrt(fit.cov[1][1]).toFixed(4), intercept: +fit.a.toFixed(4),
    lc50: +r50.conc.toFixed(3), lo: +r50.lo.toFixed(3), hi: +r50.hi.toFixed(3), g: +r50.g.toFixed(3),
    chi2: +fit.chi2.toFixed(4), df: fit.df, p: +fit.pChi.toFixed(4),
    lc10: +L(fit, 0.1).conc.toFixed(3), lc20: +L(fit, 0.2).conc.toFixed(3), lc90: +L(fit, 0.9).conc.toFixed(3),
    lc10lo: +L(fit, 0.1).lo.toFixed(3), lc10hi: +L(fit, 0.1).hi.toFixed(3),
    lc90lo: +L(fit, 0.9).lo.toFixed(3), lc90hi: +L(fit, 0.9).hi.toFixed(3),
    sprague: +(r50.conc / 10).toFixed(3), nas: +(r50.conc / 100).toFixed(4),
  },
  onTotalScale: { slope: +fitT.b.toFixed(4), lc50: +L(fitT, 0.5).conc.toFixed(3), lo: +L(fitT, 0.5).lo.toFixed(2), hi: +L(fitT, 0.5).hi.toFixed(2) },
  paper: PAPER,
};

const xlo = 3, xhi = 120, xs = [];
for (let i = 0; i <= 160; i++) xs.push(xlo * (xhi / xlo) ** (i / 160));
const fig1 = chart({
  title: '96-hour mortality against cadmium chloride in the mixture', xLabel: 'Cadmium chloride in the mixture (mg/L)', yLabel: 'Died (%)',
  series: [
    { name: 'Probit fit (fibub)', kind: 'line', x: xs.map((v) => Math.log10(v)), y: xs.map((v) => 100 * predict(fit, v)) },
    { name: "The paper's five treatments", kind: 'dots', x: CD.map((c) => Math.log10(c)), y: DEAD.map((r) => (100 * r) / 30), size: 3.6 },
  ],
  xDomain: [Math.log10(xlo), Math.log10(xhi)], yDomain: [0, 100],
  xTicks: [5, 10, 20, 30, 50, 100].map((v) => Math.log10(v)), xFmt: (t) => String(Math.round(10 ** t)),
  yTicks: [0, 25, 50, 75, 100],
  vlines: [{ x: Math.log10(r50.conc), text: `LC50 ${r50.conc.toFixed(1)}`, left: true }],
  hlines: [{ y: 50, text: '' }],
  desc: `The five mortality percentages the preprint reports at 96 hours, against the cadmium chloride concentration in the mixture on a log scale, with the maximum-likelihood probit curve. The LC50 is ${r50.conc.toFixed(1)} mg/L.`,
  height: 290,
});

const PS = Array.from({ length: 97 }, (_, i) => 0.02 + i * 0.01);
const band = PS.map((p) => L(fit, p));
const fig2 = chart({
  title: 'How wide the fiducial limits get away from LC50', xLabel: 'Mortality level (%)', yLabel: 'Concentration (mg/L)',
  series: [
    { name: 'Estimate', kind: 'line', x: PS.map((p) => 100 * p), y: band.map((r) => Math.log10(r.conc)) },
    { name: '95 % fiducial limits', kind: 'line', dash: '5 4', x: PS.map((p) => 100 * p), y: band.map((r) => Math.log10(r.lo)) },
    { name: '', kind: 'line', dash: '5 4', colour: 'var(--c-tools)', noLegend: true, x: PS.map((p) => 100 * p), y: band.map((r) => Math.log10(r.hi)) },
  ],
  xDomain: [2, 98], yDomain: [0.3, 3.1], yTicks: [0.477, 1, 1.477, 2, 2.477, 3],
  yFmt: (t) => String(Math.round(10 ** t)),
  hlines: [{ y: Math.log10(30.9), text: 'highest concentration tested' }],
  desc: 'The concentration for each mortality level with its 95 per cent fiducial limits. At LC50 the limits span 22 to 48 mg/L; by LC90 the upper limit runs past 500 mg/L, far beyond anything tested.',
  height: 280,
});

console.log(JSON.stringify(report, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curve', figure(fig1, `Figure 1. The preprint's five 96-hour mortality percentages and the probit curve fitted by the LC50 tool's maths. Slope ${fit.b.toFixed(3)} probits per tenfold rise, LC50 ${r50.conc.toFixed(3)} mg/L of cadmium chloride in the mixture: both the published values.`));
  md = inject(md, 'band', figure(fig2, 'Figure 2. The same fit read at every mortality level, with its 95 % fiducial limits. The limits are tightest at LC50 and blow out at both ends; above the dashed line the answer is an extrapolation beyond the concentrations tested.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
