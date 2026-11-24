// Figures for src/blog/discoveries/phone-seismometer-building-natural-frequency-mems-highpass-filter-attenuation.md, made with the maths of
// the Phone seismometer tool (src/lib/sci/phoneseis.ts: even resampling, detrend, taper, zero-phase Butterworth, PGA, spectrum, dominant frequency; filters from dsp.ts).
// Run: node scripts/blog-figures/phone-seismometer-building-natural-frequency-mems-highpass-filter-attenuation.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { uniform, analyse } from '../../src/lib/sci/phoneseis.ts';
import { butter, sosGain } from '../../src/lib/sci/dsp.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/phone-seismometer-building-natural-frequency-mems-highpass-filter-attenuation.md', import.meta.url);

// Inputs from the paper (Minowa, Kaniev and Rustamov 2023, E3S Web of Conferences 401, 05031, doi:10.1051/e3sconf/202340105031, CC BY 4.0):
// sampling 100 Hz; 20 bit; range about +-2.5 G; first natural frequency about 1.55 Hz (6-storey frame); 1.25 and 1.5 Hz peaks of the curved 10-storey
// building; roof-to-base magnification about 26 (one horizontal direction) and 15 (the other) at 1.55 Hz; filters 1 Hz high-pass and 20 Hz low-pass; records of about 400 s.
// OUR assumptions: a one-mode building (a single damped oscillator) shaken by random ground motion, damping read from the magnification as 1/(2*Q), a seeded random series, a phone-like
// uneven clock is NOT added (the paper's sensor is not a phone), and the numbers are in m/s2.
const FS = 100, F0 = 1.55, R = (x, n = 2) => +x.toFixed(n);
function building(f0, zeta, seconds, seed) {
  let s = seed; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 - 0.5; };
  const w = 2 * Math.PI * f0, sub = 20, dt = 1 / (FS * sub), n = Math.round(seconds * FS), out = new Float64Array(n);
  let u = 0, v = 0; const sig = 0.0095 * Math.sqrt(12); // ground acceleration noise, m/s2 rms per sample (gives a roof record of about 1 cm/s2 rms)
  for (let i = 0; i < n; i++) {
    const ag = rnd() * sig;
    for (let k = 0; k < sub; k++) { // semi-implicit Euler on the relative motion
      const a = -ag - 2 * zeta * w * v - w * w * u; v += a * dt; u += v * dt;
    }
    out[i] = -(2 * zeta * w * v + w * w * u); // absolute acceleration of the roof of a one-mode building
  }
  return out;
}
const zeta26 = 1 / (2 * 26), zeta15 = 1 / (2 * 15);
const acc = building(F0, zeta26, 400, 7);
const t = Array.from(acc, (_, i) => i / FS), off = 0.1;
const rec = uniform(t, acc.map((a) => a + off), acc.map(() => 0), acc.map(() => 9.80665), FS);
const settings = [['0.5 Hz, order 2 (page default)', { hp: 0.5, order: 2 }], ['1 Hz high, 20 Hz low, order 2', { hp: 1, lp: 20, order: 2 }], ['1 Hz high, 20 Hz low, order 4', { hp: 1, lp: 20, order: 4 }], ['2 Hz, order 4', { hp: 2, order: 4 }]];
const rows = settings.map(([name, o]) => { const a = analyse(rec, o); const p = a.per[0]; return { name, pga: R(p.pga.a * 100, 2), dom: R(p.dom.f, 3), amp: R(p.dom.a * 100, 3) }; });
const rms = Math.sqrt(acc.reduce((s, x) => s + x * x, 0) / acc.length);
// Gain of the zero-phase filters (forward and back = gain squared) at the paper's frequencies.
const gainAt = (N, hp, f) => R(sosGain(butter(N, hp, 'highpass', FS), f, FS) ** 2, 3);
const gains = [1.25, 1.3, 1.4, 1.55].map((f) => [f, gainAt(2, 1, f), gainAt(4, 1, f), gainAt(2, 0.5, f)]);
const fr = Array.from({ length: 121 }, (_, i) => 0.1 + i * 0.0325); // 0.1 to 4.0 Hz
const fig1 = chart({
  title: 'Gain of a zero-phase high-pass filter near 1.5 Hz', xLabel: 'Frequency (Hz)', yLabel: 'Amplitude gain (1 = unchanged)',
  series: [[2, 1, 'var(--c-blog)'], [4, 1, 'var(--c-tools)'], [2, 0.5, 'var(--muted)']].map(([N, hp, c]) => ({ name: `${hp} Hz, order ${N}`, kind: 'line', colour: c, x: fr, y: fr.map((f) => R(sosGain(butter(N, hp, 'highpass', FS), f, FS) ** 2, 4)) })),
  xDomain: [0, 4], yDomain: [0, 1.05], vlines: [{ x: 1.25, text: '1.25' }, { x: 1.55, text: '1.55 Hz' }],
  desc: 'Amplitude gain of zero-phase Butterworth high-pass filters with corner 1 Hz (order 2 and 4) and 0.5 Hz (order 2) at a 100 hertz sampling rate, from 0.1 to 4 hertz. The marked building frequencies 1.25 and 1.55 hertz are reduced by the 1 hertz filters.', height: 290,
});
// Spectrum of the simulated roof record, raw (detrended) and after the 1 Hz / order 2 filter.
const a0 = analyse(rec, { hp: 0.5, order: 2 }), a1 = analyse(rec, { hp: 1, lp: 20, order: 2 });
const sp0 = a0.per[0].sp, sp1 = a1.per[0].sp, keep = [...sp0.f].map((f, i) => i).filter((i) => sp0.f[i] >= 0.3 && sp0.f[i] <= 4 && i % 8 === 0); // every 8th bin (about 0.012 Hz apart)
const fig2 = chart({
  title: 'Simulated roof record: spectrum with two filter settings', xLabel: 'Frequency (Hz)', yLabel: 'Amplitude (cm/s2)',
  series: [[sp0, '0.5 Hz high-pass, order 2', 'var(--c-blog)'], [sp1, '1 Hz high, 20 Hz low, order 2', 'var(--c-tools)']].map(([sp, name, c]) => ({ name, kind: 'line', colour: c, x: keep.map((i) => R(sp.f[i], 3)), y: keep.map((i) => R(sp.a[i] * 100, 4)) })),
  xDomain: [0.3, 4], vlines: [{ x: F0, text: '1.55 Hz' }],
  desc: 'Amplitude spectrum of the x channel of a simulated 400 second roof record of a building whose first mode is at 1.55 hertz, after a 0.5 hertz high-pass filter and after a 1 hertz high-pass with a 20 hertz low-pass. Both peak near 1.55 hertz but the second is smaller.', height: 290,
});
const res = { zeta26: R(zeta26, 4), zeta15: R(zeta15, 4), rmsCms2: R(rms * 100, 3), rows, gains, T: R(1 / F0, 3), res20: R(5 * 9.80665 / 2 ** 20 * 100, 4), res20ug: R(5 / 2 ** 20 * 1e6, 2), ug: R(9.80665e-6 * 100, 5), pend: R(2 * Math.PI * Math.sqrt(1 / 9.8), 3), mag: R(1 / (2 * zeta26), 1), ratio10: R(1.25 / 1.5, 3) };
console.log(JSON.stringify(res));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'gain', figure(fig1, 'Figure 1. Gain of zero-phase Butterworth high-pass filters (what the Phone seismometer tool applies) at the 100 Hz rate used in the paper, worked out with the tool\'s filter maths. A 1 Hz corner leaves a building mode at 1.25 to 1.55 Hz partly cut; a 0.5 Hz corner barely touches it.'));
  md = inject(md, 'spectrum', figure(fig2, 'Figure 2. Amplitude spectrum of a simulated 400 s roof record (a single-mode building with its first mode at 1.55 Hz, damping 1.9 per cent, random ground shaking: our assumptions, not the paper\'s data) after two filter settings, made with the Phone seismometer tool\'s maths.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
