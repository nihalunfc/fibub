// Figures for src/blog/discoveries/enterobacter-sm3-doubling-time-od600-cfu.md, made with the maths of the
// Growth curve and doubling time (OD600) tool (src/lib/sci/growthcurve.ts).
// Run: node scripts/blog-figures/enterobacter-sm3-doubling-time-od600-cfu.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { analyse, LN2 } from '../../src/lib/sci/growthcurve.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/enterobacter-sm3-doubling-time-od600-cfu.md', import.meta.url);

// Inputs. "Paper": Pollack-Milgate, Saitia and Tang (2024), BMC Microbiology 24, 403, doi:10.1186/s12866-024-03547-3:
// rate constants 1.99 (OD fit), 2.08 (RD), 1.96 (CFU) per hour for SM3 and 1.40 per hour for E. coli RP437 (OD fit);
// shift-analysis slope 1.079 h per tenfold dilution; RD = a·OD/(b − OD) with a = 1.34, b = 6.17 for SM3; lag about 1 h.
const PAPER = { od: 1.99, rd: 2.08, cfu: 1.96, ecoli: 1.40, shiftSlope: 1.079, a: 1.34, b: 6.17 };
const toMin = (k) => (LN2 / k) * 60;
const recompute = {
  odMin: toMin(PAPER.od), rdMin: toMin(PAPER.rd), cfuMin: toMin(PAPER.cfu), ecoliMin: toMin(PAPER.ecoli),
  shiftMin: PAPER.shiftSlope * Math.log10(2) * 60,
};

// Simulation (our own numbers, not the paper's data): a culture whose true density (in the paper's RD units) grows at
// MU = 2.0 per hour after a 1 h lag, levelling off at DMAX. The spectrophotometer reading follows the paper's
// calibration turned round: OD = b·RD / (a + RD). Readings every 15 min for 8 h with 1 % multiplicative noise.
const MU = 2.0, LAG = 1, D0 = 0.0008, DMAX = 1.2;
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5);
const softplus = (x) => Math.log1p(Math.exp(6 * x)) / 6; // a smooth corner at the end of the lag
const density = (t, d0 = D0) => { const e = d0 * Math.exp(MU * softplus(t - LAG)); return e / (1 + e / DMAX); };
const odOf = (rd) => (PAPER.b * rd) / (PAPER.a + rd);
const rdOf = (od) => (PAPER.a * od) / (PAPER.b - od);
const T = Array.from({ length: 33 }, (_, i) => i * 0.25);
const OD = T.map((t) => +(odOf(density(t)) * (1 + 0.02 * rnd())).toFixed(4));
const RD = OD.map((v) => +rdOf(v).toFixed(5));
const opt = { window: 5, minOd: 0.01, model: 'gompertz' };
const fitOD = analyse('OD600', T, OD, 0, opt);
const fitRD = analyse('RD', T, RD, 0, { ...opt, minOd: 0.002 });
// Late window (OD 0.3 to 1.5) by hand: the bend in the OD scale shows up as a slower rate.
const lateOD = analyse('OD600 late', T, OD, 0, { window: 5, minOd: 0.01, model: 'none', manual: [3.75, 4.75] });
const lateRD = analyse('RD late', T, RD, 0, { window: 5, minOd: 0.002, model: 'none', manual: [3.75, 4.75] });

// Figure 1: OD and RD on a log scale, with the tool's tangent on the OD curve.
const lg = (v) => Math.log10(v);
const fig1 = chart({
  title: 'A simulated SM3-like culture: OD600 and relative density', xLabel: 'Time (h)', yLabel: 'Reading (log scale)',
  series: [
    { name: 'OD600 (what the meter reads)', kind: 'dots', x: T, y: OD.map(lg), size: 2.6 },
    { name: 'Relative density (calibrated)', kind: 'dots', x: T, y: RD.map(lg), size: 2.6 },
    { name: `Tool's tangent on OD, ${fitOD.mu.toFixed(2)} per h`, kind: 'line', x: [fitOD.lag, 5], y: [fitOD.lag, 5].map((t) => +((fitOD.intercept + fitOD.mu * t) / Math.LN10).toFixed(3)), dash: '4 3' },
  ],
  xDomain: [0, 8], yDomain: [-3.5, 1], yFmt: (v) => String(+(10 ** v).toPrecision(2)),
  desc: `Simulated readings every 15 minutes. The steepest stretch of OD600 gives ${fitOD.mu.toFixed(2)} per hour, a doubling time of ${(fitOD.td * 60).toFixed(1)} minutes; the true rate in the simulation is 2.0 per hour.`, height: 290,
});

// Figure 2: the shift (serial dilution) method. Each culture starts from a 2-fold smaller inoculum; the time it takes
// to reach OD 0.1 grows by one doubling time per 2-fold dilution. Our simulation, same growth law.
const dil = [1, 2, 4, 8, 16, 32, 64];
const onset = dil.map((d) => {
  let lo = 0, hi = 12; // bisection for OD = 0.1
  for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (odOf(density(m, (D0 * 4) / d)) < 0.1) lo = m; else hi = m; }
  return +((lo + hi) / 2).toFixed(4);
});
const xs = dil.map((d) => Math.log10(d)), mx = xs.reduce((s, v) => s + v, 0) / xs.length, my = onset.reduce((s, v) => s + v, 0) / onset.length;
const slope = xs.reduce((s, x, i) => s + (x - mx) * (onset[i] - my), 0) / xs.reduce((s, x) => s + (x - mx) ** 2, 0);
const shiftTd = slope * Math.log10(2) * 60;
const fig2 = chart({
  title: 'Shift analysis: later onset for each dilution (simulated)', xLabel: 'Dilution, log10 (fold)', yLabel: 'Time to reach OD 0.1 (h)',
  series: [
    { name: 'Simulated cultures', kind: 'dots', x: xs.map((v) => +v.toFixed(3)), y: onset, size: 4 },
    { name: `Straight line, ${slope.toFixed(3)} h per tenfold`, kind: 'line', x: [0, 2], y: [my - slope * mx, my + slope * (2 - mx)].map((v) => +v.toFixed(3)) },
  ],
  xDomain: [0, 2], yDomain: [2, 6],
  desc: `Each two-fold dilution delays the culture by one doubling time. The slope of ${slope.toFixed(3)} hours per tenfold dilution gives ${shiftTd.toFixed(1)} minutes per doubling.`, height: 260,
});

const facts = {
  recompute: Object.fromEntries(Object.entries(recompute).map(([k, v]) => [k, +v.toFixed(2)])),
  sim: {
    od: { mu: +fitOD.mu.toFixed(3), tdMin: +(fitOD.td * 60).toFixed(1), lag: +fitOD.lag.toFixed(2), win: fitOD.win.map((i) => T[i]), gomp: fitOD.model && { mu: +fitOD.model.mu.toFixed(3), lag: +fitOD.model.lag.toFixed(2), r2: +fitOD.model.r2.toFixed(4) } },
    rd: { mu: +fitRD.mu.toFixed(3), tdMin: +(fitRD.td * 60).toFixed(1), lag: +fitRD.lag.toFixed(2), win: fitRD.win.map((i) => T[i]) },
    late: { od: +lateOD.mu.toFixed(3), rd: +lateRD.mu.toFixed(3), odRange: [OD[15], OD[19]] },
    shift: { onset, slope: +slope.toFixed(4), tdMin: +shiftTd.toFixed(2) },
  },
  odMaxSim: Math.max(...OD),
};
console.log(JSON.stringify(facts));
console.log('Table to paste:\n' + T.map((t, i) => `${t}\t${OD[i]}`).join('\n'));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'od', figure(fig1, 'Figure 1. A simulated culture growing at 2.0 per hour after a 1-hour lag (our numbers, not the paper\'s data). OD600 is what a spectrophotometer reads; relative density is OD corrected with the paper\'s calibration for SM3. The dashed line is the growth-curve tool\'s tangent through the steepest five OD readings.'));
  md = inject(md, 'shift', figure(fig2, 'Figure 2. The shift method, simulated: seven cultures, each started from half the cells of the one before, with the same growth law as Figure 1. The time to reach OD 0.1 against the dilution is a straight line whose slope gives the doubling time.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
