// Figures for src/blog/discoveries/resistance-trained-young-adults-hrv-sdnn-rmssd-simulated-ecg.md, made with the
// maths of the ECG viewer (src/lib/sci/ecg.ts: synthEcg, panTompkins, hrvTime, hrvFreq; src/lib/sci/biosig.ts filters).
// Run: node scripts/blog-figures/resistance-trained-young-adults-hrv-sdnn-rmssd-simulated-ecg.mjs
import fs from 'node:fs';
import { synthEcg, panTompkins, hrvTime, hrvFreq, BANDS } from '../../src/lib/sci/ecg.ts';
import { filtfilt, bandSections } from '../../src/lib/sci/biosig.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/resistance-trained-young-adults-hrv-sdnn-rmssd-simulated-ecg.md', import.meta.url);

// Paper: Barbosa et al. (2025), J. Vasc. Bras. 24: e20240150, doi:10.1590/1677-5449.20240152 (CC BY 4.0).
// Group means: RMSSD 75.3 / 37.5 ms, SDNN 65.8 / 40.2 ms, SD1 53.3 / 26.5, SD2 75.8 / 49.8, LF/HF 0.94 / 1.55.
const PAPER = [
  { name: 'Resistance-trained', rmssd: 75.3, sdnn: 65.8, sd1: 53.3, sd2: 75.8, lfnu: 47.4, hfnu: 50.3, lfhf: 0.94 },
  { name: 'Untrained', rmssd: 37.5, sdnn: 40.2, sd1: 26.5, sd2: 49.8, lfnu: 57.8, hfnu: 56.5, lfhf: 1.55 },
];
// Our fitted generator settings (found by a Nelder-Mead search on SDNN, RMSSD and LF/HF through the whole pipeline).
// Heart rates, the 250 Hz sample rate and the 0.1 / 0.25 Hz rhythms are OUR assumptions; the paper reports no heart rate.
const FIT = [
  { hr: 60, lfAmp: 59.37, hfAmp: 61.68, jitter: 27.12, seed: 21 },
  { hr: 70, lfAmp: 40.05, hfAmp: 39.50, jitter: 0.39, seed: 22 },
];

const res = FIT.map((f, k) => {
  const s = synthEcg({ fs: 250, dur: 300, hr: f.hr, lfAmp: f.lfAmp, hfAmp: f.hfAmp, jitter: f.jitter, seed: f.seed });
  const y = filtfilt(s.x, bandSections(s.fs, 0.5, 40, 50));
  const r = panTompkins(s.x, y, s.fs).r.map((v) => v / s.fs);
  const h = hrvTime(r, 0.2), p = hrvFreq(h.tBeat, h.nn, true);
  const maxErr = Math.max(...s.beats.map((b, i) => Math.abs(r[i] - b)));
  return { ...PAPER[k], ...f, found: r.length, truth: s.beats.length, maxErrMs: maxErr * 1000, h, p };
});

// Figure 1: the two interval series (tachograms).
const fig1 = chart({
  title: 'Rebuilt beat-to-beat intervals, 5 minutes supine', xLabel: 'Time (s)', yLabel: 'RR interval (ms)',
  series: res.map((r, k) => ({ name: `${r.name} (SDNN ${r.h.sdnn.toFixed(0)} ms)`, kind: 'line', x: r.h.tBeat, y: r.h.nn.map((v) => +v.toFixed(1)) })),
  xDomain: [0, 300], yDomain: [650, 1250],
  desc: `Beat-to-beat interval series of two simulated five-minute ECGs built to reproduce the published SDNN and RMSSD of resistance-trained and untrained young adults. Simulated, not real recordings.`,
  height: 270,
});

// Figure 2: the Lomb-Scargle spectra, decimated to keep the SVG small.
const spec = res.map((r) => {
  const x = [], y = [];
  for (let i = 0; i < r.p.f.length; i += 3) { if (r.p.f[i] > 0.45) break; x.push(+r.p.f[i].toFixed(4)); y.push(+r.p.psd[i].toFixed(0)); }
  return { x, y };
});
const fig2 = chart({
  title: 'Where the variability sits (Lomb-Scargle)', xLabel: 'Frequency (Hz)', yLabel: 'Power (ms²/Hz)',
  series: spec.map((s, k) => ({ name: res[k].name, kind: 'line', x: s.x, y: s.y })),
  xDomain: [0.02, 0.45], yDomain: [0, 30000],
  bands: [{ x0: BANDS.hf[0], x1: BANDS.hf[1], text: 'HF (breathing)' }],
  vlines: [{ x: BANDS.lf[0], text: 'LF', dy: 16 }],
  yFmt: (v) => (v === 0 ? '0' : `${Math.round(v / 1000)}k`),
  desc: `Lomb-Scargle spectra of the two rebuilt interval series, with the high-frequency breathing band shaded. The trained trace carries much more power in both bands.`,
  height: 270,
});

const ident = (p) => ({
  rmssdOverRoot2: +(p.rmssd / Math.SQRT2).toFixed(2), sd1: p.sd1,
  sdnnFromPoincare: +Math.sqrt((p.sd1 ** 2 + p.sd2 ** 2) / 2).toFixed(2), sdnn: p.sdnn,
  nuSum: +(p.lfnu + p.hfnu).toFixed(1), lfhfFromNu: +(p.lfnu / p.hfnu).toFixed(2), lfhfPrinted: p.lfhf,
});
console.log(JSON.stringify(res.map((r) => ({
  name: r.name, found: r.found, truth: r.truth, maxErrMs: +r.maxErrMs.toFixed(2), removed: r.h.removed,
  meanHR: +r.h.meanHR.toFixed(1), sdnn: +r.h.sdnn.toFixed(2), rmssd: +r.h.rmssd.toFixed(2), sd1: +r.h.sd1.toFixed(1),
  sd2: +r.h.sd2.toFixed(1), pnn50: +r.h.pnn50.toFixed(1), lf: Math.round(r.p.lf), hf: Math.round(r.p.hf),
  lfhf: +r.p.lfhf.toFixed(2), lfnu: +r.p.lfnu.toFixed(1), hfnu: +r.p.hfnu.toFixed(1), paperIdentities: ident(r),
})), null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'tacho', figure(fig1, 'Figure 1. The beat-to-beat intervals of two simulated five-minute ECGs, fitted so that the ECG viewer measures each group\'s published SDNN, RMSSD and LF/HF. Every beat was found by the tool\'s Pan-Tompkins detector. These are simulations, not the study\'s recordings.'));
  md = inject(md, 'psd', figure(fig2, 'Figure 2. Lomb-Scargle spectra of the same two interval series, with the breathing (HF) band shaded. The trained trace has the stronger breathing rhythm that an RMSSD above its SDNN demands.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
