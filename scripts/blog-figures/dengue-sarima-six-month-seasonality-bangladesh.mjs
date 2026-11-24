// Figures for src/blog/discoveries/dengue-sarima-six-month-seasonality-bangladesh.md, made with the maths of the
// Time series tool (src/lib/sci/timeseries.ts: STL, seasonal strength, ACF/PACF, differencing, Ljung-Box, ARIMA).
// Run: node scripts/blog-figures/dengue-sarima-six-month-seasonality-bangladesh.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import * as T from '../../src/lib/sci/timeseries.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/dengue-sarima-six-month-seasonality-bangladesh.md', import.meta.url);

// From the paper (Alam et al. 2025, PLOS ONE 20(8): e0323238, CC BY): monthly dengue cases for Bangladesh from
// January 2008 to November 2024 (203 months), a July-to-November high season with September the usual peak, a huge
// 2023 outbreak, and a reported ACF of about 0.8 at lag 1 and 0.5 at lag 2.
// Everything below the next line is OUR simulation: we never had the paper's monthly counts.
const N = 203; // months, January 2008 to November 2024
// Monthly log-scale seasonal shape, low in the dry months and peaking in September (our assumption).
const SHAPE = [-1.6, -1.8, -1.6, -1.2, -0.7, -0.1, 0.6, 1.0, 1.25, 1.05, 0.45, -0.5];
const BUMP_AT = 186; // month index of the 2023 outbreak step (our assumption)

let seed = 20250818;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
let e = 0;
const cases = [];
for (let t = 0; t < N; t++) {
  const trend = 6.2 + 0.0075 * t + (t >= BUMP_AT ? 1.0 : 0);
  e = 0.55 * e + 0.45 * gauss(); // AR(1) remainder, so the series is not independent month to month
  cases.push(Math.max(1, Math.round(Math.exp(trend + SHAPE[t % 12] + 0.55 * e))));
}

// 1. How much season is there, if you assume a period of m months?
const PERIODS = Array.from({ length: 17 }, (_, i) => i + 2); // 2 to 18
const strengths = PERIODS.map((m) => T.strength(T.stl(cases, m)).seasonal);
// 2. ACF and PACF of the raw counts, with the Bartlett band.
const LAGS = 24;
const r = T.acf(cases, LAGS);
const band = T.bartlett(r, N)[1];
const pac = T.pacf(cases, 6);
// 3. Seasonal differencing at 6 and at 12 months, then ARIMA(2,1,2) on what is left.
const fits = [6, 12].map((m) => {
  const y = T.difference(cases, 0, 1, m);
  const lbPlain = T.ljungBox(T.difference(cases, 1, 1, m), 24);
  const f = T.arima(y, 2, 1, 2, false);
  const lb = T.ljungBox(f.resid, 24, 4);
  const ra = T.acf(f.resid, 24);
  return { m, n: y.length, lbPlain, sd: Math.sqrt(f.sigma2), q: lb.q, p: lb.p, acf6: ra[6], acf12: ra[12], aicc: f.aicc };
});

const out = {};
const months = Array.from({ length: N }, (_, i) => 2008 + i / 12);
out.series = figure(chart({
  title: 'A simulated Bangladesh dengue series, 2008 to 2024', xLabel: 'Year', yLabel: 'Cases per month',
  series: [{ name: '', kind: 'line', x: months, y: cases }],
  xTicks: [2008, 2011, 2014, 2017, 2020, 2023], xFmt: (v) => String(Math.round(v)),
  desc: 'A simulated monthly dengue series for Bangladesh, 203 months, with a July to November high season peaking in September and a large step in 2023.',
  height: 250,
}), `Figure 1. Our simulated monthly series: ${N} months with a July-to-November season peaking in September and a step up in 2023, the pattern the paper describes. These are not the paper's counts, which are not published as a table.`);

out.strength = figure(chart({
  title: 'Seasonal strength against the period you assume', xLabel: 'Assumed season length (months)', yLabel: 'Seasonal strength (0 to 1)',
  series: [{ name: '', kind: 'line', x: PERIODS, y: strengths }, { name: '', noLegend: true, kind: 'dots', x: PERIODS, y: strengths, size: 3, colour: 'var(--c-blog)' }],
  xTicks: [2, 4, 6, 8, 10, 12, 14, 16, 18], yDomain: [0, 1],
  vlines: [{ x: 6, text: '6' }, { x: 12, text: '12' }],
  desc: `STL seasonal strength for every assumed season length from 2 to 18 months. It is ${strengths[4].toFixed(2)} at a period of 6 months and ${strengths[10].toFixed(2)} at 12.`,
  height: 250,
}), `Figure 2. The Time series tool's STL decomposition run once for every assumed season length. Strength peaks at 12 months (${strengths[10].toFixed(2)}); at the paper's 6 months it is only ${strengths[4].toFixed(2)}. Six months scores middling because half of a 12-month cycle repeats too.`);

out.acf = figure(chart({
  title: 'Autocorrelation of the monthly counts', xLabel: 'Lag (months)', yLabel: 'Autocorrelation',
  series: [{ name: '', kind: 'dots', x: Array.from({ length: LAGS }, (_, i) => i + 1), y: r.slice(1), size: 3.2 }],
  xTicks: [1, 6, 12, 18, 24], yDomain: [-0.4, 1],
  hlines: [{ y: 0, text: '' }, { y: band, text: '95 % band' }, { y: -band, text: '' }],
  desc: `Autocorrelation at lags 1 to 24 of the simulated monthly counts: ${r[1].toFixed(2)} at lag 1, ${r[2].toFixed(2)} at lag 2 and a second hump of ${r[12].toFixed(2)} at lag 12.`,
  height: 250,
}), `Figure 3. Autocorrelation of the simulated counts with the 95 % Bartlett band (±${band.toFixed(2)}). Lag 1 is ${r[1].toFixed(2)} and lag 2 ${r[2].toFixed(2)}, the values the paper reports, and the second hump sits at lag ${r.indexOf(Math.max(...r.slice(8, 16)))} months, not 6.`);

let md = fs.readFileSync(ART, 'utf8');
for (const [k, v] of Object.entries(out)) md = inject(md, k, v);
fs.writeFileSync(ART, md);

console.log('strength by period:', PERIODS.map((m, i) => `${m}:${strengths[i].toFixed(3)}`).join(' '));
console.log('acf 1..14:', r.slice(1, 15).map((v) => v.toFixed(2)).join(' '), 'band', band.toFixed(3));
console.log('pacf 1..6:', pac.slice(1).map((v) => v.toFixed(2)).join(' '));
for (const f of fits) console.log(`period ${f.m}: n=${f.n} plain LB Q=${f.lbPlain.q.toFixed(1)} | ARIMA(2,1,2) resid sd=${f.sd.toFixed(0)} LB Q=${f.q.toFixed(1)} p=${f.p.toExponential(2)} acf6=${f.acf6.toFixed(2)} acf12=${f.acf12.toFixed(2)}`);
console.log('series first 12:', cases.slice(0, 12).join(', '));
console.log('series last 14:', cases.slice(-14).join(', '));
console.log('max', Math.max(...cases), 'min', Math.min(...cases));
console.log('strength trend/seasonal at 12:', JSON.stringify(T.strength(T.stl(cases, 12))), 'at 6:', JSON.stringify(T.strength(T.stl(cases, 6))));
