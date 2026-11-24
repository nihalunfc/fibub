// Figures for src/blog/discoveries/bacillus-subtilis-spores-soy-milk-d-value-z-value-pressure.md, made with the maths of
// the Autoclave F0 tool (src/lib/sci/f0.ts: D-value shifts, equivalent times, log reduction over a time-temperature log)
// and the F-value calculator (src/lib/sci/thermproc.ts: z-value fitted to D-values).
// Run: node scripts/blog-figures/bacillus-subtilis-spores-soy-milk-d-value-z-value-pressure.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import { dAt, equivalentTime, organismKill, neededLR, timeFor, survivors } from '../../src/lib/sci/f0.ts';
import { zValue } from '../../src/lib/sci/thermproc.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/bacillus-subtilis-spores-soy-milk-d-value-z-value-pressure.md', import.meta.url);

// Inputs from the paper's text: Morimatsu (2025), Microorganisms 13(7): 1469, doi:10.3390/microorganisms13071469 (CC BY).
// D-values (min) of B. subtilis spores in soy milk at 80, 87 and 100 °C, untreated and after 100 MPa at 65 °C for 30 min;
// stated z-values 7.5 and 8.2 °C; the matched pre-heats 80 °C for 420 min, 90 °C for 30 min and 100 °C for 1.5 min;
// starting count 7.4 log CFU/mL; count after pressure 3.6 log CFU/mL; detection limit 1.0 log CFU/mL.
const SETS = [
  { id: 'Untreated spores', pts: [[80, 300], [87, 20], [100, 0.6]], zPaper: 7.5 },
  { id: 'After pressure (100 MPa, 65 °C)', pts: [[80, 150], [87, 10], [100, 0.5]], zPaper: 8.2 },
];
const fits = SETS.map((s) => ({ ...s, fit: zValue(s.pts.map(([T, D]) => ({ T, D }))) }));
const PRE = [[80, 420], [90, 30], [100, 1.5]];
const PRE_LEFT = [5.6, 5.8, 5.7]; // log CFU/mL after each pre-heat (paper), from a start of 7.4
const seen = PRE_LEFT.map((v) => +(7.4 - v).toFixed(1));

// 1. z-values and D-values moved along each line.
const rows = fits.map((s) => ({ id: s.id, z: +s.fit.z.toFixed(2), r2: +s.fit.fit.r2.toFixed(3), zPaper: s.zPaper,
  D: Object.fromEntries([80, 87, 90, 100].map((T) => [T, +s.fit.dAt(T).toPrecision(3)])),
  // Moving the measured 100 °C D-value down with the paper's own z: what 87 and 80 °C "should" be on a straight line.
  from100: Object.fromEntries([87, 80].map((T) => [T, +dAt(s.pts[2][1], 100, s.zPaper, T).toPrecision(3)])) }));

// 2. Equivalent minutes of 1.5 min at 100 °C, at 80 and 90 °C, for z = 7.5 and 8.2.
const eq = [7.5, 8.2].map((z) => ({ z, at90: +equivalentTime(1.5, 100, z, 90).toFixed(1), at80: +equivalentTime(1.5, 100, z, 80).toFixed(0) }));

// 3. Log reduction of untreated spores in each matched pre-heat (a square hold), D 0.6 min at 100 °C, z 7.5 °C.
const kill = PRE.map(([T, t]) => ({ T, t, lr: +organismKill([0, t], [T, T], 0.6, 100, 7.5).lr.toFixed(2) }));
// Same holds with the fitted line (z 7.54, D from the fit at 100 °C).
const killFit = PRE.map(([T, t]) => ({ T, t, lr: +organismKill([0, t], [T, T], fits[0].fit.dAt(100), 100, fits[0].fit.z).lr.toFixed(2) }));

// 4. 87 °C post-heat to the detection limit: untreated from 7.4 logs, pressure-treated from 3.6 logs.
const n0u = 10 ** 7.4, n0p = 10 ** 3.6, lim = 10;
const post = { needU: +neededLR(n0u, lim).toFixed(2), needP: +neededLR(n0p, lim).toFixed(2),
  minU: +timeFor(neededLR(n0u, lim), 20, 87, 7.5, 87).toFixed(0), minP: +timeFor(neededLR(n0p, lim), 10, 87, 8.2, 87).toFixed(0) };
// Check-it-yourself numbers (the tool's Kill card: D 0.6 at 100, z 7.5, 2.5e7 per item, SAL 10, plan at 87 °C).
const cy = { F: +organismKill([0, 1.5], [100, 100], 0.6, 100, 7.5).F.toFixed(2), lr: +organismKill([0, 1.5], [100, 100], 0.6, 100, 7.5).lr.toFixed(2),
  need: +neededLR(2.5e7, 10).toFixed(3), left: +survivors(2.5e7, 2.5).toPrecision(3), d87: +dAt(0.6, 100, 7.5, 87).toFixed(2), t87: +timeFor(neededLR(2.5e7, 10), 0.6, 100, 7.5, 87).toFixed(1),
  eq90: +equivalentTime(1.5, 100, 7.5, 90).toFixed(2) };

const TT = Array.from({ length: 41 }, (_, i) => 78 + i * 0.6);
const fig1 = chart({
  title: 'Spore D-values against temperature (log scale)', xLabel: 'Temperature (°C)', yLabel: 'D-value (min)',
  series: [
    ...fits.map((s) => ({ name: s.id, kind: 'dots', x: s.pts.map((p) => p[0]), y: s.pts.map((p) => +Math.log10(p[1]).toFixed(3)), size: 4 })),
    ...fits.map((s, k) => ({ name: '', noLegend: true, kind: 'line', x: TT, y: TT.map((T) => +Math.log10(s.fit.dAt(T)).toFixed(3)), colour: k ? 'var(--c-tools)' : 'var(--c-blog)' })),
  ],
  xDomain: [78, 102], yDomain: [-0.5, 2.7], yTicks: [-0.301, 0, 0.699, 1, 1.699, 2, 2.477], yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  desc: `D-values of Bacillus subtilis spores in soy milk at 80, 87 and 100 °C from the paper, with the straight lines the F-value calculator's z-value fit puts through them: z ${rows[0].z} °C untreated and ${rows[1].z} °C after pressure.`, height: 280,
});
const T2 = Array.from({ length: 41 }, (_, i) => 80 + i * 0.5);
const fig2 = chart({
  title: 'Minutes that match 1.5 min at 100 °C', xLabel: 'Hold temperature (°C)', yLabel: 'Equivalent time (min)',
  series: [
    ...[7.5, 8.2].map((z) => ({ name: `z = ${z} °C`, kind: 'line', x: T2, y: T2.map((T) => +Math.log10(equivalentTime(1.5, 100, z, T)).toFixed(3)) })),
    { name: 'Pre-heats used in the paper', kind: 'dots', x: PRE.map((p) => p[0]), y: PRE.map((p) => +Math.log10(p[1]).toFixed(3)), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [80, 100], yDomain: [0, 3], yTicks: [0, 0.477, 1, 1.477, 2, 2.477, 3], yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  desc: `Equivalent time at each temperature for the lethality of 1.5 minutes at 100 °C. With z 7.5 °C it is ${eq[0].at90} min at 90 °C and ${eq[0].at80} min at 80 °C; with z 8.2 °C, ${eq[1].at90} and ${eq[1].at80} min.`, height: 270,
});

console.log(JSON.stringify({ seen, rows, eq, kill, killFit, post, cy }, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'dz', figure(fig1, 'Figure 1. The paper\'s D-values (dots, log scale) and the z-value lines fitted to them with the F-value calculator\'s maths. A steeper line means a smaller z: the kill speeds up faster with each degree.'));
  md = inject(md, 'equiv', figure(fig2, 'Figure 2. How long a hold at 80 to 100 °C matches the lethality of 1.5 minutes at 100 °C, worked out by the Autoclave F0 tool\'s equivalent-time maths for the two z-values. Dots: the three pre-heats the paper used.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
