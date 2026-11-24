// Figures and numbers for src/blog/discoveries/lung-cancer-nutrition-kap-item-scores-from-response-counts.md,
// made with the maths of the Likert chart tool (src/lib/sci/likert.ts).
// Run: node scripts/blog-figures/lung-cancer-nutrition-kap-item-scores-from-response-counts.mjs
import fs from 'node:fs';
import { summarise, chartHeight, drawLikert, palette } from '../../src/lib/sci/likert.ts';
import { svgPainter } from '../../src/lib/sci/plot.ts';
import { chart, figure, inject, watermark } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/lung-cancer-nutrition-kap-item-scores-from-response-counts.md', import.meta.url);

// Response counts exactly as Tables 2, 3 and 4 of Cao, Xiang, Zhang, Tang, Hu and Li (2026), Front. Nutr. 13:
// 1678612, doi:10.3389/fnut.2026.1678612 (CC BY 4.0) print them, for N = 598 patients. Most negative first.
const DOM = [
  {
    key: 'Knowledge', prefix: 'K', off: -1, score: 12.07, sd: 4.69, range: '0-20', alphaPilot: 0.887,
    labels: ['Not clear', 'Heard of it', 'Very familiar'],
    counts: [[32, 309, 257], [68, 273, 257], [84, 253, 261], [185, 268, 145], [87, 279, 232], [133, 282, 183], [97, 288, 213], [69, 273, 256], [88, 301, 209], [113, 305, 180]],
  },
  {
    key: 'Attitude', prefix: 'A', off: 0, score: 35.89, sd: 4.98, range: '9-45', alphaPilot: 0.788,
    labels: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
    counts: [[12, 76, 113, 285, 112], [5, 21, 98, 267, 207], [5, 20, 89, 282, 202], [10, 26, 92, 285, 185], [3, 21, 111, 279, 184], [4, 31, 104, 278, 181], [7, 26, 132, 281, 152], [3, 21, 83, 299, 192], [1, 25, 126, 296, 150]],
  },
  {
    key: 'Practice', prefix: 'P', off: 0, score: 23.28, sd: 4.12, range: '6-30', alphaPilot: 0.809,
    labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    counts: [[6, 37, 138, 248, 169], [9, 47, 160, 219, 163], [3, 32, 125, 226, 212], [1, 34, 123, 221, 219], [10, 63, 158, 206, 161], [3, 64, 154, 222, 155]],
  },
];
const N = 598;

const R = DOM.map((d) => {
  const items = d.counts.map((c, i) => summarise(`Item ${d.prefix}${i + 1}`, c));
  const k = items.length;
  const sumMeans = items.reduce((s, it) => s + it.mean, 0);          // on the tool's codes 1..options
  const total = sumMeans + d.off * k;                                 // on the paper's own coding
  const sumVar = items.reduce((s, it) => s + it.sd ** 2, 0);
  const sumSd = items.reduce((s, it) => s + it.sd, 0);
  const alpha = (k / (k - 1)) * (1 - sumVar / d.sd ** 2);             // Cronbach from the printed total SD
  const rbar = (d.sd ** 2 / sumVar - 1) / (k - 1);                    // average inter-item correlation
  const sdAt = (r) => Math.sqrt(sumVar + r * (sumSd ** 2 - sumVar));  // total SD if every pair correlated r
  return { ...d, items, k, sumMeans, total, sumVar, sumSd, alpha, rbar, sdAt, nOk: items.every((it) => it.n === N) };
});

// ---- Figure 1: the tool's own diverging stacked bars for the nine attitude items.
const AT = R[1], W1 = 560, FONT = 12, H1 = Math.round(chartHeight(AT.k, AT.labels.length, W1, FONT));
const sp = svgPainter(W1, H1, 'system-ui, sans-serif');
drawLikert(sp, { w: W1, h: H1, items: AT.items, labels: AT.labels, title: 'Attitudes to nutrition during chemotherapy (n = 598)', ink: 'var(--ink)', muted: 'var(--muted)', grid: 'var(--line)', colors: palette(5), font: FONT });
const body = String(sp).replace(/^[\s\S]*?<svg[^>]*>\n?/, '').replace(/<\/svg>\s*$/, '');
const fig1 = [
  `<svg class="blog-fig" viewBox="0 0 ${W1} ${H1}" role="img" aria-label="Diverging stacked bars for the nine attitude items, centred on the neutral answer. Agreement runs from 66 per cent for item A1 to 82 per cent for item A8." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:${FONT}px system-ui,sans-serif">`,
  '<title>The nine attitude items as diverging stacked bars</title>', body, watermark(W1, H1, 4), '</svg>',
].join('');

// ---- Figure 2: what the published total SD says about how much the items agree with each other.
const rs = Array.from({ length: 61 }, (_, i) => i / 100);
const fig2 = chart({
  title: 'Total score spread against item agreement', xLabel: 'Average correlation between items', yLabel: 'SD of the domain score',
  series: [
    ...R.map((d) => ({ name: d.key, kind: 'line', x: rs, y: rs.map((r) => +d.sdAt(r).toFixed(3)) })),
    ...R.map((d, i) => ({ name: '', noLegend: true, kind: 'dots', x: [d.rbar], y: [d.sd], size: 4.5, colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][i] })),
  ],
  xDomain: [0, 0.6], yDomain: [2, 6],
  hlines: R.map((d) => ({ y: d.sd, text: `${d.key} ${d.sd}` })),
  desc: 'The standard deviation a domain score would have if every pair of its items correlated by the same amount, against that correlation. The paper’s printed SDs cross the curves at 0.41, 0.34 and 0.43.',
  height: 290,
});

const f = (x, n = 4) => +x.toFixed(n);
console.log(JSON.stringify(R.map((d) => ({
  domain: d.key, items: d.k, everyItemHas598: d.nOk, range: d.range,
  toolSumOfMeans: f(d.sumMeans), reconstructed: f(d.total), paperScore: d.score, gap: f(d.total - d.score),
  sumOfItemVariances: f(d.sumVar), sdIfIndependent: f(Math.sqrt(d.sumVar), 3), paperSd: d.sd,
  alphaFromTables: f(d.alpha), alphaPilot: d.alphaPilot, meanInterItemR: f(d.rbar),
  itemMeans: d.items.map((it) => f(it.mean + d.off, 3)), itemMedians: d.items.map((it) => it.median),
  pctAgree: d.items.map((it) => f(it.agree, 1)), itemSd: d.items.map((it) => f(it.sd, 3)),
})), null, 1));
// The percentages the paper prints beside the attitude counts, checked against counts / 598.
const PCT_A = [[2.01, 12.71, 18.9, 47.66, 18.73], [0.84, 3.51, 16.39, 44.65, 34.62], [0.84, 3.34, 14.88, 47.16, 33.78], [1.67, 4.35, 15.38, 47.66, 30.94], [0.5, 3.51, 18.56, 46.66, 30.77], [0.67, 5.18, 17.39, 46.49, 30.27], [1.17, 4.35, 22.07, 46.99, 25.42], [0.5, 3.51, 13.88, 50, 32.11], [0.17, 4.18, 21.07, 49.5, 25.08]];
const pctGap = Math.max(...AT.items.flatMap((it, i) => it.pct.map((v, j) => Math.abs(v - PCT_A[i][j]))));
console.log('attitude percentages: 45 printed values, biggest gap from count/598 =', f(pctGap, 4), 'points');

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'likert', figure(fig1, 'Figure 1. The paper’s nine attitude items drawn by the Likert chart tool from its published response counts, centred on the neutral answer, most agreement first. The number on each segment is its percentage; the figure on the right is % agree.'));
  md = inject(md, 'sd', figure(fig2, 'Figure 2. How wide a domain score can be. Each curve is the standard deviation the total would have if every pair of items in that domain correlated by the amount on the x-axis, worked out from the item variances in the paper’s tables. The dashed lines are the standard deviations the paper prints; where each line crosses its curve is the average correlation between that domain’s items.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
