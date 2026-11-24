// Figures for src/blog/discoveries/chinese-learners-english-corner-vowels-effect-sizes-tokens-vs-speakers.md
// Maths from src/lib/sci/hyptest.ts (Hypothesis tests) and src/lib/sci/formant.ts (Vowel formant chart).
// Inputs: Table 1 of Zhu (2025), Front. Psychol. 16: 1598904 (CC BY 4.0): mean F1 and F2 in Hz with their
// standard deviations and token counts, for native American English and Chinese learners, by sex.
import { readFileSync, writeFileSync } from 'node:fs';
import { tTwo } from '../../src/lib/sci/hyptest.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/chinese-learners-english-corner-vowels-effect-sizes-tokens-vs-speakers.md', import.meta.url);
const r2 = (v) => Math.round(v * 100) / 100, r3 = (v) => Math.round(v * 1000) / 1000;

// sex, vowel, formant, native mean/SD/tokens, Chinese mean/SD/tokens, the paper's printed d and p.
const ROWS = [
  ['F', 'ɑ', 'F1', 690, 153, 310, 787, 137, 2288, -0.695, 0.000],
  ['F', 'ɑ', 'F2', 1414, 264, 310, 1407, 217, 2288, 0.032, 0.000],
  ['F', 'æ', 'F1', 672, 154, 486, 720, 125, 3545, -0.037, 0.000],
  ['F', 'æ', 'F2', 1888, 282, 486, 1896, 291, 3545, -0.027, 0.000],
  ['F', 'i', 'F1', 405, 1235, 753, 444, 119, 5380, -0.087, 0.000],
  ['F', 'i', 'F2', 2478, 311, 753, 2385, 360, 5380, 0.26, 0.000],
  ['F', 'u', 'F1', 412, 146, 423, 453, 118, 3125, -0.336, 0.000],
  ['F', 'u', 'F2', 1832, 395, 423, 1520, 349, 3125, 0.879, 0.000],
  ['M', 'ɑ', 'F1', 609, 118, 313, 678, 107, 2071, -0.63, 0.000],
  ['M', 'ɑ', 'F2', 1244, 179, 313, 1264, 188, 2071, -0.10, 0.066],
  ['M', 'æ', 'F1', 555, 110, 486, 585, 97, 3236, -0.30, 0.000],
  ['M', 'æ', 'F2', 1646, 190, 486, 1698, 213, 3236, -0.24, 0.000],
  ['M', 'i', 'F1', 346, 101, 754, 383, 121, 4916, -0.31, 0.000],
  ['M', 'i', 'F2', 2121, 262, 754, 2051, 244, 4916, 0.28, 0.000],
  ['M', 'u', 'F1', 369, 110, 426, 396, 119, 2834, 0.10, 0.000],
  ['M', 'u', 'F2', 1484, 349, 426, 1327, 308, 2834, 0.50, 0.000],
];
const SPEAKERS = { F: [6, 44], M: [6, 40] };

/** The smallest sample with exactly this mean and sample standard deviation: values put symmetrically
 * either side of the mean (plus one at the mean when the count is odd). Welch's t and Cohen's d depend
 * only on the mean, the SD and the count, so the tool's own tTwo() gives the published test back. */
function sample(n, m, s) {
  const out = [];
  if (n % 2 === 0) { const c = s * Math.sqrt((n - 1) / n); for (let i = 0; i < n / 2; i++) { out.push(m + c); out.push(m - c); } }
  else { const k = (n - 1) / 2, c = s * Math.sqrt((n - 1) / (2 * k)); for (let i = 0; i < k; i++) { out.push(m + c); out.push(m - c); } out.push(m); }
  return out;
}

const res = ROWS.map((row) => {
  const [sex, v, f, m1, s1, n1, m2, s2, n2, pd, pp] = row;
  const tok = tTwo(sample(n1, m1, s1), sample(n2, m2, s2), true);
  const [k1, k2] = SPEAKERS[sex];
  const spk = tTwo(sample(k1, m1, s1), sample(k2, m2, s2), true);
  return { sex, v, f, label: `${sex} /${v}/ ${f}`, paperD: pd, paperP: pp, tok, spk };
});

const dSvg = chart({
  title: "The paper's effect sizes, recomputed",
  xLabel: "Cohen's d printed in the paper", yLabel: "Cohen's d from its own means, SDs and counts",
  series: [
    { name: 'Equal', x: [-0.75, 0.95], y: [-0.75, 0.95], kind: 'line', colour: 'var(--muted)', dash: '4 4' },
    { name: 'The 16 comparisons', x: res.map((r) => r.paperD), y: res.map((r) => r.tok.d), kind: 'dots', size: 4 },
  ],
  desc: "Recomputed against printed Cohen's d for the 16 vowel-by-formant comparisons. Fourteen sit on the line of equality; two lie far off it.",
  height: 300,
});

const pSvg = chart({
  title: 'Significance depends on what you count',
  xLabel: "Size of the difference, |Cohen's d|", yLabel: 'p-value',
  series: [
    { name: 'Counting tokens', x: res.map((r) => Math.abs(r.tok.d)), y: res.map((r) => Math.log10(Math.max(r.tok.p, 1e-50))), kind: 'dots', size: 4 },
    { name: 'Counting speakers', x: res.map((r) => Math.abs(r.spk.d)), y: res.map((r) => Math.log10(r.spk.p)), kind: 'dots', size: 4 },
  ],
  yDomain: [-50, 0.5], yTicks: [0, -5, -10, -20, -30, -40, -50], yFmt: (v) => (v === 0 ? '1' : `1e${v}`),
  hlines: [{ y: Math.log10(0.05), text: 'p = 0.05' }],
  desc: 'The p-value of each of the 16 comparisons against the size of the difference, once with the thousands of vowel tokens as the sample and once with the 50 speakers. With tokens, almost everything is overwhelmingly significant; with speakers, nothing reaches 0.05.',
  height: 300,
});

// --- The corner vowel space, as the Vowel formant chart draws it: x is minus F2, y is F1 downwards.
const SPACE = {
  'Native women': { i: [405, 2478], 'æ': [672, 1888], 'ɑ': [690, 1414], u: [412, 1832] },
  'Chinese women': { i: [444, 2385], 'æ': [720, 1896], 'ɑ': [787, 1407], u: [453, 1520] },
  'Native men': { i: [346, 2121], 'æ': [555, 1646], 'ɑ': [609, 1244], u: [369, 1484] },
  'Chinese men': { i: [383, 2051], 'æ': [585, 1698], 'ɑ': [678, 1264], u: [396, 1327] },
};
const ORDER = ['i', 'æ', 'ɑ', 'u'];
const area = (g) => {
  const p = ORDER.map((v) => [g[v][1], g[v][0]]);
  let s = 0; for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; s += x1 * y2 - x2 * y1; }
  return Math.abs(s) / 2;
};
const spaceSeries = Object.entries(SPACE).map(([name, g]) => ({
  name, kind: 'line',
  x: [...ORDER, ORDER[0]].map((v) => -g[v][1]),
  y: [...ORDER, ORDER[0]].map((v) => g[v][0]),
}));
for (const v of ORDER) spaceSeries.push({ x: [-SPACE['Chinese women'][v][1]], y: [SPACE['Chinese women'][v][0]], kind: 'dots', size: 0, noLegend: true, label: { text: `/${v}/`, dx: 0, dy: -8, anchor: 'middle' } });
const spaceSvg = chart({
  title: 'The four corner vowels, in hertz',
  xLabel: 'F2 (Hz), high to low', yLabel: 'F1 (Hz)',
  series: spaceSeries, yReverse: true, xFmt: (v) => String(Math.round(-v)),
  desc: 'The quadrilateral joining the mean positions of /i/, /ae/, /a/ and /u/ for each group. Both learner outlines enclose more area than the matching native ones, mostly because their /u/ is much further back.',
  height: 320,
});

let md = readFileSync(ART, 'utf8');
md = inject(md, 'd', figure(dSvg, 'Figure 1. Each of the 16 published Cohen’s d values against the value the Hypothesis tests maths gives from the paper’s own means, standard deviations and token counts. Fourteen agree to better than 0.01; the two outliers are the female /æ/ F1 and the male /u/ F1 cells.'));
md = inject(md, 'p', figure(pSvg, 'Figure 2. The same 16 comparisons, with the p-value plotted against the size of the difference. Counting vowel tokens (thousands per group) makes almost every difference overwhelmingly significant; counting the 50 speakers leaves none below 0.05.'));
md = inject(md, 'space', figure(spaceSvg, 'Figure 3. The corner vowel quadrilaterals as the Vowel formant chart plots them, from the paper’s mean F1 and F2. Labels mark the Chinese women’s positions.'));
writeFileSync(ART, md);

console.log('label | paper d | our d | our g | t | df | p(tokens) | paper p | t(spk) | p(spk)');
for (const r of res) console.log(`${r.label} | ${r.paperD} | ${r3(r.tok.d)} | ${r3(r.tok.g)} | ${r2(r.tok.t)} | ${Math.round(r.tok.df)} | ${r.tok.p.toExponential(2)} | ${r.paperP} | ${r2(r.spk.t)} | ${r3(r.spk.p)}`);
const off = res.filter((r) => Math.abs(r.tok.d - r.paperD) > 0.01);
console.log('d mismatches:', off.map((r) => `${r.label} printed ${r.paperD} vs ${r3(r.tok.d)}`).join('; '));
console.log('biggest agreement gap among the rest:', r3(Math.max(...res.filter((r) => !off.includes(r)).map((r) => Math.abs(r.tok.d - r.paperD)))));
console.log('printed p = 0.000 but our p > 0.05:', res.filter((r) => r.paperP === 0 && r.tok.p > 0.05).map((r) => `${r.label} p ${r3(r.tok.p)}`).join('; '));
console.log('speaker-level smallest p:', r3(Math.min(...res.map((r) => r.spk.p))), 'for', res.reduce((a, b) => (a.spk.p < b.spk.p ? a : b)).label);
console.log('tokens: comparisons with p < 1e-5:', res.filter((r) => r.tok.p < 1e-5).length, 'of', res.length);
for (const k of Object.keys(SPACE)) console.log(k, 'area', Math.round(area(SPACE[k])), 'Hz^2, F1 range', SPACE[k]['ɑ'][0] - SPACE[k].i[0], ', i-u F2 gap', SPACE[k].i[1] - SPACE[k].u[1]);
console.log('area ratio women', r3(area(SPACE['Chinese women']) / area(SPACE['Native women'])), 'men', r3(area(SPACE['Chinese men']) / area(SPACE['Native men'])));
console.log('F1 higher for learners in all 8 cells:', ROWS.filter((r) => r[2] === 'F1').every((r) => r[6] > r[3]));
