// #625 op-amp circuit calculator. Real-op-amp responses (single pole, A0 = 1e5, GBW = 1 MHz) checked against
// python-control (inverting, non-inverting: H = -A(1-β)/(1+Aβ), A/(1+Aβ), control.bandwidth) and an independent
// NumPy node-equation solve for the integrator, differentiator, summing and difference circuits.
import * as O from '../../src/lib/sci/eng-opamp.ts';
export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) <= t;
  const mag = (z) => Math.hypot(z.re, z.im), W = (f) => 2 * Math.PI * f, fs = [10, 1e3, 1e4, 9.0909e4, 1e5, 1e6];
  const inv = { config: 'inv', r1: 1e3, rf: 1e4 }, non = { config: 'noninv', r1: 1e3, rf: 9e3 };
  check('opamp: ideal gains', O.idealGains(inv)[0].re === -10 && O.idealGains(non)[0].re === 10 && O.noiseGain(inv) === 11 && rel(O.noiseGain(non), 10, 1e-12));
  const ref = { inv: [9.998900060506653, 9.998295375460808, 9.938963343282232, 7.070682448782874, 6.726393132033617, 0.9053566440754858], non: [9.999000050004998, 9.998500287438139, 9.949386813808927, 7.398998969010357, 7.070714267314158, 0.9950362049768564] };
  check('opamp: inverting −10 with a 1 MHz op-amp vs python-control', fs.every((f, i) => rel(mag(O.realGains(inv, W(f), 1e6)[0]), ref.inv[i], 1e-9)));
  check('opamp: non-inverting 10 vs python-control', fs.every((f, i) => rel(mag(O.realGains(non, W(f), 1e6)[0]), ref.non[i], 1e-9)));
  { const f3 = O.f3db((f) => mag(O.realGains(non, W(f), 1e6)[0]), 1, 1e8); check('opamp: non-inverting −3.01 dB at the closed-loop pole ωa(1 + A0β) = 100.01 kHz (control.bandwidth gives 99.77 kHz at −3.00 dB)', rel(f3, 100010, 1e-6) && rel(O.bandwidth(1e6, O.noiseGain(non)), 1e5, 1e-12)); }
  { const ph = O.realGains(inv, W(1e5), 1e6)[0]; check('opamp: inverting phase at 100 kHz', Math.abs(Math.atan2(ph.im, ph.re) * 180 / Math.PI - 132.27682585870025) < 1e-6); }
  const int = { config: 'int', r1: 1e4, rf: 1e6, c: 10e-9 };
  check('opamp: integrator with 1 MΩ across C vs NumPy', fs.every((f, i) => rel(mag(O.realGains(int, W(f), 1e6)[0]), [84.57371839259996, 1.5888027808012994, 0.1588923346209071, 0.017407512418078298, 0.015811436116502375, 0.0011244945627042454][i], 1e-8)));
  check('opamp: integrator ideal DC gain −Rf/R and unity at 1/(2πRC)', rel(O.idealGains(int, 0)[0].re, -100, 1e-9) && rel(mag(O.idealGains({ config: 'int', r1: 1e4, rf: Infinity, c: 10e-9 }, 1 / (1e4 * 10e-9))[0]), 1, 1e-12));
  const dif = { config: 'dif', r1: 100, rf: 1e4, c: 10e-9 };
  check('opamp: differentiator with 100 Ω series vs NumPy', fs.every((f, i) => rel(mag(O.realGains(dif, W(f), 1e6)[0]), [0.0062831228579858294, 0.6286945006108647, 6.688634209185911, 13.295919555714947, 11.645283715115534, 0.9915960544525015][i], 1e-8)));
  const sum = { config: 'sum', r1: 1e4, rf: 1e4, rs: [1e4, 5e3] };
  check('opamp: summing amplifier gains and noise gain', O.idealGains(sum).map((g) => g.re).join() === '-1,-2' && rel(O.noiseGain(sum), 4, 1e-12));
  check('opamp: summing vs NumPy', [[10, 0.999960000800032, 1.999920001600064], [1e4, 0.9991610561224267, 1.9983221122448533]].every(([f, a, b]) => { const g = O.realGains(sum, W(f), 1e6); return rel(mag(g[0]), a, 1e-9) && rel(mag(g[1]), b, 1e-9); }));
  const dd = { config: 'diff', r1: 1e4, rf: 1e5, r3: 1e4, r4: 1e5 };
  check('opamp: difference amplifier vs NumPy', [[10, 9.998900060506653], [1e3, 9.998295375460806]].every(([f, a]) => { const g = O.realGains(dd, W(f), 1e6); return rel(mag(g[0]), a, 1e-9) && rel(mag(g[1]), a, 1e-9); }));
  check('opamp: matched difference amp rejects common mode', O.diffCmrr(1e4, 1e5, 1e4, 1e5) === Infinity && Math.abs(O.diffCmrr(1e4, 1e5, 1e4, 1.01e5) - 20 * Math.log10(10.004504504504505 / 0.009009009009009)) < 1e-6);
  check('opamp: worst-case CMRR for 1 % resistors at G = 10 is 48 dB', Math.abs(O.diffCmrrWorst(10, 0.01) - 48.786) < 1e-3);
  check('opamp: full-power bandwidth', rel(O.fullPower(0.5e6, 10), 7957.747, 1e-6) && O.clip(15, -13.5, 13.5) === 13.5);
};
