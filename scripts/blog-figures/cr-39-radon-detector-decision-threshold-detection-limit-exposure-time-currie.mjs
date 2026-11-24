// Figures for src/blog/discoveries/cr-39-radon-detector-decision-threshold-detection-limit-exposure-time-currie.md,
// made with the maths of the Counting statistics helper (src/lib/sci/phcount.ts: currie, poissonCI).
// Run: node scripts/blog-figures/cr-39-radon-detector-decision-threshold-detection-limit-exposure-time-currie.mjs
import fs from 'node:fs';
import { currie, poissonCI } from '../../src/lib/sci/phcount.ts';
import { normCdf } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/cr-39-radon-detector-decision-threshold-detection-limit-exposure-time-currie.md', import.meta.url);

// From the paper: Loffredo and Quarto (2026), Atmosphere 17(6): 621 (CC BY). Calibration factor Fc = 0.513 tracks cm⁻²
// per kBq h m⁻³; α = β = 0.05; fitted lines ln C* = 8.978 − 1.000 ln t and ln C# = 9.777 − 1.000 ln t; median and
// geometric mean 68 Bq/m³, GSD 3; 4 % below C*, 8 % between C* and C#, 88 % above C#.
// OUR readings and assumptions: t in hours, 1 month = 720 h; counting-only Currie limits (the ISO 11929 calibration term
// is left out); a paired blank of the same area; equal shares of 1, 3 and 6 month exposures for the class check.
const FC = 0.513e-3; // tracks cm⁻² per Bq h m⁻³
const Cstar = (t) => Math.exp(8.978) / t, Chash = (t) => Math.exp(9.777) / t;
const ratio = Math.exp(9.777 - 8.978);
// Background tracks B (paired blank, tb = tg) that give the paper's ratio C#/C* with Currie's limits.
const bFor = (r, tbOverTg = 1) => { let lo = 0.01, hi = 1e7; for (let i = 0; i < 200; i++) { const m = Math.sqrt(lo * hi), c = currie(m, tbOverTg, 1); c.LD / c.LC > r ? (lo = m) : (hi = m); } return lo; };
const B = bFor(ratio), cur = currie(B, 1, 1);
const area = cur.LC / (Cstar(720) * 720 * FC); // cm², so that L_C in tracks matches C* at one month
// With the ISO calibration term (relative uncertainty about 9.9 % on Fc) the counting part of the ratio is a bit lower.
const uRel = 0.051 / 0.513, ratioCount = ratio * (1 - 1.645 ** 2 * uRel ** 2);
const Biso = bFor(ratioCount), curIso = currie(Biso, 1, 1);
// Averaging the background over 9 blank detectors (10 % of 90) instead of one.
const B9 = currie(Math.round(B) * 9, 9, 1), B1 = currie(Math.round(B), 1, 1);
const toC = (tracks, tH) => tracks / (area * FC * tH);
// Background that grows with exposure (like a counter's background rate): equal at 1 month.
const rateModel = (tH) => toC(currie(B * tH / 720, 1, 1).LC, tH);
const months = [1, 3, 6];
const lim = months.map((m) => ({ m, t: m * 720, Cs: +Cstar(m * 720).toFixed(2), Ch: +Chash(m * 720).toFixed(2), fixed: +toC(cur.LC, m * 720).toFixed(2), rate: +rateModel(m * 720).toFixed(2) }));
// Class shares for a log-normal radon distribution (GM 68, GSD 3), equal thirds of exposure times.
const below = (c) => normCdf(Math.log(c / 68) / Math.log(3));
const cls = months.map((m) => ({ m, A: below(Cstar(m * 720)), AB: below(Chash(m * 720)) }));
const shareA = cls.reduce((s, c) => s + c.A, 0) / 3, shareAB = cls.reduce((s, c) => s + c.AB, 0) / 3;
// Worked track example: 60 tracks on 3 cm²-ish area after 3 months against the paired blank.
const G = 60, net = G - Math.round(B), cEx = toC(net, 2160), ci = poissonCI(G, 0.95);

const L10 = Math.log10;
const tm = Array.from({ length: 61 }, (_, i) => 10 ** (L10(0.5) + (i / 60) * (L10(12) - L10(0.5))));
const fig1 = chart({
  title: 'CR-39: decision threshold against exposure time', xLabel: 'Exposure (months, log scale)', yLabel: 'C* (Bq/m³, log scale)',
  series: [
    { name: 'Fixed background (slope −1)', kind: 'line', x: tm.map(L10), y: tm.map((m) => +L10(toC(cur.LC, m * 720)).toFixed(3)) },
    { name: 'Background grows (slope −½)', kind: 'line', x: tm.map(L10), y: tm.map((m) => +L10(rateModel(m * 720)).toFixed(3)), dash: '5 4' },
    { name: 'Paper\'s fitted line', kind: 'dots', x: months.map(L10), y: months.map((m) => +L10(Cstar(m * 720)).toFixed(3)), colour: 'var(--ink)', size: 4 },
  ],
  xDomain: [L10(0.5), L10(12)], yDomain: [L10(0.5), L10(50)], xTicks: [0.5, 1, 2, 3, 6, 12].map(L10), yTicks: [0.5, 1, 2, 5, 10, 20, 50].map(L10),
  xFmt: (v) => String(+(10 ** v).toPrecision(2)), yFmt: (v) => String(+(10 ** v).toPrecision(2)),
  desc: `Decision threshold in Bq/m³ against exposure time on log scales. A background fixed in tracks gives slope −1 and matches the paper's line (${lim[0].Cs}, ${lim[1].Cs} and ${lim[2].Cs} Bq/m³ at 1, 3 and 6 months); a background that grows with time would give slope −0.5.`, height: 270,
});

console.log(JSON.stringify({ ratio: +ratio.toFixed(3), B: +B.toFixed(1), sigma0: +cur.sigma0.toFixed(2), LC: +cur.LC.toFixed(2), LD: +cur.LD.toFixed(2), area: +area.toFixed(2), iso: { ratioCount: +ratioCount.toFixed(3), B: +Biso.toFixed(1), LC: +curIso.LC.toFixed(2), area: +(curIso.LC / (Cstar(720) * 720 * FC)).toFixed(2) }, blanks: { one: { B: Math.round(B), LC: +B1.LC.toFixed(2), LD: +B1.LD.toFixed(2), s0: +B1.sigma0.toFixed(2) }, nine: { B: Math.round(B) * 9, LC: +B9.LC.toFixed(2), LD: +B9.LD.toFixed(2), s0: +B9.sigma0.toFixed(2), C1m: +toC(B9.LC, 720).toFixed(2) } }, lim, shareA: +(100 * shareA).toFixed(1), shareB: +(100 * (shareAB - shareA)).toFixed(1), shareC: +(100 * (1 - shareAB)).toFixed(1), cls: cls.map((c) => ({ m: c.m, A: +(100 * c.A).toFixed(1), AB: +(100 * c.AB).toFixed(1) })), ex: { G, net, C: +cEx.toFixed(1), ciLo: +ci.lo.toFixed(1), ciHi: +ci.hi.toFixed(1) } }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'slope', figure(fig1, 'Figure 1. Decision threshold against exposure time, both on log scales, from Currie\'s formulas in the Counting statistics helper\'s maths. Solid: a background fixed in tracks, with the background count inferred from the paper\'s two fitted lines; dashed: the same background at one month but growing with exposure; dots: the paper\'s fitted line at 1, 3 and 6 months.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
