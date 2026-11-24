// Figures for src/blog/discoveries/station-blackout-decay-heat-operating-time.md, made with the maths of the
// Decay heat estimator (src/lib/sci/eng-decayheat.ts: the Way-Wigner fraction, its exact energy integral, boil-off).
// Run: node scripts/blog-figures/station-blackout-decay-heat-operating-time.mjs
import fs from 'node:fs';
import { fraction, energy, timeBelow, duration, H_FG } from '../../src/lib/sci/eng-decayheat.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/station-blackout-decay-heat-operating-time.md', import.meta.url);

// Inputs from the paper: Liu et al. (2023), Front. Energy Res. 11, 1191467 (CC BY). A 3,250 MWth four-loop PWR;
// core-damage times for four operating histories; the paper itself uses the Way-Wigner decay-power formula.
const P0 = 3250, T0 = 100; // MW, and the second at which the blackout starts
const CASES = [
  { name: '1 week', T: 7 * 86400, damage: 15.37 },
  { name: '1 month', T: 30 * 86400, damage: 12.47 },
  { name: '1 year', T: 365.25 * 86400, damage: 10.71 },
  { name: '1,350 days', T: 1350 * 86400, damage: 9.74 },
];
const GJ = (t, T) => (energy(T0, t, T) * P0) / 1000; // GJ released between the blackout and time t
const rows = CASES.map((c) => ({ ...c, E: GJ(c.damage * 3600, c.T), P1h: fraction(3600, c.T) * P0, Pdam: fraction(c.damage * 3600, c.T) * P0 }));
const mean = rows.reduce((s, r) => s + r.E, 0) / rows.length;
// Invert: the hour at which each history has released that same energy.
const hourFor = (T, E) => { let lo = T0, hi = 4e5; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; GJ(m, T) < E ? (lo = m) : (hi = m); } return (lo + hi) / 2 / 3600; };
rows.forEach((r) => { r.pred = hourFor(r.T, mean); r.diff = ((r.pred - r.damage) / r.damage) * 100; r.water = r.E / H_FG; });

const lg = (v) => Math.log10(v);
const p10 = (t) => { const v = 10 ** t; return v >= 1 ? String(Math.round(v)) : String(+v.toPrecision(2)); };
const hours = Array.from({ length: 121 }, (_, i) => 10 ** (lg(100) + (i * (lg(2e5) - lg(100))) / 120)); // 100 s to 55 h

// Figure 1: decay power against time for the four operating histories.
const fig1 = chart({
  title: 'Decay heat after a blackout, by how long the reactor ran', xLabel: 'Seconds since shutdown', yLabel: 'Decay heat (MW)',
  series: rows.map((r) => ({ name: r.name, kind: 'line', x: hours.map(lg), y: hours.map((t) => +(fraction(t, r.T) * P0).toFixed(2)) })),
  xDomain: [lg(100), lg(2e5)], yDomain: [0, 80], xFmt: p10,
  vlines: rows.map((r, i) => ({ x: lg(r.damage * 3600), text: i === 0 || i === 3 ? `${r.damage} h` : '', left: i > 1, dy: 14 * (i % 2) })),
  desc: `Way-Wigner decay heat of a 3,250 MW reactor against time since shutdown, for operating histories of one week, one month, one year and 1,350 days. The dashed lines mark the core-damage times the paper reports, from ${rows[3].damage} to ${rows[0].damage} hours.`,
  height: 290,
});

// Figure 2: energy released since the blackout, with the paper's core-damage points.
const fig2 = chart({
  title: 'Energy released since the blackout', xLabel: 'Hours since the blackout', yLabel: 'Energy released (GJ)',
  series: [
    ...rows.map((r) => ({ name: r.name, kind: 'line', x: hours.map((t) => t / 3600), y: hours.map((t) => +GJ(t, r.T).toFixed(1)) })),
    { name: '', noLegend: true, kind: 'dots', x: rows.map((r) => r.damage), y: rows.map((r) => +r.E.toFixed(1)), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 20], yDomain: [0, 1300], hlines: [{ y: +mean.toFixed(0), text: `${mean.toFixed(0)} GJ on average` }],
  desc: `Energy released by decay heat since the blackout, for the four operating histories. The black dots mark the paper's core-damage times: all four fall near ${mean.toFixed(0)} GJ, about ${(mean / H_FG).toFixed(0)} tonnes of water boiled away.`,
  height: 290,
});

console.log(JSON.stringify({
  mean: +mean.toFixed(0), water: +(mean / H_FG).toFixed(0),
  rows: rows.map((r) => ({ name: r.name, E: +r.E.toFixed(0), water: +r.water.toFixed(0), P1h: +r.P1h.toFixed(1), Pdam: +r.Pdam.toFixed(1), paper: r.damage, pred: +r.pred.toFixed(2), diff: +r.diff.toFixed(1) })),
  frac1s: +(fraction(1, 1350 * 86400) * 100).toFixed(2), frac1min: +(fraction(60, 1350 * 86400) * 100).toFixed(2),
  below1pc: duration(timeBelow(0.01, 1350 * 86400)), below05pc: duration(timeBelow(0.005, 1350 * 86400)),
  below1pcWeek: duration(timeBelow(0.01, 7 * 86400)),
  shortTerm: [1.13, 1.44, 2.49].map((h) => ({ h, P: +(fraction(h * 3600, 1350 * 86400) * P0).toFixed(1), E: +GJ(h * 3600, 1350 * 86400).toFixed(0), water: +(GJ(h * 3600, 1350 * 86400) / H_FG).toFixed(0) })),
  dryout: { h: 7.92, P: +(fraction(7.92 * 3600, 1350 * 86400) * P0).toFixed(1), E: +GJ(7.92 * 3600, 1350 * 86400).toFixed(0), water: +(GJ(7.92 * 3600, 1350 * 86400) / H_FG).toFixed(0) },
  infinite10h: +(fraction(10 * 3600, Infinity) * P0).toFixed(1),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'power', figure(fig1, 'Figure 1. Decay heat of the paper\'s 3,250 MW reactor against time since shutdown, worked out with the Way-Wigner formula in the Decay heat estimator for the paper\'s four operating histories. The dashed lines mark the core-damage times the paper\'s RELAP5-3D model reports.'));
  md = inject(md, 'energy', figure(fig2, `Figure 2. The same four histories, now as the energy decay heat has released since the blackout (the tool's exact integral of the formula). The dots are the paper's core-damage times; they cluster near ${mean.toFixed(0)} GJ, the energy needed to boil about ${(mean / H_FG).toFixed(0)} tonnes of water.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
