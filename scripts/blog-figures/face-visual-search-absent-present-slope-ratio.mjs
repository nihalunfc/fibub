// Figures and numbers for src/blog/discoveries/face-visual-search-absent-present-slope-ratio.md, made with the
// maths of the Memory tasks tool (src/lib/sci/cogtasks.ts: line() and searchSummary()).
// Run: node scripts/blog-figures/face-visual-search-absent-present-slope-ratio.mjs
import fs from 'node:fs';
import { line, searchSummary } from '../../src/lib/sci/cogtasks.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/face-visual-search-absent-present-slope-ratio.md', import.meta.url);

// Printed values from Kaur, Hooge and Albonico (2025), Vision 9(4): 88, doi:10.3390/vision9040088 (CC BY 4.0).
// Four within-subject tests, 54 trials each (36 "different" = target present, 18 "same" = target absent),
// set sizes 2, 4 and 6, 87 participants analysed. "same"/"different" set-size effects with their SDs are the
// paper's Table 2; accuracy, d', mean RT and the overall set-size effect are in its text.
const N = 87, SIZES = [2, 4, 6], PRESENT_TRIALS = 36, ABSENT_TRIALS = 18;
const T = [
  { test: 'Ethnicity', acc: 0.77, d: 1.67, rt: 2369, eff: 169, effSe: 12, absent: 199, absentSd: 178, present: 147, presentSd: 145, printed: 1.35, z15: -1.95, p15: 0.051 },
  { test: 'Expression', acc: 0.76, d: 1.83, rt: 2692, eff: 266, effSe: 14, absent: 333, absentSd: 219, present: 230, presentSd: 147, printed: 1.45, z15: -0.67, p15: 0.501 },
  { test: 'Gender', acc: 0.88, d: 2.55, rt: 2636, eff: 271, effSe: 10, absent: 363, absentSd: 156, present: 221, presentSd: 106, printed: 1.64, z15: 1.72, p15: 0.085 },
  { test: 'Identity', acc: 0.73, d: 1.43, rt: 3311, eff: 334, effSe: 20, absent: 400, absentSd: 318, present: 315, presentSd: 229, printed: 1.27, z15: -3.16, p15: 0.001 },
];

const R = T.map((t) => {
  const seA = t.absentSd / Math.sqrt(N), seP = t.presentSd / Math.sqrt(N);
  const ratio = t.absent / t.present;
  const relSe = Math.hypot(seA / t.absent, seP / t.present);        // delta method on a ratio of two means
  const se = ratio * relSe;
  // The pooled set-size effect should be the trial-weighted mix of the two: 18 absent to 36 present.
  const mix = (ABSENT_TRIALS * t.absent + PRESENT_TRIALS * t.present) / (ABSENT_TRIALS + PRESENT_TRIALS);
  const wImplied = (t.eff - t.present) / (t.absent - t.present);     // the absent weight the printed numbers imply
  // Serial self-terminating search: a present trial inspects (n+1)/2 items, an absent trial all n, so the
  // absent slope should be twice the present one. OUR model, to read the observed ratio as a quitting point.
  const quit = t.absent / (2 * t.present);
  return { ...t, seA, seP, ratio, se, lo: ratio - 1.96 * se, hi: ratio + 1.96 * se, mix, wImplied, quit, rtAt: SIZES.map((n) => t.rt + t.eff * (n - 4)) };
});
const meanW = R.reduce((s, r) => s + r.wImplied, 0) / R.length;

// ---- One person's session: how precise is a 54-trial estimate? seSlope from the tool's own line().
const SIG = 600; // ms of trial-to-trial scatter around the line (OUR assumption, typical for 2-3 s searches)
const sxx = (per) => per * SIZES.reduce((s, n) => s + (n - 4) ** 2, 0);
const sePresent = SIG / Math.sqrt(sxx(PRESENT_TRIALS / SIZES.length)), seAbsent = SIG / Math.sqrt(sxx(ABSENT_TRIALS / SIZES.length));

// ---- Simulate one observer under the serial model and let searchSummary read the slopes back.
// splitmix32: a small, well-behaved generator, so the same seed always gives the same session.
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x9e3779b9) >>> 0; let z = s; z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0; z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0; return ((z ^ (z >>> 16)) >>> 0) / 4294967296; };
}
function simulate(t, quit, seed, sigma = SIG, accuracy = 1) {
  const r = rng(seed), gauss = () => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
  // One item takes `insp` ms to check. A present trial checks a random 1..n of them (so its slope is insp/2);
  // an absent trial checks `quit` of all n (so its slope is insp*quit). `base` is set so the pooled mean RT at
  // four faces is the paper's mean RT for that test.
  const insp = 2 * t.present;
  const base = t.rt - (2 / 3) * t.present * (5 + 4 * quit), trials = [];
  for (const n of SIZES) {
    for (let i = 0; i < PRESENT_TRIALS / SIZES.length; i++) trials.push({ setSize: n, present: true, correct: r() < accuracy, rt: base + insp * (Math.floor(r() * n) + 1) + sigma * gauss() });
    for (let i = 0; i < ABSENT_TRIALS / SIZES.length; i++) trials.push({ setSize: n, present: false, correct: r() < accuracy, rt: base + insp * quit * n + sigma * gauss() });
  }
  return searchSummary(trials, 150, 20000);
}
const SIM = R.map((t, i) => {
  const s = simulate(t, t.quit, 7 + i);
  return { test: t.test, present: s.present.slope, presentSe: s.present.seSlope, absent: s.absent.slope, absentSe: s.absent.seSlope, ratio: s.ratio, n: [s.present.n, s.absent.n] };
});
// 200 simulated observers of the identity test: unbiased on average, hopeless one person at a time.
const RUNS = Array.from({ length: 200 }, (_, k) => simulate(R[3], R[3].quit, 1000 + k));
const avg = (f) => RUNS.reduce((s, x) => s + f(x), 0) / RUNS.length;
const POOL = { present: avg((x) => x.present.slope), absent: avg((x) => x.absent.slope), meanRatio: avg((x) => x.ratio) };
const MANY = RUNS.map((x) => x.ratio).filter(Number.isFinite).sort((a, b) => a - b);

// ---- Figure 1: the paper's four RT-by-set-size lines, rebuilt from its mean RT and set-size effect.
const fig1 = chart({
  title: 'Search time against set size, rebuilt from two numbers',
  xLabel: 'Faces on the screen', yLabel: 'Mean reaction time (ms)',
  series: R.map((t) => ({ name: t.test, kind: 'line', x: SIZES, y: t.rtAt.map((v) => Math.round(v)) })),
  xDomain: [1.6, 6.4], yDomain: [1800, 4200], xTicks: SIZES,
  desc: 'Four straight lines of mean reaction time against set size, rebuilt from each test’s mean RT and set-size effect. Identity is both the slowest and the steepest; ethnicity is the flattest.',
  height: 270,
});

// ---- Figure 2: absent slope against present slope, with the serial prediction.
const xx = [100, 420];
const fig2 = chart({
  title: 'Absent against present slopes, and the serial prediction',
  xLabel: 'Target-present slope (ms per face)', yLabel: 'Target-absent slope (ms per face)',
  series: [
    { name: 'Serial search: twice', kind: 'line', x: xx, y: xx.map((v) => 2 * v), colour: 'var(--muted)', dash: '5 4' },
    { name: 'Equal slopes', kind: 'line', x: xx, y: xx, colour: 'var(--line)' },
    { name: 'The four tests', kind: 'dots', x: R.map((t) => t.present), y: R.map((t) => t.absent), errors: R.map((t) => +(1.96 * t.seA).toFixed(0)), size: 4.5, colour: 'var(--c-blog)' },
  ],
  xDomain: [100, 420], yDomain: [100, 850],
  desc: 'The four tests’ target-absent set-size effects against their target-present ones, with 95 per cent bars from the published standard deviations. All four sit well below the dashed line of twice the present slope that a strictly serial search predicts.',
  height: 280,
});

const f = (x, n = 3) => +x.toFixed(n);
console.log(JSON.stringify(R.map((t) => ({
  test: t.test, ratioPrinted: t.printed, ratioRecomputed: f(t.absent / t.present, 4),
  seRatio: f(t.se, 3), ci: [f(t.lo, 3), f(t.hi, 3)], excludes2: t.hi < 2, excludes15: t.hi < 1.5,
  paperZvs15: t.z15, paperPvs15: t.p15,
  pooledEffectPaper: t.eff, mix18to36: f(t.mix, 1), impliedAbsentWeight: f(t.wImplied, 3),
  quitFraction: f(t.quit, 3), rtAt2_4_6: t.rtAt.map((v) => Math.round(v)),
})), null, 1));
console.log('mean implied absent weight', f(meanW, 4), 'design weight', f(ABSENT_TRIALS / (ABSENT_TRIALS + PRESENT_TRIALS), 4));
console.log('one 54-trial session, SE of the slope: present', f(sePresent, 1), 'absent', f(seAbsent, 1), 'ms per face (scatter', SIG, 'ms)');
console.log('simulated observers', JSON.stringify(SIM.map((s) => ({ test: s.test, present: f(s.present, 1), presentSe: f(s.presentSe, 1), absent: f(s.absent, 1), absentSe: f(s.absentSe, 1), ratio: f(s.ratio, 3), trials: s.n }))));
console.log('200 identity observers, mean of the fitted slopes: present', f(POOL.present, 1), '(model', R[3].present, ') absent', f(POOL.absent, 1), '(model', R[3].absent, ') mean ratio', f(POOL.meanRatio, 3));
console.log('200 identity observers: ratio median', f(MANY[99], 2), 'middle 95 %', [f(MANY[4], 2), f(MANY[194], 2)], 'negative slopes', MANY.filter((v) => v < 0).length);

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'lines', figure(fig1, 'Figure 1. Each test’s mean reaction time against set size, rebuilt from the two numbers the paper prints for it: the mean RT (which, with equal trials at each set size, is the time at four faces) and the set-size effect in milliseconds per face. The lines are ours; the paper plots its own measured points in its Figure 4.'));
  md = inject(md, 'slopes', figure(fig2, 'Figure 2. The target-absent set-size effect against the target-present one for the four tests, with 95 per cent bars worked out from the published standard deviations and 87 participants. A strictly serial, self-terminating search would put every point on the dashed line; all four lie far below it.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
