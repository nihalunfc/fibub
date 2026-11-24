// Figures for src/blog/discoveries/drake-equation-continents-oceans-plate-tectonics-civilizations.md, made with the maths of
// the Drake equation calculator (src/lib/sci/drake.ts: pointN, logMoments, exactCdf, sampleLogN, quantile, shareBelow).
// Run: node scripts/blog-figures/drake-equation-continents-oceans-plate-tectonics-civilizations.mjs
import fs from 'node:fs';
import { pointN, logMoments, exactCdf, sampleLogN, quantile, shareBelow } from '../../src/lib/sci/drake.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/drake-equation-continents-oceans-plate-tectonics-civilizations.md', import.meta.url);
// From Stern and Gerya (2024), Sci. Rep. 14, 8552, doi:10.1038/s41598-024-54700-x (CC BY 4.0): Drake's 1961 values
// R* = 1/yr, fp 0.2–0.5, ne 1–5, fl = 1, fi = 1, fc 0.1–0.2, L 1,000–100,000,000 yr; their new factors foc 0.0002–0.01 and
// fpt < 0.17, so fi = foc·fpt < 0.00003–0.002; their result N < 0.006 – < 100,000.
// OUR assumptions: fpt fixed at its upper limit 0.17 (so every N here is an upper limit), and every range log-uniform
// (as the calculator draws them).
const OLD = [[1, 1], [0.2, 0.5], [1, 5], [1, 1], [1, 1], [0.1, 0.2], [1e3, 1e8]].map(([lo, hi]) => ({ lo, hi }));
const FI = [0.0002 * 0.17, 0.01 * 0.17];
const NEW = OLD.map((r, i) => (i === 4 ? { lo: FI[0], hi: FI[1] } : r));
const ends = (R) => [R.reduce((p, r) => p * r.lo, 1), R.reduce((p, r) => p * r.hi, 1)];
const N = 200000, SEED = 1;
const summary = (R) => {
  const s = sampleLogN(R, N, SEED), m = logMoments(R);
  return { ends: ends(R).map((v) => +v.toPrecision(3)), point: +pointN(R).toPrecision(3), median: +(10 ** quantile(s, 0.5)).toPrecision(3),
    p5: +(10 ** quantile(s, 0.05)).toPrecision(3), p95: +(10 ** quantile(s, 0.95)).toPrecision(3),
    pBelow1: +shareBelow(s, 0).toFixed(4), pBelow1Exact: +exactCdf(R, 0).toFixed(4), pAtLeast1000: +(1 - exactCdf(R, 3)).toFixed(4),
    meanLog: +m.mean.toFixed(3), sdLog: +Math.sqrt(m.var).toFixed(2), shares: m.share.map((v) => Math.round(100 * v)) };
};
const out = { fiRange: FI.map((v) => +v.toPrecision(3)), old: summary(OLD), new: summary(NEW),
  paperEnds: [200 * 0.00003, 5e7 * 0.002] };
// Middle estimate against a fixed L, with the other factors at their log-middles.
const Ls = Array.from({ length: 51 }, (_, i) => 3 + i * 0.1);
const midAtL = (R, lg) => pointN(R.map((r, i) => (i === 6 ? { lo: 10 ** lg, hi: 10 ** lg } : r)));
out.breakEvenL = (() => { let lo = 0, hi = 12; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; midAtL(NEW, m) < 1 ? (lo = m) : (hi = m); } return Math.round(10 ** lo); })();
out.midNewAtL = [3, 5, 8].map((lg) => +midAtL(NEW, lg).toPrecision(3));

const xs = Array.from({ length: 141 }, (_, i) => -5 + i * 0.1);
const fig1 = chart({
  title: 'Chance that fewer than N civilisations exist', xLabel: 'N (number of civilisations now)', yLabel: 'P(fewer than N)',
  series: [
    { name: "Drake's 1961 ranges", kind: 'line', x: xs, y: xs.map((x) => +exactCdf(OLD, x).toFixed(4)) },
    { name: 'With continents, oceans, plate tectonics', kind: 'line', x: xs, y: xs.map((x) => +exactCdf(NEW, x).toFixed(4)) },
  ],
  xDomain: [-5, 9], yDomain: [0, 1], xTicks: [-4, -2, 0, 2, 4, 6, 8], xFmt: (t) => (t === 0 ? '1' : `10${String(t).replace('-', '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])}`),
  vlines: [{ x: 0, text: 'N = 1' }],
  desc: `Cumulative probability of N with every factor drawn log-uniformly. With Drake's ranges the chance of fewer than one civilisation is ${(100 * out.old.pBelow1Exact).toFixed(1)} percent; with the two new factors it is ${(100 * out.new.pBelow1Exact).toFixed(1)} percent.`, height: 260,
});
const fig2 = chart({
  title: 'Middle estimate of N against the lifetime L', xLabel: 'L, years a civilisation keeps signalling', yLabel: 'N (middle estimate)',
  series: [
    { name: "Drake's 1961 ranges", kind: 'line', x: Ls, y: Ls.map((lg) => +Math.log10(midAtL(OLD, lg)).toFixed(3)) },
    { name: 'With the two new factors', kind: 'line', x: Ls, y: Ls.map((lg) => +Math.log10(midAtL(NEW, lg)).toFixed(3)) },
  ],
  xDomain: [3, 8], yDomain: [-3, 8], xTicks: [3, 4, 5, 6, 7, 8], xFmt: (t) => `10${'⁰¹²³⁴⁵⁶⁷⁸⁹'[t]}`,
  yTicks: [-2, 0, 2, 4, 6, 8], yFmt: (t) => (t === 0 ? '1' : `10${String(t).replace('-', '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])}`),
  hlines: [{ y: 0, text: 'N = 1' }],
  desc: `With every other factor at the middle of its range, N rises in step with L. With the new factors N reaches 1 only when civilisations keep signalling for about ${out.breakEvenL.toLocaleString('en')} years.`, height: 260,
});
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cdf', figure(fig1, 'Figure 1. The chance that fewer than N civilisations exist, for Drake\'s 1961 ranges and with fi replaced by the paper\'s continents-oceans and plate-tectonics factors (fpt at its upper limit of 0.17, our assumption). Exact sums from the Drake equation calculator\'s maths, every factor drawn log-uniformly.'));
  md = inject(md, 'life', figure(fig2, 'Figure 2. The middle estimate of N (every other factor at the middle of its range on a log scale) as the lifetime L changes. Log scales on both axes.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
