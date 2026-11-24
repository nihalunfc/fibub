// Figures for src/blog/discoveries/electrosensory-pyramidal-cell-bursts-isi-modes-cv-burst-fraction.md, made with
// the maths of the Spike train analyser (src/lib/sci/spikes.ts: summarise, isis, histogram, autocorrelogram).
// Run: node scripts/blog-figures/electrosensory-pyramidal-cell-bursts-isi-modes-cv-burst-fraction.mjs
import fs from 'node:fs';
import { summarise, isis, histogram, autocorrelogram } from '../../src/lib/sci/spikes.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/electrosensory-pyramidal-cell-bursts-isi-modes-cv-burst-fraction.md', import.meta.url);

// From the paper (Akhshi et al. 2025, PLOS Comput Biol 21(11): e1013711): in vivo pyramidal cells fire bursts of
// typically 2 to 3 spikes, with an intra-burst interval mode of 12 ms and an inter-burst mode of about 100 ms,
// at baseline rates between 5 and 60 Hz. Everything else below is OUR construction.
// A gamma interval of shape k and mean m has its mode at m (k - 1) / k, so to put the modes at the paper's
// 12 ms and 100 ms we use means of 12.8 ms (shape 16) and 120 ms (shape 6).
const INTRA = 0.0128, INTER = 0.120, SIZES = [2, 3], DEAD = 0.003;

// A small, reproducible generator: gamma intervals built as sums of exponentials, so the spread is fixed by the
// shape (CV = 1/sqrt(shape)): shape 16 for intra-burst intervals (CV 0.25), shape 6 for the gaps (CV 0.41).
let seed = 20251117;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gamma = (mean, shape) => { let s = 0; for (let i = 0; i < shape; i++) s += -Math.log(1 - rnd() + 1e-12); return (s * mean) / shape; };

/** Bursting trains: `sizes` spikes per burst (drawn at random), gamma intervals, 3 ms dead time.
 *  `gapShape` sets how regular the burst clock is: 6 is fairly regular, 1 is a Poisson clock. */
function burster(trials, seconds, sizes, intra = INTRA, inter = INTER, gapShape = 6) {
  const out = [];
  for (let k = 0; k < trials; k++) {
    const t = []; let x = Math.max(DEAD, gamma(inter, gapShape));
    while (x < seconds) {
      const n = sizes[Math.floor(rnd() * sizes.length)];
      for (let i = 0; i < n && x < seconds; i++) { t.push(Math.round(x * 1e4) / 1e4); if (i < n - 1) x += Math.max(DEAD, gamma(intra, 16)); }
      x += Math.max(DEAD, gamma(inter, gapShape));
    }
    out.push({ name: `Trial ${k + 1}`, t });
  }
  return out;
}
/** Poisson trains at a given rate, same dead time. */
function poisson(trials, seconds, rate) {
  const out = [];
  for (let k = 0; k < trials; k++) {
    const t = []; let x = 0;
    while (true) { x += Math.max(DEAD, -Math.log(1 - rnd() + 1e-12) / rate); if (x >= seconds) break; t.push(Math.round(x * 1e4) / 1e4); }
    out.push({ name: `Trial ${k + 1}`, t });
  }
  return out;
}

const TRIALS = 40, SECONDS = 5; // the paper shows 5 s traces
const B = burster(TRIALS, SECONDS, SIZES);
const sB = summarise(B, 0, SECONDS);
const P = poisson(TRIALS, SECONDS, sB.meanRate);
const sP = summarise(P, 0, SECONDS);
// The same bursts on a Poisson burst clock (exponential gaps), matched in rate by lengthening the mean gap.
const R = burster(TRIALS, SECONDS, SIZES, INTRA, INTER, 1);
const sR = summarise(R, 0, SECONDS);

const f = (v, n = 3) => Number(v.toPrecision(n)).toString();
console.log('--- expected rate from the paper’s own burst description ---');
for (const n of [2, 2.5, 3]) console.log(`${n} spikes per burst: ${f(n / ((n - 1) * 0.012 + 0.100))} spikes/s (from the paper's two modes), ${f(n / ((n - 1) * INTRA + INTER))} spikes/s from our gamma means`);
console.log('--- the two simulated cells, as the Spike train analyser reads them ---');
for (const [name, s] of [['Bursting (paper-like)', sB], ['Poisson, same rate', sP], ['Bursting on a Poisson clock', sR]]) {
  console.log(`${name}: rate ${f(s.meanRate, 4)} +- ${f(s.sdRate, 3)} spikes/s | mean ISI ${f(1000 * (s.isiAll.reduce((a, v) => a + v, 0) / s.isiAll.length), 4)} ms | CV ${f(s.cvPooled, 4)} | Fano ${f(s.fano, 3)} | ISIs ${s.isiAll.length} | under 2 ms: ${s.refractoryViolations}`);
}
const median = (a) => { const b = [...a].sort((x, y) => x - y), m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
const sd = (a) => { const m = a.reduce((s, v) => s + v, 0) / a.length; return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / a.length); };
console.log('median ISI: bursting', f(1000 * median(sB.isiAll), 3), 'ms | Poisson', f(1000 * median(sP.isiAll), 3), 'ms | Poisson clock', f(1000 * median(sR.isiAll), 3), 'ms');
console.log('SD of ISI: bursting', f(1000 * sd(sB.isiAll), 3), 'ms | Poisson', f(1000 * sd(sP.isiAll), 3), 'ms | Poisson clock', f(1000 * sd(sR.isiAll), 3), 'ms');
const shortShare = (s) => s.isiAll.filter((v) => v < 0.03).length / s.isiAll.length;
console.log('share of intervals under 30 ms: bursting', f(100 * shortShare(sB), 3), '% | Poisson', f(100 * shortShare(sP), 3), '% | Poisson clock', f(100 * shortShare(sR), 3), '%');

/* ------------------------------------------------------- Figure 1: the ISI histograms */
const BIN = 0.002, MAX = 0.25;
const hB = histogram(sB.isiAll, 0, MAX, BIN), hP = histogram(sP.isiAll, 0, MAX, BIN);
const mids = hB.edges.slice(0, -1).map((e, i) => 1000 * (e + hB.edges[i + 1]) / 2);
const pct = (h, s) => h.counts.map((c) => (100 * c) / s.isiAll.length);
const fig1 = chart({
  title: 'Interval histograms: bursting against Poisson',
  xLabel: 'Interval between spikes (ms)',
  yLabel: 'Share of intervals (%)',
  series: [
    { name: 'Bursting (simulated)', x: mids, y: pct(hB, sB) },
    { name: 'Poisson, same rate', x: mids, y: pct(hP, sP), colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 1000 * MAX], yDomain: [0, Math.max(...pct(hB, sB)) * 1.1],
  vlines: [{ x: 12, text: '12 ms' }, { x: 100, text: '100 ms' }],
  height: 260,
  desc: 'Two interval histograms in 2 ms bins. The bursting train has one peak near 12 ms and a second, broad hump near 110 ms; the Poisson train has a single peak at the shortest intervals and falls away smoothly.',
});

/* ------------------------------------------------------- Figure 2: the autocorrelograms */
const LAG = 0.2, ABIN = 0.004;
const aB = autocorrelogram(B, LAG, ABIN, 0, SECONDS), aP = autocorrelogram(P, LAG, ABIN, 0, SECONDS);
const amids = aB.edges.slice(0, -1).map((e, i) => 1000 * (e + aB.edges[i + 1]) / 2);
const fig2 = chart({
  title: 'Autocorrelograms of the same two trains',
  xLabel: 'Lag (ms)',
  yLabel: 'Rate of other spikes (spikes/s)',
  series: [
    { name: 'Bursting (simulated)', x: amids, y: aB.rate },
    { name: 'Poisson, same rate', x: amids, y: aP.rate, colour: 'var(--c-tools)' },
  ],
  xDomain: [-1000 * LAG, 1000 * LAG], yDomain: [0, Math.max(...aB.rate) * 1.1],
  height: 260,
  desc: 'Two autocorrelograms from minus 200 to plus 200 ms. The bursting train has a tall narrow peak within about 30 ms of each spike and a dip beyond it; the Poisson train is flat apart from the dead time at zero lag.',
});

/* ------------------------------------------------------- Figure 3: what CV and rate together say */
console.log('--- CV against rate as the burst size and the gap change ---');
const SET = [
  { label: '1 spike per burst', sizes: [1] },
  { label: '2 spikes per burst', sizes: [2] },
  { label: '3 spikes per burst', sizes: [3] },
  { label: '4 spikes per burst', sizes: [4] },
];
const series3 = SET.map((set, i) => {
  const x = [], y = [];
  for (const gap of [0.03, 0.04, 0.06, 0.08, 0.1, 0.14, 0.2, 0.3, 0.45]) {
    seed = 20251117 + i * 977;
    const s = summarise(burster(30, SECONDS, set.sizes, INTRA, gap), 0, SECONDS);
    x.push(s.meanRate); y.push(s.cvPooled);
  }
  console.log(set.label, 'rates', x.map((v) => f(v, 3)).join(', '), '| CV', y.map((v) => f(v, 3)).join(', '));
  return { name: set.label, x, y, kind: i === 0 ? 'line' : 'line', colour: ['var(--muted)', 'var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][i], dash: i === 3 ? '4 3' : undefined };
});
const fig3 = chart({
  title: 'Burst size shows up in the CV, not the rate',
  xLabel: 'Mean firing rate (spikes/s)',
  yLabel: 'CV of the intervals',
  series: series3,
  xDomain: [0, 70], yDomain: [0, 1.6],
  hlines: [{ y: 1, text: 'Poisson' }],
  bands: [{ x0: 5, x1: 60, text: 'rates seen in vivo' }],
  height: 280,
  desc: 'Four curves of interval CV against mean firing rate. Single spikes stay near a CV of 0.4 at every rate, while two, three and four spikes per burst rise from about 0.6 at the highest rates to 1.1, 1.5 and 1.8 at the lowest, and all four cover the same range of firing rates.',
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'isi', figure(fig1, 'Figure 1. Interval histograms of two simulated trains, read with the Spike train analyser’s own `histogram`: one built from the paper’s stated burst structure, one Poisson at the same mean rate. The dashed lines are the paper’s two reported interval modes. Simulated, not the paper’s recordings.'));
md = inject(md, 'acg', figure(fig2, 'Figure 2. Autocorrelograms of the same two trains, 4 ms bins. Bursting puts a tall peak inside the first 30 ms and empties the next hundred; a Poisson cell at the same rate is flat. Simulated.'));
md = inject(md, 'cv', figure(fig3, 'Figure 3. For simulated trains with 1 to 4 spikes per burst, the interval CV against the mean firing rate as the gap between bursts is varied from 30 to 450 ms. The shaded band is the 5 to 60 Hz the paper reports in vivo. Simulated.'));
fs.writeFileSync(ART, md);
console.log('fig1', fig1.length, 'fig2', fig2.length, 'fig3', fig3.length, 'bytes');

// One trial, in milliseconds, for the "Check it yourself" steps, plus what the tool reads from it alone.
const ms = B[0].t.filter((v) => v < 2).map((v) => Number((v * 1000).toFixed(1)));
const s1 = summarise([{ name: 'Cell', t: ms.map((v) => v / 1000) }], 0, 2);
console.log('--- the first 2 s of trial 1 for the article:', ms.length, 'spikes ---');
console.log(ms.join(' '));
console.log('tool on it: rate', f(s1.meanRate, 4), 'spikes/s | CV', f(s1.cvPooled, 4), '| mean ISI', f(1000 * s1.trains[0].meanIsi, 4), 'ms | ISIs', s1.isiAll.length, '| under 2 ms', s1.refractoryViolations);
