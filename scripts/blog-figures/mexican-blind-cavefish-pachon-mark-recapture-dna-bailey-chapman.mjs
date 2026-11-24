// Figures for src/blog/discoveries/mexican-blind-cavefish-pachon-mark-recapture-dna-bailey-chapman.md, made with the
// maths of the Mark-recapture estimator (src/lib/sci/markrecap.ts: Lincoln-Petersen, Chapman, Seber's variance and
// the log-normal interval). Run: node scripts/blog-figures/mexican-blind-cavefish-pachon-mark-recapture-dna-bailey-chapman.mjs
import fs from 'node:fs';
import { twoSample } from '../../src/lib/sci/markrecap.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/mexican-blind-cavefish-pachon-mark-recapture-dna-bailey-chapman.md', import.meta.url);

// Inputs from the paper's text: Espinasa et al. (2024), Fishes 9(9): 334, doi:10.3390/fishes9090334 (CC BY).
// Pachón main pool: 29 fish genotyped on each of two visits three days apart, 3 genotypes found twice; estimate 218 (40-395).
// Whole Pachón system: 35 fish genotyped in 2019, 55 in 2022, 3 found in both; estimate 490 (76-904).
// Reading "29 fish sampled twice" as M = C = 29 is OUR reading; it reproduces the paper's numbers exactly (below).
const SETS = [
  { id: 'Main pool, 3 days apart', M: 29, C: 29, R: 3, paper: [218, 40, 395] },
  { id: 'Whole system, 2019 vs 2022', M: 35, C: 55, R: 3, paper: [490, 76, 904] },
];
// Bailey's (1951) binomial estimator and variance, which the paper's values match (not part of the tool).
const bailey = ({ M, C, R }) => { const N = (M * (C + 1)) / (R + 1), v = (M * M * (C + 1) * (C - R)) / ((R + 1) ** 2 * (R + 2)); return { N, se: Math.sqrt(v), lo: N - 1.96 * Math.sqrt(v), hi: N + 1.96 * Math.sqrt(v) }; };
const res = SETS.map((s) => ({ ...s, bai: bailey(s), log: twoSample(s.M, s.C, s.R, 'lognormal'), nor: twoSample(s.M, s.C, s.R, 'normal'), poi: twoSample(s.M, s.C, s.R, 'poisson') }));

// Figure 1: how the main-pool estimate moves with the number of matched genotypes R (M = C = 29).
const RR = Array.from({ length: 11 }, (_, i) => i + 2);
const ts = RR.map((R) => twoSample(29, 29, R, 'lognormal'));
const fig1 = chart({
  title: 'Main pool: estimate against matched genotypes', xLabel: 'Fish found in both samples, R', yLabel: 'Estimated fish, N',
  series: [
    { name: 'Chapman', kind: 'line', x: RR, y: ts.map((t) => +t.chapman.toFixed(1)) },
    { name: 'Lincoln-Petersen', kind: 'line', x: RR, y: ts.map((t) => +t.lp.toFixed(1)), dash: '5 4' },
    { name: '95 % log-normal limits', kind: 'line', x: RR, y: ts.map((t) => +t.lo.toFixed(1)), colour: 'var(--muted)', dash: '2 3' },
    { name: '', noLegend: true, kind: 'line', x: RR, y: ts.map((t) => +Math.min(t.hi, 800).toFixed(1)), colour: 'var(--muted)', dash: '2 3' },
    { name: '', noLegend: true, kind: 'dots', x: [3], y: [+res[0].log.chapman.toFixed(1)], size: 4, colour: 'var(--c-blog)' },
  ],
  xDomain: [2, 12], yDomain: [0, 800], vlines: [{ x: 3, text: 'R = 3 (paper)' }, { x: 7, text: 'R = 7 rule' }],
  desc: `With 29 fish in each sample, the Chapman estimate falls from ${ts[0].chapman.toFixed(0)} at R = 2 to ${res[0].log.chapman.toFixed(0)} at R = 3 and ${ts[2].chapman.toFixed(0)} at R = 4; the upper limit at R = 2 is above the plot.`, height: 280,
});

// Figure 2: planning. If the pool holds about 224 fish, how precise is the estimate for different sample sizes?
// R is set to its expected value M·C/N (our planning assumption).
const N0 = Math.round(res[0].log.chapman), CC = Array.from({ length: 31 }, (_, i) => 20 + i * 5);
const plan = [29, 40, 60].map((M) => ({ M, cv: CC.map((C) => +(100 * twoSample(M, C, (M * C) / N0).cv).toFixed(2)) }));
const fig2 = chart({
  title: `Planning a repeat: precision if the pool holds ${N0} fish`, xLabel: 'Fish genotyped on the second visit, C', yLabel: 'Coefficient of variation (%)',
  series: plan.map((p) => ({ name: `${p.M} marked`, kind: 'line', x: CC, y: p.cv })),
  xDomain: [20, 170], yDomain: [0, 45], hlines: [{ y: 20, text: '20 %' }],
  desc: `Expected coefficient of variation of the Chapman estimate for 29, 40 or 60 fish genotyped on the first visit, if the pool holds ${N0} fish.`, height: 260,
});

const r0 = (v) => Math.round(v);
console.log(JSON.stringify(res.map((r) => ({ id: r.id, paper: r.paper, bailey: [r.bai.N, r.bai.se, r.bai.lo, r.bai.hi].map((v) => +v.toFixed(1)), lp: +r.log.lp.toFixed(1), chapman: +r.log.chapman.toFixed(1), se: +r.log.se.toFixed(1), cv: +(100 * r.log.cv).toFixed(1), seen: r.log.seen, log: [r0(r.log.lo), r0(r.log.hi)], nor: [r0(r.nor.lo), r0(r.nor.hi)], poi: [r0(r.poi.lo), r0(r.poi.hi)] }))));
console.log('R sweep', RR.map((R, i) => `${R}:${ts[i].chapman.toFixed(0)}(${ts[i].lo.toFixed(0)}-${ts[i].hi.toFixed(0)})`).join(' '));
console.log('plan', plan.map((p) => p.M + ': ' + [29, 40, 60, 100, 150].map((C) => `C${C}=${p.cv[CC.indexOf(C)] ?? (100 * twoSample(p.M, C, (p.M * C) / N0).cv).toFixed(1)}%/R${((p.M * C) / N0).toFixed(1)}`).join(' ')).join(' | '));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'sweep', figure(fig1, 'Figure 1. The main-pool estimate for 29 fish genotyped on each visit, as the number of genotypes found twice (R) changes, from the Mark-recapture estimator\'s maths. The paper found R = 3. Dotted lines: the 95 % log-normal interval (cut at 800).'));
  md = inject(md, 'plan', figure(fig2, 'Figure 2. Planning a repeat survey: the expected coefficient of variation of the Chapman estimate if the pool holds about 224 fish, for 29, 40 or 60 fish genotyped first. Expected recaptures, not real data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
