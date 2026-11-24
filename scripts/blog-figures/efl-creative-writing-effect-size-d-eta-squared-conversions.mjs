// Figures for src/blog/discoveries/efl-creative-writing-effect-size-d-eta-squared-conversions.md, made with the
// maths of the Effect size converter (src/lib/sci/effsize.ts) and the normal density from src/lib/sci/distributions.ts.
// Run: node scripts/blog-figures/efl-creative-writing-effect-size-d-eta-squared-conversions.mjs
import fs from 'node:fs';
import { convert } from '../../src/lib/sci/effsize.ts';
import { DIST } from '../../src/lib/sci/distributions.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/efl-creative-writing-effect-size-d-eta-squared-conversions.md', import.meta.url);

// From the paper's abstract: Mekheimer and Mahdy (2026), Asian-Pac. J. Second Foreign Lang. Educ. 11(1), doi:10.1186/s40862-026-00409-5 (CC BY 4.0).
// Post-test Total Creative Writing score, 30 students per group.
const E = { m: 83.6, sd: 6.8, n: 30 }, C = { m: 46.3, sd: 10.13, n: 30 };
const res = convert({ from: 'means', m1: E.m, sd1: E.sd, n1: E.n, m2: C.m, sd2: C.sd, n2: C.n });
const get = (k) => res.rows.find((r) => r.key === k);
const d = get('d').value;
// The two-sample t that goes with this d (equal groups), and Welch's version from the two SDs.
const tPooled = d / Math.sqrt(1 / E.n + 1 / C.n);
const seW = Math.sqrt(E.sd ** 2 / E.n + C.sd ** 2 / C.n), tW = (E.m - C.m) / seW;
const dfW = seW ** 4 / ((E.sd ** 2 / E.n) ** 2 / (E.n - 1) + (C.sd ** 2 / C.n) ** 2 / (C.n - 1));

// Figure 1: the two score distributions implied by the printed means and SDs.
const N = DIST.normal, X = Array.from({ length: 241 }, (_, i) => 10 + i * 0.4);
const fig1 = chart({
  title: 'The two classes, as their means and SDs describe them',
  xLabel: 'Total creative writing score (post-test)', yLabel: 'Relative number of students',
  series: [
    { name: 'E-learning class (83.6, SD 6.8)', kind: 'line', x: X, y: X.map((x) => +N.pdf(x, { mu: E.m, sigma: E.sd }).toFixed(6)) },
    { name: 'Control class (46.3, SD 10.13)', kind: 'line', x: X, y: X.map((x) => +N.pdf(x, { mu: C.m, sigma: C.sd }).toFixed(6)) },
  ],
  xDomain: [10, 106], yDomain: [0, 0.064],
  vlines: [{ x: C.m, text: '46.3', left: true }, { x: E.m, text: '83.6' }],
  desc: `Normal curves with the paper's printed means and standard deviations. They overlap over about ${(get('overlap').value * 100).toFixed(1)} per cent of their area, and a randomly chosen student from the e-learning class beats one from the control class with probability ${(get('cl').value * 100).toFixed(1)} per cent.`,
  height: 275,
});

// Figure 2: eta squared against Cohen's d for two groups of 30, with the paper's reported range.
const DS = Array.from({ length: 121 }, (_, i) => i * 0.05);
const etaOf = (x) => convert({ from: 'd', value: x, n1: 30, n2: 30 }).rows.find((r) => r.key === 'eta2').value;
const dOfEta = (e) => convert({ from: 'eta2', value: e, k: 2 }).rows.find((r) => r.key === 'd').value;
const fig2 = chart({
  title: 'One effect, two scales: η² against Cohen\'s d',
  xLabel: 'Cohen\'s d (two groups of 30)', yLabel: 'η² (share of variance explained)',
  series: [{ name: '', noLegend: true, kind: 'line', x: DS, y: DS.map((x) => +etaOf(x).toFixed(5)) }],
  xDomain: [0, 6], yDomain: [0, 1],
  bands: [{ x0: +dOfEta(0.71).toFixed(3), x1: +dOfEta(0.89).toFixed(3), text: 'η² = 0.71 to 0.89 (the paper\'s range)' }],
  vlines: [{ x: +d.toFixed(3), text: `d = ${d.toFixed(2)} for the total score`, left: true }],
  hlines: [{ y: 0.8, text: '' }, { y: +get('eta2').value.toFixed(4), text: `η² = ${get('eta2').value.toFixed(2)}` }],
  desc: `Eta squared against Cohen's d for two groups of 30. The paper's reported range of 0.71 to 0.89 corresponds to d between ${dOfEta(0.71).toFixed(2)} and ${dOfEta(0.89).toFixed(2)}; the total creative writing score gives d = ${d.toFixed(2)} and eta squared ${get('eta2').value.toFixed(2)}.`,
  height: 285,
});

console.log(JSON.stringify({
  pooledSd: +Math.sqrt(((E.n - 1) * E.sd ** 2 + (C.n - 1) * C.sd ** 2) / (E.n + C.n - 2)).toFixed(4),
  rows: res.rows.map((r) => ({ k: r.key, v: +r.value.toPrecision(5), ci: r.ci && r.ci.map((x) => +x.toPrecision(4)) })),
  tPooled: +tPooled.toFixed(3), tWelch: +tW.toFixed(3), dfWelch: +dfW.toFixed(1), varRatio: +(C.sd ** 2 / E.sd ** 2).toFixed(2),
  etaRange: [0.71, 0.89].map((e) => +dOfEta(e).toFixed(3)),
  glass: +get('glass').value.toFixed(3),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curves', figure(fig1, 'Figure 1. The two classes as the paper\'s printed means and standard deviations describe them. Not the students\' real score distribution, which is not published: two normal curves with those means and spreads.'));
  md = inject(md, 'scales', figure(fig2, 'Figure 2. The fixed relationship between Cohen\'s d and eta squared for two groups of 30, with the paper\'s reported eta squared range shaded and the total-score result marked.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
