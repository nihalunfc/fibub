// Figures for src/blog/discoveries/radial-artery-occlusion-hemostasis-trial-sample-size.md, made with the maths of the
// Sample size tool (src/lib/sci/power.ts) and the NNT calculator (src/lib/sci/nnt.ts).
// Run: node scripts/blog-figures/radial-artery-occlusion-hemostasis-trial-sample-size.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { powerProp, solveN } from '../../src/lib/sci/power.ts';
import { compare } from '../../src/lib/sci/nnt.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/radial-artery-occlusion-hemostasis-trial-sample-size.md', import.meta.url);

// Inputs from the protocol: Zhang et al. (2026), PLOS ONE 21(6): e0350563, doi:10.1371/journal.pone.0350563 (CC BY 4.0).
const P_CTRL = 0.043, P_NEW = 0.01, ALPHA = 0.05, POWER = 0.8, DROP = 0.10, PAPER_N = 368, PAPER_TOTAL = 818;
const Z = 1.959963984540054, ZB = 0.8416212335729143;
const unpooled = (p1, p2) => (Z + ZB) ** 2 * (p1 * (1 - p1) + p2 * (1 - p2)) / (p1 - p2) ** 2; // the textbook Wald formula, for comparison
const nTool = solveN((n) => powerProp(n, P_CTRL, P_NEW, ALPHA), POWER, 1);
const nW = unpooled(P_CTRL, P_NEW);
const perGroupTool = Math.ceil(nTool - 1e-9), withDropTool = Math.ceil(perGroupTool / (1 - DROP) - 1e-9);
const powerAtPlanned = powerProp(PAPER_N, P_CTRL, P_NEW, ALPHA);

// Figure 1: power against people per group for three possible true rates in the new arm.
const ns = Array.from({ length: 81 }, (_, i) => 20 + i * 15);
const fig1 = chart({
  title: 'Power to detect fewer occlusions (4.3% in the control arm)', xLabel: 'People per group', yLabel: 'Power',
  series: [0.01, 0.015, 0.02].map((p2) => ({ name: `new arm ${(p2 * 100).toFixed(1)}%`, kind: 'line', x: ns, y: ns.map((n) => +powerProp(n, P_CTRL, p2, ALPHA).toFixed(4)) })),
  xDomain: [0, 1220], yDomain: [0, 1], hlines: [{ y: 0.8, text: '80% power' }], vlines: [{ x: 409, text: '409 planned' }],
  desc: `With 409 per group the trial has ${(powerProp(409, P_CTRL, 0.01) * 100).toFixed(0)}% power if the new method brings occlusion to 1.0%, but only ${(powerProp(409, P_CTRL, 0.015) * 100).toFixed(0)}% at 1.5% and ${(powerProp(409, P_CTRL, 0.02) * 100).toFixed(0)}% at 2.0%.`, height: 280,
});

// Figure 2: people needed per group (80% power, before dropout) against the true rate in the new arm.
const p2s = Array.from({ length: 41 }, (_, i) => 0.004 + i * 0.0005);
const fig2 = chart({
  title: 'People per group needed as the expected benefit shrinks', xLabel: 'Occlusion rate with the new method (%)', yLabel: 'People per group',
  series: [{ name: 'Sample size tool (pooled)', kind: 'line', x: p2s.map((p) => +(p * 100).toFixed(2)), y: p2s.map((p) => Math.round(solveN((n) => powerProp(n, P_CTRL, p, ALPHA), POWER, 1))) }],
  xDomain: [0.4, 2.4], yDomain: [0, 2000], vlines: [{ x: 1.0, text: 'protocol: 1.0%' }],
  desc: `About ${Math.round(solveN((n) => powerProp(n, P_CTRL, 0.005), 0.8, 1))} per group if the new rate is 0.5%, ${Math.round(nTool)} at 1.0%, ${Math.round(solveN((n) => powerProp(n, P_CTRL, 0.02), 0.8, 1))} at 2.0%.`, height: 280,
});

const nnt = compare(Math.round(P_NEW * 1000), 1000, Math.round(P_CTRL * 1000), 1000); // a 1000-per-arm illustration of the planned rates
const facts = { nTool: nTool.toFixed(3), nW: nW.toFixed(3), perGroupTool, withDropTool, totalTool: 2 * withDropTool, paperTotalCheck: (2 * PAPER_N / (1 - DROP)).toFixed(1), powerAt368: powerAtPlanned.toFixed(4), powerAt409: powerProp(409, P_CTRL, P_NEW).toFixed(4), powerAt409_15: powerProp(409, P_CTRL, 0.015).toFixed(4), powerAt409_20: powerProp(409, P_CTRL, 0.02).toFixed(4), n15: solveN((n) => powerProp(n, P_CTRL, 0.015), 0.8, 1).toFixed(1), n20: solveN((n) => powerProp(n, P_CTRL, 0.02), 0.8, 1).toFixed(1), n90: solveN((n) => powerProp(n, P_CTRL, P_NEW), 0.9, 1).toFixed(1), nnt: nnt.nnt.nnt.toFixed(2) };
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'power', figure(fig1, 'Figure 1. Power curves from the Sample size tool\'s two-proportion maths for the protocol\'s 4.3% control rate and three possible rates with the new method. The dashed line marks the 409 people per group the trial plans.'));
  md = inject(md, 'n', figure(fig2, 'Figure 2. People needed per group for 80% power at a two-sided 5% level, as the true occlusion rate with the new method rises from 0.4% to 2.4%. Worked out with the tool\'s maths; not trial data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
