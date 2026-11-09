// #422 instrument harmonics analyser. The windowed, frame-averaged spectrum (Hann, Hamming, Blackman, rectangular),
// parabolic peak picking and the spectral centroid checked against NumPy (rfft, scipy get_window) on a synthetic
// stretched-partial tone with noise; the fundamental and inharmonicity B come back from tones of known f0 and B.
import * as H from '../../src/lib/sci/harmonics.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  { const re = Float64Array.from([1, 2, 3, 4, 0, -1, 0.5, 2]), im = new Float64Array(8); H.fft(re, im);
    check('harmonics: FFT of 8 points (sum, Nyquist bin)', near(re[0], 11.5, 1e-12) && near(im[0], 0, 1e-12) && near(re[4], 1 - 2 + 3 - 4 + 0 + 1 + 0.5 - 2, 1e-12)); }
  check('harmonics: a sine of amplitude 0.5 on a bin reads 0.5 (Hann)', near(H.spectrum(Float64Array.from({ length: 4096 }, (_, i) => 0.5 * Math.sin((2 * Math.PI * 64 * i) / 1024)), 1024, 1024).amp[64], 0.5, 1e-9));
  const fs = 44100, x = H.synth(fs, 1, 220, { B: 0.0004, count: 12, noise: 0.01, seed: 7 });
  check('harmonics: synthetic tone samples match NumPy', near(x[5], 1.2136883283956292, 1e-12) && near(x[1000], 1.1147415470118875, 1e-12));
  const s = H.spectrum(x, fs, 8192, 'hann');
  check('harmonics: Hann spectrum, 9 frames, bins 41, 42, 100 match NumPy', s.frames === 9 && near(s.amp[41], 0.9900262535371818, 1e-12) && near(s.amp[42], 0.407832787382647, 1e-12) && near(s.amp[100], 4.836058316633185e-05, 1e-15));
  const W = { hamming: [0.8575152040217082, 0.0011615190530861626], blackman: [0.9078035219535122, 0.0001041181631191052], rect: [0.7142490319075665, 0.00781689631206179] };
  check('harmonics: Hamming, Blackman and rectangular windows on a 20,000-sample segment match NumPy', Object.entries(W).every(([k, v]) => { const t = H.spectrum(x, fs, 4096, k, 1000, 20000); return t.frames === 8 && near(t.amp[20], v[0], 1e-12) && near(t.amp[85], v[1], 1e-14); }));
  const ps = H.peaks(s, { floorDb: 60 });
  const np = [[219.9921677848499, 0.02250745349737715], [440.2769614586512, -5.962647214161709], [661.1175801798337, -9.496626968607657], [882.8072995431814, -12.040422532495507], [1105.5651619462506, -13.807727999425898]];
  check('harmonics: five strongest peaks (parabolic interpolation) match NumPy', np.every(([f, d], i) => near(ps[i].f, f, 1e-9) && near(ps[i].db, d, 1e-9)));
  check('harmonics: spectral centroid 1340.861 Hz matches NumPy', near(H.centroid(s), 1340.8610601905157, 1e-8));
  const f0 = H.fundamental(ps), fit = H.harmonicSeries(ps, f0, 12, fs / 2);
  check('harmonics: stretched tone: f0 220.0 Hz and B 0.000400 recovered from 12 partials', near(fit.f0, 220, 0.05) && near(fit.B, 0.0004, 0.00001) && fit.found === 12 && fit.harmonics[11].cents > 40);
  const cases = [[41.2, {}], [110, { amp: (n) => (n % 2 ? 1 / n : 0.02 / n) }], [196, { amp: (n) => (n === 1 ? 0.05 : 1 / n) }], [523.25, {}], [1046.5, { count: 8 }], [261.63, { amp: () => 1, count: 20 }]];
  check('harmonics: fundamental within 0.1 % for low, clarinet-like, weak-fundamental, high and flat-spectrum tones', cases.every(([f, o]) => { const t = H.spectrum(H.synth(fs, 1.5, f, { noise: 0.02, ...o }), fs, 16384), p = H.peaks(t); return near(H.harmonicSeries(p, H.fundamental(p), 16, fs / 2).f0, f, f * 0.001); }));
  { const h = H.harmonicSeries(H.peaks(H.spectrum(H.synth(fs, 1, 300, { amp: (n) => (n === 3 ? 0 : 1 / n), count: 6 }), fs, 8192)), 300, 8, fs / 2);
    check('harmonics: a missing harmonic is reported as not found; strongest is 0 dB', h.harmonics[2].f === null && h.harmonics[0].rel === 0 && h.harmonics[1].rel < -5 && h.harmonics[6].f === null); }
  check('harmonics: note names (440 = A4, 261.63 = C4, 445 = A4 +19.6 ¢)', H.noteOf(440).name === 'A4' && H.noteOf(261.63).name === 'C4' && near(H.noteOf(445).cents, 19.56, 0.01));
  check('harmonics: short signal is zero-padded into one frame', H.spectrum([1, 0, 0, 0], 8, 16).frames === 1);
};
