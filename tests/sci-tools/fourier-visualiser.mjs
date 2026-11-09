// #549 Fourier visualiser. References: numpy.fft.fft and scipy.signal.get_window (NumPy 2.5.4, SciPy 1.18.1, run on
// 2026-11-09), exact Fourier coefficients of the standard waves (textbook formulas), the Wilbraham-Gibbs constant
// (2/π) Si(π) = 1.178979744 (scipy.special.sici), and t² on (−π, π): a₀/2 = π²/3, aₙ = 4(−1)ⁿ/n².
import { fft, windowFn, spectrum, peaks, exactCoeffs, numericCoeffs, waveValue, partialSum, parsevalError, maxPartial, meanSquare, epicycles, epicyclePoint, resample, shape } from '../../src/lib/sci/fourier.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  // Small DFT against the definition, and a length-6 example: fft([1,2,3,4,5,6]) = 21, −3+5.196152i, −3+1.732051i, −3, ...
  const X = fft([1, 2, 3, 4, 5, 6]);
  check('fourier: FFT of 1..6 matches numpy', near(X.re[0], 21, 1e-12) && near(X.re[1], -3, 1e-12) && near(X.im[1], 5.196152422706632, 1e-12) && near(X.im[2], 1.7320508075688772, 1e-12) && near(X.re[3], -3, 1e-12) && near(X.im[3], 0, 1e-12));
  // Bluestein (n = 1000, 1023, 7) and radix-2 (1024) against a direct DFT.
  const sig = Array.from({ length: 1024 }, (_, i) => Math.sin(0.37 * i) + 0.3 * Math.cos(0.011 * i * i) + (i % 7) / 10);
  for (const n of [7, 1000, 1023, 1024]) {
    const x = sig.slice(0, n), Y = fft(x);
    let err = 0;
    for (const k of [0, 1, 5, Math.floor(n / 3), n - 1]) { let re = 0, im = 0; for (let j = 0; j < n; j++) { const a = (-2 * Math.PI * ((k * j) % n)) / n; re += x[j] * Math.cos(a); im += x[j] * Math.sin(a); } err = Math.max(err, Math.hypot(Y.re[k] - re, Y.im[k] - im)); }
    check(`fourier: FFT of length ${n} equals the direct DFT (${err.toExponential(1)})`, err < 1e-9);
  }
  // Windows: scipy.signal.get_window(w, 16) (periodic).
  check('fourier: Hann and Hamming windows as SciPy', near(windowFn('hann', 16)[4], 0.5, 1e-15) && near(windowFn('hann', 16)[1], 0.03806023374435663, 1e-15) && near(windowFn('hamming', 16)[0], 0.08, 1e-15) && near(windowFn('hamming', 16)[8], 1, 1e-15));
  check('fourier: Blackman and flat-top windows as SciPy', near(windowFn('blackman', 16)[8], 1, 1e-12) && near(windowFn('blackman', 16)[0], 0, 1e-15) && near(windowFn('flattop', 16)[8], 1.000000003, 1e-9) && near(windowFn('flattop', 16)[0], -0.000421051, 1e-9));
  // numpy example: sin 50 Hz + 0.5 sin 120 Hz at 1000 Hz, 1000 samples: amplitudes 1 and 0.5, phase −90°.
  const fs = 1000, s = Array.from({ length: 1000 }, (_, i) => Math.sin((2 * Math.PI * 50 * i) / fs) + 0.5 * Math.sin((2 * Math.PI * 120 * i) / fs));
  for (const w of ['rect', 'hann', 'hamming', 'blackman', 'flattop']) {
    const sp = spectrum(s, fs, w);
    check(`fourier: ${w} window keeps amplitudes 1 and 0.5 on their bins`, near(sp.amp[50], 1, 1e-9) && near(sp.amp[120], 0.5, 1e-9) && near(sp.phase[50], -90, 1e-6) && sp.f[50] === 50 && sp.df === 1);
  }
  check('fourier: equivalent noise bandwidth 1.5 bins for Hann, 3.7702 for flat top (SciPy)', near(spectrum(s, fs, 'hann').enbw, 1.5, 1e-12) && near(spectrum(s, fs, 'flattop').enbw, 3.770246447, 1e-8));
  const sm = spectrum(s.map((v) => v + 2), fs, 'rect');
  check('fourier: DC shows the mean; removing the mean clears it', near(sm.amp[0], 2, 1e-12) && near(spectrum(s.map((v) => v + 2), fs, 'rect', true).amp[0], 0, 1e-12) && near(sm.mean, 2, 1e-12));
  const pk = peaks(spectrum(Array.from({ length: 1000 }, (_, i) => Math.cos((2 * Math.PI * 50.3 * i) / fs)), fs, 'hann'), 3);
  check(`fourier: peak between bins found near 50.3 Hz (${pk[0].f.toFixed(3)})`, near(pk[0].f, 50.3, 0.02));
  const odd = spectrum(Array.from({ length: 999 }, (_, i) => Math.cos((2 * Math.PI * 111 * i) / 999)), 999, 'rect');
  check('fourier: odd length, amplitude 1 at 111 Hz', odd.amp.length === 500 && near(odd.amp[111], 1, 1e-9));
  // Exact series.
  const sq = exactCoeffs('square', 7);
  check('fourier: square wave bₙ = 4/(nπ), odd n', near(sq.b[1], 4 / Math.PI, 1e-15) && sq.b[2] === 0 && near(sq.b[7], 4 / (7 * Math.PI), 1e-15) && sq.a.every((v) => v === 0));
  check('fourier: sawtooth, triangle, rectified sines and pulse', near(exactCoeffs('sawtooth', 2).b[2], -1 / Math.PI, 1e-15) && near(exactCoeffs('triangle', 3).a[3], 8 / (9 * Math.PI ** 2), 1e-15) && near(exactCoeffs('halfsine', 2).a[2], -2 / (3 * Math.PI), 1e-15) && near(exactCoeffs('fullsine', 2).a0 / 2, 2 / Math.PI, 1e-15) && near(exactCoeffs('pulse', 1, 0.25).a[1], (2 * Math.sin(Math.PI / 4)) / Math.PI, 1e-15));
  // Numerical coefficients agree with the exact ones (to the sampling error at jumps, about 1e-7 here).
  for (const id of ['square', 'sawtooth', 'triangle', 'halfsine', 'fullsine', 'pulse']) {
    const e = exactCoeffs(id, 12), nmc = numericCoeffs((t) => waveValue(id, t), 12);
    const err = Math.max(Math.abs(e.a0 - nmc.a0), ...e.a.map((v, i) => Math.abs(v - nmc.a[i])), ...e.b.map((v, i) => Math.abs(v - nmc.b[i])));
    check(`fourier: numerical coefficients of the ${id} match the exact ones (${err.toExponential(1)})`, err < 1e-6);
  }
  const t2 = numericCoeffs((t) => t * t, 4);
  check('fourier: t² gives a₀/2 = π²/3 and aₙ = 4(−1)ⁿ/n²', near(t2.a0 / 2, Math.PI ** 2 / 3, 1e-6) && [1, 2, 3, 4].every((n) => near(t2.a[n], (4 * (-1) ** n) / (n * n), 1e-6)));
  check('fourier: partial sums converge to the wave', near(partialSum(exactCoeffs('triangle', 199), 199, 0.7), waveValue('triangle', 0.7), 2e-3) && near(partialSum(exactCoeffs('square', 2001), 2001, 1), 1, 2e-3));
  // Gibbs: the overshoot of the square wave tends to (2/π) Si(π) = 1.178979744 (SciPy), about 9 % of the jump of 2.
  const g99 = maxPartial(exactCoeffs('square', 99), 99).v, g1001 = maxPartial(exactCoeffs('square', 1001), 1001).v;
  check(`fourier: Gibbs overshoot (${g99.toFixed(6)}, ${g1001.toFixed(6)}) tends to 1.178980`, near(g99, 1.1790130793, 1e-6) && near(g1001, 1.178979744, 5e-5) && g1001 < g99);
  check('fourier: Fejér sum never overshoots; Lanczos σ cuts it to about 1.2 % of the jump', maxPartial(exactCoeffs('square', 99), 99, 'fejer').v < 1 && near(maxPartial(exactCoeffs('square', 99), 99, 'lanczos').v, 1.02373, 1e-4));
  // Parseval: square wave mean square 1; error after N terms = 1 − (8/π²) Σ_odd 1/n².
  const ms = meanSquare((t) => waveValue('square', t));
  check('fourier: Parseval error of the square wave', near(ms, 1, 1e-12) && near(parsevalError(1, exactCoeffs('square', 1), 1), 1 - 8 / Math.PI ** 2, 1e-12) && near(parsevalError(1, exactCoeffs('square', 9), 9), 1 - (8 / Math.PI ** 2) * (1 + 1 / 9 + 1 / 25 + 1 / 49 + 1 / 81), 1e-12));
  // Epicycles: with every circle the path comes back exactly; a circle is one circle.
  const heart = shape('heart', 256), c = epicycles(heart);
  const back = heart.map((_, m) => epicyclePoint(c, c.length, (2 * Math.PI * m) / 256));
  check('fourier: all epicycles redraw the path exactly', back.every((p, m) => near(p[0], heart[m][0], 1e-12) && near(p[1], heart[m][1], 1e-12)));
  const circ = epicycles(Array.from({ length: 64 }, (_, m) => [2 + 3 * Math.cos((2 * Math.PI * m) / 64), 3 * Math.sin((2 * Math.PI * m) / 64)]));
  check('fourier: a circle is one circle (k = 1, radius 3) plus its centre', near(circ[0].amp, 3, 1e-12) && circ[0].k === 1 && near(circ[1].amp, 2, 1e-12) && circ[1].k === 0 && circ[2].amp < 1e-12);
  const sqp = resample([[0, 0], [1, 0], [1, 1], [0, 1]], 8);
  check('fourier: resampling by length', sqp.length === 8 && near(sqp[1][0], 0.5, 1e-12) && near(sqp[2][0], 1, 1e-12) && near(sqp[3][1], 0.5, 1e-12));
};
