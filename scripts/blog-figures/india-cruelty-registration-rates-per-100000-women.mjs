// Figures and numbers for src/blog/discoveries/india-cruelty-registration-rates-per-100000-women.md, made with the
// maths of the Crime rate calculator (src/lib/sci/crimerate.ts: crude rates with exact Poisson intervals, rate ratios
// with the exact conditional test).
// Run: node scripts/blog-figures/india-cruelty-registration-rates-per-100000-women.mjs
import fs from 'node:fs';
import { crudeRate, rateRatio, poissonExact } from '../../src/lib/sci/crimerate.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/india-cruelty-registration-rates-per-100000-women.md', import.meta.url);

// From the paper's running text: Susmitha K. and Balamurugan J. (2026), Frontiers in Sociology 11: 1901370 (CC BY 4.0).
// Registered Section 498A cases and the published rate per 100,000 women for the four years whose counts it states.
// The paper does not print the female population it divided by, so we recover it as count / rate x 100,000 (OUR
// back-calculation; the rates are rounded to 0.1, so each denominator is good to about +-0.5 %).
const YEARS = [
  { y: 2005, k: 58319, r: 10.9 },
  { y: 2014, k: 122877, r: 20.5 },
  { y: 2022, k: 140019, r: 20.9 },
  { y: 2023, k: 133676, r: 19.7 },
].map((a) => ({ ...a, pop: (a.k / a.r) * 1e5 }));

const rates = YEARS.map((a) => {
  const c = crudeRate(a.k, a.pop, 1e5);
  return { ...a, rate: c.rate, ci: c.ci, halfPct: (100 * (c.ci[1] - c.ci[0])) / 2 / c.rate };
});

const pair = (i, j) => {
  const A = YEARS[i], B = YEARS[j], R = rateRatio(B.k, B.pop, A.k, A.pop);
  return { from: A.y, to: B.y, rr: R.rr, ci: R.exactCi, p: R.p, change: R.change, changeCi: R.changeCi };
};
const PAIRS = [pair(0, 1), pair(1, 2), pair(2, 3), pair(0, 3)];

// Compound annual change between the end years, for comparison with the paper's fitted annual percent change.
const apc = (a, b, n) => 100 * ((b / a) ** (1 / n) - 1);
const APC = { p1: apc(10.9, 20.5, 9), p2: apc(20.5, 19.7, 9), all: apc(10.9, 19.7, 18) };

// How wide the exact Poisson 95 % interval is, as a percentage of the rate, against the number of cases.
const COUNTS = Array.from({ length: 140 }, (_, i) => Math.round(3 * 1.075 ** i)).filter((k, i, a) => k <= 200000 && a.indexOf(k) === i);
const width = (k) => { const c = poissonExact(k); return (100 * (c[1] - c[0])) / 2 / k; };
const MARKS = [12, 16951, 140019].map((k) => ({ k, w: width(k) }));
const district = crudeRate(12, 180000, 1e5); // our own made-up small district: 12 cases, 180,000 women

const fig1 = chart({
  title: 'Registered cruelty cases per 100,000 women',
  xLabel: 'Year', yLabel: 'Rate per 100,000 women',
  series: [
    { name: '', noLegend: true, kind: 'dots', x: rates.map((a) => a.y), y: rates.map((a) => +a.rate.toFixed(3)), size: 4, errors: rates.map((a) => +((a.ci[1] - a.ci[0]) / 2).toFixed(4)) },
    { name: '', noLegend: true, kind: 'line', x: rates.map((a) => a.y), y: rates.map((a) => +a.rate.toFixed(3)), dash: '4 4', colour: 'var(--muted)' },
  ],
  xDomain: [2003, 2025], yDomain: [8, 23], xTicks: [2005, 2010, 2015, 2020, 2025], xFmt: (v) => String(v),
  desc: 'Registered cruelty rate per 100,000 women in India for 2005, 2014, 2022 and 2023, with 95 per cent exact Poisson intervals that are narrower than the plotted points.',
  height: 250,
});

const fig2 = chart({
  title: 'How many cases a rate needs before it is steady',
  xLabel: 'Cases counted (log scale)', yLabel: '95 % interval, ± % of the rate',
  series: [
    { name: '', noLegend: true, kind: 'line', x: COUNTS.map((k) => Math.log10(k)), y: COUNTS.map((k) => +width(k).toFixed(3)) },
    { name: '', noLegend: true, kind: 'dots', x: MARKS.map((m) => Math.log10(m.k)), y: MARKS.map((m) => +m.w.toFixed(3)), size: 4, colour: 'var(--c-tools)' },
  ],
  xDomain: [Math.log10(3), Math.log10(200000)], yDomain: [0, 80],
  xTicks: [1, 2, 3, 4, 5].map((v) => v), xFmt: (v) => ['10', '100', '1,000', '10,000', '100,000'][v - 1] ?? '',
  vlines: MARKS.map((m, i) => ({ x: Math.log10(m.k), text: m.k.toLocaleString('en-GB'), left: i === 2, dy: i * 14 })),
  desc: 'The half-width of the exact Poisson 95 per cent interval, as a percentage of the rate, falls from about 60 per cent at 12 cases to 0.5 per cent at 140,000 cases.',
  height: 250,
});

console.log(JSON.stringify({
  rates: rates.map((a) => ({ y: a.y, popM: +(a.pop / 1e6).toFixed(1), rate: +a.rate.toFixed(3), ci: a.ci.map((v) => +v.toFixed(3)), halfPct: +a.halfPct.toFixed(2) })),
  pairs: PAIRS.map((p) => ({ ...p, rr: +p.rr.toFixed(4), ci: p.ci.map((v) => +v.toFixed(4)), p: p.p, change: +p.change.toFixed(1), changeCi: p.changeCi.map((v) => +v.toFixed(1)) })),
  apc: { p1: +APC.p1.toFixed(2), p2: +APC.p2.toFixed(2), all: +APC.all.toFixed(2) },
  marks: MARKS.map((m) => ({ k: m.k, halfPct: +m.w.toFixed(2) })),
  district: { rate: +district.rate.toFixed(2), ci: district.ci.map((v) => +v.toFixed(2)) },
  prevalenceRatio: Math.round(0.24 / (19.7 / 1e5)),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rates', figure(fig1, 'Figure 1. The registered-cruelty rate per 100,000 women for the four years whose case counts the paper states, worked out again with the Crime rate calculator\'s maths. The 95 % exact Poisson intervals are drawn, but they are narrower than the dots: with more than 58,000 cases, chance is not what moves these numbers.'));
  md = inject(md, 'width', figure(fig2, 'Figure 2. The same interval maths across the whole range of counts. The marked points are a small district with 12 cases (our own example), West Bengal\'s 16,951 cases in 2019 and India\'s 133,676 in 2023.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
