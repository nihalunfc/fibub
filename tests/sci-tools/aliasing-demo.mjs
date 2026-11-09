// #630 Sampling and aliasing explorer. The apparent frequency is checked against the peak of numpy.fft.rfft of the
// sampled sine (Hann window, parabolic peak refinement) for 12 cases, embedded below as [f, fs, numpy peak].
import { alias, fold, samples, aliasWave, sincRecon } from '../../src/lib/sci/eng-alias.ts';

const REF = [[30, 100, 29.999999999999993], [70, 100, 30.0], [130, 100, 29.99999999999999], [180, 100, 20.000000000000032], [23, 24, 0.9999999999999724], [30000, 44100, 14099.98197022129], [60, 50, 10.0], [5, 1000, 4.99999999999924], [255, 100, 45.000000000000036], [99, 10, 0.9999999999999546], [1234.5, 1000, 234.49999999999994], [0.75, 1, 0.25000000000000083]];
const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

export default async (check) => {
  for (const [f, fs, peak] of REF) check(`aliasing: ${f} Hz sampled at ${fs} Hz appears at ${+peak.toFixed(4)} Hz (numpy FFT peak)`, Math.abs(alias(f, fs).apparent - peak) < 2e-3 * Math.max(1, fs / 1000) && close(fold(f, fs), alias(f, fs).apparent));
  { const a = alias(30, 100); check('aliasing: 30 Hz at 100 Hz is zone 1, not aliased', a.zone === 1 && !a.aliased && !a.inverted && a.k === 0); }
  { const a = alias(70, 100); check('aliasing: 70 Hz at 100 Hz is zone 2, inverted, shows as −30 Hz', a.zone === 2 && a.aliased && a.inverted && a.signed === -30 && a.k === 1); }
  { const a = alias(130, 100); check('aliasing: 130 Hz at 100 Hz is zone 3, +30 Hz', a.zone === 3 && !a.inverted && close(a.signed, 30)); }
  { const a = alias(23, 24); check('aliasing: wagon wheel, 23 turns/s filmed at 24 frames/s appears as −1 (backwards)', close(a.signed, -1)); }
  { const a = alias(50, 100); check('aliasing: exactly fs/2 is an edge case', a.edge && a.zone === 1 && !a.aliased); }
  { const a = alias(100, 100); check('aliasing: exactly fs looks like 0 Hz (zone 2 edge)', a.edge && a.apparent === 0 && a.zone === 2); }
  // The alias passes through every sample; the sinc reconstruction from many samples is close to the alias between samples.
  for (const [f, fs] of [[70, 100], [130, 100], [23, 24], [255, 100]]) {
    const s = samples(f, fs, 1.5, 0.4, 40, -20);
    check(`aliasing: alias of ${f} Hz at ${fs} Hz passes through all 40 samples`, s.t.every((t, i) => close(aliasWave(f, fs, 1.5, 0.4, t), s.x[i], 1e-9)));
    const big = samples(f, fs, 1.5, 0.4, 4001, -2000), t = 0.37 / fs;
    check(`aliasing: sinc reconstruction between samples gives the alias (${f} Hz at ${fs} Hz)`, Math.abs(sincRecon(big.x, -2000, fs, t) - aliasWave(f, fs, 1.5, 0.4, t)) < 2e-3);
  }
  { const s = samples(30, 100, 1, 0, 401, -200); check('aliasing: below Nyquist, sinc reconstruction gives the original', Math.abs(sincRecon(s.x, -200, 100, 0.0123) - Math.sin(2 * Math.PI * 30 * 0.0123)) < 5e-3); }
};
