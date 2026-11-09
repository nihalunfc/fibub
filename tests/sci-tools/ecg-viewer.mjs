// #680 ECG viewer and HRV. Filters checked against scipy.signal (butter, iirnotch, sosfiltfilt); HRV time domain
// against NumPy on the detected beats; Lomb-Scargle band powers against scipy.signal.lombscargle(floating_mean=True,
// normalize='normalize') scaled the same way; QRS detection against the known beat times of the synthetic ECG.
import { synthEcg, panTompkins, hrvTime, hrvFreq } from '../../src/lib/sci/ecg.ts';
import { filtfilt, bandSections, butterHigh, butterLow, notch } from '../../src/lib/sci/biosig.ts';

export default async (check) => {
  const near = (a, b, tol) => Number.isFinite(a) && Math.abs(a - b) <= tol;
  // Filter sections (scipy.signal.butter / iirnotch).
  { const h = butterHigh(0.5, 250), l = butterLow(40, 250), q = notch(60, 500);
    check('ecg: butter high-pass 0.5 Hz at 250 Hz', near(h[0], 0.9911536, 1e-7) && near(h[1], -1.98230719, 1e-7) && near(h[3], -1.98222893, 1e-7) && near(h[4], 0.98238545, 1e-7));
    check('ecg: butter low-pass 40 Hz at 250 Hz', near(l[0], 0.14532388, 1e-7) && near(l[3], -0.67102909, 1e-7) && near(l[4], 0.25232463, 1e-7));
    check('ecg: iirnotch 60 Hz Q 30 at 500 Hz', near(q[0], 0.98758894, 1e-7) && near(q[1], -1.43984271, 1e-7) && near(q[4], 0.97517788, 1e-7)); }
  const { x, beats, fs } = synthEcg();
  const y = filtfilt(x, bandSections(fs, 0.5, 40, 50));
  check('ecg: zero-phase filter matches scipy sosfiltfilt', [[0, -0.05871680045929547], [1000, -0.08058338133394909], [20000, 0.13645106776048616], [44999, 0.0393824089763003]].every(([i, v]) => near(y[i], v, 1e-12)));
  // QRS detection on the synthetic ECG and variants: every true beat found within 3 ms, nothing extra.
  for (const [name, o, inv] of [['example', {}], ['45 bpm', { hr: 45 }], ['150 bpm', { hr: 150, lfAmp: 10, hfAmp: 8 }], ['noisy', { noise: 0.1, seed: 3 }], ['inverted', {}, true]]) {
    let s = synthEcg(o); const xx = inv ? s.x.map((v) => -v) : s.x, yy = filtfilt(xx, bandSections(s.fs, 0.5, 40, 50));
    const d = panTompkins(xx, yy, s.fs), r = d.r.map((v) => v / s.fs);
    const ok = r.length === s.beats.length && s.beats.every((b, i) => Math.abs(r[i] - b) < 0.003);
    check(`ecg: Pan-Tompkins finds all ${s.beats.length} beats (${name})`, ok && d.polarity === (inv ? 'down' : 'up'));
  }
  const r = panTompkins(x, y, fs).r.map((v) => v / fs);
  check('ecg: example has 204 beats', r.length === 204 && beats.length === 204);
  const h = hrvTime(r, 0.2);
  check('ecg: mean RR and HR (NumPy)', near(h.meanRR, 880.6287106195175, 1e-9) && near(h.meanHR, 68.2572883352479, 1e-9) && h.removed === 0);
  check('ecg: SDNN, RMSSD, pNN50 (NumPy)', near(h.sdnn, 37.621076810891225, 1e-9) && near(h.rmssd, 33.67564847449279, 1e-9) && near(h.pnn50, 13.861386138613863, 1e-9));
  check('ecg: Poincaré SD1, SD2 (NumPy)', near(h.sd1, 23.868837086854136, 1e-9) && near(h.sd2, 47.54965254282276, 1e-9));
  const f = hrvFreq(h.tBeat, h.nn, true);
  check('ecg: VLF, LF, HF power vs scipy lombscargle', near(f.vlf, 6.310554443398462, 1e-6) && near(f.lf, 875.3723341358167, 1e-6) && near(f.hf, 496.7226881418639, 1e-6));
  check('ecg: LF and HF peaks at the built-in 0.1 and 0.25 Hz rhythms', near(f.peakLF, 0.1, 0.001) && near(f.peakHF, 0.25, 0.001));
  // A pure 0.1 Hz RR swing of ±40 ms: LF power about A²/2 = 800 ms² (scipy gives 794.29).
  { const t = [], v = []; for (let i = 0; i * 0.8 < 300; i++) { t.push(i * 0.8); v.push(800 + 40 * Math.sin(2 * Math.PI * 0.1 * i * 0.8)); }
    const g = hrvFreq(t, v, false); check('ecg: sine RR series gives LF ≈ A²/2', near(g.lf, 794.2923276610923, 1e-6) && g.hf < 5); }
  // Irregular intervals are set aside.
  { const b = r.slice(); b.splice(50, 0, (b[49] + b[50]) / 2); const g = hrvTime(b, 0.2); check('ecg: an extra beat removes 2 intervals', g.removed === 2 && near(g.sdnn, h.sdnn, 3)); }
  try { hrvTime([1, 2]); check('ecg: too few beats throws', false); } catch { check('ecg: too few beats throws', true); }
};
