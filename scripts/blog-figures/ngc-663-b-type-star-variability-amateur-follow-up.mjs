// Figures for src/blog/discoveries/ngc-663-b-type-star-variability-amateur-follow-up.md, made with the maths of
// the Variable star log (src/lib/astro/aavso.ts: differential photometry, Julian dates) and the Period finder
// (src/lib/sci/lombscargle.ts).
// Run: node scripts/blog-figures/ngc-663-b-type-star-variability-amateur-follow-up.mjs
import fs from 'node:fs';
import { differential, jd, fractionEstimate } from '../../src/lib/astro/aavso.ts';
import { lombScargle, peaks, falseAlarm, phase } from '../../src/lib/sci/lombscargle.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ngc-663-b-type-star-variability-amateur-follow-up.md', import.meta.url);

// --- From the paper (Xiao, Wang and Deng 2026, Universe 12(1): 9, doi:10.3390/universe12010009, CC BY 4.0) ---
// Seven of the variables it lists, as period in days and full amplitude in magnitudes.
const VARS = [
  { id: 'V8', type: 'β Cephei', p: 0.2101, amp: 0.014 },
  { id: 'V9', type: 'slowly pulsating B', p: 1.0981, amp: 0.015 },
  { id: 'V35', type: 'β Cephei', p: 0.2764, amp: 0.065 },
  { id: 'V1', type: 'α Cygni', p: 12.9508, amp: 0.067 },
  { id: 'V19', type: 'β Cephei', p: 0.1940, amp: 0.077 },
  { id: 'V38', type: 'rotational', p: 21.760, amp: 0.280 },
  { id: 'V10', type: 'eclipsing binary', p: 6.1638, amp: 0.330 },
];
const NIGHTS = 8, NB = 3187, NV = 7494;   // usable nights, B frames (80 s), V frames (30 s)

// --- Our assumptions ---
const PER_NIGHT = 5;        // hours of usable darkness per night
const SIG_BIG = 0.008;      // per-frame scatter, 50 cm telescope on a bright B star, mag
const SIG_AMATEUR = 0.03;   // per-frame scatter, small telescope and DSLR
const r3 = (v, n = 3) => +v.toFixed(n);

// 1. What an amplitude in magnitudes is as a change in flux (the quantity a camera measures).
const fluxChange = (amp) => 100 * (1 - 10 ** (-0.4 * amp));
// 2. The error on a fitted sinusoid amplitude is sigma * sqrt(2/N), so the 5-sigma amplitude limit is 5 sigma sqrt(2/N).
const ampLimit = (sig, n) => 5 * sig * Math.sqrt(2 / n);
const detect = VARS.map((v) => ({
  ...v, flux: r3(fluxChange(v.amp), 2),
  snrPaper: r3((v.amp / 2) / (SIG_BIG * Math.sqrt(2 / NV)), 0),
  nAmateur: Math.ceil(2 * (5 * SIG_AMATEUR / (v.amp / 2)) ** 2),
  longerThanRun: v.p > (NIGHTS + 1),
}));

// 3. Can an 8-night run find each period? Simulate the sampling and run the Period finder's periodogram.
let seed = 663; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
function run(period, amp, sig, nights = NIGHTS, perNight = 120, ph = 0) {
  const t = [], y = [];
  for (let n = 0; n < nights; n++) for (let k = 0; k < perNight; k++) {
    const tt = n + (k / (perNight - 1)) * (PER_NIGHT / 24);
    t.push(tt);
    y.push(r3((amp / 2) * Math.sin(2 * Math.PI * (tt / period + ph)) + sig * gauss(), 4));
  }
  const pg = lombScargle(t, y, null, 0.04, 6, 6000);
  const pk = peaks(pg, 3);
  return { t, y, pg, pk, best: 1 / pk[0].freq, fap: falseAlarm(pk[0].power, t.length, 6, t, null) };
}
const spb = run(VARS[1].p, VARS[1].amp, SIG_BIG);          // V9: 1.0981 d, inside the run
const rot = run(VARS[5].p, VARS[5].amp, SIG_BIG);          // V38: 21.76 d, longer than the run
const bcep = run(VARS[0].p, VARS[0].amp, SIG_BIG);         // V8: 0.2101 d, the smallest amplitude
const amateur = run(VARS[6].p, VARS[6].amp, SIG_AMATEUR, 6, 40); // V10 eclipsing binary, small telescope

// 4. Differential photometry the way the tool does it.
const comp = 2.0e5, compMag = 11.42;
const varCounts = [1.9e5, 1.87e5, 1.84e5];
const mags = varCounts.map((c) => r3(differential(c, comp, compMag), 4));
const visual = r3(fractionEstimate(11.2, 11.9, 3, 4), 3);

// Thin a periodogram down to the plotted range, keeping each window's highest point (so peaks survive).
const thin = (pg, lo = 0.04, hi = 2.5, step = 9) => {
  const x = [], y = [];
  for (let i = 0; i < pg.freq.length; i += step) {
    let bi = i;
    for (let j = i; j < Math.min(pg.freq.length, i + step); j++) if (pg.power[j] > pg.power[bi]) bi = j;
    if (pg.freq[bi] >= lo && pg.freq[bi] <= hi) { x.push(r3(pg.freq[bi], 3)); y.push(r3(pg.power[bi], 3)); }
  }
  return { x, y };
};
const fig1 = chart({
  title: 'Eight nights are enough for a 1.1-day period, not a 22-day one', xLabel: 'Frequency (cycles per day)', yLabel: 'Periodogram power',
  series: [
    { name: 'V9: 1.0981 d', kind: 'line', ...thin(spb.pg) },
    { name: 'V38: 21.76 d', kind: 'line', ...thin(rot.pg) },
  ],
  xDomain: [0.04, 2.5], yDomain: [0, 1],
  vlines: [{ x: 1 / VARS[1].p, text: '0.911 c/d' }, { x: 1 / VARS[5].p, text: '0.046 c/d', left: true, dy: 14 }],
  desc: 'Lomb-Scargle periodograms of two simulated eight-night runs. The 1.1-day signal gives a sharp peak at its own frequency; the 22-day one piles its power into the lowest frequencies the run can reach, with a second peak near one day.', height: 280,
});
const NN = Array.from({ length: 60 }, (_, i) => Math.round(10 ** (1 + (i * 2.7) / 59)));
const fig2 = chart({
  title: 'How many frames an amplitude needs', xLabel: 'Frames in the run', yLabel: 'Smallest amplitude found at 5σ (mag)',
  series: [
    { name: '0.008 mag per frame', kind: 'line', x: NN, y: NN.map((n) => r3(2 * ampLimit(SIG_BIG, n), 5)) },
    { name: '0.03 mag per frame', kind: 'line', x: NN, y: NN.map((n) => r3(2 * ampLimit(SIG_AMATEUR, n), 5)) },
  ],
  xDomain: [10, 500], yDomain: [0, 0.35],
  hlines: [{ y: 0.014, text: 'V8: 0.014 mag' }, { y: 0.077, text: 'V19: 0.077 mag' }, { y: 0.28, text: 'V38: 0.280 mag' }],
  desc: 'The smallest full amplitude a run can find at five sigma, against the number of frames, for a 0.008 and a 0.03 magnitude per-frame scatter. The paper\'s smallest amplitudes need thousands of frames at amateur precision.', height: 280,
});

console.log(JSON.stringify({
  detect,
  resolution: { baselineDays: NIGHTS, df: r3(1 / NIGHTS, 4), dutyCycle: r3((100 * PER_NIGHT) / 24, 1), framesPerNightV: Math.round(NV / NIGHTS), framesPerNightB: Math.round(NB / NIGHTS) },
  spb: { best: r3(spb.best, 4), err: r3(100 * (spb.best - VARS[1].p) / VARS[1].p, 2), power: r3(spb.pk[0].power), fap: +spb.fap.toPrecision(3) },
  bcep: { best: r3(bcep.best, 4), err: r3(100 * (bcep.best - VARS[0].p) / VARS[0].p, 2), power: r3(bcep.pk[0].power), fap: +bcep.fap.toPrecision(3) },
  rot: { best: r3(rot.best, 4), power: r3(rot.pk[0].power), topThree: rot.pk.map((p) => r3(1 / p.freq, 3)) },
  // The same 21.76 d signal started at eight different phases: how far the eight-night run's answer wanders.
  rotPhases: (() => {
    const got = Array.from({ length: 8 }, (_, i) => run(VARS[5].p, VARS[5].amp, SIG_BIG, NIGHTS, 120, i / 8).best);
    return { periods: got.map((g) => r3(g, 2)), min: r3(Math.min(...got), 2), max: r3(Math.max(...got), 2) };
  })(),
  spbPhases: (() => {
    const got = Array.from({ length: 8 }, (_, i) => run(VARS[1].p, VARS[1].amp, SIG_BIG, NIGHTS, 120, i / 8).best);
    return { periods: got.map((g) => r3(g, 4)), min: r3(Math.min(...got), 4), max: r3(Math.max(...got), 4) };
  })(),
  amateur: { best: r3(amateur.best, 4), err: r3(100 * (amateur.best - VARS[6].p) / VARS[6].p, 2), power: r3(amateur.pk[0].power), fap: +amateur.fap.toPrecision(3), n: amateur.t.length },
  photometry: { mags, drop: r3(mags[2] - mags[0], 4), visual, jdExample: r3(jd(Date.UTC(2026, 10, 24, 20, 30, 0)), 5) },
  limits: { n100big: r3(2 * ampLimit(SIG_BIG, 100), 4), n100am: r3(2 * ampLimit(SIG_AMATEUR, 100), 4), n3187: r3(2 * ampLimit(SIG_BIG, NB), 5), n7494: r3(2 * ampLimit(SIG_BIG, NV), 5) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'periodogram', figure(fig1, 'Figure 2. Periodograms of two simulated eight-night runs with the paper\'s periods and amplitudes, worked out with the Period finder\'s maths. A period inside the run is found exactly; a 22-day period is not. Simulated data, not the paper\'s measurements.'));
  md = inject(md, 'limits', figure(fig2, 'Figure 1. The smallest full amplitude a run can detect at five sigma against the number of frames, for observatory-grade and amateur-grade per-frame scatter. Lines mark three of the paper\'s amplitudes.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
