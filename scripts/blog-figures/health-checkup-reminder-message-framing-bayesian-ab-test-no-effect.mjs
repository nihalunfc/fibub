// Figures for src/blog/discoveries/health-checkup-reminder-message-framing-bayesian-ab-test-no-effect.md, made with the
// maths of the Bayesian A/B test (src/lib/sci/bayes.ts: abTest, betaPdf) and the Hypothesis tests chi-square
// (src/lib/sci/hyptest.ts: chiIndep).
// Run: node scripts/blog-figures/health-checkup-reminder-message-framing-bayesian-ab-test-no-effect.mjs
import fs from 'node:fs';
import { abTest, betaPdf } from '../../src/lib/sci/bayes.ts';
import { chiIndep } from '../../src/lib/sci/hyptest.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/health-checkup-reminder-message-framing-bayesian-ab-test-no-effect.md', import.meta.url);

// Inputs from the paper: Maltz et al. (2024), JMIR Public Health and Surveillance 10: e45379, doi:10.2196/45379 (CC BY).
// Table 2 gives, for each message framing, the number of members counted (n) and the share who went on to do the
// check-up after opening the message (%, one decimal). We rebuild the counts as round(n x %) (OUR reconstruction).
const ARMS = ['Control', 'Gains', 'Losses', 'Recommendation', 'Implementation intentions', 'Empowerment'];
const SHORT = ['Control', 'Gains', 'Losses', 'Recommend', 'Plan', 'Empower'];
const SCREEN = [[5075, 14.1], [4416, 13.9], [3122, 12.9], [4890, 13.1], [4854, 14.1], [3153, 14.1]];
const LAB = [[9581, 23.6], [8687, 23.3], [6027, 23.5], [9357, 24.0], [9015, 23.4], [6133, 23.8]];
const counts = (rows) => rows.map(([n, p]) => ({ n, k: Math.round((n * p) / 100) }));
const S = counts(SCREEN), L = counts(LAB);

const vsControl = (rows) => rows.slice(1).map((b, i) => {
  const r = abTest(rows[0].k, rows[0].n, b.k, b.n);
  return { arm: ARMS[i + 1], k: b.k, n: b.n, pB: +r.pB.toFixed(4), diff: +(r.diffMean * 100).toFixed(2), lo: +(r.diffCi[0] * 100).toFixed(2), hi: +(r.diffCi[1] * 100).toFixed(2), lossB: +(r.lossB * 100).toFixed(3), lift: +(r.liftMedian * 100).toFixed(1) };
});
const sv = vsControl(S), lv = vsControl(L);
const chi = (rows) => { const c = chiIndep(rows.map(({ n, k }) => [k, n - k]), false); return { chi2: +c.chi2.toFixed(2), V: +c.V.toFixed(4), df: c.df, p: +c.p.toFixed(3) }; };
const chiS = chi(S), chiL = chi(L);

// Figure 1: difference from control with 95 % credible intervals (percentage points).
const X = [1, 2, 3, 4, 5];
const fig1 = chart({
  title: 'Each framing minus the neutral message', xLabel: 'Message framing', yLabel: 'Difference (percentage points)',
  series: [
    { name: 'Screening tests', kind: 'dots', x: X.map((x) => x - 0.12), y: sv.map((r) => r.diff), errors: sv.map((r) => (r.hi - r.lo) / 2), size: 3.5 },
    { name: 'Lab tests', kind: 'dots', x: X.map((x) => x + 0.12), y: lv.map((r) => r.diff), errors: lv.map((r) => (r.hi - r.lo) / 2), size: 3.5 },
  ],
  xDomain: [0.5, 5.5], yDomain: [-3, 2], xTicks: X, xFmt: (t) => SHORT[t] ?? '', hlines: [{ y: 0, text: '' }],
  desc: `Posterior mean difference from the neutral message, with 95 % credible intervals, for five framings. Every interval crosses zero; the widest effect, recommendation on screening tests, is ${sv[2].diff} points (${sv[2].lo} to ${sv[2].hi}).`, height: 280,
});
// Figure 2: posteriors for screening, control against recommendation and implementation intentions.
const ps = Array.from({ length: 161 }, (_, i) => 0.11 + i * 0.0003);
const post = (r) => ps.map((p) => +betaPdf(p, 1 + r.k, 1 + r.n - r.k).toFixed(2));
const fig2 = chart({
  title: 'Screening tests: where the true rate could be', xLabel: 'Share who did the screening test (%)', yLabel: 'Posterior density',
  series: [{ name: 'Neutral', kind: 'line', x: ps.map((p) => +(p * 100).toFixed(2)), y: post(S[0]) }, { name: 'Recommendation', kind: 'line', x: ps.map((p) => +(p * 100).toFixed(2)), y: post(S[3]) }, { name: 'Losses', kind: 'line', x: ps.map((p) => +(p * 100).toFixed(2)), y: post(S[2]), dash: '5 4' }],
  xDomain: [11, 15.8], yFmt: (t) => String(t),
  desc: 'Posterior distributions (flat prior) of the screening rate after the neutral, recommendation and loss-framed messages. The curves overlap heavily.', height: 260,
});

console.log(JSON.stringify({ S, L, screening: sv, lab: lv, chiS, chiL }, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'diff', figure(fig1, 'Figure 1. Difference between each framed message and the neutral one, with 95 % credible intervals from the Bayesian A/B test\'s maths (flat priors). Counts rebuilt from the paper\'s rates and group sizes; a recomputation, not the paper\'s own figure.'));
  md = inject(md, 'post', figure(fig2, 'Figure 2. Posterior distributions of the true screening rate for three messages. Where the curves overlap, the data cannot tell the messages apart.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
