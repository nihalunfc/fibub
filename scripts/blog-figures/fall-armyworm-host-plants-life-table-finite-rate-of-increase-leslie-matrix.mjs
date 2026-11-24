// Figures for src/blog/discoveries/fall-armyworm-host-plants-life-table-finite-rate-of-increase-leslie-matrix.md, made
// with the maths of Population growth models (src/lib/sci/popgrowth.ts: the Leslie matrix, λ, R0 and generation time).
// Run: node scripts/blog-figures/fall-armyworm-host-plants-life-table-finite-rate-of-increase-leslie-matrix.mjs
import fs from 'node:fs';
import { leslie, expTime } from '../../src/lib/sci/popgrowth.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fall-armyworm-host-plants-life-table-finite-rate-of-increase-leslie-matrix.md', import.meta.url);

// Inputs from the paper: Tajdar et al. (2025), Frontiers in Insect Science 5: 1548497, doi:10.3389/finsc.2025.1548497 (CC BY 4.0).
// Per host: net reproductive rate R0 (offspring per individual), age at the start of egg laying (days), oviposition days,
// and the paper's own r (per day), λ (per day) and T (days).
const HOSTS = [
  { id: 'Maize', R0: 532.8, onset: 29, ovi: 6.7, r: 0.21, lam: 1.23, T: 30.0 },
  { id: 'Castor bean', R0: 424.36, onset: 37, ovi: 4.6, r: 0.16, lam: 1.17, T: 36.95 },
  { id: 'Potato', R0: 174.94, onset: 34, ovi: 4.1, r: 0.14, lam: 1.15, T: 35.17 },
  { id: 'Wheat', R0: 94.62, onset: 38, ovi: 3.4, r: 0.11, lam: 1.12, T: 39.02 },
];
// OUR assumptions: one class per day of age; survival folded into the offspring numbers (each day's F is net offspring
// per newborn, so Σ F = R0); egg laying starts on the onset day, lasts the oviposition days (rounded), and each day
// gives half the day before ("halving"). "One day" puts all of R0 on the onset day; "even" spreads it evenly.
const SHAPES = { one: (d) => [1], even: (d) => Array(d).fill(1), halving: (d) => Array.from({ length: d }, (_, k) => 0.5 ** k) };
const build = (h, shape, round = false) => {
  const d = Math.max(1, Math.round(h.ovi)), w = SHAPES[shape](d), sw = w.reduce((a, b) => a + b, 0), n = h.onset + w.length - 1;
  const F = new Array(n).fill(0), P = new Array(n).fill(1); P[n - 1] = 0;
  w.forEach((x, k) => { F[h.onset - 1 + k] = round ? +(h.R0 * x / sw).toFixed(2) : h.R0 * x / sw; });
  return { F, P };
};
const res = HOSTS.map((h) => {
  const m = Object.fromEntries(Object.keys(SHAPES).map((s) => { const { F, P } = build(h, s), L = leslie(F, P); return [s, { lam: +L.lambda.toFixed(4), r: +L.r.toFixed(4), T: +L.T.toFixed(2) }]; }));
  return { ...h, fromRT: { r: +(Math.log(h.R0) / h.T).toFixed(4), lam: +Math.exp(Math.log(h.R0) / h.T).toFixed(4) }, TfromLam: +(Math.log(h.R0) / Math.log(h.lam)).toFixed(2), TfromR: +(Math.log(h.R0) / h.r).toFixed(2), m,
    doubling: +(Math.log(2) / m.halving.r).toFixed(2), days1000: +expTime(1, m.halving.r, 1000).toFixed(1) };
});
console.log(JSON.stringify(res, null, 1));

// What matters more: the start of egg laying or the number of offspring? Maize with a later onset, or with R0 halved.
const maize = HOSTS[0];
const lamOf = (h) => { const { F, P } = build(h, 'halving'); return leslie(F, P).lambda; };
const swaps = { base: lamOf(maize), late3: lamOf({ ...maize, onset: maize.onset + 3 }), halfR0: lamOf({ ...maize, R0: maize.R0 / 2 }), wheatR0: lamOf({ ...maize, R0: 94.62 }), wheatOnset: lamOf({ ...maize, onset: 38 }) };
console.log('swaps', JSON.stringify(Object.fromEntries(Object.entries(swaps).map(([k, v]) => [k, +v.toFixed(4)]))));

// Rows a reader can paste into the tool (maize, halving, F rounded to 0.01).
const rw = build(maize, 'halving', true), Lr = leslie(rw.F, rw.P);
console.log('ROWS\n' + rw.F.map((f, i) => `day ${i + 1}, ${f}, ${rw.P[i]}, ${i === 0 ? 100 : 0}`).join('\n'));
console.log('rounded rows: λ', Lr.lambda.toFixed(5), 'r', Lr.r.toFixed(4), 'R0', Lr.R0.toFixed(2), 'T', Lr.T.toFixed(3), 'doubling', (Math.log(2) / Lr.r).toFixed(3));

// Figure 1: λ against the age egg laying starts, for the maize and wheat R0, with the four hosts.
const ON = Array.from({ length: 31 }, (_, i) => 20 + i * 0.75);
const curve = (R0, ovi) => ON.map((a) => +lamOf({ R0, onset: Math.round(a), ovi }).toFixed(4));
const ONi = Array.from({ length: 23 }, (_, i) => 22 + i);
const fig1 = chart({
  title: 'Fall armyworm: growth rate against the start of egg laying', xLabel: 'Age when egg laying starts (days)', yLabel: 'Finite rate of increase λ (per day)',
  series: [
    { name: 'R₀ 532.8 (maize)', kind: 'line', x: ONi, y: ONi.map((a) => +lamOf({ R0: 532.8, onset: a, ovi: 6.7 }).toFixed(4)) },
    { name: 'R₀ 94.62 (wheat)', kind: 'line', x: ONi, y: ONi.map((a) => +lamOf({ R0: 94.62, onset: a, ovi: 3.4 }).toFixed(4)) },
    { name: 'Paper, four hosts', kind: 'dots', x: HOSTS.map((h) => h.onset), y: HOSTS.map((h) => h.lam), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [22, 44], yDomain: [1.08, 1.3],
  desc: `Finite rate of increase from the Leslie matrix as the start of egg laying moves from day 22 to day 44, for the maize and wheat net reproductive rates. The paper's four hosts sit near these lines: maize ${res[0].lam} at day 29, wheat ${res[3].lam} at day 38.`, height: 270,
});
void curve;

// Figure 2: paper's λ against the model's λ (halving), with the range from the other two shapes as error bars.
const xi = HOSTS.map((_, i) => i + 1);
const fig2 = chart({
  title: 'λ per host: paper and Leslie model', xLabel: '1 maize · 2 castor bean · 3 potato · 4 wheat', yLabel: 'λ (per day)',
  series: [
    { name: 'Paper', kind: 'dots', x: xi.map((x) => x - 0.08), y: HOSTS.map((h) => h.lam), size: 4 },
    { name: 'Leslie model', kind: 'dots', x: xi.map((x) => x + 0.08), y: res.map((r) => r.m.halving.lam), size: 4, errors: res.map((r) => +((r.m.one.lam - r.m.even.lam) / 2).toFixed(4)) },
  ],
  xDomain: [0.5, 4.5], xTicks: [1, 2, 3, 4], yDomain: [1.1, 1.26],
  desc: `Finite rate of increase per host. Paper: ${HOSTS.map((h) => h.lam).join(', ')}. Leslie model with halving daily egg numbers: ${res.map((r) => r.m.halving.lam.toFixed(3)).join(', ')}; bars show half the spread between putting every egg on one day and spreading them evenly.`, height: 250,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'onset', figure(fig1, 'Figure 1. The finite rate of increase from a daily Leslie matrix as the start of egg laying moves, for the net reproductive rates on maize and on wheat (our assumption: daily egg numbers halve after the first day). Black dots: the four hosts as the paper reports them.'));
  md = inject(md, 'hosts', figure(fig2, 'Figure 2. The paper\'s λ for each host beside the Leslie model built from its R₀, onset day and oviposition days. Bars: half the spread between laying every egg on one day and spreading them evenly. A recomputation from summary values, not from the paper\'s raw life table.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
