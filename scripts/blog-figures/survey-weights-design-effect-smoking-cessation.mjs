// Figures and numbers for src/blog/discoveries/survey-weights-design-effect-smoking-cessation.md, made with the maths
// of the Survey weighting tool (src/lib/sci/surveyw.ts: raking/post-stratification, Kish's design effect,
// weighted percentages).
// Run: node scripts/blog-figures/survey-weights-design-effect-smoking-cessation.mjs
import fs from 'node:fs';
import { rake, kish, weightedPct, parseMargin } from '../../src/lib/sci/surveyw.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/survey-weights-design-effect-smoking-cessation.md', import.meta.url);

// The paper: Bai Y., Ye X., Zhao Y., Wang R. and Jian X. (2026), Frontiers in Public Health 14: 1972026 (CC BY 4.0).
// Figures it states: 923 ever-quitters (580 unsuccessful, 343 successful); weighted failure 66.9 % with a
// design-based standard error of 2.66 %; design effect 2.95 and effective sample size 312; weights adding to
// 18,047,490; 23 districts x 3 townships x 2 communities = 138 sampled communities; and, by age group, the
// unweighted counts and the weighted share of each outcome.
const N = 923, P = 0.669, SE = 0.0266, TOTAL = 18047490, COMMUNITIES = 138;
const AGES = ['15-35', '36-55', '>55'];
const COUNT = { unsuccessful: [102, 227, 251], successful: [19, 67, 257] };
const SHARE = { unsuccessful: [36.2, 36.9, 26.9], successful: [16.6, 24.6, 58.8] }; // weighted %, within outcome

// 1. The design effect implied by the paper's own two numbers: a simple random sample of 923 would have this error.
const srsSe = Math.sqrt((P * (1 - P)) / N);
const deff = (SE / srsSe) ** 2;
const neff = N / deff;

// 2. Rebuild a weight for every respondent from the published margins: six cells (3 age groups x 2 outcomes),
// each cell's weight being its share of the total weight divided by its share of the sample.
const cells = [];
for (const out of ['unsuccessful', 'successful']) {
  const pOut = out === 'unsuccessful' ? P : 1 - P;
  AGES.forEach((age, i) => cells.push({ age, out, n: COUNT[out][i], w: (SHARE[out][i] / 100) * pOut }));
}
const wsum = cells.reduce((s, c) => s + c.w, 0);
cells.forEach((c) => { c.r = (c.w / wsum) / (c.n / N); });
const W = [], AGE = [], OUT = [];
for (const c of cells) for (let i = 0; i < c.n; i++) { W.push(c.r); AGE.push(c.age); OUT.push(c.out); }
const k6 = kish(W);
const pct6 = weightedPct(OUT, W);

// 3. The same job done with the tool's own post-stratification, on the age margins only.
const ageShare = AGES.map((_, i) => (cells[i].w + cells[i + 3].w) / wsum);
const unwShare = AGES.map((_, i) => (COUNT.unsuccessful[i] + COUNT.successful[i]) / N);
const margin = parseMargin(AGES.map((a, i) => `${a}, ${ageShare[i]}`).join('\n'));
const raked = rake([AGE], W.map(() => 1), [margin.shares], TOTAL);
const kAge = kish(raked.w);
const pctAge = weightedPct(OUT, raked.w);
const perRespondent = TOTAL / N;
const ageWeights = AGES.map((a) => +(raked.w[AGE.indexOf(a)] / perRespondent).toFixed(4));

// 4. What is left over is clustering: 138 communities, so about 6.7 ever-quitters each.
const clusterDeff = deff / k6.deff;
const m = N / COMMUNITIES;
const icc = (clusterDeff - 1) / (m - 1);

// Chart 1: who the weights move. Age-group share of the sample against age-group share of the weight.
const x = [1, 2, 3];
const fig1 = chart({
  title: 'Who the weights move: ever-quitters by age',
  xLabel: 'Age group', yLabel: 'Share (%)',
  series: [
    { name: 'share of the 923 respondents', kind: 'line', x, y: unwShare.map((v) => +(100 * v).toFixed(2)) },
    { name: 'share of the weight', kind: 'line', x, y: ageShare.map((v) => +(100 * v).toFixed(2)) },
  ],
  xDomain: [0.8, 3.2], yDomain: [0, 60], xTicks: x, xFmt: (v) => AGES[v - 1] ?? '',
  desc: 'The youngest age group is 13 per cent of the ever-quitters interviewed but carries 30 per cent of the weight; the oldest group is 55 per cent of the sample and 37 per cent of the weight.',
  height: 250,
});

// Chart 2: what a design effect costs, in margin of error and effective sample size.
const deffs = Array.from({ length: 141 }, (_, i) => 1 + i * 0.025);
const moe = (d) => 100 * 1.96 * srsSe * Math.sqrt(d);
const fig2 = chart({
  title: 'What a design effect costs this survey',
  xLabel: 'Design effect', yLabel: 'Margin of error on 66.9 % (± %)',
  series: [
    { name: '', noLegend: true, kind: 'line', x: deffs, y: deffs.map((d) => +moe(d).toFixed(3)) },
    { name: '', noLegend: true, kind: 'dots', x: [1, k6.deff, deff], y: [1, k6.deff, deff].map((d) => +moe(d).toFixed(3)), size: 4, colour: 'var(--c-tools)' },
  ],
  xDomain: [1, 4.5], yDomain: [2.5, 7],
  vlines: [
    { x: 1, text: 'simple random: n 923', dy: 0 },
    { x: k6.deff, text: `weights only: n ${Math.round(k6.neff)}`, dy: 14 },
    { x: deff, text: `as published: n ${Math.round(neff)}`, left: true, dy: 28 },
  ],
  desc: 'The margin of error grows with the square root of the design effect: plus or minus 3.0 points at a design effect of 1, 3.4 points at 1.27 and 5.2 points at the published 2.95.',
  height: 260,
});

console.log(JSON.stringify({
  implied: { srsSePct: +(100 * srsSe).toFixed(4), deff: +deff.toFixed(3), neff: +neff.toFixed(1), moePct: +moe(deff).toFixed(2), ci: [+(100 * P - moe(deff)).toFixed(1), +(100 * P + moe(deff)).toFixed(1)] },
  cells: cells.map((c) => ({ age: c.age, out: c.out, n: c.n, weight: +c.r.toFixed(3) })),
  sixCell: { deff: +k6.deff.toFixed(4), neff: +k6.neff.toFixed(1), weighted: pct6.map((r) => ({ cat: r.cat, n: r.n, unweighted: +r.pct.toFixed(2), weighted: +r.wpct.toFixed(2) })) },
  ageOnly: { converged: raked.converged, weights: ageWeights, deff: +kAge.deff.toFixed(4), neff: +kAge.neff.toFixed(1), weighted: pctAge.map((r) => ({ cat: r.cat, weighted: +r.wpct.toFixed(2) })), sumOfWeights: Math.round(raked.w.reduce((s, v) => s + v, 0)) },
  shares: { unweighted: unwShare.map((v) => +(100 * v).toFixed(2)), weighted: ageShare.map((v) => +(100 * v).toFixed(2)) },
  clustering: { clusterDeff: +clusterDeff.toFixed(2), meanCluster: +m.toFixed(2), icc: +icc.toFixed(3) },
  unweightedPct: +((100 * 580) / N).toFixed(2),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ages', figure(fig1, 'Figure 1. The age mix of the 923 ever-quitters as interviewed, and as the published weights count them. The gap is what post-stratification to the 2020 census does, and it is why the weighted failure rate is four points above the raw one.'));
  md = inject(md, 'deff', figure(fig2, 'Figure 2. The price of a design effect, worked out with the tool\'s maths: the margin of error on a 66.9 % estimate from 923 people, against the design effect. The marked points are a simple random sample, the weights alone, and the published figure.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
