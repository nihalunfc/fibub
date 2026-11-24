// Figures and numbers for src/blog/discoveries/ethereum-tokenomics-adf-kpss-simulated-p-values-trend-stationarity.md,
// made with the maths of the Unit root tests tool (src/lib/sci/unitroot.ts).
// Run: node scripts/blog-figures/ethereum-tokenomics-adf-kpss-simulated-p-values-trend-stationarity.mjs
import fs from 'node:fs';
import { simulateNull, normalRng, simPValue, criticalValues } from '../../src/lib/sci/unitroot.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ethereum-tokenomics-adf-kpss-simulated-p-values-trend-stationarity.md', import.meta.url);

// Statistics and p-values printed in Table 2 of Mohammad, Harkiolakis and Sarbazvatan (2026), Frontiers in
// Blockchain 9: 1817622, doi:10.3389/fbloc.2026.1817622 (CC BY 4.0). N = 108 monthly observations.
const V = ['ln(Price)', 'ln(Fees)', 'ln(Burns)', 'ln(TVL)', 'ln(Unlocks)', 'Gini'];
const ADF = [[-2.251, 0.188], [-1.817, 0.372], [-1.692, 0.435], [-1.548, 0.509], [-1.902, 0.331], [-1.618, 0.474]];
const ADFD = [-6.124, -10.894, -10.670, -5.162, -6.643, -4.835];
const KPSS = [[0.250, 0.010], [0.145, 0.051], [0.139, 0.063], [0.345, 0.010], [0.305, 0.010], [0.254, 0.010]];
const REPS = 20000, SEED = 1;

// ADF p-values: the page's own simulation (random walks, Dickey-Fuller t ratio) for 107 regression rows (N = 108, no lags).
// OUR ASSUMPTION: the paper does not give the lag lengths, so we also run T = 100 to see how much this matters.
const adfDraws = (reg, T) => simulateNull({ test: 'adf', regression: reg, T }, REPS, normalRng(SEED)).sort((a, b) => a - b);
const dC = adfDraws('c', 107), dC100 = adfDraws('c', 100), dCT = adfDraws('ct', 107);
const pC = ADF.map(([s]) => simPValue(dC, s, true).p), pC100 = ADF.map(([s]) => simPValue(dC100, s, true).p), pCT = ADF.map(([s]) => simPValue(dCT, s, true).p);
const pDiff = simPValue(dC, Math.max(...ADFD), true).p;
// KPSS: simulated white noise, n = 108, with a level (c) or a level and trend (ct); lags unknown, so 0, 4 and 10.
const kd = (reg, lags) => simulateNull({ test: 'kpss', regression: reg, n: 108, lags }, REPS, normalRng(SEED)).sort((a, b) => a - b);
const kct = { 0: kd('ct', 0), 4: kd('ct', 4), 10: kd('ct', 10) }, kc = { 0: kd('c', 0), 4: kd('c', 4), 10: kd('c', 10) };
const pKct = KPSS.map(([s]) => simPValue(kct[0], s, false).p), pKc = KPSS.map(([s]) => simPValue(kc[0], s, false).p);
const cvCt = Object.fromEntries(Object.entries(kct).map(([l, d]) => [l, criticalValues(d, false, [0.1, 0.05, 0.01]).map((c) => c.value)]));
const cvC = Object.fromEntries(Object.entries(kc).map(([l, d]) => [l, criticalValues(d, false, [0.1, 0.05, 0.01]).map((c) => c.value)]));
const f3 = (x) => x.toFixed(3);

console.log('ADF const p (T=107):', pC.map(f3).join(' '), ' paper:', ADF.map((a) => a[1]).join(' '));
console.log('ADF const p (T=100):', pC100.map(f3).join(' '), ' max |diff| T107 vs T100', Math.max(...pC.map((p, i) => Math.abs(p - pC100[i]))).toFixed(4));
console.log('ADF const p max |tool - paper|', Math.max(...pC.map((p, i) => Math.abs(p - ADF[i][1]))).toFixed(4));
console.log('ADF const+trend p:', pCT.map(f3).join(' '));
console.log('ADF crit c T107 1/5/10%:', criticalValues(dC, true, [0.01, 0.05, 0.1]).map((c) => c.value.toFixed(3)).join(' '));
console.log('weakest first-difference stat p:', pDiff);
console.log('KPSS trend p (0 lags):', pKct.map(f3).join(' '), ' paper:', KPSS.map((a) => a[1]).join(' '));
console.log('KPSS level p (0 lags):', pKc.map(f3).join(' '));
console.log('KPSS trend crit 10/5/1% by lags:', JSON.stringify(Object.fromEntries(Object.entries(cvCt).map(([l, v]) => [l, v.map(f3)]))));
console.log('KPSS level crit 10/5/1% by lags:', JSON.stringify(Object.fromEntries(Object.entries(cvC).map(([l, v]) => [l, v.map(f3)]))));
console.log('KPSS trend p by lags for Fees and Burns:', [0, 4, 10].map((l) => [KPSS[1], KPSS[2]].map(([s]) => f3(simPValue(kct[l], s, false).p)).join('/')).join('  '));

const fig1 = chart({
  title: 'Dickey-Fuller p-values: paper against the tool', xLabel: "Paper's p-value", yLabel: 'Simulated p-value (constant only)',
  series: [
    { name: 'equal', x: [0, 0.6], y: [0, 0.6], kind: 'line', colour: 'var(--muted)', dash: '4 4' },
    { name: 'ADF in levels', x: ADF.map((a) => a[1]), y: pC, kind: 'dots', size: 4.5 },
  ],
  xDomain: [0.1, 0.6], yDomain: [0.1, 0.6], desc: 'Six points lie on the diagonal: the simulated p-values with a constant (0.19, 0.37, 0.43, 0.51, 0.33, 0.47) equal the paper\'s within 0.003.',
});
const fig2 = chart({
  title: 'KPSS statistics against 5 % limits', xLabel: 'Variable (1 Price, 2 Fees, 3 Burns, 4 TVL, 5 Unlocks, 6 Gini)', yLabel: 'KPSS statistic',
  series: [{ name: 'KPSS', x: [1, 2, 3, 4, 5, 6], y: KPSS.map((k) => k[0]), kind: 'dots', size: 4.5 }],
  xDomain: [0.5, 6.5], xTicks: [1, 2, 3, 4, 5, 6], yDomain: [0, 0.5],
  hlines: [{ y: cvCt[0][1], text: `trend-stationary 5 % limit ${f3(cvCt[0][1])}` }, { y: cvC[0][1], text: `level-stationary 5 % limit ${f3(cvC[0][1])}` }],
  desc: 'Six KPSS statistics between 0.139 and 0.345. All lie below the level-stationary 5 percent limit of 0.464; four lie above the trend-stationary limit of 0.148.',
});
let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'adf', figure(fig1, 'Six unit-root p-values from the paper, recomputed with the tool\'s own simulation for a constant and about 107 rows.'));
md = inject(md, 'kpss', figure(fig2, 'The paper\'s KPSS statistics against simulated 5 % limits for 108 observations and no lags. The paper\'s p-values only make sense against the lower, trend-stationary limit.'));
fs.writeFileSync(ART, md);

// The paper's KPSS statistics for the first differences (Table 2): which limit do they pass?
const KD = [0.146, 0.039, 0.040, 0.363, 0.184, 0.094];
console.log('KPSS differences, trend p:', KD.map((s) => f3(simPValue(kct[0], s, false).p)).join(' '), ' level p:', KD.map((s) => f3(simPValue(kc[0], s, false).p)).join(' '));

// "Check it yourself": the tool's own made-up example (price_a, 120 months), 10,000 draws, seed 1, as the page does it.
import { adf, kpss } from '../../src/lib/sci/unitroot.ts';
const L = fs.readFileSync(new URL('../../src/tools/unit-root-cointegration/example.csv', import.meta.url), 'utf8').trim().split('\n');
const H = L[0].split(','), pa = L.slice(1).map((l) => +l.split(',')[H.indexOf('price_a')]);
for (const reg of ['c', 'ct']) {
  const a = adf(pa, { regression: reg, autolag: 'aic' });
  const ap = simPValue(simulateNull({ test: 'adf', regression: reg, T: a.nobs }, 10000, normalRng(1)), a.stat, true);
  const k = kpss(pa, { regression: reg, nlags: 'auto' });
  const kdd = simulateNull({ test: 'kpss', regression: reg, n: k.nobs, lags: k.lags }, 10000, normalRng(1)).sort((x, y) => x - y);
  const kp = simPValue(kdd, k.stat, false);
  console.log(`price_a ${reg}: ADF ${a.stat.toFixed(3)} lags ${a.usedLag} rows ${a.nobs} p ${ap.p.toFixed(3)} | KPSS ${k.stat.toFixed(3)} lags ${k.lags} p ${kp.p.toFixed(4)} 5% ${criticalValues(kdd, false, [0.05])[0].value.toFixed(3)}`);
}
