// Figures for src/blog/discoveries/us-foodborne-outbreak-trends-1998-2018-mann-kendall-negative-binomial.md, made with
// the maths of the Trend analyser (src/lib/sci/trend.ts) and the Distribution explorer (src/lib/sci/distributions.ts).
// Run: node scripts/blog-figures/us-foodborne-outbreak-trends-1998-2018-mann-kendall-negative-binomial.mjs
// Everything here is a SIMULATION. The paper (Bazaco et al. 2026, PLOS ONE 21(8): e0353943, CC0) gives differences
// between 5-year window means, not yearly counts; we build made-up yearly counts with those differences.
import fs from 'node:fs';
import { mannKendall, senSlope, senCI, pettitt } from '../../src/lib/sci/trend.ts';
import { DIST, rng, gammaDraw } from '../../src/lib/sci/distributions.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/us-foodborne-outbreak-trends-1998-2018-mann-kendall-negative-binomial.md', import.meta.url);
const YEARS = Array.from({ length: 21 }, (_, i) => 1998 + i);
const WIN = [[1998, 2003], [2004, 2008], [2009, 2013], [2014, 2018]]; // the paper's windows (Results)

// Median differences in outbreaks per year, from the paper's text (last window minus earlier windows, or as stated).
const SCEN = [
  { id: 'Salmonella, eggs', d: -10.1 },   // 2014-2018 vs 1998-2003
  { id: 'STEC O157, meat', d: -5.3 },     // last vs first window
  { id: 'Campylobacter, poultry', d: 4.2 },// first vs fourth window (rise)
  { id: 'Listeria, dairy', d: 1.7 },      // 2014-2018 vs 1998-2003
];
const BASE = 2; // OUR assumption: the lower of the two end windows averages 2 outbreaks a year.

/** Smooth log-linear mean through the two end-window centres (2000.5 and 2016), lower end = BASE, other end = BASE + |d|. */
const meanCurve = (d) => { const hi = BASE + Math.abs(d), [m1, m4] = d < 0 ? [hi, BASE] : [BASE, hi], b = Math.log(m4 / m1) / (2016 - 2000.5); return YEARS.map((y) => m1 * Math.exp(b * (y - 2000.5))); };
/** Negative binomial draw with mean mu and size r (gamma-Poisson mixture); r = Infinity gives Poisson. */
function nbDraw(mu, r, u) { const lam = Number.isFinite(r) ? gammaDraw(r, u) * mu / r : mu; let k = 0, p = Math.exp(-lam), s = p; const v = u(); while (v > s && k < 1000) { k++; p *= lam / k; s += p; } return k; }
const power = (d, r, reps = 400, seed = 1) => { const u = rng(seed), m = meanCurve(d); let hit = 0; for (let i = 0; i < reps; i++) { const x = m.map((mu) => nbDraw(mu, r, u)); if (mannKendall(x).p < 0.05) hit++; } return hit / reps; };

// Figure 1: one simulated Salmonella-in-eggs series (dispersion r = 5, our assumption), Sen line and window means.
const u = rng(2026), mEgg = meanCurve(-10.1), x = mEgg.map((mu) => nbDraw(mu, 5, u));
const mk = mannKendall(x), ss = senSlope(YEARS, x), ci = senCI(ss.slopes, mk.varS), pt = pettitt(x);
const winMean = WIN.map(([a, b]) => { const v = x.filter((_, i) => YEARS[i] >= a && YEARS[i] <= b); return v.reduce((s, q) => s + q, 0) / v.length; });
const stepX = [], stepY = []; WIN.forEach(([a, b], i) => { stepX.push(a - 0.5, b + 0.5); stepY.push(+winMean[i].toFixed(2), +winMean[i].toFixed(2)); });
const fig1 = chart({
  title: 'Simulated yearly outbreaks shaped like Salmonella in eggs', xLabel: 'Year', yLabel: 'Outbreaks (simulated)',
  series: [
    { name: 'Simulated year', kind: 'dots', x: YEARS, y: x, size: 3.5 },
    { name: '5-year window mean', kind: 'line', x: stepX, y: stepY, dash: '5 4' },
    { name: `Sen slope ${ss.slope.toFixed(2)} a year`, kind: 'line', x: [1998, 2018], y: [1998, 2018].map((t) => +(ss.intercept + ss.slope * t).toFixed(2)) },
  ],
  xDomain: [1997, 2019], yDomain: [0, Math.max(...x) + 3], height: 280,
  desc: `Made-up negative binomial counts falling from about 12 to 2 a year: Mann-Kendall p = ${mk.p.toPrecision(2)}, Sen slope ${ss.slope.toFixed(2)} outbreaks a year.`,
});

// Figure 2: power of Mann-Kendall on 21 yearly counts against the size of the window difference.
const ds = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10];
const pw = { pois: ds.map((d) => power(-d, Infinity)), nb2: ds.map((d) => power(-d, 2)), nb5: ds.map((d) => power(-d, 5)) };
const scen = SCEN.map((s) => ({ ...s, pois: power(s.d, Infinity), nb5: power(s.d, 5), nb2: power(s.d, 2) }));
const fig2 = chart({
  title: 'How often Mann-Kendall finds a trend in 21 yearly counts', xLabel: 'Difference between first and last window means (outbreaks a year)', yLabel: 'Share of simulated series with p < 0.05',
  series: [
    { name: 'Poisson', kind: 'line', x: ds, y: pw.pois },
    { name: 'Negative binomial, r = 5', kind: 'line', x: ds, y: pw.nb5, dash: '6 3' },
    { name: 'Negative binomial, r = 2', kind: 'line', x: ds, y: pw.nb2, dash: '2 3' },
  ],
  vlines: SCEN.map((s, i) => ({ x: Math.abs(s.d), text: '', dy: i * 14 })), hlines: [{ y: 0.8, text: '80 %' }],
  xDomain: [0, 11], yDomain: [0, 1], height: 290,
  desc: 'With a low level of 2 outbreaks a year, Mann-Kendall usually finds a fall of 5 or more a year between the end windows, but often misses changes of 1 to 2 a year, more so when counts are over-dispersed.',
});

// Distribution explorer check: negative binomial with mean 3 and r = 5 has p = r/(r+mu) = 0.625.
const nb = DIST.nbinom, P = { r: 5, p: 0.625 };
const dx = { mean: nb.moments(P).mean, variance: nb.moments(P).variance, p0: nb.pdf(0, P), cdf6: nb.cdf(6, P) };

console.log(JSON.stringify({ x, mk: { S: mk.S, Z: +mk.Z.toFixed(3), p: mk.p.toPrecision(3), tau: +mk.tau.toFixed(3) }, sen: +ss.slope.toFixed(3), ci: [+ci.lo.toFixed(3), +ci.hi.toFixed(3)], pettitt: { after: YEARS[pt.at], K: pt.K, p: +pt.p.toPrecision(2) }, winMean: winMean.map((v) => +v.toFixed(2)), meanTrue: mEgg.map((v) => +v.toFixed(2)), pw, scen, dx }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'series', figure(fig1, 'Figure 1. One made-up 21-year series of outbreak counts, drawn from a negative binomial distribution whose mean falls from about 12 to 2 a year (the paper\'s difference of 10.1 between the end windows; the level and spread are our assumptions). Dashed steps: 5-year window means; solid line: Sen slope from the Trend analyser\'s maths. Not the surveillance data.'));
  md = inject(md, 'power', figure(fig2, 'Figure 2. Share of 400 simulated 21-year count series that the Mann-Kendall test flags at the 5 % level, against the difference between the first and last 5-year window means, with the lower window at 2 outbreaks a year. Vertical lines mark the paper\'s differences for Listeria in dairy (1.7), Campylobacter in poultry (4.2), STEC O157 in meat (5.3) and Salmonella in eggs (10.1). Simulation, not the paper\'s data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
