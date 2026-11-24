// Figures and numbers for src/blog/discoveries/pitch-normalisation-median-semitones-conversation.md, made with
// the maths of the Pitch contour tracker (src/lib/sci/pitch.ts: synthVoice, pitchTrack, pitchStats, semitones).
// Run: node scripts/blog-figures/pitch-normalisation-median-semitones-conversation.mjs
import fs from 'node:fs';
import { synthVoice, pitchTrack, pitchStats, semitones } from '../../src/lib/sci/pitch.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/pitch-normalisation-median-semitones-conversation.md', import.meta.url);
const r2 = (x) => +x.toFixed(2);

// ---- Check 1: the paper's own semitone column ---------------------------------------------------------
// Stated values from Matalon (2026), Frontiers in Communication 11, doi:10.3389/fcomm.2026.1833068 (CC BY 4.0):
// peak F0 of four conversational turns and each speaker's median F0.
const TURNS = [
  { line: 3, who: 'Dan', peak: 164.3, med: 130.2, printed: 4 },
  { line: 6, who: 'Dan', peak: 234.3, med: 130.2, printed: 10.2 },
  { line: 4, who: 'Beth', peak: 367.3, med: 213.7, printed: 9.4 },
  { line: 8, who: 'Beth', peak: 474.3, med: 213.7, printed: 13.8 },
];
console.log('check 1 (semitones above the speaker median)');
for (const t of TURNS) console.log(`  line ${t.line} (${t.who}): ${t.peak} Hz over ${t.med} Hz -> ${semitones(t.peak, t.med).toFixed(2)} st (paper ${t.printed})`);

// ---- Check 2: voice ranges from the printed minima and maxima -----------------------------------------
const RANGES = [
  { who: 'Female speakers (n = 29), averages', lo: 140, hi: 584 },
  { who: 'Male speakers (n = 16), averages', lo: 77, hi: 315 },
  { who: 'Dan (case study)', lo: 85.7, hi: 323.5 },
  { who: 'Beth (case study)', lo: 154.4, hi: 517.4 },
];
console.log('check 2 (range in semitones)');
for (const r of RANGES) console.log(`  ${r.who}: ${r.lo} to ${r.hi} Hz -> ${semitones(r.hi, r.lo).toFixed(2)} st`);

// ---- A simulated conversational contour, tracked by the tool ------------------------------------------
// Five phrases, each rising to a peak and falling, around a median near 140 Hz. OUR INVENTED CONTOUR.
const PH = [[0.15, 1.05, 120, 1.25, -0.5], [1.45, 2.35, 130, 2.4, -0.7], [2.75, 3.65, 125, 1.3, -0.6], [4.05, 4.95, 140, 3.3, -0.9], [5.25, 6.15, 115, 1.2, -0.45]];
const f0 = (t) => { for (const [a, b, base, up, dn] of PH) if (t >= a && t < b) { const ph = (t - a) / (b - a); return base * 2 ** (up * Math.sin(Math.PI * ph ** 1.4) * Math.exp(-1.5 * ph) + dn * ph); } return 0; };
const FS = 16000, DUR = 6.4;
const wave = synthVoice(f0, DUR, FS);
const tr = pitchTrack(wave, FS, { smooth: 5 });
const base = pitchStats(tr.f0, 100);
const st = pitchStats(tr.f0, base.median); // semitones relative to this speaker's own median
const voiced = tr.f0.filter((v) => v != null).sort((a, b) => a - b);
const quant = (p) => voiced[Math.min(voiced.length - 1, Math.floor(p * (voiced.length - 1)))];
const iqrSt = semitones(quant(0.75), quant(0.25));
console.log(`simulated contour: ${st.n} voiced frames of ${tr.t.length}; median ${st.median.toFixed(1)} Hz, mean ${st.mean.toFixed(1)} Hz, ${Math.round(st.min)} to ${Math.round(st.max)} Hz, range ${st.rangeSt.toFixed(2)} st, IQR ${iqrSt.toFixed(2)} st, SD ${st.stSd.toFixed(2)} st`);

// ---- Check 3: what one octave error in N frames does to the mean and to the median ---------------------
let seed = 1833068;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const SHARES = Array.from({ length: 11 }, (_, i) => i * 0.02);
const REPS = 200;
const shift = SHARES.map((qq) => {
  let dm = 0, dmed = 0;
  for (let r = 0; r < REPS; r++) {
    const bad = tr.f0.map((v) => (v == null ? null : rnd() < qq ? (rnd() < 0.5 ? v / 2 : v * 2) : v));
    const s = pitchStats(bad, 100);
    dm += Math.abs(semitones(s.mean, base.mean)); dmed += Math.abs(semitones(s.median, base.median));
  }
  return { q: qq, mean: dm / REPS, median: dmed / REPS };
});
console.log('check 3 (average absolute shift, semitones)');
for (const s of shift) if (Math.round(s.q * 100) % 4 === 0) console.log(`  ${(s.q * 100).toFixed(0)} % of frames: mean ${s.mean.toFixed(3)} st, median ${s.median.toFixed(3)} st, ratio ${(s.mean / (s.median || 1)).toFixed(1)}×`);

// ---- Check 4: the same thing with real tracker errors, on the tool's own example ----------------------
// The tool's built-in example, analysed with its default 75-500 Hz range and then with 75-1000 Hz, which
// lets the tracker double the pitch of some frames.
const exF0 = (t) => (t < 0.1 ? 0 : t < 1.0 ? 180 * (120 / 180) ** ((t - 0.1) / 0.9) : t < 1.25 ? 0 : t < 2.05 ? 130 * (220 / 130) ** ((t - 1.25) / 0.8) : 0);
const ex = synthVoice(exF0, 2.15, 16000);
const look = (fmax) => { const t = pitchTrack(ex, 16000, { smooth: 5, fmin: 75, fmax }); const s0 = pitchStats(t.f0, 100); return { ...pitchStats(t.f0, s0.median), frames: t.t.length, med: s0.median }; };
const okRun = look(500), badRun = look(1000);
console.log(`check 4: 75-500 Hz -> median ${okRun.med.toFixed(1)} Hz, mean ${okRun.mean.toFixed(1)} Hz, max ${Math.round(okRun.max)} Hz, range ${okRun.rangeSt.toFixed(1)} st, voiced ${Math.round(okRun.voiced * 100)} % (${okRun.n} of ${okRun.frames})`);
console.log(`         75-1000 Hz -> median ${badRun.med.toFixed(1)} Hz, mean ${badRun.mean.toFixed(1)} Hz, max ${Math.round(badRun.max)} Hz, range ${badRun.rangeSt.toFixed(1)} st, voiced ${Math.round(badRun.voiced * 100)} % (${badRun.n} of ${badRun.frames})`);
console.log(`         shift: mean ${semitones(badRun.mean, okRun.mean).toFixed(2)} st, median ${semitones(badRun.med, okRun.med).toFixed(2)} st, max ${semitones(badRun.max, okRun.max).toFixed(2)} st`);

// ---- Figures ------------------------------------------------------------------------------------------
const keep = (arr) => arr.filter((_, i) => i % 4 === 0);
const fig1 = chart({
  title: 'A conversational contour, normalised on its own median', xLabel: 'Time (s)', yLabel: 'Semitones above the median',
  series: [{ name: '', noLegend: true, kind: 'dots', x: keep(tr.t).map(r2), y: keep(tr.f0).map((v) => (v == null ? NaN : r2(semitones(v, base.median)))), size: 2.2 }],
  xDomain: [0, DUR], yDomain: [-10, 14],
  hlines: [{ y: 0, text: `median ${Math.round(base.median)} Hz` }, { y: r2(semitones(quant(0.75), base.median)), text: 'upper quartile' }, { y: r2(semitones(quant(0.25), base.median)), text: 'lower quartile' }],
  desc: `A made-up five-phrase contour tracked by the tool and expressed in semitones above the speaker's own median of ${Math.round(base.median)} Hz. The quartiles are ${iqrSt.toFixed(1)} semitones apart.`,
  height: 290,
});
const fig2 = chart({
  title: 'An octave error moves the mean, not the median', xLabel: 'Share of frames with an octave error (%)', yLabel: 'Shift in the statistic (semitones)',
  series: [
    { name: 'Mean F0', kind: 'line', x: SHARES.map((q) => q * 100), y: shift.map((s) => +s.mean.toFixed(3)) },
    { name: 'Median F0', kind: 'line', x: SHARES.map((q) => q * 100), y: shift.map((s) => +s.median.toFixed(3)) },
  ],
  xDomain: [0, 20], yDomain: [0, 0.9],
  desc: 'Average absolute shift of the mean and of the median pitch, in semitones, when a share of frames is halved or doubled by the tracker. Two hundred random draws per point.',
  height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'contour', figure(fig1, `Figure 1. Our made-up conversational contour, tracked with the Pitch contour tracker's maths and plotted in semitones above the speaker's own median (${Math.round(base.median)} Hz). Every fourth frame is shown (40 ms apart). The quartile lines are ${iqrSt.toFixed(1)} semitones apart, which is what the paper reports as the average for its 45 real speakers.`));
  md = inject(md, 'errors', figure(fig2, 'Figure 2. How far the mean and the median move when the tracker halves or doubles the pitch of some frames. Each point is the average absolute shift over 200 random draws on the contour in Figure 1.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
