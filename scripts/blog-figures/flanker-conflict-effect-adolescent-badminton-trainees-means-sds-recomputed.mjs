// Figures and numbers for src/blog/discoveries/flanker-conflict-effect-adolescent-badminton-trainees-means-sds-recomputed.md,
// made with the maths of the Reaction time experiments tool (src/lib/sci/rtexp.ts) and the Effect size converter
// (src/lib/sci/effectsize.ts).
// Run: node scripts/blog-figures/flanker-conflict-effect-adolescent-badminton-trainees-means-sds-recomputed.mjs
import fs from 'node:fs';
import { makeFlanker, summarise } from '../../src/lib/sci/rtexp.ts';
import { independent, paired } from '../../src/lib/sci/effectsize.ts';
import { normalRng } from '../../src/lib/sci/unitroot.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/flanker-conflict-effect-adolescent-badminton-trainees-means-sds-recomputed.md', import.meta.url);

// Means and SDs printed in Tables 2 to 4 of Hu (2026), Frontiers in Psychology 17: 1881972, doi:10.3389/fpsyg.2026.1881972
// (CC BY 4.0). Training group n = 32, control group n = 30; 50 congruent and 50 incongruent trials each.
const T = { n: 32, cong: [421.50, 48.30], inc: [478.20, 56.69], eff: [56.70, 22.43], errC: [2.38, 1.64], errI: [5.88, 3.22], errE: [3.50, 2.67] };
const C = { n: 30, cong: [448.30, 51.20], inc: [542.60, 63.81], eff: [94.29, 30.06], errC: [3.11, 2.18], errI: [9.70, 4.30], errE: [6.59, 3.90] };
const cmp = (k) => independent({ m1: T[k][0], s1: T[k][1], n1: T.n, m2: C[k][0], s2: C[k][1], n2: C.n });
const rows = [['Congruent RT', 'cong', -2.12, -0.54], ['Incongruent RT', 'inc', -4.21, -1.07], ['RT conflict effect', 'eff', -5.61, -1.42], ['Congruent errors', 'errC', -1.49, -0.38], ['Incongruent errors', 'errI', -3.93, -1.01], ['Error conflict effect', 'errE', -3.62, -0.93]];
console.log('measure | paper t, d | tool t (pooled), d, p');
for (const [name, k, pt, pd] of rows) { const r = cmp(k); console.log(name, '|', pt, pd, '|', r.t.toFixed(2), r.d.toFixed(2), r.p.toExponential(2), 'df', r.df); }
console.log('effect from means: trainees', (T.inc[0] - T.cong[0]).toFixed(2), 'controls', (C.inc[0] - C.cong[0]).toFixed(2));
// Implied correlation between congruent and incongruent RT across people (from the SD of their difference).
const pT = paired({ m1: T.cong[0], s1: T.cong[1], m2: T.inc[0], s2: T.inc[1], n: T.n, sdiff: T.eff[1] });
const pC = paired({ m1: C.cong[0], s1: C.cong[1], m2: C.inc[0], s2: C.inc[1], n: C.n, sdiff: C.eff[1] });
console.log('implied r: trainees', pT.r.toFixed(3), 'controls', pC.r.toFixed(3), '| paired t', pT.t.toFixed(2), pC.t.toFixed(2), '| dz', pT.dz.toFixed(2), pC.dz.toFixed(2));
console.log('excluded trials: 71 of 6200 =', (71 / 6200 * 100).toFixed(2), '%; trials per person: 100 x 62 =', 100 * 62);

// ---- How noisy is one person's conflict effect from 100 trials? (simulation with the tool's trial lists and summary)
// OUR ASSUMPTIONS: every trial RT is normal around the group's mean for that condition with a trial-to-trial SD of
// sigma (the paper does not print it), all answers correct, no trimming needed.
let seed = 12345;
const uni = () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return (((t ^ (t >>> 14)) >>> 0) + 0.5) / 4294967296; };
const nor = normalRng(7);
function oneRun(muC, muI, sigma) {
  const trials = makeFlanker(100, 0.5, uni).map((s, i) => ({ ...s, task: 'flanker', trial: i + 1, response: s.answer, correct: true, rt: Math.max(150, (s.condition === 'congruent' ? muC : muI) + sigma * nor()) }));
  return summarise(trials).effect.rt;
}
const SIG = [40, 60, 80, 100, 120];
const sim = SIG.map((sigma) => {
  const e = Array.from({ length: 3000 }, () => oneRun(T.cong[0], T.inc[0], sigma));
  const m = e.reduce((a, b) => a + b, 0) / e.length, sd = Math.sqrt(e.reduce((a, b) => a + (b - m) ** 2, 0) / (e.length - 1));
  return { sigma, m, sd, formula: sigma * Math.sqrt(2 / 50) };
});
console.log('sigma | mean effect | simulated SD of one person\'s effect | formula sigma*sqrt(2/50)');
for (const s of sim) console.log(s.sigma, s.m.toFixed(1), s.sd.toFixed(2), s.formula.toFixed(2));
const rel = (sd, sigma) => 1 - (sigma * Math.sqrt(2 / 50)) ** 2 / sd ** 2;
const SG = Array.from({ length: 13 }, (_, i) => 30 + i * 10);
const SGt = SG.filter((s) => rel(T.eff[1], s) >= 0), SGc = SG.filter((s) => rel(C.eff[1], s) >= 0);
console.log('reliability of the conflict effect, sigma 60/80/100/120: trainees', [60, 80, 100, 120].map((s) => rel(T.eff[1], s).toFixed(2)).join(' '), 'controls', [60, 80, 100, 120].map((s) => rel(C.eff[1], s).toFixed(2)).join(' '));
const zero = (sd) => sd / Math.sqrt(2 / 50);
console.log('trial SD at which reliability reaches 0: trainees', zero(T.eff[1]).toFixed(1), 'controls', zero(C.eff[1]).toFixed(1));
// Spearman-Brown check: same reliability for a run of half the trials gives
const sb = (r, k) => (k * r) / (1 + (k - 1) * r);
console.log('Spearman-Brown 100 -> 200 trials at r = 0.5:', sb(0.5, 2).toFixed(2), '; trials needed for r = 0.8 from r = 0.5 at 100 trials:', (100 * (0.8 / 0.2) / (0.5 / 0.5)).toFixed(0));

const fig1 = chart({
  title: 'Paper against tool: t values of six group comparisons', xLabel: "Paper's t", yLabel: "Recomputed t (pooled)",
  series: [
    { name: 'equal', x: [-6, -1], y: [-6, -1], kind: 'line', colour: 'var(--muted)', dash: '4 4' },
    { name: 't', x: rows.map((r) => r[2]), y: rows.map((r) => cmp(r[1]).t), kind: 'dots', size: 4.5 },
  ], xDomain: [-6, -1], yDomain: [-6, -1], desc: 'Six points lie close to the diagonal; the paper used Welch\'s test for two of the error comparisons, which explains the small gaps.',
});
const fig2 = chart({
  title: 'How reliable is one person\'s conflict effect?', xLabel: 'Trial-to-trial SD of reaction time (ms), our assumption', yLabel: 'Reliability of the 100-trial conflict effect',
  series: [
    { name: 'Trainees', x: SGt, y: SGt.map((s) => rel(T.eff[1], s)), kind: 'line' },
    { name: 'Controls', x: SGc, y: SGc.map((s) => rel(C.eff[1], s)), kind: 'line' },
  ], xDomain: [30, 150], yDomain: [0, 1], desc: 'Reliability falls from near 1 at a trial SD of 30 ms to zero at about 112 ms for the trainees and 150 ms for the controls.',
});
let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'tcheck', figure(fig1, 'The paper\'s t values for six group comparisons, recomputed from its printed means, SDs and group sizes.'));
md = inject(md, 'rel', figure(fig2, 'What the paper\'s SDs imply: the larger the trial-to-trial noise in one person\'s reaction times, the less of the spread in conflict effects is real.'));
fs.writeFileSync(ART, md);
