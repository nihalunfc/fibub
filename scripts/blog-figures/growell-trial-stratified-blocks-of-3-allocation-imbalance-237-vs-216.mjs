// Figures for src/blog/discoveries/growell-trial-stratified-blocks-of-3-allocation-imbalance-237-vs-216.md, made with the maths
// of the Randomisation list generator (src/lib/sci/randomise.ts: makeList, stratumList, parseRatio, rngFromText).
// Run: node scripts/blog-figures/growell-trial-stratified-blocks-of-3-allocation-imbalance-237-vs-216.mjs
import fs from 'node:fs';
import * as R from '../../src/lib/sci/randomise.ts';
import { normCdf } from '../../src/lib/sci/distributions.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/growell-trial-stratified-blocks-of-3-allocation-imbalance-237-vs-216.md', import.meta.url);

// Paper: Simmons et al. (2026), BMC Pregnancy and Childbirth 26: 368 (CC BY 4.0). 453 randomised, 216 intervention and 237 control; stratified
// permuted blocks of size 3, ratio 1:1, three stratification variables (BMI category, race/ethnicity, recruitment method), number of strata not given.
// Six-month follow-up 268 (117 and 151).
const N = 453, OBS = 237 - 216, ARMS = ['Intervention', 'Control'];
const designs = [
  { key: 'simple', label: 'Simple', o: { method: 'simple', blockSizes: [] } },
  { key: 'b2', label: 'Blocks of 2', o: { method: 'blocks', blockSizes: [2] } },
  { key: 'b4', label: 'Blocks of 4', o: { method: 'blocks', blockSizes: [4] } },
  { key: 'b6', label: 'Blocks of 6', o: { method: 'blocks', blockSizes: [6] } },
];

// A trial: each of the 453 people joins a stratum at random (OUR assumption: equally likely), and each stratum has its own list from the tool's generator.
function trial(design, S, seed) {
  const rng = R.rngFromText('assign/' + seed), counts = Array(S).fill(0);
  for (let i = 0; i < N; i++) counts[rng.below(S)]++;
  let gap = 0;
  counts.forEach((c, s) => {
    if (!c) return;
    const o = { arms: ARMS, ratio: [1, 1], perStratum: c, factors: [], seed: 't' + seed, ...design.o };
    const list = R.stratumList(o, 'S' + s);
    gap += list.reduce((a, x) => a + (x.arm === 0 ? 1 : -1), 0);
  });
  return Math.abs(gap);
}
const REPS = 300, Ss = [1, 5, 10, 20, 30, 60];
const res = {};
for (const d of designs) res[d.key] = Ss.map((S) => { const g = Array.from({ length: REPS }, (_, k) => trial(d, S, k + 1)); return { S, mean: g.reduce((a, b) => a + b, 0) / REPS, p21: g.filter((v) => v >= OBS).length / REPS }; });

// What the tool says about the paper's wording: a block of 3 with a 1:1 ratio.
let blockOf3 = 'accepted';
try { R.makeList({ arms: ARMS, ratio: [1, 1], method: 'blocks', blockSizes: [3], perStratum: 12, factors: [], seed: 'x' }); } catch (e) { blockOf3 = String(e.message).slice(0, 60); }
// Blocks of 3 only fit a 1:2 or 2:1 ratio.
const ok3 = R.makeList({ arms: ARMS, ratio: [1, 2], method: 'blocks', blockSizes: [3], perStratum: 12, factors: [], seed: 'x' }).summary[0].counts;
// Follow-up retention (our arithmetic): 117 of 216 and 151 of 237.
const pI = 117 / 216, pC = 151 / 237, pAll = 268 / N, se = Math.sqrt(pAll * (1 - pAll) * (1 / 216 + 1 / 237)), z = (pC - pI) / se;
const simpleSd = Math.sqrt(N);

console.log(JSON.stringify({
  obs: OBS, simpleSd: +simpleSd.toFixed(2), zObs: +(OBS / simpleSd).toFixed(2),
  res: Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v.map((r) => [r.S, +r.mean.toFixed(1), +r.p21.toFixed(3)])])),
  blockOf3, ok3, retention: { pI: +pI.toFixed(3), pC: +pC.toFixed(3), z: +z.toFixed(2), p: +(2 * (1 - normCdf(z))).toFixed(3) },
}, null, 1));

const fig1 = chart({
  title: 'Final gap between the arms, 453 people', xLabel: 'Number of strata', yLabel: 'Mean gap (participants)',
  series: designs.map((d, i) => ({ name: d.label, kind: 'line', x: Ss, y: res[d.key].map((r) => +r.mean.toFixed(1)) })),
  xDomain: [1, 60], yDomain: [0, 24], xTicks: [1, 10, 20, 30, 40, 50, 60],
  hlines: [{ y: OBS, text: 'observed gap 21' }],
  desc: 'Average final difference between the two arms for 453 people, by number of strata, for simple randomisation and stratified permuted blocks of 2, 4 and 6, from 300 simulated trials per point. Only simple randomisation gives a gap near the 21 seen in the trial at all strata counts; blocks keep the gap small until there are many strata.',
  height: 280,
});
const fig2 = chart({
  title: 'How often a gap of 21 or more arises', xLabel: 'Number of strata', yLabel: 'Share of trials with gap >= 21',
  series: designs.map((d) => ({ name: d.label, kind: 'line', x: Ss, y: res[d.key].map((r) => +r.p21.toFixed(3)) })),
  xDomain: [1, 60], yDomain: [0, 0.5], xTicks: [1, 10, 20, 30, 40, 50, 60],
  desc: 'Share of 300 simulated trials per point whose final gap between the arms is 21 or more, by number of strata and design. For simple randomisation it is about one in three at every strata count; for blocks it is near zero until the strata are many.',
  height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'gap', figure(fig1, 'Figure 1. The average final gap between the arms for 453 people, by design and number of strata (300 simulated trials per point). The dashed line is the 21 seen in the trial.'));
  md = inject(md, 'share', figure(fig2, 'Figure 2. The share of simulated trials with a gap of at least 21. Stratified blocks stay far below simple randomisation until the strata outnumber the people they can fill.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
