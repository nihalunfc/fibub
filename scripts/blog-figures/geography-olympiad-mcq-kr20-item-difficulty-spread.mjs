// Figures for src/blog/discoveries/geography-olympiad-mcq-kr20-item-difficulty-spread.md, made with the maths of
// the Item analysis tool (src/lib/sci/itemanalysis.ts: KR-20, item difficulty, the 27 % upper-lower index).
// Run: node scripts/blog-figures/geography-olympiad-mcq-kr20-item-difficulty-spread.mjs
import fs from 'node:fs';
import { analyse, kr20 } from '../../src/lib/sci/itemanalysis.ts';
import { normCdf, normInv } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/geography-olympiad-mcq-kr20-item-difficulty-spread.md', import.meta.url);

// Numbers from the paper: Logayah, Ruhimat, Arrasyid and Islamy (2024), Cogent Social Sciences 10(1): 2354971 (CC BY).
const K = 100, N = 259, MEAN = 33.85, SD = 9.85, KR = 0.82, PBAR = MEAN / K;

// Step 1. KR-20 = (k / (k - 1)) (1 - Σ p q / s²). With k, the mean score and the score SD fixed, KR-20 depends
// only on the SPREAD of the item difficulties, because Σ p q = Σ p - Σ p² = k p̄ - k (p̄² + var p).
const krFromSpread = (sdP, s = SD, pbar = PBAR, k = K) => {
  const sumPQ = k * pbar - k * (pbar * pbar + sdP * sdP);
  return (k / (k - 1)) * (1 - sumPQ / (s * s));
};
// The spread that reproduces the paper's 0.82 (bisection).
const spreadFor = (kr, s = SD) => { let lo = 0, hi = 0.47; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; krFromSpread(m, s) < kr ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const SPREAD = spreadFor(KR);

// Step 2. Simulate one 259 × 100 answer sheet with that difficulty spread, then run the tool's own analysis on it.
// Normal-ogive model: a student of ability θ answers item i right with probability Φ(a θ - b_i); θ ~ N(0, 1).
// b_i is set so the item difficulties p_i = Φ(-b_i / √(1 + a²)) have mean p̄ and SD = SPREAD. `a` is tuned so the
// total-score SD comes out at the paper's 9.85. Everything else (KR-20, discrimination) then follows.
let seed = 2354971;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const PHI = normCdf, probit = normInv;
// Item difficulties: evenly spaced quantiles of a beta-like spread, rescaled to the exact mean and SD we need.
const base = Array.from({ length: K }, (_, i) => (i + 0.5) / K);
const z0 = base.map((u) => probit(u));
const m0 = z0.reduce((s, x) => s + x, 0) / K, sd0 = Math.sqrt(z0.reduce((s, x) => s + (x - m0) ** 2, 0) / K);
let P = z0.map((z) => Math.min(0.9, Math.max(0.03, PBAR + (SPREAD / sd0) * (z - m0))));
// Clipping at both ends moves the mean, so shift the whole set back until the mean is exactly p̄.
for (let i = 0; i < 200; i++) { const m = P.reduce((s2, x) => s2 + x, 0) / K; P = P.map((x) => Math.min(0.9, Math.max(0.03, x + (PBAR - m) * 0.9))); }
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const sheet = (a) => {
  const b = P.map((p) => -probit(p) * Math.sqrt(1 + a * a));
  const th = Array.from({ length: N }, gauss);
  return th.map((t) => b.map((bi) => (rnd() < PHI(a * t - bi) ? 1 : 0)));
};
const meanD = (r) => r.items.reduce((s2, i) => s2 + i.D, 0) / K;
const tune = (target, read) => { let a = 0.5; for (let it = 0; it < 40; it++) { seed = 2354971; const r = analyse(sheet(a)); a *= 1 + 0.35 * (target - read(r)) / target; } seed = 2354971; return { a, X: sheet(a) }; };
// Sheet A: tuned so the total-score SD is the paper's 9.85. Sheet B: tuned so the mean discrimination index is 0.33.
const A1 = tune(SD, (r) => r.sd), R = analyse(A1.X), a = A1.a;
const A2 = tune(0.33, meanD), R2 = analyse(A2.X);

// Figure 1: KR-20 against the spread of item difficulty, at three score SDs.
const SS = Array.from({ length: 81 }, (_, i) => i * 0.005);
const fig1 = chart({
  title: 'KR-20 is fixed by the spread of item difficulty', xLabel: 'Standard deviation of the 100 item difficulties', yLabel: 'KR-20',
  series: [9.0, SD, 10.7].map((s) => ({ name: `Score SD ${s.toFixed(2)}`, kind: 'line', x: SS, y: SS.map((v) => +krFromSpread(v, s).toFixed(4)), dash: s === SD ? undefined : '4 3' })),
  xDomain: [0, 0.4], yDomain: [0.55, 0.95],
  hlines: [{ y: KR, text: "the paper's 0.82" }], vlines: [{ x: +SPREAD.toFixed(3), text: SPREAD.toFixed(3) }],
  desc: `KR-20 worked out from the paper's 100 items, mean score 33.85 and score SD 9.85, as the spread of item difficulty changes. The paper's 0.82 needs a difficulty standard deviation of ${SPREAD.toFixed(3)}.`,
  height: 280,
});

// Figure 2: the simulated sheet's items, difficulty against the 27 % upper-lower discrimination index, with the
// ceiling that difficulty puts on the index.
const pp = Array.from({ length: 99 }, (_, i) => (i + 1) / 100);
const fig2 = chart({
  title: 'Difficulty and discrimination cannot both be free', xLabel: 'Item difficulty p (share answering right)', yLabel: 'Discrimination index D',
  series: [
    { name: 'Ceiling at 27 % groups', kind: 'line', x: pp, y: pp.map((p) => +Math.min(1, p / 0.27, (1 - p) / 0.27).toFixed(3)), colour: 'var(--muted)', dash: '5 4' },
    { name: 'Simulated items', kind: 'dots', x: R.items.map((it) => +it.p.toFixed(4)), y: R.items.map((it) => +it.D.toFixed(4)), size: 2.6 },
  ],
  xDomain: [0, 1], yDomain: [-0.1, 1.05],
  hlines: [{ y: 0.33, text: "the paper's mean D" }],
  desc: 'For the simulated 259 by 100 answer sheet, each item’s difficulty against its upper-lower discrimination index, with the ceiling that difficulty alone puts on the index when the top and bottom 27 % are compared.',
  height: 280,
});

// A small corner of sheet A for the article's "Check it yourself": 24 students, 12 items spread across the
// difficulty range, printed as rows of 0s and 1s for pasting into the tool.
const COLS = Array.from({ length: 20 }, (_, i) => 4 + i * 5);
const BLOCK = A1.X.slice(0, 40).map((r) => COLS.map((j) => r[j]));
const RB = analyse(BLOCK);
console.log(BLOCK.map((r) => r.join(',')).join('\n'));
console.log('block:', JSON.stringify({ n: RB.n, k: RB.k, mean: +RB.mean.toFixed(3), sd: +RB.sd.toFixed(3), kr20: +RB.kr20.toFixed(3), kr21: +RB.kr21.toFixed(3), sem: +RB.sem.toFixed(3), g: RB.groupSize, p: RB.items.map((i) => +i.p.toFixed(3)), D: RB.items.map((i) => +i.D.toFixed(3)), rpb: RB.items.map((i) => +i.rpb.toFixed(3)), rit: RB.items.map((i) => +i.rit.toFixed(3)) }));

console.log(JSON.stringify({
  spreadNeeded: +SPREAD.toFixed(4), krIfAllEqual: +krFromSpread(0).toFixed(4), krAt025: +krFromSpread(0.25).toFixed(4),
  sumPQ: +(K * PBAR - K * (PBAR * PBAR + SPREAD * SPREAD)).toFixed(3), a: +a.toFixed(4),
  tool: { k: R.k, n: R.n, mean: +R.mean.toFixed(2), sd: +R.sd.toFixed(2), kr20: +R.kr20.toFixed(4), kr21: +R.kr21.toFixed(4), sem: +R.sem.toFixed(3), groupSize: R.groupSize,
    meanP: +(R.items.reduce((s, i) => s + i.p, 0) / K).toFixed(4), sdP: +Math.sqrt(R.items.reduce((s, i) => s + (i.p - R.mean / K) ** 2, 0) / K).toFixed(4),
    meanD: +(R.items.reduce((s, i) => s + i.D, 0) / K).toFixed(4), meanRpb: +(R.items.reduce((s, i) => s + i.rpb, 0) / K).toFixed(4),
    hardest: +Math.min(...R.items.map((i) => i.p)).toFixed(3), easiest: +Math.max(...R.items.map((i) => i.p)).toFixed(3) },
  sheetB: { a: +A2.a.toFixed(4), sd: +R2.sd.toFixed(2), kr20: +R2.kr20.toFixed(4), meanD: +meanD(R2).toFixed(4), meanP: +(R2.items.reduce((s2, i) => s2 + i.p, 0) / K).toFixed(4), meanRpb: +(R2.items.reduce((s2, i) => s2 + i.rpb, 0) / K).toFixed(4) },
  firstTen: R.items.slice(0, 10).map((i) => ({ p: +i.p.toFixed(3), D: +i.D.toFixed(3), rpb: +i.rpb.toFixed(3) })),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'kr', figure(fig1, 'Figure 1. KR-20 for a 100-item test with the paper’s mean score and score spread, as a function of how widely the item difficulties are spread. Made with the Item analysis tool’s KR-20 formula. The dashed lines cross where the paper’s reliability of 0.82 sits.'));
  md = inject(md, 'pd', figure(fig2, 'Figure 2. One simulated 259-student, 100-item answer sheet built to the difficulty spread Figure 1 requires, analysed with the Item analysis tool. The grey line is the largest discrimination index an item of that difficulty can reach when the top and bottom 27 % are compared.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
