// Figures for src/blog/discoveries/wrist-extensor-median-frequency-esports-emg-welch-window-detectability.md, made with the
// maths of the EMG analyser (src/lib/sci/emg.ts: synthEmg, fatigue, welch, meanMedian).
// Run: node scripts/blog-figures/wrist-extensor-median-frequency-esports-emg-welch-window-detectability.mjs
import fs from 'node:fs';
import * as E from '../../src/lib/sci/emg.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/wrist-extensor-median-frequency-esports-emg-welch-window-detectability.md', import.meta.url);

// Paper: Tholl, Hansen and Froboese (2025), BMC Sports Sci Med Rehabil (CC BY 4.0). Left wrist extensor median frequency
// 99.24 -> 95.59 Hz (-3.7 %), right 97.86 -> 94.60 Hz (-3.3 %); EMG at 2000 Hz, 4-450 Hz band-pass, MDF from FFT over 10 s periods.
const FS = 2000, LO = 20, HI = 450; // our band starts at 20 Hz because the made-up EMG is built with a 20 Hz high-pass
const TARGET = { start: 99.24, end: 95.59 };

// One 10 s window of made-up EMG whose spectrum is a one-pole low-pass with corner fc (our model of a muscle), then the tool's own window analysis.
const win = (fc, seed, nseg = 512) => {
  const { x } = E.synthEmg({ fs: FS, dur: 11, bursts: [[0.5, 10.5]], f0: fc, f1: fc, seed });
  return E.fatigue(x.slice(FS * 0.5, FS * 10.5), FS, 10, 10, nseg, LO, HI)[0].mdf;
};
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const sd = (v) => { const m = mean(v); return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1)); };
const SEEDS = Array.from({ length: 40 }, (_, i) => i + 1);
const avgMdf = (fc, nseg = 512) => mean(SEEDS.map((s) => win(fc, s, nseg)));

// Calibration curve: mean window MDF against corner frequency.
const fcs = [60, 70, 80, 90, 100, 110, 120];
const curve = fcs.map((fc) => avgMdf(fc));
// Bisect to the corner that gives the paper's two means.
const solve = (target) => { let a = 60, b = 130; for (let i = 0; i < 12; i++) { const m = (a + b) / 2; if (avgMdf(m) < target) a = m; else b = m; } return (a + b) / 2; };
const fcA = solve(TARGET.start), fcB = solve(TARGET.end);

// 100 independent windows at each state.
const SEEDS2 = Array.from({ length: 100 }, (_, i) => 1000 + i);
const A = SEEDS2.map((s) => win(fcA, s)), B = SEEDS2.map((s) => win(fcB, s + 5000));
const sdA = sd(A), sdB = sd(B), shift = mean(A) - mean(B);
// Chance that one window from the later state reads higher than one window from the start.
let flips = 0, pairs = 0; for (const a of A) for (const b of B) { pairs++; if (b >= a) flips++; }
// Windows to average per state so the standard error of the difference is a quarter of the true shift.
const sdW = (sdA + sdB) / 2, nNeeded = Math.ceil(2 * (sdW / (TARGET.start - TARGET.end) * 4) ** 2);
// Segment length effect on the same signal.
const seg = [256, 512, 1024, 2048].map((n) => [n, +avgMdf(fcA, n).toFixed(2)]);

console.log(JSON.stringify({
  curve: fcs.map((f, i) => [f, +curve[i].toFixed(2)]), fcA: +fcA.toFixed(2), fcB: +fcB.toFixed(2),
  meanA: +mean(A).toFixed(2), meanB: +mean(B).toFixed(2), sdA: +sdA.toFixed(2), sdB: +sdB.toFixed(2), shift: +shift.toFixed(2),
  flipPct: +(100 * flips / pairs).toFixed(1), nNeeded, seg, relShift: +(100 * (TARGET.start - TARGET.end) / TARGET.start).toFixed(2),
  sdPct: +(100 * sdW / TARGET.start).toFixed(2),
}, null, 1));

const fig1 = chart({
  title: 'Median frequency of made-up wrist EMG', xLabel: 'Spectral corner of the model muscle (Hz)', yLabel: 'Window median frequency (Hz)',
  series: [{ name: '', noLegend: true, kind: 'line', x: fcs, y: curve.map((v) => +v.toFixed(2)) }],
  xDomain: [60, 120], yDomain: [60, 120], xTicks: [60, 80, 100, 120],
  hlines: [{ y: TARGET.start, text: 'paper start 99.24 Hz' }, { y: TARGET.end, text: 'end 95.59 Hz' }],
  desc: 'The tool reads a median frequency from 10 second windows of made-up EMG. It rises almost in step with the spectral corner of the model muscle. The two horizontal lines mark the paper\'s left wrist extensor values at the start and the end of the sessions.',
  height: 265,
});
const idx = (n) => Array.from({ length: n }, (_, i) => i + 1);
const fig2 = chart({
  title: 'One 10 second window each, 40 repeats', xLabel: 'Repeat number', yLabel: 'Window median frequency (Hz)',
  series: [
    { name: 'start (99.2 Hz)', kind: 'dots', size: 3, x: idx(40), y: A.slice(0, 40).map((v) => +v.toFixed(2)) },
    { name: 'end (95.6 Hz)', kind: 'dots', size: 3, x: idx(40), y: B.slice(0, 40).map((v) => +v.toFixed(2)) },
  ],
  xDomain: [0, 41], yDomain: [88, 106], xTicks: [1, 10, 20, 30, 40],
  hlines: [{ y: TARGET.start }, { y: TARGET.end }],
  desc: 'Median frequencies from 40 independent made-up 10 second windows at the start state and 40 at the end state. The two clouds overlap because a single window scatters by about as much as the 3.65 Hz shift.',
  height: 265,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curve', figure(fig1, 'Figure 1. The tool\'s window median frequency against the corner of our model spectrum, averaged over 40 made-up recordings per point. The dashed lines are the paper\'s group means for the left wrist extensor.'));
  md = inject(md, 'scatter', figure(fig2, 'Figure 2. One 10 second window per dot. The start and end states differ by 3.65 Hz on average, but single windows scatter by almost as much, so a decline shows only after averaging.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
