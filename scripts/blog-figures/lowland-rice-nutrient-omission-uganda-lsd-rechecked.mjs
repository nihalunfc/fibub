// Figures and numbers for src/blog/discoveries/lowland-rice-nutrient-omission-uganda-lsd-rechecked.md, made with
// the maths of the Yield trial ANOVA tool (src/lib/sci/trialanova.ts) and the Fertiliser blend calculator
// (src/lib/sci/fertiliser.ts).
// Run: node scripts/blog-figures/lowland-rice-nutrient-omission-uganda-lsd-rechecked.mjs
import fs from 'node:fs';
import { analyse } from '../../src/lib/sci/trialanova.ts';
import { blend, P2O5_PER_P, K2O_PER_K } from '../../src/lib/sci/fertiliser.ts';
import { tInv } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/lowland-rice-nutrient-omission-uganda-lsd-rechecked.md', import.meta.url);

// Values from the text and Table 2 of Kyalo et al. (2025), Front. Agron. 7: 1609528 (CC BY): the five treatment
// means (t/ha), the season mean, the CV % and the published LSD at 5 %, for each of the three seasons.
const TRTS = ['Control', 'PK (no N)', 'NK (no P)', 'NP (no K)', 'NPK'];
const SEASONS = [
  { id: '2013A', y: [4.2, 5.3, 6.2, 5.7, 6.8], mean: 5.6, cv: 28.4, lsd: 0.6 },
  { id: '2014A', y: [1.9, 2.3, 2.9, 2.9, 2.9], mean: 2.6, cv: 20.4, lsd: 0.74 },
  { id: '2014B', y: [2.7, 2.9, 3.7, 3.8, 3.9], mean: 3.4, cv: 23.3, lsd: 0.95 },
];
const R = 7, T = TRTS.length, DFE = (R - 1) * (T - 1), TQ = tInv(0.975, DFE);

// A reproducible normal sample, double-centred so the treatment means and the error mean square come out exactly.
let seed = 1609528;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
function plots(means, mse) {
  let e = means.map(() => Array.from({ length: R }, gauss));
  const rm = e.map((r) => r.reduce((a, b) => a + b, 0) / R), cm = Array.from({ length: R }, (_, j) => e.reduce((a, r) => a + r[j], 0) / T), gm = rm.reduce((a, b) => a + b, 0) / T;
  e = e.map((r, i) => r.map((v, j) => v - rm[i] - cm[j] + gm));
  const k = Math.sqrt((mse * DFE) / e.flat().reduce((a, v) => a + v * v, 0));
  const farm = Array.from({ length: R }, (_, j) => (j - (R - 1) / 2) * 0.06 * Math.sqrt(mse) * 3); // farm effect: OUR assumption
  const obs = [];
  means.forEach((m, i) => { for (let j = 0; j < R; j++) obs.push({ trt: TRTS[i], block: `Farm ${j + 1}`, y: +(m + farm[j] + k * e[i][j]).toFixed(3) }); });
  return obs;
}
/** Blocks a published LSD would need, given the published CV and treatment mean (continuous, by bisection). */
function repsFor(lsd, s) {
  const f = (r) => tInv(0.975, Math.max(1.01, (r - 1) * (T - 1))) * Math.sqrt((2 * s * s) / r) - lsd;
  let lo = 2, hi = 400; if (f(hi) > 0) return Infinity;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

const out = SEASONS.map((S) => {
  const s = (S.cv / 100) * S.mean, mse = s * s, lsd = TQ * Math.sqrt((2 * mse) / R);
  const r = analyse(plots(S.y, mse), 'rcbd');
  return { ...S, pub: S.lsd, s, mse, lsd, r, needR: repsFor(S.lsd, s), gaps: { control: S.y[4] - S.y[0], n: S.y[4] - S.y[1], p: S.y[4] - S.y[2], k: S.y[4] - S.y[3] } };
});

console.log(`t at 5 % with ${DFE} error degrees of freedom: ${TQ.toFixed(4)}`);
for (const o of out) {
  console.log(`\n== ${o.id}`);
  console.log(`   published: mean ${o.mean} t/ha, CV ${o.cv} %, LSD ${o.pub} t/ha, p < 0.001`);
  console.log(`   residual SD from CV x mean: ${o.s.toFixed(4)} t/ha, error mean square ${o.mse.toFixed(4)}`);
  console.log(`   LSD at 7 blocks: ${o.lsd.toFixed(3)} t/ha (published ${o.pub}); tool gives ${o.r.lsd.toFixed(3)}`);
  console.log(`   tool: grand mean ${o.r.grand.toFixed(3)}, CV ${o.r.cv.toFixed(1)} %, F ${o.r.rows[1].f.toFixed(2)}, p ${o.r.rows[1].p.toFixed(4)}, error df ${o.r.dfe}`);
  console.log(`   means and letters: ${o.r.means.map((m) => `${m.trt} ${m.mean.toFixed(2)}${m.letters}`).join(' | ')}`);
  console.log(`   gaps from NPK: control ${o.gaps.control.toFixed(2)}, no N ${o.gaps.n.toFixed(2)}, no P ${o.gaps.p.toFixed(2)}, no K ${o.gaps.k.toFixed(2)} t/ha`);
  console.log(`   blocks the published LSD of ${o.pub} would need: ${o.needR === Infinity ? 'more than 400' : o.needR.toFixed(1)}`);
}

// Across-season means quoted in the paper's text, and the percentage comparisons.
const txt = { Control: 2.8, 'PK (no N)': 3.4, 'NK (no P)': 3.9, 'NP (no K)': 3.8, NPK: 4.83 };
console.log('\n== The paper\'s across-season means and its percentage claims');
for (const k of ['Control', 'PK (no N)', 'NK (no P)', 'NP (no K)']) console.log(`   NPK vs ${k}: ${(100 * (txt.NPK / txt[k] - 1)).toFixed(0)} % higher`);
console.log(`   average of the three season means for NPK: ${((6.8 + 2.9 + 3.9) / 3).toFixed(2)} t/ha (text says 4.83)`);
// Agronomic efficiency of the full rate, from the dry-weight yields of Table 3.
for (const N of [125, 58.3]) console.log(`   agronomic efficiency of N at ${N} kg N/ha: ${((4.0 - 1.7) * 1000 / N).toFixed(1)} kg grain per kg N (paper: 18)`);

// What the stated rates mean in fertiliser products.
const PRODUCTS = [{ name: 'Urea (46-0-0)', grade: [46, 0, 0, 0] }, { name: 'TSP (0-46-0)', grade: [0, 46, 0, 0] }, { name: 'MOP (0-0-50)', grade: [0, 0, 50, 0] }];
const need = [58.3, 13.2 * P2O5_PER_P, 49 * K2O_PER_K, null];
const b = blend(PRODUCTS, need);
console.log(`\n== Fertiliser products for ${need[0]} kg N, ${need[1].toFixed(2)} kg P2O5 and ${need[2].toFixed(2)} kg K2O per hectare`);
PRODUCTS.forEach((p, i) => console.log(`   ${p.name}: ${b.x[i].toFixed(1)} kg/ha`));
console.log(`   supplied ${b.supplied.map((v) => v.toFixed(2)).join(' / ')} kg/ha, exact: ${b.exact}, total mass ${b.mass.toFixed(1)} kg/ha`);
console.log(`   same blend for the 125 kg N/ha that the split doses add up to: urea ${(125 / 0.46).toFixed(1)} kg/ha`);

// ---- Figure 1: treatment means with half-LSD bars.
const fig1 = chart({
  title: 'Rice yields by nutrient omission, with the LSD', xLabel: 'Treatment', yLabel: 'Grain yield (t/ha)',
  series: out.map((o) => ({ name: o.id, kind: 'dots', size: 3.4, x: TRTS.map((_, i) => i + 1), y: o.y, errors: TRTS.map(() => o.lsd / 2) })),
  xDomain: [0.6, 5.4], yDomain: [1, 8], xTicks: [1, 2, 3, 4, 5], xFmt: (v) => ['Control', 'no N', 'no P', 'no K', 'NPK'][v - 1] ?? '',
  height: 300,
  desc: 'The five treatment means in each of the three seasons, with bars half a least significant difference long each way. Where two bars overlap, the two yields cannot be told apart at the 5 per cent level.',
});

// ---- Figure 2: the gaps the paper reports against the smallest gap that could be called real.
const fig2 = chart({
  title: 'Can the P and K omissions be detected?', xLabel: 'Season', yLabel: 'Difference in yield (t/ha)',
  series: [
    { name: 'LSD from the published CV', kind: 'line', x: [1, 2, 3], y: out.map((o) => +o.lsd.toFixed(3)) },
    { name: 'NPK − no P', kind: 'dots', size: 4, x: [1, 2, 3], y: out.map((o) => +o.gaps.p.toFixed(2)) },
    { name: 'NPK − no K', kind: 'dots', size: 4, x: [1, 2, 3], y: out.map((o) => +o.gaps.k.toFixed(2)) },
  ],
  xDomain: [0.8, 3.2], yDomain: [-0.2, 2], xTicks: [1, 2, 3], xFmt: (v) => out[v - 1]?.id ?? '', height: 300,
  desc: 'In every season the yield lost by leaving out phosphorus or potassium is smaller than the least significant difference worked out from the trial own coefficient of variation, so neither omission can be detected.',
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'means', figure(fig1, 'Figure 1. Treatment means in the three seasons (paper, Table 2), each with a bar half a least significant difference long either way. The LSD comes from the season\'s own published CV and seven farms as blocks. Bars that overlap mean the two treatments cannot be separated at the 5 % level.'));
md = inject(md, 'gaps', figure(fig2, 'Figure 2. The yield gap between full NPK and the plots without phosphorus or without potassium, against the least significant difference for that season. Every gap sits below the line.'));
fs.writeFileSync(ART, md);
console.log(`\nFigure 1 ${fig1.length} bytes; Figure 2 ${fig2.length} bytes`);
