// Figures for src/blog/discoveries/seminal-plasma-metabolomics-2612-tests-bh-fdr-10-vs-9.md, made with the maths of the
// Volcano and PCA tool (src/lib/sci/mbvolcano.ts: compare, welch, bh).
// Run: node scripts/blog-figures/seminal-plasma-metabolomics-2612-tests-bh-fdr-10-vs-9.mjs
import fs from 'node:fs';
import * as M from '../../src/lib/sci/mbvolcano.ts';
import { normCdf } from '../../src/lib/sci/distributions.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/seminal-plasma-metabolomics-2612-tests-bh-fdr-10-vs-9.md', import.meta.url);

// Paper: Xu et al. (2026), Frontiers in Endocrinology (CC BY 4.0). Discovery cohort 10 impaired vs 9 controls; 2,612 annotated metabolites tested;
// nominal screen p < 0.05 and fold change >= 1.5 or <= 0.67 gave 89 metabolites; none had BH q < 0.05. HPLC-UV cohort 18 vs 18: 2-HMBA p = 0.030, q = 0.060; cytidine p = 0.812, q = 0.812.
const NA = 10, NB = 9, M_TESTS = 2612, FC = 1.5, PAPER_HITS = 89;

const rng = (seed) => { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const norm = (r) => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
// OUR made-up table: intensity = 2^(mean + effect + sigma x noise), the mean of each metabolite itself drawn around 10 (log2 units).
function table(sigma, seed, spike = 0, delta = 0) {
  const r = rng(seed), groups = [...Array(NA).fill('Control'), ...Array(NB).fill('Impaired')], x = [];
  for (let i = 0; i < M_TESTS; i++) { const mu = 10 + 3 * norm(r), row = []; for (let j = 0; j < NA + NB; j++) row.push(2 ** (mu + (i < spike && j >= NA ? delta : 0) + sigma * norm(r))); x.push(row); }
  return { features: x.map((_, i) => 'm' + i), samples: groups.map((_, j) => 's' + j), groups, x };
}
const run = (sigma, seed, spike, delta) => M.compare(table(sigma, seed, spike, delta), 'Control', 'Impaired', 'log2');
const screen = (res) => res.filter((z) => z.p < 0.05 && (z.fc >= FC || z.fc <= 1 / FC)).length;
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const R = 8, seeds = Array.from({ length: R }, (_, i) => i + 1);

// 1. How many nominal hits does pure noise give, as the noise level changes?
const sig = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2];
const hits = sig.map((s) => mean(seeds.map((k) => screen(run(s, k)))));
const avgHits = (s) => mean(seeds.map((k) => screen(run(s, k))));
let a = 0.5, b = 0.8; for (let i = 0; i < 9; i++) { const m = (a + b) / 2; if (avgHits(m) < PAPER_HITS) a = m; else b = m; } const sigma = (a + b) / 2;
const nullRuns = seeds.map((k) => run(sigma, k));
const nullStats = {
  screenHits: mean(nullRuns.map(screen)), rawP: mean(nullRuns.map((r) => r.filter((z) => z.p < 0.05).length)),
  minQ: mean(nullRuns.map((r) => Math.min(...r.map((z) => z.q)))), anyQ05: nullRuns.filter((r) => r.some((z) => z.q < 0.05)).length,
};

// 2. Power: 100 real differences hidden among the 2,612, found at q < 0.05 (log2 fold change delta).
const deltas = [0.5, 1, 1.5, 2, 2.5, 3];
const SPIKE = 100;
const power = deltas.map((d) => { const out = seeds.slice(0, 5).map((k) => { const r = run(sigma, 100 + k, SPIKE, d); return [r.slice(0, SPIKE).filter((z) => z.q < 0.05).length / SPIKE, r.slice(0, SPIKE).filter((z) => z.p < 0.05).length / SPIKE, r.slice(SPIKE).filter((z) => z.q < 0.05).length]; }); return [mean(out.map((o) => o[0])), mean(out.map((o) => o[1])), mean(out.map((o) => o[2]))]; });

// 3. The paper's own two HPLC-UV p-values through the tool's BH.
const bh2 = M.bh([0.030, 0.812]);
const pCrit = 0.05 / M_TESTS;

// 4. Normal-approximation p of a Mann-Whitney test from a stated AUC (our arithmetic, no ties).
const aucP = (auc, n1, n2) => 2 * (1 - normCdf((auc * n1 * n2 - (n1 * n2) / 2) / Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12)));
const aucs = { hplc: +aucP(0.713, 18, 18).toFixed(4), disc2hmba: +aucP(0.9, 10, 9).toFixed(4), discCyt: +aucP(0.889, 10, 9).toFixed(4) };

console.log(JSON.stringify({
  aucs, sigma: +sigma.toFixed(3), sigmaFoldSd: +(2 ** sigma).toFixed(2), hits: sig.map((s, i) => [s, +hits[i].toFixed(1)]),
  nullStats: { screenHits: +nullStats.screenHits.toFixed(1), rawP: +nullStats.rawP.toFixed(1), minQ: +nullStats.minQ.toFixed(3), anyQ05: nullStats.anyQ05 },
  expectedRawP: M_TESTS * 0.05, power: deltas.map((d, i) => [d, +power[i][0].toFixed(3), +power[i][1].toFixed(3), +power[i][2].toFixed(1)]),
  bh2, pCrit,
}, null, 1));

const fig1 = chart({
  title: 'Pure noise can give the paper\'s 89 hits', xLabel: 'Noise (SD of log2 intensity)', yLabel: 'Metabolites passing the screen',
  series: [{ name: '', noLegend: true, kind: 'line', x: sig, y: sig.map((s, i) => +hits[i].toFixed(1)) }],
  xDomain: [0.2, 1.2], yDomain: [0, 140], xTicks: [0.2, 0.4, 0.6, 0.8, 1.0, 1.2],
  hlines: [{ y: PAPER_HITS, text: 'paper: 89 hits' }, { y: M_TESTS * 0.05, text: '5 % of 2,612 = 131' }],
  desc: 'Made-up tables of 2,612 metabolites with no real group difference, 10 against 9 samples. The number passing a nominal screen of p below 0.05 and fold change of at least 1.5 either way rises with the noise and reaches 89 at a log2 standard deviation near 0.65, and flattens out near 125, about 5 percent of the tests.',
  height: 265,
});
const fig2 = chart({
  title: 'What 10 against 9 can find among 2,612 tests', xLabel: 'True fold change (log2)', yLabel: 'Share of 100 real differences found',
  series: [
    { name: 'raw p < 0.05', kind: 'line', x: deltas, y: power.map((p) => +p[1].toFixed(3)) },
    { name: 'FDR q < 0.05', kind: 'line', x: deltas, y: power.map((p) => +p[0].toFixed(3)) },
  ],
  xDomain: [0.5, 3], yDomain: [0, 1], xTicks: [0.5, 1, 1.5, 2, 2.5, 3],
  desc: 'With the same noise, a hundred metabolites truly raised by a given fold change are hidden among 2,612 tests. Raw p below 0.05 finds most of them at a log2 fold change of 1 (a factor of 2), while the false-discovery-rate filter finds 14 percent at 1, 82 percent at 1.5 (a factor of 2.8) and nearly all at 2 (a factor of 4).',
  height: 265,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'noise', figure(fig1, 'Figure 1. Hits from a table with nothing in it. The curve is the average of 8 made-up tables per point; the paper\'s 89 sits on it at a plausible noise level, and the ceiling is 5 % of the tests.'));
  md = inject(md, 'power', figure(fig2, 'Figure 2. How large a real difference must be to survive the correction with 10 against 9 samples and 2,612 tests, in made-up tables with 100 real differences hidden.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
