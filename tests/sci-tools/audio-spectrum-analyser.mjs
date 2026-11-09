// #940 audio spectrum analyser: FFT, windows and Welch spectra checked against NumPy (numpy.fft.rfft) and SciPy
// (scipy.signal.get_window, scipy.signal.welch with scaling='spectrum'); peak interpolation against known tones.
import { fft, makeWindow, powerSpectrum, welch, peaks, noteOf, rmsDb, toDb, spectrogram, thin } from '../../src/lib/sci/phfft.ts';
export default async (check) => {
  const fs = 48000, x = Float64Array.from({ length: 30000 }, (_, i) => { const t = i / fs; return 0.5 * Math.sin(2 * Math.PI * 1234.5 * t) + 0.05 * Math.sin(2 * Math.PI * 3700 * t + 0.3) + 0.01 * Math.cos(2 * Math.PI * 97 * t) + 0.02; });
  { const re = Float64Array.from(x.slice(0, 1024)), im = new Float64Array(1024); fft(re, im);
    const R = [25.28066119654341, 4.908684492931587, 9.539584181836409, 4.228265997423978, 4.45750610334883, 4.574826897434784, 4.6799585424183565, 4.792672853840944, 4.92078608829994, 5.069314104988741, 5.242806717772815, 5.446279257085669];
    const I = [0.0, -0.05418401186920395, 0.8769968161597124, -0.40200659476010103, -0.4631305147867115, -0.5576357202770199, -0.6643590486580517, -0.7803136006931897, -0.9055990270809702, -1.0414229914935755, -1.1896938350741104, -1.3529878600804768];
    check('FFT 1024 matches numpy.fft.rfft (first 12 bins)', R.every((v, k) => Math.abs(re[k] - v) < 1e-9 && Math.abs(im[k] - I[k]) < 1e-9)); }
  check('FFT refuses a length that is not a power of two', (() => { try { fft(new Float64Array(6), new Float64Array(6)); return false; } catch { return true; } })());
  const W = { hann: [0.0, 0.14644660940672627, 0.5, 0.8535533905932737, 1.0, 0.8535533905932737, 0.5, 0.14644660940672627], hamming: [0.08000000000000007, 0.21473088065418822, 0.54, 0.865269119345812, 1.0, 0.865269119345812, 0.54, 0.21473088065418822], blackman: [-1.3877787807814457e-17, 0.06644660940672624, 0.34, 0.7735533905932738, 0.9999999999999999, 0.7735533905932738, 0.34, 0.06644660940672624] };
  for (const [n, v] of Object.entries(W)) check(`window ${n} = scipy get_window (periodic)`, Array.from(makeWindow(n, 8)).every((a, i) => Math.abs(a - v[i]) < 1e-12));
  const ref = { hann: [[0, 1.0338523884606775e-06], [1, 5.136597554294213e-07], [10, 2.5817744808440086e-07], [8, 4.5255747215984995e-05], [104, 0.008394668661459288], [105, 0.10717934173070086], [106, 0.07059744155494747], [107, 0.0011842671552669667], [315, 0.0006087691662498458], [316, 0.0011399668266305117], [2048, 1.4483659698552122e-23]], hamming: [[0, 7.502166165921768e-07], [1, 6.782444994556887e-07], [10, 1.3283454245823994e-07], [8, 4.447501311724599e-05], [104, 0.004502363026295152], [105, 0.10345697027337415], [106, 0.06188068060054438], [107, 0.0004176411473235837], [315, 0.0005159498217198545], [316, 0.0011156222081904821], [2048, 1.1832593200271405e-10]], blackman: [[0, 1.0325932023696657e-06], [1, 7.300861494916208e-07], [10, 1.8027244147353177e-06], [8, 4.627522885260988e-05], [104, 0.01815320412889071], [105, 0.11094610606581966], [106, 0.08065906775652734], [107, 0.0059740539752788], [315, 0.0007216319868645046], [316, 0.0011636691603120644], [2048, 2.6603970079615357e-24]], rect: [[0, 6.307470978491319e-35], [1, 2.0691791708030246e-06], [10, 2.76426141716558e-06], [8, 4.178998225289128e-05], [104, 0.005462404301677151], [105, 0.08333020737669229], [106, 0.022901901783659178], [107, 0.0035920370479213043], [315, 0.00013139167267538253], [316, 0.0009809666334649326], [2048, 5.391225734474268e-09]] };
  for (const [n, pts] of Object.entries(ref)) {
    const w = welch(x, makeWindow(n, 4096));
    // scipy's one-sided 'spectrum' scaling doubles the inside bins to A²/2; ours gives A² there, the same at DC and Nyquist.
    check(`Welch ${n}, 4096, 50 % overlap = scipy.signal.welch (11 bins, 13 frames)`, w.frames === 13 && pts.every(([k, p]) => Math.abs(w.power[k] - (k === 0 || k === 2048 ? 1 : 2) * p) < 1e-12 + 1e-9 * p));
  }
  { const n = 8192, s = Float64Array.from({ length: n }, (_, i) => Math.sin(2 * Math.PI * 1500 * i / 48000));
    const p = powerSpectrum(s.slice(0, 4096), makeWindow('hann', 4096)); check('full-scale sine on a bin reads 0 dBFS', Math.abs(toDb(p[128]) - 0) < 1e-9);
    check('RMS of a full-scale sine −3.01 dBFS', Math.abs(rmsDb(s) + 3.0103) < 1e-3); }
  { const w = welch(x, makeWindow('hann', 4096)), pk = peaks(w.power, fs, { count: 3 });
    check(`peak 1: 1234.5 Hz found within 0.5 Hz (${pk[0].f.toFixed(2)})`, Math.abs(pk[0].f - 1234.5) < 0.5);
    check(`peak 1 level within 1.5 dB of −6.02 dBFS (${pk[0].db.toFixed(2)})`, Math.abs(pk[0].db + 6.02) < 1.5);
    check(`peak 2: 3700 Hz within 0.5 Hz, about −26 dBFS (${pk[1].f.toFixed(2)}, ${pk[1].db.toFixed(1)})`, Math.abs(pk[1].f - 3700) < 0.5 && Math.abs(pk[1].db + 26.02) < 1.5); }
  { const s = Float64Array.from({ length: 16384 }, (_, i) => Math.sin(2 * Math.PI * 440 * i / 44100)); const pk = peaks(welch(s, makeWindow('hann', 16384)).power, 44100, { count: 1 });
    check(`440 Hz found within 0.05 Hz with 16384-point FFT (${pk[0].f.toFixed(3)})`, Math.abs(pk[0].f - 440) < 0.05); }
  check('note: 440 Hz is A4, 0 cents', noteOf(440).name === 'A4' && Math.abs(noteOf(440).cents) < 1e-9);
  check('note: 261.63 Hz is C4', noteOf(261.6256).name === 'C4' && Math.abs(noteOf(261.6256).cents) < 0.01);
  check('note: 450 Hz is A4 +38.9 cents', noteOf(450).name === 'A4' && Math.abs(noteOf(450).cents - 38.906) < 0.01);
  check('note: A4 = 432 Hz tuning', noteOf(432, 432).name === 'A4' && noteOf(27.5).name === 'A0');
  { const sg = spectrogram(x, makeWindow('hann', 1024), 20); check('spectrogram: 20 columns of 513 bins', sg.length === 20 && sg[0].length === 513); }
  { const f = Array.from({ length: 2049 }, (_, k) => k * 11.71875), v = f.map((_, k) => (k === 105 ? 0 : -80)), t = thin(f, v, 300, true);
    check('thinning keeps the peak and at most 300 points', t.f.length <= 300 && t.v.includes(0) && t.f[t.v.indexOf(0)] === f[105]); }
};
