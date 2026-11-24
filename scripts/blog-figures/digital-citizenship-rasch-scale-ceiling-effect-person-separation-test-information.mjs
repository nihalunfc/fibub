// Figures for src/blog/discoveries/digital-citizenship-rasch-scale-ceiling-effect-person-separation-test-information.md
// All maths from src/lib/sci/irt.ts, the engine behind the IRT item analysis tool (#T494).
// Inputs: the 13 item measures in logits, the person mean and SD, and the separation and reliability
// indices reported by Prasetiyo et al. (2026), Front. Educ. 11: 1882245 (CC BY 4.0).
import { readFileSync, writeFileSync } from 'node:fs';
import { fitIrt, icc, info } from '../../src/lib/sci/irt.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/digital-citizenship-rasch-scale-ceiling-effect-person-separation-test-information.md', import.meta.url);

// The paper's 13 item measures (logits), hardest first, and its person statistics.
const ITEMS = [
  ['CE4', 1.86], ['IDC3', 1.03], ['DE1', 0.66], ['IDC4', 0.55], ['IDC1', 0.36], ['CE3', 0.24], ['DE2', -0.11],
  ['DI3', -0.55], ['IDC2', -0.57], ['CE1', -0.64], ['CE2', -0.76], ['DI1', -0.86], ['DI2', -1.20],
];
const B = ITEMS.map(([, b]) => b);
const PERSON_MEAN = 2.69, PERSON_SD = 1.45, N = 243;
const r2 = (v) => Math.round(v * 100) / 100, r3 = (v) => Math.round(v * 1000) / 1000;

// Test information of the whole set at an ability theta: the tool's info() summed over items (Rasch, a = 1).
const testInfo = (t) => B.reduce((s, b) => s + info({ a: 1, b }, t), 0);
const se = (t) => 1 / Math.sqrt(testInfo(t));

const grid = Array.from({ length: 161 }, (_, i) => -4 + i * 0.05);

const infoSvg = chart({
  title: 'Where the 13 items measure, and where the people are',
  xLabel: 'Ability (logits)', yLabel: 'Test information',
  series: [{ name: 'Test information', x: grid, y: grid.map(testInfo), kind: 'line' }],
  bands: [{ x0: PERSON_MEAN - PERSON_SD, x1: PERSON_MEAN + PERSON_SD, text: 'most people' }],
  vlines: [{ x: 0, text: 'item mean 0', left: true }, { x: PERSON_MEAN, text: 'person mean 2.69' }],
  desc: 'Test information against ability for the 13 item measures the paper reports. It peaks near 0 logits and has fallen to a third of its peak where most of the 243 people sit, between 1.24 and 4.14 logits.',
  height: 290,
});

const seSvg = chart({
  title: 'What that costs in precision',
  xLabel: 'Ability (logits)', yLabel: 'Standard error of a score (logits)',
  series: [
    { name: 'As 13 right/wrong items', x: grid, y: grid.map(se), kind: 'line' },
    { name: 'With four steps per item', x: grid, y: grid.map((t) => se(t) / 2), kind: 'line', dash: '5 4' },
  ],
  yDomain: [0, 2.2],
  vlines: [{ x: 0, text: 'item mean', left: true }, { x: PERSON_MEAN, text: 'person mean' }],
  desc: 'The standard error of one person score, one over the square root of the test information, against ability. At the person mean of 2.69 logits it is 1.7 times its value at the item mean.',
  height: 290,
});

// --- Simulation: 243 people answering 13 right/wrong items at the paper's difficulties, once with the
// paper's own person distribution and once with a well-targeted one. Fitted with the tool's 1PL (Rasch).
const rng = (seed) => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
const normal = (r) => { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
function run(mean, seed) {
  const r = rng(seed), U = [];
  for (let i = 0; i < N; i++) { const t = mean + PERSON_SD * normal(r); U.push(B.map((b) => (r() < icc({ a: 1, b }, t) ? 1 : 0))); }
  const f = fitIrt(U, '1pl');
  // The 1PL puts ability on a scale with SD 1, so the common slope carries the real spread: multiply the
  // fitted difficulties by it and take out the mean shift to compare with the paper's logits.
  const a = f.items[0].a, back = f.items.map((it) => it.b * a);
  const off = back.reduce((s, x, i) => s + (x - B[i]), 0) / B.length;
  const rec = back.map((x) => x - off);
  const rmse = Math.sqrt(f.thetaSE.reduce((s, x) => s + x * x, 0) / N);
  const mTh = f.theta.reduce((s, x) => s + x, 0) / N;
  const varObs = f.theta.reduce((s, x) => s + (x - mTh) ** 2, 0) / (N - 1);
  const rel = 1 - (rmse * rmse) / varObs;
  return {
    a, rec, worst: Math.max(...rec.map((x, i) => Math.abs(x - B[i]))), rmse, rel, sep: Math.sqrt(rel / (1 - rel)),
    perfect: U.filter((row) => row.every((v) => v === 1)).length, seMin: Math.min(...f.thetaSE), seMax: Math.max(...f.thetaSE),
  };
}
const onTarget = run(0, 7), asPaper = run(PERSON_MEAN, 7);

const recSvg = chart({
  title: 'Can the tool recover the published item measures?',
  xLabel: 'Item measure in the paper (logits)', yLabel: 'Recovered by the tool (logits)',
  series: [
    { name: 'Equal', x: [-1.4, 2.1], y: [-1.4, 2.1], kind: 'line', colour: 'var(--muted)', dash: '4 4' },
    { name: 'People on target', x: B, y: onTarget.rec, kind: 'dots', size: 4 },
    { name: "People at the paper's 2.69", x: B, y: asPaper.rec, kind: 'dots', size: 4 },
  ],
  desc: 'Recovered against published item measures for both simulated samples. Every point lies within 0.37 logits of the dashed line of equality.',
  height: 300,
});

let md = readFileSync(ART, 'utf8');
md = inject(md, 'info', figure(infoSvg, 'Figure 1. Test information against ability, worked out with the IRT item analysis tool’s own information function at the 13 item measures the paper publishes. The shaded strip is one standard deviation either side of the reported person mean. Almost nobody sits where the items measure best.'));
md = inject(md, 'se', figure(seSvg, 'Figure 2. The standard error of a single person’s score, one over the square root of the information in Figure 1. The dashed line halves it, a rough allowance for the four steps inside each five-point item. At the person mean the error is 1.7 times its value at the item mean.'));
md = inject(md, 'rec', figure(recSvg, 'Figure 3. Simulated check: 243 people answering 13 right/wrong items placed at the paper’s difficulties, fitted with the tool’s Rasch model, once with abilities centred on the items and once centred where the paper’s sample sits. Simulated data, not the paper’s answers.'));
writeFileSync(ART, md);

const mB = B.reduce((s, x) => s + x, 0) / B.length;
console.log('item mean', r3(mB), 'item SD (population)', r3(Math.sqrt(B.reduce((s, x) => s + (x - mB) ** 2, 0) / B.length)), 'item SD (n-1)', r3(Math.sqrt(B.reduce((s, x) => s + (x - mB) ** 2, 0) / (B.length - 1))));
console.log('person mean in item SDs:', r2(PERSON_MEAN / 0.84));
console.log('separation 1.94 implies reliability', r3(1.94 ** 2 / (1 + 1.94 ** 2)), '| reliability 0.79 implies separation', r3(Math.sqrt(0.79 / 0.21)));
for (const t of [0, 1.86, PERSON_MEAN, PERSON_MEAN + PERSON_SD]) console.log(`theta ${t}: information ${r3(testInfo(t))}, SE ${r3(se(t))}, SE with four steps ${r3(se(t) / 2)}`);
console.log('information at person mean as a share of the peak:', r3(testInfo(PERSON_MEAN) / testInfo(0)));
for (const [tag, s] of [['on target', onTarget], ['as paper', asPaper]]) {
  console.log(tag, 'slope', r3(s.a), 'worst recovery error', r3(s.worst), 'RMSE', r3(s.rmse), 'reliability', r3(s.rel), 'separation', r3(s.sep), 'perfect scores', s.perfect, `SE ${r3(s.seMin)} to ${r3(s.seMax)}`);
}
console.log('recovered (as paper):', asPaper.rec.map(r2).join(' '));
