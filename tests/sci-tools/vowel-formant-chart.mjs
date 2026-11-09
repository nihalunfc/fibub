// Vowel formant chart: LPC checked against numpy/scipy (scipy.signal.lfilter pre-emphasis, numpy.hamming,
// scipy.linalg.solve_toeplitz, numpy.roots) on the same made-up vowel, and Lobanov against pandas.
import * as L from '../../src/lib/sci/formant.ts';
import { readWav, writeWav, resample } from '../../src/lib/sci/formant-audio.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const fs = 11000, x = L.synthVowel([700, 1220, 2600, 3500, 4500], [60, 70, 110, 200, 250], 120, 0.4, fs);
  const y = L.preEmphasis(x, fs), N = 275, w = L.hamming(N);
  const fr = Float64Array.from(y.subarray(1100, 1100 + N), (v, i) => v * w[i]);
  const { a } = L.levinson(L.autocorr(fr, 10), 10);
  const scipyA = [-1.1112817851, 0.9033461215, -0.9123119126, 1.0207488784, -0.4614653426, 0.8532582016, -0.6897669334, 0.5162572912, -0.5935161008, 0.6696773785];
  check('formant: Levinson-Durbin matches scipy solve_toeplitz', scipyA.every((v, i) => near(a[i + 1], v, 1e-9)));
  const fm = L.rootsToFormants(a, fs);
  const ref = [[712.4491, 53.3225], [1212.8284, 69.2285], [2609.4261, 111.8543], [3506.896, 205.7364], [4518.2601, 261.8193]];
  check('formant: frequencies and bandwidths from roots match numpy.roots', fm.length === 5 && ref.every(([f, b], i) => near(fm[i].f, f, 1e-3) && near(fm[i].bw, b, 1e-3)));
  // Roots of a polynomial with known roots: (z − 0.5)(z + 0.25)(z² − 2·0.9cos(1)z + 0.81).
  // Expanded: (z² − 0.25z − 0.125)(z² − c1 z + 0.81).
  const c1 = 2 * 0.9 * Math.cos(1);
  const q = [1, -c1 - 0.25, 0.81 + 0.25 * c1 - 0.125, -0.25 * 0.81 + 0.125 * c1, -0.125 * 0.81];
  const r = L.polyRoots(q), want = [[0.5, 0], [-0.25, 0], [0.9 * Math.cos(1), 0.9 * Math.sin(1)], [0.9 * Math.cos(1), -0.9 * Math.sin(1)]];
  check('formant: Aberth root finder finds known roots', want.every(([re, im]) => r.some((z) => near(z[0], re, 1e-12) && near(z[1], im, 1e-12))));
  // Whole pipeline on made-up vowels at three sample rates, through a WAV file round trip.
  let ok = true;
  for (const rate of [16000, 44100]) for (const [F, f0] of [[[300, 2300, 3000, 3700, 4500], 210], [[750, 1300, 2500, 3500, 4500], 120], [[320, 800, 2300, 3400, 4400], 150]]) {
    const s = L.synthVowel(F, [60, 90, 130, 200, 250], f0, 0.4, rate), wv = readWav(writeWav(s, rate));
    const sp = L.spanFormants(L.formantTrack(wv.x, wv.fs, { maxFormant: 5500 }), 0.05, 0.35);
    if (!sp.F.every((f, k) => Math.abs(f / F[k] - 1) < 0.05)) ok = false;
  }
  check('formant: F1 to F3 of made-up vowels within 5 % at 16 and 44.1 kHz', ok);
  const z = L.lobanov([300, 2300, 750, 1300, 320, 400, 2600, 850, 1500, 380], ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B']);
  const pz = [-0.830271852, 1.5624424189, -0.2919111411, 0.3660852835, -0.8063447093, -0.8009106369, 1.5610242172, -0.3177875985, 0.3800567902, -0.8223827719];
  check('formant: Lobanov z-scores per speaker match pandas', pz.every((v, i) => near(z[i], v, 1e-9)));
  const tone = Array.from({ length: 44100 }, (_, i) => Math.sin(2 * Math.PI * 300 * i / 44100) + 0.3 * Math.sin(2 * Math.PI * 9000 * i / 44100));
  const o = resample(tone, 44100, 11000);
  let err = 0; for (let m = 200; m < o.length - 200; m++) err = Math.max(err, Math.abs(o[m] - Math.sin(2 * Math.PI * 300 * m / 11000)));
  check(`formant: resampling keeps 300 Hz and removes 9 kHz (error ${err.toExponential(1)})`, err < 1e-3);
  // WAV reading: 24-bit stereo and 32-bit float.
  const mk = (tag, bits, ch, samples) => {
    const bytes = bits / 8, n = samples.length / ch, b = new Uint8Array(44 + n * ch * bytes), v = new DataView(b.buffer);
    const put = (at, s) => [...s].forEach((c, i) => (b[at + i] = c.charCodeAt(0)));
    put(0, 'RIFF'); v.setUint32(4, 36 + n * ch * bytes, true); put(8, 'WAVE'); put(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, tag, true); v.setUint16(22, ch, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000 * ch * bytes, true); v.setUint16(32, ch * bytes, true); v.setUint16(34, bits, true); put(36, 'data'); v.setUint32(40, n * ch * bytes, true);
    samples.forEach((s, i) => { const at = 44 + i * bytes; if (tag === 3) v.setFloat32(at, s, true); else { const w = Math.round(s * 8388607); v.setUint8(at, w & 255); v.setUint8(at + 1, (w >> 8) & 255); v.setUint8(at + 2, (w >> 16) & 255); } });
    return b;
  };
  const w24 = readWav(mk(1, 24, 2, [0.5, -0.5, 0.25, 0.75]));
  check('formant: 24-bit stereo WAV mixed to mono', w24.x.length === 2 && near(w24.x[0], 0, 1e-6) && near(w24.x[1], 0.5, 1e-6) && w24.channels === 2);
  const wf = readWav(mk(3, 32, 1, [0.1, -0.2]));
  check('formant: 32-bit float WAV', near(wf.x[1], -0.2, 1e-7) && wf.format === 'float');
  let msg = ''; try { readWav(new Uint8Array(20)); } catch (e) { msg = e.message; }
  check('formant: not a WAV file is explained', /not a WAV/.test(msg));
  const t = L.parseVowelTable('speaker,vowel,F1,F2\nA,i,300,2300\nA,a,750,x\nB,u,320,800');
  check('formant: vowel table by header names', t.rows.length === 2 && t.skipped === 1 && t.rows[1].vowel === 'u' && t.rows[1].speaker === 'B' && t.rows[0].F2 === 2300);
};
