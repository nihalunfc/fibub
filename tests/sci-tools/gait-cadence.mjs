// #491 gait and cadence. Reference numbers from scipy (butter, filtfilt, find_peaks) and numpy (interp, rfft);
// the full pipeline was compared on 4 synthetic walks × 3 settings, including jittered millisecond timestamps
// (/tmp/claude-0/a9/gait_check.py): identical step indices, filtered signal to 1e-9.
import * as G from '../../src/lib/sci/gait.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const { b, a } = G.butter2(3, 50);
  const B = [0.02785976611713602, 0.05571953223427204, 0.02785976611713602], A = [1.0, -1.475480443592646, 0.5869195080611902];
  check('gait: Butterworth coefficients as scipy butter(2, 3, fs=50)', b.every((v, i) => near(v, B[i], 1e-12)) && a.every((v, i) => near(v, A[i], 1e-12)));
  const x = [0, 1, 3, 2, 5, 4, 4, 4, 1, 0, 2, 7, 3, 1, 0, 0.5, 2, 1, 0, 1, 3];
  const ff = [-0.07391683068927185, 0.7460923016377066, 1.509995255167089, 2.1587683538285467, 2.648941304855668, 2.9578438426328577, 3.0893432655709283, 3.0738796408265747, 2.960071593516486, 2.796014962773049, 2.604733216666189, 2.3807929525746, 2.1221799882332513, 1.8601854200775638, 1.649999731626654, 1.5406277697613002, 1.5596422299401402, 1.7178510404455845, 2.015392897730185, 2.435082146232527, 2.9329887853974443];
  check('gait: filtfilt as scipy (odd padding)', G.filtfilt(b, a, x).every((v, i) => near(v, ff[i], 1e-10)));
  check('gait: find_peaks as scipy', JSON.stringify(G.findPeaks(x, -Infinity, 1)) === '[2,4,11,16]' && JSON.stringify(G.findPeaks(x, 2, 4)) === '[4,11,16]' && JSON.stringify(G.findPeaks(x, 2.5, 1)) === '[2,4,11]');
  check('gait: plateau peak at its middle', JSON.stringify(G.findPeaks([0, 1, 2, 2, 2, 2, 1, 0], -Infinity, 1)) === '[3]');
  const ex = G.analyse(G.parseAccel(G.syntheticWalk()), { fc: 3, minStep: 0.3, k: 0.5 });
  check('gait: example walk steps as scipy', JSON.stringify(ex.peaks) === JSON.stringify([6, 32, 59, 85, 111, 137, 164, 190, 217, 244, 271, 299, 327, 355, 382, 410, 437, 464, 491, 517, 544, 571, 596, 623, 649, 676, 703, 731, 759, 786, 814, 842, 869, 897, 924, 951, 977]));
  check('gait: example cadence, CV, spectrum peak', near(ex.cadence, 111.2255, 1e-4) && near(ex.cvStep, 2.8699, 1e-4) && near(ex.domF, 1.855469, 1e-6) && near(ex.fs, 50, 1e-9));
  const fast = G.analyse(G.parseAccel(G.syntheticWalk(100, 15, 2.6, 3)), { fc: 2.5, minStep: 0.25, k: 0.3 });
  check('gait: fast walk (100 Hz) as scipy', fast.steps === 39 && JSON.stringify(fast.peaks.slice(0, 5)) === '[7,47,84,122,160]' && near(fast.cadence, 156.7010, 1e-4) && near(fast.cvStep, 2.4218, 1e-4) && near(fast.domF, 2.587891, 1e-6));
  const slow = G.analyse(G.parseAccel(G.syntheticWalk(60, 30, 1.4, 11)), { fc: 4, minStep: 0.35, k: 0.8 });
  check('gait: slow walk as scipy', slow.steps === 42 && near(slow.cadence, 84.1803, 1e-4) && near(slow.cvStep, 2.7398, 1e-4) && near(slow.domF, 1.407399, 1e-6));
  const ms = G.parseAccel('time_ms,x,y,z\n' + Array.from({ length: 30 }, (_, i) => `${1000 + i * 20},0,0,9.8`).join('\n'));
  check('gait: millisecond times read as seconds from 0', ms.unitNote.includes('milli') && near(ms.t[1], 0.02) && ms.t[0] === 0);
  const sp = G.spectrum(Array.from({ length: 64 }, (_, i) => Math.sin((2 * Math.PI * 4 * i) / 64)), 64);
  check('gait: spectrum of a pure sine', near(sp.a[4], 1, 1e-12) && near(sp.f[4], 4));
  const err = (t) => { try { G.parseAccel(t); return ''; } catch (e) { return e.message; } };
  check('gait: bad input', err('1,2,3').includes('Line 1') && err('t,ax,ay,az\n0,1,2,3').includes('20 samples') && err(Array.from({ length: 25 }, (_, i) => `${i % 3},0,0,1`).join('\n')).includes('rise'));
  let e = ''; try { G.analyse(G.parseAccel(G.syntheticWalk()), { fc: 30, minStep: 0.3, k: 0.5 }); } catch (x) { e = x.message; }
  check('gait: cut-off above Nyquist rejected', e.includes('half the sampling rate'));
};
