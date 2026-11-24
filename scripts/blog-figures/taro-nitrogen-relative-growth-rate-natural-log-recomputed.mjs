// Figures for src/blog/discoveries/taro-nitrogen-relative-growth-rate-natural-log-recomputed.md, made with the maths
// of the Plant growth analysis tool (src/lib/sci/plantgrowth.ts: RGR between harvests, Hunt's formulas).
// Run: node scripts/blog-figures/taro-nitrogen-relative-growth-rate-natural-log-recomputed.mjs
import fs from 'node:fs';
import { analyse, interval } from '../../src/lib/sci/plantgrowth.ts';
import { normInv } from '../../src/lib/sci/stats.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/taro-nitrogen-relative-growth-rate-natural-log-recomputed.md', import.meta.url);

// Inputs from the paper: Steel, Antille and Gleadow (2026), Front. Plant Sci. 16: 1731490, doi:10.3389/fpls.2025.1731490 (CC BY 4.0).
// Harvest 1 at 35 days after planting, mean total dry mass 4.91 g (± 0.52 SE, 12 plants). Harvest 2 at 124 to 125 days and
// harvest 4 at 298 to 305 days: mean total dry mass and the paper's RGR (g g-1 d-1) for each nitrogen level (mM N).
// The midpoints, 124.5 and 301.5 days, are OUR assumption.
const T1 = 35, W1 = 4.91, T2 = 124.5, T4 = 301.5;
const N = [2.5, 5, 10, 15, 20];
const H2 = { w: [20.70, 24.52, 27.11, 28.85, 17.20], rgr: [0.0068, 0.0063, 0.0079, 0.0085, 0.0058] };
const H4 = { w: [74.77, 147.32, 168.72, 102.91, 66.49], rgr: [0.0043, 0.0055, 0.0057, 0.0048, 0.0041] };
// RGR from harvest means with the tool's maths ('mean' = ln of mean W, one value per harvest).
const h = (t, w) => ({ t, n: 1, w, la: 1, lw: NaN, lnW: Math.log(w), sdLnW: NaN, lar: 1 / w, sla: NaN, lwr: NaN });
const rgrLn = (t2, w2) => interval(h(T1, W1), h(t2, w2), 'mean').rgr;
const rows = [...N.map((n, i) => ({ n, h: 2, t: T2, w: H2.w[i], paper: H2.rgr[i] })), ...N.map((n, i) => ({ n, h: 4, t: T4, w: H4.w[i], paper: H4.rgr[i] }))]
  .map((r) => ({ ...r, ln: rgrLn(r.t, r.w), log10: rgrLn(r.t, r.w) / Math.LN10 }));
rows.forEach((r) => { r.ratio = r.paper / r.ln; });
const meanRatio = rows.reduce((s, r) => s + r.ratio, 0) / rows.length;

// Figure 1: the paper's RGR against the natural-log RGR from the same means.
const xs = [0, 0.022];
const fig1 = chart({
  title: 'Taro RGR: paper against the natural-log formula', xLabel: 'RGR from ln of harvest means (g g⁻¹ d⁻¹)', yLabel: 'RGR in the paper (g g⁻¹ d⁻¹)',
  series: [
    { name: 'Harvest 2', kind: 'dots', x: rows.filter((r) => r.h === 2).map((r) => +r.ln.toFixed(5)), y: rows.filter((r) => r.h === 2).map((r) => r.paper), size: 3.5 },
    { name: 'Harvest 4', kind: 'dots', x: rows.filter((r) => r.h === 4).map((r) => +r.ln.toFixed(5)), y: rows.filter((r) => r.h === 4).map((r) => r.paper), size: 3.5 },
    { name: '', noLegend: true, kind: 'line', x: xs, y: xs, colour: 'var(--muted)', dash: '5 4', label: { text: 'same value', at: [0.0095, 0.0095], dx: -6, dy: -8, anchor: 'end' } },
    { name: '', noLegend: true, kind: 'line', x: xs, y: xs.map((x) => +(x / Math.LN10).toFixed(5)), colour: 'var(--ink)', dash: '2 3', label: { text: '÷ ln 10 (log₁₀)', at: [0.0195, 0.0195 / Math.LN10], dx: 0, dy: 16, anchor: 'end' } },
  ],
  xDomain: [0, 0.022], yDomain: [0, 0.012],
  desc: `The ten published RGR values lie on the line for base-10 logarithms, about ${meanRatio.toFixed(3)} times the natural-log RGR, not on the line of equal values.`, height: 280,
});

// Figure 2: what each reading of the 10 mM rate predicts for plant mass, against the harvest means.
const r10 = H4.rgr[2], tt = Array.from({ length: 55 }, (_, i) => T1 + i * 5);
const obs = { t: [T1, T2, 255, T4], w: [W1, 27.11, 115.89, 168.72] };
const fig2 = chart({
  title: 'Taro at 10 mM N: mass predicted from the published RGR', xLabel: 'Days after planting', yLabel: 'Total dry mass (g)',
  series: [
    { name: 'Harvest means', kind: 'dots', x: obs.t, y: obs.w, size: 4 },
    { name: `Read as ln: W₁·e^(${r10}t)`, kind: 'line', x: tt, y: tt.map((t) => +(W1 * Math.exp(r10 * (t - T1))).toFixed(2)) },
    { name: `Read as log₁₀: W₁·10^(${r10}t)`, kind: 'line', x: tt, y: tt.map((t) => +(W1 * 10 ** (r10 * (t - T1))).toFixed(2)), colour: 'var(--ink)', dash: '5 4' },
  ],
  xDomain: [30, 305], yDomain: [0, 200],
  desc: `From 4.91 g at 35 days, an RGR of ${r10} per day read as a natural-log rate gives ${(W1 * Math.exp(r10 * (T4 - T1))).toFixed(1)} g by day 301.5; read as base 10 it gives ${(W1 * 10 ** (r10 * (T4 - T1))).toFixed(1)} g, close to the 168.72 g measured.`, height: 270,
});

// SIMULATED plants for "Check it yourself" (our assumption): six plants per harvest, log-normal around the 10 mM means with
// the spread implied by the SEs (4.91 ± 0.52 from 12 plants; 168.72 ± 13.78 read as 6 plants), rescaled to the exact means.
// Leaf areas are made up (250 cm² at harvest 1, about 171 at harvest 4) and do not affect RGR.
const sixLog = (mean, sd) => { const s2 = Math.log(1 + (sd / mean) ** 2), mu = Math.log(mean) - s2 / 2; const v = Array.from({ length: 6 }, (_, i) => Math.exp(mu + Math.sqrt(s2) * normInv((i + 0.5) / 6))); const k = mean / (v.reduce((a, b) => a + b, 0) / 6); return v.map((x) => +(x * k).toFixed(2)); };
const p1 = sixLog(W1, 0.52 * Math.sqrt(12)), p4 = sixLog(168.72, 13.78 * Math.sqrt(6));
const la1 = [235, 262, 248, 255, 241, 259], la4 = [150, 182, 166, 177, 158, 193];
const plants = [...p1.map((w, i) => ({ t: T1, w, la: la1[i], lw: NaN })), ...p4.map((w, i) => ({ t: 301, w, la: la4[i], lw: NaN }))];
const aLn = analyse(plants, 'lnmean'), aMean = analyse(plants, 'mean');

const r5 = (v) => +v.toFixed(5);
console.log(JSON.stringify({ rows: rows.map((r) => ({ n: r.n, h: r.h, w: r.w, paper: r.paper, ln: r5(r.ln), log10: r5(r.log10), ratio: +r.ratio.toFixed(3) })), meanRatio: +meanRatio.toFixed(3), invLn10: +(1 / Math.LN10).toFixed(4),
  pred10: { ln: +(W1 * Math.exp(r10 * (T4 - T1))).toFixed(1), log10: +(W1 * 10 ** (r10 * (T4 - T1))).toFixed(1) },
  dayRange: { h2: [124, 125].map((t) => [2.5, 15].map((n, k) => r5(rgrLn(t, [20.70, 28.85][k])))), h4: [298, 305].map((t) => r5(rgrLn(t, 168.72))) },
  sim: { p1, p4, rgrLnMean: r5(aLn.intervals[0].rgr), se: r5(aLn.intervals[0].rgrSe), lo: r5(aLn.intervals[0].rgrLo), hi: r5(aLn.intervals[0].rgrHi), rgrMean: r5(aMean.intervals[0].rgr) } }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ratio', figure(fig1, 'Figure 1. The paper\'s RGR for each nitrogen level at harvests 2 and 4 against the RGR the Plant growth analysis maths gives from the same harvest means with natural logarithms. Dashed: equal values; dotted: the natural-log value divided by ln 10.'));
  md = inject(md, 'mass', figure(fig2, 'Figure 2. Growth from the harvest 1 mean at the published 10 mM rate, read as a natural-log rate (solid) or a base-10 rate (dashed), with the harvest means at 10 mM N. Harvest days are midpoints of the stated ranges.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
