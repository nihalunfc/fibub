// Figures for src/blog/discoveries/octave-band-air-attenuation-iso-9613-summation-reverberation-normalisation.md, made
// with the ISO 9613-1 air absorption formula used by the Decibel distance and Room acoustics calculators
// (src/lib/sci/phair.ts: airAbsorption) and levelAt from src/lib/sci/phdb.ts.
// Run: node scripts/blog-figures/octave-band-air-attenuation-iso-9613-summation-reverberation-normalisation.mjs
import fs from 'node:fs';
import { airAbsorption } from '../../src/lib/sci/phair.ts';
import { levelAt } from '../../src/lib/sci/phdb.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/octave-band-air-attenuation-iso-9613-summation-reverberation-normalisation.md', import.meta.url);

// From the paper: Rindel (2024), Appl. Sci. 14: 10139 (CC BY). Reference atmosphere 20 °C, 50 % RH, 101.325 kPa;
// c0 = 343.2 m/s; summation over N = 9 pure tones per octave band (N = 15 gave no noticeable change).
// OUR assumption: the 9 tones sit at the centres of 9 equal slices of the octave on a log scale, equal weight
// (a flat spectrum inside the band). The paper's exact placement of the tones may differ.
const C0 = 343.2, N = 9;
const tones = (fc, n = N) => Array.from({ length: n }, (_, i) => fc * 2 ** ((i + 0.5) / n - 0.5));
const pure = (f, r, T = 20, RH = 50) => airAbsorption(f, T, RH).alpha * r;
// Octave-band attenuation after a path r: energy average of the band's pure tones.
const band = (fc, r, T = 20, RH = 50, n = N) => -10 * Math.log10(tones(fc, n).reduce((s, f) => s + 10 ** (-pure(f, r, T, RH) / 10), 0) / n);
const r1 = (v) => +v.toFixed(1);

const TT = [0.25, 1, 2, 4, 8];
const table = [1000, 2000, 4000, 8000].map((fc) => ({ fc, alpha: r1(airAbsorption(fc, 20, 50).alpha * 1000), rows: TT.map((t) => ({ t, pure: r1(pure(fc, C0 * t)), sum: r1(band(fc, C0 * t)), sum15: r1(band(fc, C0 * t, 20, 50, 15)) })) }));
// Where the centre-frequency shortcut is off by 0.5 and 1 dB (and how much attenuation that is).
const offAt = (fc, tol) => { let t = 0; while (Math.abs(pure(fc, C0 * t) - band(fc, C0 * t)) < tol) t += 0.001; return { t: +t.toFixed(2), r: Math.round(C0 * t), A: r1(band(fc, C0 * t)), rf2: +((C0 * t / 1000) * (fc / 1000) ** 2).toFixed(1) }; };
const off = [2000, 4000, 8000].map((fc) => ({ fc, half: offAt(fc, 0.5), one: offAt(fc, 1) }));
// At 15 dB of band attenuation, how far off is the shortcut?
const at15 = [2000, 4000, 8000].map((fc) => { let t = 0; while (band(fc, C0 * t) < 15) t += 0.001; return { fc, t: +t.toFixed(2), pure: r1(pure(fc, C0 * t)) }; });
// The 8 kHz band's average coefficient A/r falls towards the 6.3 kHz tone's.
const a63 = airAbsorption(6300, 20, 50).alpha;
let t63 = 0.01; while (band(8000, C0 * t63) / (C0 * t63) > a63) t63 += 0.001;
const slope = (fc, t) => (band(fc, C0 * t + 1) - band(fc, C0 * t)) * 1000;
// Normalising 30 % RH to the 50 % reference at 4 kHz.
const norm = [1, 2, 3, 4].map((t) => ({ t, d: r1(band(4000, C0 * t, 20, 30) - band(4000, C0 * t)), dPure: r1(pure(4000, C0 * t, 20, 30) - pure(4000, C0 * t)) }));
let t10 = 0; while (band(4000, C0 * t10, 20, 30) - band(4000, C0 * t10) < 10) t10 += 0.01;
const cold = [0, 20].map((T) => ({ T, alpha4: r1(airAbsorption(4000, T, 50).alpha * 1000), A1: r1(band(4000, C0, T, 50)), A4: r1(band(4000, 4 * C0, T, 50)) }));
const tool = { r2: 687, a8: levelAt(90, 1, 687, 8000, 'plane', { tC: 20, rh: 50, pKPa: 101.325, on: true }), a63: levelAt(90, 1, 687, 6300, 'plane', { tC: 20, rh: 50, pKPa: 101.325, on: true }), sum: band(8000, 686) };

const ts = Array.from({ length: 81 }, (_, i) => i * 0.05);
const fig1 = chart({
  title: 'Air attenuation in the 4 and 8 kHz octave bands', xLabel: 'Travel time (s), at 343.2 m/s', yLabel: 'Attenuation (dB)',
  series: [
    { name: '8 kHz band', kind: 'line', x: ts, y: ts.map((t) => r1(band(8000, C0 * t))) },
    { name: '4 kHz band', kind: 'line', x: ts, y: ts.map((t) => r1(band(4000, C0 * t))) },
    { name: 'Centre tone only', kind: 'line', x: ts, y: ts.map((t) => r1(pure(8000, C0 * t))), colour: 'var(--muted)', dash: '5 4' },
    { name: '', noLegend: true, kind: 'line', x: ts, y: ts.map((t) => r1(pure(4000, C0 * t))), colour: 'var(--muted)', dash: '5 4' },
  ],
  xDomain: [0, 4], yDomain: [0, 100], hlines: [{ y: 15, text: '15 dB' }],
  desc: `Attenuation against travel time at 20 °C and 50 % humidity. After 2 s the 8 kHz band has lost ${r1(band(8000, 2 * C0))} dB, against ${r1(pure(8000, 2 * C0))} dB for its centre tone alone.`, height: 280,
});
const ts2 = Array.from({ length: 80 }, (_, i) => 0.1 + i * 0.1);
const fig2 = chart({
  title: '8 kHz band: the loss rate slows down', xLabel: 'Travel time (s)', yLabel: 'Loss rate (dB per km)',
  series: [
    { name: 'Rate at that moment', kind: 'line', x: ts2, y: ts2.map((t) => r1(slope(8000, t))) },
    { name: 'Average so far', kind: 'line', x: ts2, y: ts2.map((t) => r1((band(8000, C0 * t) / (C0 * t)) * 1000)) },
  ],
  xDomain: [0, 8], yDomain: [0, 120],
  hlines: [{ y: r1(airAbsorption(8000, 20, 50).alpha * 1000), text: '8 kHz tone' }, { y: r1(a63 * 1000), text: '6.3 kHz tone' }],
  desc: `The 8 kHz band's loss rate starts near ${Math.round(slope(8000, 0))} dB per km and falls as the top of the band dies away; the running average reaches the 6.3 kHz tone's ${r1(a63 * 1000)} dB per km after ${t63.toFixed(1)} s.`, height: 260,
});

console.log(JSON.stringify({ table, off, at15, a63: r1(a63 * 1000), t63: +t63.toFixed(2), A63: r1(band(8000, C0 * t63)), slope0: r1(slope(8000, 0)), slope2: r1(slope(8000, 2)), norm, t10: +t10.toFixed(2), cold, tool: { a8: +tool.a8.absorb.toFixed(2), alpha8: +(tool.a8.alpha * 1000).toFixed(1), a63: +tool.a63.absorb.toFixed(2), sum: r1(tool.sum) } }, null, 0));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'bands', figure(fig1, 'Figure 1. Octave-band air attenuation against travel time, summed from 9 pure tones per band with the ISO 9613-1 formula in fibub\'s calculators (solid), and the centre tone alone (dashed), at 20 °C, 50 % humidity and sea-level pressure. Recomputed, not the paper\'s figure.'));
  md = inject(md, 'rate', figure(fig2, 'Figure 2. For the 8 kHz band, the rate of loss at each moment and the average rate so far, against the pure-tone coefficients at 8 and 6.3 kHz.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
