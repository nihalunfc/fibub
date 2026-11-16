// Figures for src/blog/discoveries/barnards-star-broken-resonant-chain-merger.md, made with the maths of the
// Habitable zone calculator (src/lib/sci/habitable.ts: Kepler's third law, equilibrium temperature, Kopparapu limits).
// Run: node scripts/blog-figures/barnards-star-broken-resonant-chain-merger.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { auForPeriod, periodDays, tEq, habitableZone } from '../../src/lib/sci/habitable.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/barnards-star-broken-resonant-chain-merger.md', import.meta.url);

// Inputs. Periods (days) and the minimum-mass range: Basant et al. (2025), ApJL 982, L1, as reported by AAS Nova,
// rounded. Star: about 0.16 solar masses (same source); temperature and luminosity rounded literature values, assumed.
const P = { d: 2.34, b: 3.15, c: 4.12, e: 6.74 };
const MS = 0.16, TEFF = 3200, LUM = 0.0035;
const ME = 0.3 / 332946; // a typical planet of 0.3 Earth masses, in solar masses (the four are 0.19 to 0.34)
const names = ['d', 'b', 'c', 'e'];
const a = Object.fromEntries(names.map((n) => [n, auForPeriod(P[n], MS)]));

// Neighbour period ratios and the nearest simple ratios (first and second order).
const SIMPLE = [[5, 4], [4, 3], [7, 5], [3, 2], [5, 3], [8, 5], [2, 1], [9, 7], [6, 5]];
const pairs = [['d', 'b'], ['b', 'c'], ['c', 'e']].map(([i, o]) => {
  const r = P[o] / P[i];
  const near = SIMPLE.map(([p, q]) => ({ p, q, off: r / (p / q) - 1 })).sort((x, y) => Math.abs(x.off) - Math.abs(y.off))[0];
  // Spacing in mutual Hill radii: R_H = ((m1 + m2)/(3 M))^(1/3) (a1 + a2)/2.
  const RH = Math.cbrt((2 * ME) / (3 * MS)) * (a[i] + a[o]) / 2;
  return { pair: `${i}–${o}`, r, near, hill: (a[o] - a[i]) / RH };
});

// 1. Period ratios against simple ratios.
const fig1 = chart({
  title: 'Period ratio of each neighbouring pair', xLabel: 'Pair (inner to outer)', yLabel: 'Outer period ÷ inner period',
  series: [{ name: 'Barnard\'s Star planets', kind: 'dots', x: [1, 2, 3], y: pairs.map((p) => +p.r.toFixed(3)), size: 6 }],
  xDomain: [0.5, 3.5], xTicks: [1, 2, 3], xFmt: (v) => ['', 'd to b', 'b to c', 'c to e'][v] ?? '', yDomain: [1.15, 1.75],
  hlines: [[6, 5], [4, 3], [3, 2], [5, 3]].map(([p, q]) => ({ y: p / q, text: `${p}:${q}` })),
  desc: 'The first pair sits just outside 4:3, the second sits between 4:3 and 5:4, and the third between 3:2 and 5:3: the chain is broken after planet b.', height: 300,
});

// 2. Where two half-mass planets would sit to merge into planet c. Merging keeps the orbital angular momentum
// m1 √a1 + m2 √a2 = (m1 + m2) √a (circular orbits, equal masses), so √a_c = (√a1 + √a2)/2.
const sqc = Math.sqrt(a.c);
const inner = Array.from({ length: 60 }, (_, i) => 3.0 + i * ((P.c - 0.02 - 3.0) / 59));
const outer = inner.map((p1) => periodDays((2 * sqc - Math.sqrt(auForPeriod(p1, MS))) ** 2, MS));
const pairAt = (p1) => periodDays((2 * sqc - Math.sqrt(auForPeriod(p1, MS))) ** 2, MS);
const fig2 = chart({
  title: 'Two planets that would merge into planet c', xLabel: 'Inner planet\'s period (days)', yLabel: 'Outer planet\'s period (days)',
  series: [
    { name: 'Pairs that keep c at 4.12 days', kind: 'line', x: inner.map((v) => +v.toFixed(3)), y: outer.map((v) => +v.toFixed(3)) },
  ],
  hlines: [{ y: P.e, text: 'Planet e (6.74 d)' }], vlines: [{ x: P.b, text: 'Planet b' }], xDomain: [3, 4.2], yDomain: [4, 7.2],
  desc: 'Equal-mass pairs whose merger would leave a planet at 4.12 days: the inner one between planet b and 4.1 days, the outer one between 4.1 days and planet e.', height: 300,
});

const hz = habitableZone(TEFF, LUM);
const facts = {
  a: Object.fromEntries(names.map((n) => [n, a[n].toFixed(4)])),
  tEq: Object.fromEntries(names.map((n) => [n, Math.round(tEq(LUM, a[n], 0.3))])),
  pairs: pairs.map((p) => ({ pair: p.pair, r: p.r.toFixed(3), near: `${p.near.p}:${p.near.q}`, off: (p.near.off * 100).toFixed(1) + '%', hill: p.hill.toFixed(1) })),
  hz: JSON.stringify(hz).slice(0, 400),
  examples: [3.4, 3.6, 3.8].map((p1) => ({ p1, p2: pairAt(p1).toFixed(2), ratio: (pairAt(p1) / p1).toFixed(2) })),
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ratios', figure(fig1, 'Figure 1. Period ratios of the three neighbouring pairs (periods from Basant et al. 2025, rounded), with simple ratios as dashed lines.'));
  md = inject(md, 'merge', figure(fig2, 'Figure 2. Line: pairs of equal-mass planets whose merger, keeping orbital angular momentum, leaves one planet at planet c\'s 4.12 days. Made with the Kepler\'s-law maths in the Habitable zone calculator; a sketch, not the paper\'s simulation.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
