// Figures for src/blog/discoveries/european-eel-bottom-trawl-cpue-log-linear-slope-annual-decline.md, made with the maths of the
// CPUE trend calculator (src/lib/sci/cpue.ts: log-linear standardised index and its yearly trend).
// Run: node scripts/blog-figures/european-eel-bottom-trawl-cpue-log-linear-slope-annual-decline.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { cpueIndex } from '../../src/lib/sci/cpue.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/european-eel-bottom-trawl-cpue-log-linear-slope-annual-decline.md', import.meta.url);

// Inputs from the paper: Svedang (2025), Front. Fish Sci. 3, doi:10.3389/frish.2025.1580250 (CC BY 4.0).
// Year slopes (all eels / eels of 50 cm or more): the pooled value -0.10371 / -0.09117 and per survey; surveys run 1985-2024 (some 1991-2024).
const SLOPES = [['BITSQ1', -0.07592], ['BITSQ4', -0.12185], ['BTS', -0.15002], ['DYFS', -0.08294], ['IBTSQ1', 0.000995], ['IBTSQ3', -0.06941], ['SNS', -0.3335], ['All', -0.10371]];
// OUR assumption: the paper does not state the link function; a negative binomial model normally uses a log link, so a slope b
// means CPUE changes by a factor exp(b) each year.
const pct = (b) => 100 * (Math.exp(b) - 1);
const B = -0.10371, Y0 = 1991, Y1 = 2023, N = 40, SD = 1.0, MEAN0 = 8; // simulated: 40 hauls a year, spread (sd of log CPUE) 1.0, 8 eels/h at the start: all OUR assumptions

let seed = 1580250; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const recs = [];
for (let y = Y0; y <= Y1; y++) for (let k = 0; k < N; k++) { const eff = 0.4 + 0.4 * rnd(), cpue = Math.exp(Math.log(MEAN0) + B * (y - Y0) + SD * gauss() - SD * SD / 2); recs.push({ year: y, catch: cpue * eff, effort: eff, f: [] }); }
const fit = cpueIndex(recs, [], 'drop');
const win = [5, 8, 12, 20, 33].map((n) => { const r = cpueIndex(recs.filter((x) => x.year > Y1 - n), [], 'drop'); return { n, ...r.trend }; });
console.log(JSON.stringify({
  perYear: SLOPES.map(([n, b]) => [n, +pct(b).toFixed(2)]), halfLife: +(Math.log(2) / 0.10371).toFixed(2), tenfold: +(Math.log(10) / 0.10371).toFixed(1),
  remaining33: +(100 * Math.exp(B * 33)).toFixed(1), remaining34: +(100 * Math.exp(B * 34)).toFixed(1), remaining39: +(100 * Math.exp(B * 39)).toFixed(1), sns: +(100 * Math.exp(-0.3335 * 10)).toFixed(1),
  trend: { pct: +fit.trend.pct.toFixed(2), lo: +fit.trend.lo.toFixed(2), hi: +fit.trend.hi.toFixed(2), truth: +pct(B).toFixed(2) }, s: +fit.s.toFixed(3), n: fit.n,
  windows: win.map((w) => ({ n: w.n, pct: +w.pct.toFixed(1), lo: +w.lo.toFixed(1), hi: +w.hi.toFixed(1) })),
  first: +fit.years[0].index.toFixed(2), last: +fit.years[fit.years.length - 1].index.toFixed(2),
}));

const yrs = fit.years.map((r) => r.year);
const fig1 = chart({
  title: 'Simulated eel CPUE index, 1991 to 2023', xLabel: 'Year', yLabel: 'Eels per trawl hour (standardised index)',
  series: [
    { name: 'Index (simulated)', kind: 'dots', x: yrs, y: fit.years.map((r) => +r.index.toFixed(2)), size: 3.5, errors: fit.years.map((r) => +((r.hi - r.lo) / 2).toFixed(2)) },
    { name: 'True curve', kind: 'line', x: yrs, y: yrs.map((y) => +(MEAN0 * Math.exp(B * (y - Y0))).toFixed(2)), colour: 'var(--c-tools)' },
  ],
  xDomain: [1990, 2024], yDomain: [0, 12], xFmt: (v) => String(v),
  desc: `Simulated standardised CPUE of 40 hauls a year falling at the pooled slope of -0.10371 a year, with the true curve. The tool's fitted trend is ${fit.trend.pct.toFixed(1)} % a year (95 % interval ${fit.trend.lo.toFixed(1)} to ${fit.trend.hi.toFixed(1)}).`, height: 300,
});
const fig2 = chart({
  title: 'How long a series is needed to see −9.9 % a year?', xLabel: 'Years in the series (the latest n years)', yLabel: 'Trend (% per year)',
  series: [
    { name: 'Estimate with 95 % interval', kind: 'dots', x: win.map((w) => w.n), y: win.map((w) => +w.pct.toFixed(2)), size: 4.5, errors: win.map((w) => +((w.hi - w.lo) / 2).toFixed(2)) },
  ],
  xDomain: [0, 35], yDomain: [-40, 20], hlines: [{ y: 0, text: 'no trend' }, { y: +pct(B).toFixed(2), text: 'true −9.85' }],
  desc: `Trend and 95 % interval fitted to the last 5, 8, 12, 20 and 33 years of the same simulated series: ${win.map((w) => `${w.n} years ${w.pct.toFixed(1)} % (${w.lo.toFixed(1)} to ${w.hi.toFixed(1)})`).join('; ')}.`, height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'index', figure(fig1, 'Figure 1. A simulated survey series (our assumptions: 40 hauls a year, spread 1.0 in the logarithm, 8 eels per hour in 1991) that falls at the pooled slope of the paper, with the index and 95 % intervals the CPUE trend calculator gives. Not the paper\'s data.'));
  md = inject(md, 'windows', figure(fig2, 'Figure 2. The fitted trend and its 95 % interval when only the last 5, 8, 12, 20 or all 33 years of the same simulated series are used.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
