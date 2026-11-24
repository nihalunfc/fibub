// Figures and numbers for src/blog/discoveries/tactile-working-memory-staircase-threshold-79-percent.md, made
// with the maths of the Threshold fitter (src/lib/sci/staircase.ts: target, simulateStair, reversalMean, fitPF).
// Run: node scripts/blog-figures/tactile-working-memory-staircase-threshold-79-percent.mjs
import fs from 'node:fs';
import { target, psi, inverse, simulateStair, reversalMean, group, fitPF, bootRaw, joinBoot, bootSummary } from '../../src/lib/sci/staircase.ts';
import { rng } from '../../src/lib/sci/sdt-optim.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/tactile-working-memory-staircase-threshold-79-percent.md', import.meta.url);

// The paper: Yeganeh, Makarov, Unnthorsson and Kristjánsson (2026), Sensors 26(8): 2361,
// doi:10.3390/s26082361 (CC BY 4.0). Its rule: three correct in a row lengthen the sequence by one item,
// one error shortens it by one; each staircase ran to six reversals; threshold = mean level at the reversals.
// Reported thresholds: 3.84 items (SD 0.3) for ordered recall, 4.88 (SD 0.8) for unordered, 10 participants.
// The tool treats a LOWER level as the harder one, so the level here is minus the sequence length.
const RULE = { down: 3, stepDown: 1, stepUp: 1, start: -2, min: -9, max: -1 };
const GAMMA = 0, LAMBDA = 0.02, SLOPES = [0.8, 1.2, 2]; // guess, lapse and slopes are OUR assumptions
const P = target(RULE);

console.log(`check 1: the rule aims at ${(P * 100).toFixed(2)} % correct (paper: "approximately 79 %")`);
console.log(`  two correct in a row would aim at ${(target({ ...RULE, down: 2 }) * 100).toFixed(2)} %, one at ${(target({ ...RULE, down: 1 }) * 100).toFixed(1)} %`);

// Midpoint alpha that puts the 79.4 % point at the wanted span (bisection).
const alphaFor = (span, beta) => { let lo = -14, hi = 0; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; (inverse('logistic', P, m, beta, GAMMA, LAMBDA) < -span ? (lo = m) : (hi = m)); } return (lo + hi) / 2; };
const observer = (span, beta) => { const a = alphaFor(span, beta); return (x) => psi('logistic', x, a, beta, GAMMA, LAMBDA); };

// ---- Check 2: how precise is one six-reversal staircase? ----------------------------------------------
const runOne = (p, rand, revs = 6, drop = 0) => {
  const t = simulateStair(RULE, p, 500, rand, revs + drop);
  return { t, est: -reversalMean(t, drop, revs).mean };
};
console.log('check 2: 3,000 simulated staircases on an observer whose true span is 3.84 items');
const noise = {};
for (const beta of SLOPES) {
  const p = observer(3.84, beta), rand = rng(7), e = [], len = [];
  for (let i = 0; i < 3000; i++) { const r = runOne(p, rand); if (Number.isFinite(r.est)) { e.push(r.est); len.push(r.t.length); } }
  const mu = e.reduce((a, b) => a + b, 0) / e.length, sd = Math.sqrt(e.reduce((a, b) => a + (b - mu) ** 2, 0) / (e.length - 1));
  noise[beta] = { mu, sd, trials: len.reduce((a, b) => a + b, 0) / len.length };
  console.log(`  slope ${beta}: estimate ${mu.toFixed(3)} items (SD ${sd.toFixed(3)}), ${noise[beta].trials.toFixed(1)} trials per staircase`);
}

// ---- Check 3: what a ten-person SD looks like when everyone is identical ------------------------------
const BINS = Array.from({ length: 26 }, (_, i) => 0.05 + i * 0.05);
const dens = {}, tails = {};
for (const beta of SLOPES) {
  const p = observer(3.84, beta), rand = rng(99), sds = [];
  for (let g = 0; g < 2000; g++) {
    const e = []; for (let k = 0; k < 10; k++) e.push(runOne(p, rand, 6, 2).est);
    const m = e.reduce((a, b) => a + b, 0) / 10;
    sds.push(Math.sqrt(e.reduce((a, b) => a + (b - m) ** 2, 0) / 9));
  }
  sds.sort((a, b) => a - b);
  const qn = (q) => sds[Math.floor(q * (sds.length - 1))];
  tails[beta] = { med: qn(0.5), lo: qn(0.05), hi: qn(0.95), p03: sds.filter((v) => v <= 0.305).length / sds.length, p08: sds.filter((v) => v >= 0.795).length / sds.length };
  dens[beta] = BINS.map((b) => sds.filter((v) => v > b - 0.025 && v <= b + 0.025).length / sds.length);
  const t = tails[beta];
  console.log(`check 3, slope ${beta}: ten-person SD median ${t.med.toFixed(2)} (5 to 95 %: ${t.lo.toFixed(2)} to ${t.hi.toFixed(2)}); P(SD ≤ 0.3) = ${(t.p03 * 100).toFixed(1)} %, P(SD ≥ 0.8) = ${(t.p08 * 100).toFixed(1)} %`);
}

// ---- Check 4: pooling ten staircases and fitting the curve -------------------------------------------
const pooled = (() => {
  const p = observer(3.84, 1.2), rand = rng(10);
  let all = []; const each = [];
  for (let k = 0; k < 10; k++) { const r = runOne(p, rand, 6, 2); all = all.concat(r.t); each.push(r.est); }
  const d = group(all.map((t) => ({ x: t.x, correct: t.correct })));
  const fit = fitPF(d, 'logistic', GAMMA, LAMBDA);
  const th = -inverse('logistic', P, fit.alpha, fit.beta, GAMMA, LAMBDA);
  const rand2 = rng(1); let raw = { th: [], sl: [], failed: 0 };
  for (let done = 0; done < 500; done += 25) raw = joinBoot(raw, bootRaw(d, fit, P, 25, rand2));
  const bs = bootSummary(raw);
  return { each, th, fit, bs, trials: all.length, levels: d.length };
})();
console.log(`check 4: ten staircases, ${pooled.trials} trials at ${pooled.levels} levels; fitted span ${pooled.th.toFixed(3)} items, slope ${pooled.fit.beta.toFixed(3)}, bootstrap SE ${pooled.bs.se.toFixed(3)}`);

// ---- The run shown in Figure 1 and the values for "Check it yourself" ---------------------------------
const show = runOne(observer(3.84, 1.2), rng(3), 6);
console.log(`figure 1 run: ${show.t.length} trials, reversal mean ${show.est.toFixed(3)} items`);
const ex = (() => {
  const a = -5.05, beta = 1.2;
  const t = simulateStair({ ...RULE, multiplicative: false, halveAt: [] }, (x) => psi('logistic', x, a, beta, GAMMA, LAMBDA), 120, rng(1));
  const d = group(t.map((v) => ({ x: v.x, correct: v.correct })));
  const fit = fitPF(d, 'logistic', 0, 0.02);
  const rand = rng(1); let raw = { th: [], sl: [], failed: 0 };
  for (let done = 0; done < 500; done += 25) raw = joinBoot(raw, bootRaw(d, fit, 0.794, 25, rand));
  return { th: inverse('logistic', 0.794, fit.alpha, fit.beta, 0, 0.02), fit, rm: reversalMean(t, 2, 8).mean, truth: inverse('logistic', 0.794, a, beta, GAMMA, LAMBDA), bs: bootSummary(raw), n: fit.n, levels: d.length };
})();
console.log(`check it yourself (120 trials, seed 1): threshold ${ex.th.toFixed(4)}, alpha ${ex.fit.alpha.toFixed(4)}, beta ${ex.fit.beta.toFixed(4)}, deviance ${ex.fit.deviance.toFixed(4)} on ${ex.fit.df} df, reversal mean ${ex.rm.toFixed(4)}, true level ${ex.truth.toFixed(4)}, bootstrap ${ex.bs.ci.map((v) => v.toFixed(3)).join(' to ')}, SE ${ex.bs.se.toFixed(4)}, levels ${ex.levels}`);

// ---- Figures -----------------------------------------------------------------------------------------
const rev = show.t.filter((t) => t.reversal);
const fig1 = chart({
  title: 'One staircase, the paper\'s rule, six reversals', xLabel: 'Trial', yLabel: 'Sequence length (items)',
  series: [
    { name: 'Level', kind: 'step', x: show.t.map((t) => t.trial), y: show.t.map((t) => -t.x) },
    { name: 'Reversal', kind: 'dots', x: rev.map((t) => t.trial), y: rev.map((t) => -t.x), size: 4 },
  ],
  xDomain: [1, show.t.length], yDomain: [1, 7],
  hlines: [{ y: 3.84, text: 'true span 3.84' }, { y: +show.est.toFixed(2), text: `reversal mean ${show.est.toFixed(2)}` }],
  desc: `A simulated staircase under the paper's rule: three correct answers in a row lengthen the sequence by one item, one error shortens it. It stops at the sixth reversal, after ${show.t.length} trials, and the mean of the reversals is ${show.est.toFixed(2)} items against a true span of 3.84.`,
  height: 290,
});
const fig2 = chart({
  title: 'Ten identical observers still scatter', xLabel: 'Standard deviation across ten observers (items)', yLabel: 'Share of simulated studies',
  series: SLOPES.map((beta) => ({ name: `slope ${beta}`, kind: 'line', x: BINS, y: dens[beta].map((v) => +v.toFixed(4)) })),
  xDomain: [0, 1.3], yDomain: [0, Math.max(...SLOPES.flatMap((b) => dens[b])) * 1.1],
  vlines: [{ x: 0.3, text: 'paper: 0.3' }, { x: 0.8, text: 'paper: 0.8', dy: 14 }],
  desc: 'For ten simulated observers with exactly the same true span, the standard deviation of their six-reversal staircase thresholds, over 2,000 simulated studies, for three assumed psychometric slopes. The paper\'s two reported SDs, 0.3 and 0.8 items, both fall inside this spread.',
  height: 290,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'track', figure(fig1, `Figure 1. A simulated staircase under the paper's rule, with the Threshold fitter's maths. Three correct answers in a row add an item, one error takes one away; it stops at the sixth reversal, here after ${show.t.length} trials. The mean of the six reversals, ${show.est.toFixed(2)} items, is the paper's threshold measure; the true span we gave the observer was 3.84.`));
  md = inject(md, 'spread', figure(fig2, 'Figure 2. The standard deviation of ten six-reversal thresholds when all ten observers are identical (true span 3.84 items), over 2,000 simulated studies, for three assumed psychometric slopes. Both of the paper\'s reported SDs sit inside the range the procedure produces on its own.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
