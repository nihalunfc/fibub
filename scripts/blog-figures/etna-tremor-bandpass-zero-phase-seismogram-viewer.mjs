// Figures for src/blog/discoveries/etna-tremor-bandpass-zero-phase-seismogram-viewer.md, made with the maths of the
// Seismogram viewer (src/lib/sci/dsp.ts: Butterworth bandpass, zero-phase filtering, amplitude spectrum).
// Run: node scripts/blog-figures/etna-tremor-bandpass-zero-phase-seismogram-viewer.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { butter, sosfiltfilt, sosGain, amplitudeSpectrum, dominant, detrend, demean, taper, nextPow2 } from '../../src/lib/sci/dsp.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/etna-tremor-bandpass-zero-phase-seismogram-viewer.md', import.meta.url);

// Inputs from the paper: Vesely et al. (2026), Solid Earth 17: 465-484, doi:10.5194/se-17-465-2026 (CC BY 4.0).
// Tremor data resampled to 50 Hz; bands: seismometer 0.5-10 Hz, rotation 0.5-2.5 Hz (tremor); array 0.6-10 Hz, rotation 0.6-1.4 Hz (LP);
// "two-pole zero-phase Butterworth" (we read it as order 2 per corner, zero phase: OUR assumption).
const FS = 50, ORDER = 2;
const BANDS = [
  { name: 'Tremor, seismometer 0.5-10 Hz', f: [0.5, 10], colour: 'var(--c-tools)' },
  { name: 'Tremor, rotation 0.5-2.5 Hz', f: [0.5, 2.5], colour: 'var(--c-blog)' },
  { name: 'LP, array 0.6-10 Hz', f: [0.6, 10], colour: 'var(--ink)', dash: '5 3' },
  { name: 'LP, rotation 0.6-1.4 Hz', f: [0.6, 1.4], colour: 'var(--muted)', dash: '5 3' },
];
const sos = BANDS.map((b) => butter(ORDER, b.f, 'bandpass', FS));
const gainZP = (k, f) => sosGain(sos[k], f, FS) ** 2; // forwards and backwards: gain squared

// Synthetic tremor (OUR assumption, not the paper's data): white noise shaped to 1-5 Hz, plus a strong 0.2 Hz ocean microseism
// (4 times the tremor's RMS) and weak 12-20 Hz noise (half the tremor's RMS). 300 s at 50 Hz, fixed seed.
let seed = 465; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const N = 300 * FS;
const white = (n) => Float64Array.from({ length: n }, gauss);
const rms = (x) => Math.sqrt(x.reduce((s, v) => s + v * v, 0) / x.length);
const shaped = (lo, hi, target) => { const y = sosfiltfilt(butter(4, [lo, hi], 'bandpass', FS), white(N)); const k = target / rms(y); return y.map((v) => v * k); };
const tremor = shaped(1, 5, 1), hf = shaped(12, 20, 0.5);
const micro = Float64Array.from({ length: N }, (_, i) => 4 * Math.SQRT2 * Math.sin((2 * Math.PI * 0.2 * i) / FS + 0.7));
const raw = Float64Array.from({ length: N }, (_, i) => tremor[i] + hf[i] + micro[i]);
const prep = taper(detrend(raw), 0.05);
const out = sos.map((s) => sosfiltfilt(s, prep));
const skip = 10 * FS; // ignore the first and last 10 s when measuring (edge effects)
const core = (x) => x.slice(skip, N - skip);
const kept = out.map((y) => rms(core(y)));
const rawRms = rms(core(prep));
const spRaw = amplitudeSpectrum(core(prep), FS), spOut = out.map((y) => amplitudeSpectrum(core(y), FS));
const dom = [spRaw, ...spOut].map((s) => dominant(s, 0.1));

// Chart 1: gain of the four zero-phase filters.
const ff = Array.from({ length: 121 }, (_, i) => i * 0.1);
const fig1 = chart({
  title: 'Zero-phase bandpass gain (order 2)', xLabel: 'Frequency (Hz)', yLabel: 'Gain (1 = unchanged)',
  series: BANDS.map((b, k) => ({ name: b.name.replace(/, /, ' ').replace('seismometer', 'seis.').replace('rotation', 'rot.'), kind: 'line', x: ff.map((f) => +f.toFixed(1)), y: ff.map((f) => +gainZP(k, f).toFixed(4)), colour: b.colour, dash: b.dash })),
  xDomain: [0, 12], yDomain: [0, 1.05], hlines: [{ y: 0.5, text: '' }],
  desc: 'Gain of four zero-phase Butterworth bandpass filters, the bands used in the Etna study. The narrow 0.6 to 1.4 Hz filter passes only a little more than the lowest octave; the 0.5 to 10 Hz filter passes almost everything in between.', height: 300,
});
// Chart 2: spectra of the synthetic tremor before and after the two tremor filters.
const fmax = 15, idx = [...spRaw.f].map((f, i) => i).filter((i) => spRaw.f[i] <= fmax);
const step = Math.max(1, Math.floor(idx.length / 220)), pick = idx.filter((_, j) => j % step === 0);
const lg = (a) => +Math.log10(Math.max(a, 1e-4)).toFixed(3);
const fig2 = chart({
  title: 'Synthetic tremor: amplitude spectrum', xLabel: 'Frequency (Hz)', yLabel: 'Amplitude (log scale)',
  series: [
    { name: 'Unfiltered', kind: 'line', x: pick.map((i) => +spRaw.f[i].toFixed(3)), y: pick.map((i) => lg(spRaw.a[i])), colour: 'var(--muted)' },
    { name: '0.5-10 Hz', kind: 'line', x: pick.map((i) => +spOut[0].f[i].toFixed(3)), y: pick.map((i) => lg(spOut[0].a[i])), colour: 'var(--c-tools)' },
    { name: '0.5-2.5 Hz', kind: 'line', x: pick.map((i) => +spOut[1].f[i].toFixed(3)), y: pick.map((i) => lg(spOut[1].a[i])), colour: 'var(--c-blog)' },
  ],
  xDomain: [0, fmax], yDomain: [-4, 1], yTicks: [-4, -3, -2, -1, 0, 1], yFmt: (t) => String(10 ** t),
  desc: 'Amplitude spectrum of a synthetic 300 s tremor record (tremor shaped to 1 to 5 Hz, a strong 0.2 Hz microseism and weak 12 to 20 Hz noise) before and after two zero-phase bandpass filters. The microseism spike and the high-frequency noise vanish after filtering.', height: 280,
});

// Array spatial aliasing rule of thumb: f_max = v / (2 d), for slowness 1.2-1.7 s/km (apparent v = 1/slowness) and spacings 60-90 m.
const alias = [[1.2, 60], [1.2, 90], [1.7, 60], [1.7, 90]].map(([s, d]) => ({ s, d, v: +(1 / s).toFixed(3), fmax: +((1 / s) / (2 * d / 1000)).toFixed(2) }));
const wl = [0.35, 0.4, 0.45].map((v) => ({ v, at1: v * 1000, at2: v * 500 }));

// The page's own made-up example (vertical component HHZ, 100 samples per second), rebuilt with the same formulas as the
// tool's "Use the example" button, then processed the way the page does (straight line out, 5 % taper, bandpass, zero phase).
const exampleZ = () => {
  let sd = 20261109; const rn = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296 - 0.5; };
  const fs = 100, n = 6000, tp = 12.4, ts = 19.6, pa = 2400, sa = 1500, ph = 0.3, d = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / fs; let v = 300 * Math.sin(2 * Math.PI * 0.2 * t + ph) + 40 * rn() + 25 * Math.sin(2 * Math.PI * 1.1 * t + 3 * ph);
    if (t > tp) { const u = t - tp; v += pa * Math.exp(-u / 2.2) * (1 - Math.exp(-u * 30)) * Math.sin(2 * Math.PI * 6 * u + ph) + 0.4 * pa * Math.exp(-u / 3) * rn() * (1 - Math.exp(-u * 30)); }
    if (t > ts) { const u = t - ts; v += sa * Math.exp(-u / 4) * (1 - Math.exp(-u * 15)) * Math.sin(2 * Math.PI * 2.5 * u + 2 * ph) + 0.35 * sa * Math.exp(-u / 6) * rn() * (1 - Math.exp(-u * 15)); }
    d[i] = Math.round(v + 1500 + 0.02 * i);
  }
  return d;
};
const ex = exampleZ(), EXFS = 100;
const exWin = (band, w0, w1) => {
  let x = taper(detrend(ex), 0.05);
  if (band) x = sosfiltfilt(butter(2, band, 'bandpass', EXFS), x);
  const a = Math.round(w0 * EXFS), b = Math.min(x.length, Math.round(w1 * EXFS) + 1), w = demean(x.subarray(a, b));
  const sp = amplitudeSpectrum(w, EXFS), dm = dominant(sp, (2 * EXFS) / w.length);
  return { f: +dm.f.toFixed(2), amp: +dm.a.toFixed(1), n: w.length };
};
const exRes = {
  P: [null, [1, 15], [0.5, 2.5], [0.6, 1.4]].map((b) => [b ? b.join('-') : 'none', exWin(b, 12.5, 18)]),
  S: [null, [1, 15], [0.5, 2.5], [0.6, 1.4]].map((b) => [b ? b.join('-') : 'none', exWin(b, 20, 32)]),
};

const res = {
  exRes,
  rawRms: +rawRms.toFixed(3),
  kept: BANDS.map((b, k) => ({ band: b.name, rms: +kept[k].toFixed(3), share: +((kept[k] / rawRms) ** 2).toFixed(3) })),
  gainAtCorners: BANDS.map((b, k) => ({ band: b.name, low: +gainZP(k, b.f[0]).toFixed(3), high: +gainZP(k, b.f[1]).toFixed(3), at0_2: +gainZP(k, 0.2).toExponential(2), at15: +gainZP(k, 15).toExponential(2) })),
  dominant: ['raw', ...BANDS.map((b) => b.name)].map((n, i) => [n, +dom[i].f.toFixed(2), +dom[i].a.toFixed(3)]),
  partsRms: { tremor: +rms(core(tremor)).toFixed(3), hf: +rms(core(hf)).toFixed(3), micro: +rms(core(micro)).toFixed(3) },
  alias, wl,
};
console.log(JSON.stringify(res, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'gain', figure(fig1, 'Figure 1. Gain of the four zero-phase bandpass filters (order 2 per corner, 50 samples per second) for the bands the paper reports. Zero phase squares the one-pass gain, so every corner sits at 0.5 (the dashed line).'));
  md = inject(md, 'spectrum', figure(fig2, 'Figure 2. Amplitude spectrum of our synthetic tremor record before and after two of the filters. The record is simulated (our assumption), not the paper\'s data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
