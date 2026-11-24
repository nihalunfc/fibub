// Figures for src/blog/discoveries/primary-school-digital-inquiry-research-competence-difference-in-differences.md,
// made with the maths of the Difference-in-differences calculator (src/lib/sci/did.ts: did2x2).
// Run: node scripts/blog-figures/primary-school-digital-inquiry-research-competence-difference-in-differences.mjs
import fs from 'node:fs';
import { did2x2 } from '../../src/lib/sci/did.ts';
import { tTwoSided, tInv } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/primary-school-digital-inquiry-research-competence-difference-in-differences.md', import.meta.url);

// The four cells, from the paper's text: Kurebay et al. (2026), Front. Educ. 11: 1821816 (CC BY 4.0).
// Research-competence score on a 1-4 scale, 59 pupils per group.
const T0 = { mean: 2.39, sd: 0.61, n: 59 }, T1 = { mean: 3.27, sd: 0.58, n: 59 };
const C0 = { mean: 2.41, sd: 0.63, n: 59 }, C1 = { mean: 2.58, sd: 0.66, n: 59 };
const r = did2x2(T0, T1, C0, C1);

// The paper's own paired analysis: dz = 0.94 (treated) and 0.16 (comparison) with mean changes 0.88 and 0.17,
// so the standard deviation of each group's change is mean change / dz.
const sdGain = { t: 0.88 / 0.94, c: 0.17 / 0.16 };
const sePaired = Math.sqrt(sdGain.t ** 2 / 59 + sdGain.c ** 2 / 59);
const tPaired = r.did / sePaired;
// Pre-post correlation implied by a change standard deviation: var(gain) = sd0² + sd1² − 2 r sd0 sd1.
const impliedR = (sd0, sd1, sdg) => (sd0 ** 2 + sd1 ** 2 - sdg ** 2) / (2 * sd0 * sd1);
const rT = impliedR(T0.sd, T1.sd, sdGain.t), rC = impliedR(C0.sd, C1.sd, sdGain.c);

// How the standard error of the same 0.71 change-of-changes moves with the within-pupil correlation.
const seAt = (rho) => {
  const vT = T0.sd ** 2 + T1.sd ** 2 - 2 * rho * T0.sd * T1.sd, vC = C0.sd ** 2 + C1.sd ** 2 - 2 * rho * C0.sd * C1.sd;
  return Math.sqrt(vT / 59 + vC / 59);
};
const RHO = Array.from({ length: 121 }, (_, i) => -0.4 + i * 0.01);
const atRho = (rho) => { const se = seAt(rho), t = r.did / se; return { se, t, p: tTwoSided(t, 116), lo: r.did - tInv(0.975, 116) * se, hi: r.did + tInv(0.975, 116) * se }; };

const fig1 = chart({
  title: 'Research competence: the two groups before and after',
  xLabel: 'Test (0 = before the nine weeks, 1 = after)', yLabel: 'Score (1 to 4 scale)',
  series: [
    { name: 'Digital inquiry class', kind: 'line', x: [0, 1], y: [T0.mean, T1.mean] },
    { name: 'Ordinary class', kind: 'line', x: [0, 1], y: [C0.mean, C1.mean] },
    { name: 'Counterfactual', kind: 'line', x: [0, 1], y: [T0.mean, +r.counterfactual.toFixed(3)], colour: 'var(--muted)', dash: '5 4' },
    { name: '', noLegend: true, kind: 'dots', x: [0, 1, 0, 1], y: [T0.mean, T1.mean, C0.mean, C1.mean], size: 3.5, colour: 'var(--ink)' },
  ],
  xDomain: [-0.08, 1.08], yDomain: [2.2, 3.45], xTicks: [0, 1],
  desc: `The four group means. The treated class rises ${(T1.mean - T0.mean).toFixed(2)} points, the comparison class ${(C1.mean - C0.mean).toFixed(2)}; the gap between the treated line and the dashed counterfactual is the difference-in-differences, ${r.did.toFixed(2)} points.`,
  height: 270,
});

const fig2 = chart({
  title: 'The same 0.71 points, with and without the pairing',
  xLabel: 'Assumed before-after correlation within a pupil', yLabel: 't statistic for the effect',
  series: [{ name: '', noLegend: true, kind: 'line', x: RHO, y: RHO.map((x) => +(r.did / seAt(x)).toFixed(3)) }],
  xDomain: [-0.4, 0.8], yDomain: [0, 12],
  hlines: [{ y: +tInv(0.975, 116).toFixed(3), text: 'p = 0.05' }],
  vlines: [{ x: 0, text: 'cells treated as independent' }, { x: +rT.toFixed(3), text: `implied by the paper (${rT.toFixed(2)})`, left: true, dy: 16 }],
  desc: 'The t statistic for the 0.71-point change-of-changes against the assumed before-after correlation within a pupil. It is 4.4 when the four cells are treated as independent samples and rises steeply with the correlation; the paper\'s own change-score figures imply a negative correlation.',
  height: 280,
});

console.log(JSON.stringify({
  did: +r.did.toFixed(4), treated: +r.treatedChange.toFixed(4), control: +r.controlChange.toFixed(4), counterfactual: +r.counterfactual.toFixed(4),
  se: +r.se.toFixed(4), t: +r.t.toFixed(3), df: r.df, p: r.p, lo: +r.lo.toFixed(4), hi: +r.hi.toFixed(4),
  sdGain: { t: +sdGain.t.toFixed(4), c: +sdGain.c.toFixed(4) }, sePaired: +sePaired.toFixed(4), tPaired: +tPaired.toFixed(3),
  impliedR: { treated: +rT.toFixed(4), control: +rC.toFixed(4) },
  at: Object.fromEntries([-0.237, 0, 0.3, 0.5, 0.7].map((x) => [x, { se: +atRho(x).se.toFixed(4), t: +atRho(x).t.toFixed(3), p: atRho(x).p.toExponential(2), ci: [+atRho(x).lo.toFixed(3), +atRho(x).hi.toFixed(3)] }])),
  dzIfR: Object.fromEntries([0, 0.3, 0.5, 0.7].map((rho) => [rho, +(0.88 / Math.sqrt(T0.sd ** 2 + T1.sd ** 2 - 2 * rho * T0.sd * T1.sd)).toFixed(3)])),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cells', figure(fig1, 'Figure 1. The paper\'s four group means (dots), joined for each group, with the dashed line showing where the digital-inquiry class would have ended if it had moved like the ordinary class. The gap at the right is the difference-in-differences the tool reports.'));
  md = inject(md, 'rho', figure(fig2, 'Figure 2. How certain the same 0.71-point estimate is, as the assumed before-after correlation within a pupil changes. The tool\'s 2 x 2 card uses the left-hand case (independent cells).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
