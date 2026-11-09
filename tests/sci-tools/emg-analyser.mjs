// #681 EMG envelope and fatigue analyser. Welch spectra checked against scipy.signal.welch (nperseg 256, defaults),
// mean and median frequency against the same definition in NumPy on SciPy's spectra, the moving RMS against
// numpy.convolve, the low-pass envelope against scipy.signal.sosfiltfilt, the fatigue slope against
// scipy.stats.linregress, and burst onsets against the known burst times of the synthetic EMG.
import * as E from '../../src/lib/sci/emg.ts';
import { filtfilt, bandSections } from '../../src/lib/sci/biosig.ts';

export default async (check) => {
  const near = (a, b, tol) => Number.isFinite(a) && Math.abs(a - b) <= tol;
  // FFT against a direct DFT.
  { const re = Float64Array.from({ length: 16 }, (_, i) => Math.sin(i) + i / 7), im = new Float64Array(16), r0 = Array.from(re);
    E.fft(re, im); let ok = true;
    for (let k = 0; k < 16; k++) { let a = 0, b = 0; r0.forEach((v, n) => { a += v * Math.cos(2 * Math.PI * k * n / 16); b -= v * Math.sin(2 * Math.PI * k * n / 16); }); ok = ok && near(re[k], a, 1e-12) && near(im[k], b, 1e-12); }
    check('emg: FFT equals the direct DFT', ok); }
  // Welch of a pure 100 Hz sine: all power near 100 Hz, total = A²/2.
  { const x = Array.from({ length: 2000 }, (_, i) => 2 * Math.sin(2 * Math.PI * 100 * i / 1000)), w = E.welch(x, 1000, 256);
    let tot = 0; for (let k = 0; k < w.P.length; k++) tot += w.P[k] * 1000 / 256;
    const mm = E.meanMedian(w.f, w.P, 0, 500);
    check('emg: Welch density integrates to the sine variance A²/2', near(tot, 2, 0.02));
    check('emg: mean and median frequency of a 100 Hz sine', near(mm.mnf, 100, 0.5) && near(mm.mdf, 100, 2.5)); }
  const { x, fs, bursts } = E.synthEmg();
  const y = filtfilt(x, bandSections(fs, 20, 450, 0));
  const wl = E.welch(Array.from(y.slice(3000, 4000)), fs, 256), mm = E.meanMedian(wl.f, wl.P, 20, 450);
  check('emg: Welch window mean and median frequency (SciPy)', near(mm.mnf, 173.97477863242779, 1e-9) && near(mm.mdf, 136.37740421165466, 1e-9));
  const env = E.envelope(y, fs, 'rms', 50), env2 = E.envelope(y, fs, 'lp', 6);
  { let ok = true; const w = 50; for (const i of [500, 2300, 15000, 29990]) { let s = 0; for (let k = i - 25; k < i + 25; k++) s += y[k] * y[k]; ok = ok && near(env[i], Math.sqrt(s / w), 1e-12); } check('emg: moving RMS 50 ms (numpy.convolve)', ok); }
  check('emg: low-pass envelope positive and smooth', env2.every((v) => Number.isFinite(v)) && env2[4000] > 0.2 && env2[500] < 0.02);
  const b = E.bursts(env, y, fs, 0, 1.5, 3, 0.2, 0.1);
  check(`emg: 5 bursts, onsets and offsets within 30 ms of the truth`, b.bursts.length === 5 && b.bursts.every((z, i) => Math.abs(z.on - bursts[i][0]) < 0.03 && Math.abs(z.off - bursts[i][1]) < 0.03));
  const b2 = E.bursts(env2, y, fs, 0, 1.5, 3, 0.2, 0.1);
  check('emg: low-pass envelope finds the same 5 bursts within 50 ms', b2.bursts.length === 5 && b2.bursts.every((z, i) => Math.abs(z.on - bursts[i][0]) < 0.05));
  check('emg: iEMG grows with the made-up fatigue', b.bursts.every((z, i) => i === 0 || z.iemg > b.bursts[i - 1].iemg));
  const act = (t0, t1) => b.bursts.some((z) => t0 >= z.on && t1 <= z.off);
  const w = E.fatigue(y, fs, 1, 0.5, 256, 20, 450, act), a = w.filter((v) => v.active);
  check('emg: 63 windows, 35 inside bursts', w.length === 63 && a.length === 35 && near(a[0].mnf, 166.52929284068063, 1e-9) && near(a[0].mdf, 137.66111992513973, 1e-9));
  const tl = E.trendLine(a.map((v) => v.t), a.map((v) => v.mdf));
  check('emg: median frequency slope (scipy linregress)', near(tl.b, -1.4193903600426927, 1e-9) && near(tl.a, 148.09670900726724, 1e-9) && near(tl.r2, 0.7040041405958731, 1e-9) && near(tl.seb, 0.16021386321158054, 1e-9));
  let threw = false; try { E.fatigue(y, fs, 0.1, 0.1, 256, 20, 450); } catch { threw = true; }
  check('emg: window shorter than a segment throws', threw);
};
