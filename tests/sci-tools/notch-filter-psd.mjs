// #346 Notch filter and PSD: checked against scipy.signal 1.18 (iirnotch, lfilter_zi, lfilter, filtfilt, welch, freqz).
import * as N from '../../src/lib/sci/notchpsd.ts';
export default async (check) => {
  const rel = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const f = N.iirnotch(50, 30, 500);
  check('notch: iirnotch(50, 30, 500) coefficients = scipy', rel(f.b[0], 0.9896361753628921) && rel(f.b[1], -1.6012649682336106) && rel(f.a[2], 0.9792723507257841));
  const zi = N.lfilterZi(f); check('notch: lfilter_zi = scipy', rel(zi[0], 0.010363824637107997) && rel(zi[1], 0.010363824637107914));
  const x = N.exampleTrace();
  const y = N.removeLineNoise(x, 500, N.notchFreqs(50, 3, 500), 30, true);
  const want = [[0, 6.947875738197058], [1, 16.066079216672], [100, 12.06343223471321], [2500, 5.1188933571492825], [4998, 2.683598495852853], [4999, 4.359212793600101]];
  check('notch: filtfilt cascade 50, 100, 150 Hz = scipy (ends and middle)', want.every(([i, v]) => rel(y[i], v)));
  const c = N.removeLineNoise(x, 500, [50], 10, false);
  check('notch: single causal pass = scipy lfilter', [[0, 11.284849495941218], [5, 5.3730013107389105], [3000, 7.304017441328893]].every(([i, v]) => rel(c[i], v)));
  const w = N.welch(x, 500, 512, 0.5);
  check('notch: welch(nperseg 512) = scipy, 18 segments', w.segments === 18 && [[0, 0.7360765250811626], [10, 126.14474477600571], [51, 288.4395389492064], [154, 10.1583712996161], [256, 0.011640548892287531]].every(([i, v]) => rel(w.psd[i], v)));
  const w2 = N.welch(y, 500, 1024, 0.75, 'hamming');
  check('notch: welch hamming, 75 % overlap = scipy', w2.segments === 16 && [[20, 207.0388652738779], [102, 0.012335611625647266], [307, 4.574338472435536e-05]].every(([i, v]) => rel(w2.psd[i], v, 1e-8)));
  check('notch: band powers (rectangle sum) = numpy on scipy PSD', rel(N.bandPower(w.f, w.psd, 8, 13), 202.29175128679708) && rel(N.bandPower(w.f, w.psd, 1, 4), 15.445544438882756));
  check('notch: gain 0 at f0 and 1/√2 (scipy freqz 0.70458) at f0 ± f0/2Q', N.cascadeGain([50], 30, 500, 50) < 1e-12 && Math.abs(N.cascadeGain([50], 30, 500, 50 + 50 / 60, false) - 0.7045814323995827) < 1e-9);
  // The line noise is gone, alpha stays.
  const wy = N.welch(y, 500, 512, 0.5);
  check('notch: 50 Hz power down > 30 dB, alpha 8–13 Hz kept within 1 %', 10 * Math.log10(N.bandPower(w.f, w.psd, 49, 51) / N.bandPower(wy.f, wy.psd, 49, 51)) > 30 && Math.abs(N.bandPower(wy.f, wy.psd, 8, 13) / N.bandPower(w.f, w.psd, 8, 13) - 1) < 0.01);
  // Parseval: a 10 Hz sine of amplitude 20 has power 200.
  { const s = Float64Array.from({ length: 5000 }, (_, i) => 20 * Math.sin(2 * Math.PI * 10 * i / 500)); const ws = N.welch(s, 500, 500 === 0 ? 1 : 512); check('notch: Welch power of a sine = A²/2', Math.abs(N.bandPower(ws.f, ws.psd, 0, 250) - 200) < 0.5); }
  check('notch: harmonics stop below Nyquist (60 Hz at 250 Hz rate: 60 and 120)', N.notchFreqs(60, 5, 250).join() === '60,120');
  check('notch: bands parsed', JSON.stringify(N.parseBands('Delta 1-4; Theta 4 to 8\nAlpha 8–13 Hz')) === JSON.stringify([{ name: 'Delta', lo: 1, hi: 4 }, { name: 'Theta', lo: 4, hi: 8 }, { name: 'Alpha', lo: 8, hi: 13 }]));
  let m = ''; try { N.parseBands('Alpha 13-8'); } catch (e) { m = e.message; } check('notch: bad band refused', m.includes('upper edge'));
  m = ''; try { N.iirnotch(300, 30, 500); } catch (e) { m = e.message; } check('notch: notch above Nyquist refused', m.includes('half the sample rate'));
  m = ''; try { N.welch([1, 2, 3], 500, 256); } catch (e) { m = e.message; } check('notch: too-short trace for Welch refused', m.includes('fewer than one Welch segment'));
};
