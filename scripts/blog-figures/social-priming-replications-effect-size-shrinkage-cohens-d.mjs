// Figures for src/blog/discoveries/social-priming-replications-effect-size-shrinkage-cohens-d.md, made with the maths
// of the Effect size converter (src/lib/sci/effsize.ts: convert) and the Sample size tool (src/lib/sci/power.ts:
// powerT, solveN), with the t distribution from src/lib/sci/stats.ts.
// Run: node scripts/blog-figures/social-priming-replications-effect-size-shrinkage-cohens-d.mjs
import fs from 'node:fs';
import { convert } from '../../src/lib/sci/effsize.ts';
import { powerT, solveN } from '../../src/lib/sci/power.ts';
import { tInv, tTwoSided } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/social-priming-replications-effect-size-shrinkage-cohens-d.md', import.meta.url);

// Inputs from the paper: Mac Giolla, Karlsson, Neequaye and Bergquist (2024), Meta-Psychology 8, doi:10.15626/MP.2022.3308
// (CC BY 4.0). 70 replications of 49 originals; originals mean d 0.72, median N 57 (mean 63); replications mean d 0.14,
// median N 126 (mean 434); pooled replication d 0.07 (all), 0.40 (same lab), 0.002 (independent labs).
// Splitting each N into two equal groups is OUR assumption (the paper gives totals, not group sizes).
const split = (N) => [Math.floor(N / 2), Math.ceil(N / 2)];
const row = (res, key) => res.rows.find((r) => r.key === key);
const card = (d, N) => {
  const [n1, n2] = split(N), res = convert({ from: 'd', value: d, n1, n2 });
  const t = d / Math.sqrt(1 / n1 + 1 / n2), df = n1 + n2 - 2;
  const D = row(res, 'd'), R = row(res, 'r'), PS = row(res, 'cl'), G = row(res, 'g');
  return { d, N, n1, n2, ci: D.ci.map((x) => +x.toFixed(2)), g: +G.value.toFixed(3), r: +R.value.toFixed(3), ps: +(PS.value * 100).toFixed(1), t: +t.toFixed(2), p: +tTwoSided(t, df).toFixed(4) };
};
const orig = card(0.72, 57), origMean = card(0.72, 63), rep = card(0.14, 126), same = card(0.40, 126), indep = card(0.002, 126);
// The smallest d that reaches p < .05 with N people in two equal groups: t_crit x sqrt(1/n1 + 1/n2).
const dCrit = (N) => { const [n1, n2] = split(N); return tInv(0.975, n1 + n2 - 2) * Math.sqrt(1 / n1 + 1 / n2); };
// Power of the typical original (N 57, two groups of about 28.5) if the true effect were the pooled replication values.
const pw = (d, N) => +(powerT(N / 2, d, 0.05) * 100).toFixed(1);
const power = { d007: pw(0.07, 57), d040: pw(0.40, 57), d072: pw(0.72, 57) };
const nFor80 = { d040: Math.ceil(solveN((n) => powerT(n, 0.40), 0.8)), d007: Math.ceil(solveN((n) => powerT(n, 0.07), 0.8)), d014: Math.ceil(solveN((n) => powerT(n, 0.14), 0.8)) };

const NS = Array.from({ length: 96 }, (_, i) => 20 + i * 4);
const fig1 = chart({
  title: 'The smallest d that reaches p < .05', xLabel: 'Total sample size N (two equal groups)', yLabel: "Cohen's d",
  series: [
    { name: 'p = .05 line', kind: 'line', x: NS, y: NS.map((N) => +dCrit(N).toFixed(3)), colour: 'var(--muted)' },
    { name: 'Originals (mean d, median N)', kind: 'dots', x: [57], y: [0.72], size: 5, colour: 'var(--c-blog)' },
    { name: 'Replications', kind: 'dots', x: [126], y: [0.14], size: 5, colour: 'var(--c-tools)' },
    { name: '', noLegend: true, kind: 'line', x: [57, 57], y: orig.ci, colour: 'var(--c-blog)' },
    { name: '', noLegend: true, kind: 'line', x: [126, 126], y: rep.ci, colour: 'var(--c-tools)' },
  ],
  xDomain: [20, 400], yDomain: [-0.4, 1.4], hlines: [{ y: 0, text: '' }],
  desc: `The line is the smallest Cohen's d that gives p below .05 for N people. At the originals' median N of 57 it is ${dCrit(57).toFixed(2)}; their mean d of 0.72 sits just above it, with a 95 % interval of ${orig.ci.join(' to ')}. The typical replication (N 126, d 0.14) has an interval of ${rep.ci.join(' to ')}.`, height: 290,
});
const DS = Array.from({ length: 60 }, (_, i) => +(0.02 + i * 0.02).toFixed(2));
const fig2 = chart({
  title: 'Power of a typical original study (N = 57)', xLabel: "True effect size d", yLabel: 'Chance of p < .05 (%)',
  series: [{ name: 'Power', kind: 'line', x: DS, y: DS.map((d) => pw(d, 57)) }],
  xDomain: [0, 1.2], yDomain: [0, 100], vlines: [{ x: 0.07, text: '0.07 all', dy: 0 }, { x: 0.40, text: '0.40 same lab', dy: 14 }, { x: 0.72, text: '0.72 originals', dy: 28 }], hlines: [{ y: 80, text: '80 %' }],
  desc: `Chance that a two-group study with 57 people reaches p < .05: ${power.d007} % if the true d is 0.07, ${power.d040} % if 0.40, ${power.d072} % if 0.72.`, height: 260,
});

console.log(JSON.stringify({ orig, origMean, rep, same, indep, dCrit57: +dCrit(57).toFixed(3), dCrit63: +dCrit(63).toFixed(3), dCrit126: +dCrit(126).toFixed(3), power, nFor80 }, null, 0).replace(/},/g, '},\n'));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'crit', figure(fig1, 'Figure 1. The smallest Cohen\'s d that a two-group study of N people can report as significant (grey), with the originals\' mean effect at their median sample size and the replications\' mean effect at theirs, each with its 95 % interval from the Effect size converter\'s maths. Summary values from the paper; equal group sizes are our assumption.'));
  md = inject(md, 'power', figure(fig2, 'Figure 2. Statistical power of a two-group study with 57 people, from the Sample size tool\'s maths, against the true effect. The dashed lines mark the paper\'s pooled replication effects and the originals\' mean.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
