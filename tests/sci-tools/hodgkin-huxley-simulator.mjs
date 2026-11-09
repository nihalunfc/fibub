// #347 Hodgkin-Huxley: RK4 (dt 0.01 ms) checked against SciPy solve_ivp (DOP853, rtol 1e-10) on the same
// equations: spike times, peak voltage, temperature factor, 1 ms threshold, firing rates and a pulse train.
import * as H from '../../src/lib/sci/hhsim.ts';
export default async (check) => {
  const close = (a, b, tol) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < tol);
  const r = H.simulate({ kind: 'step', amp: 10, start: 5, dur: 40 }, 60);
  check('hh: 10 µA/cm² step, spike times match solve_ivp within 0.1 µs', close(r.spikes, [6.900779304, 21.82224836, 36.47149026], 1e-4));
  check('hh: peak voltage matches solve_ivp', Math.abs(r.peak - 40.26314149) < 0.01);
  const w = H.simulate({ kind: 'step', amp: 10, start: 5, dur: 40 }, 60, { ...H.DEFAULTS, tempC: 16.3 });
  check('hh: at 16.3 °C (φ = 3) seven spikes at the solve_ivp times', close(w.spikes, [6.531200669, 12.76387348, 18.92496686, 25.08267034, 31.24012282, 37.39760306, 43.55507716], 1e-4) && Math.abs(w.peak - 30.79125151) < 0.01);
  check('hh: 1 ms pulse threshold 6.9107 µA/cm² as solve_ivp bisection', Math.abs(H.threshold(1) - 6.910691969) < 1e-4);
  check('hh: firing rate 70 Hz at 10 and 87.5 Hz at 20 µA/cm² (spikes 100-500 ms)', H.rate(10) === 70 && H.rate(20) === 87.5);
  const tr = H.simulate({ kind: 'train', amp: 15, start: 5, width: 1, freq: 50, count: 3 }, 70);
  check('hh: pulse train spike times', close(tr.spikes, [6.578011989, 26.49875111, 46.49862193], 1e-4));
  const s = H.steady(-65);
  check('hh: resting state is steady (dV/dt ≈ 0 at −65 mV)', Math.abs(H.deriv([-65, s.m, s.h, s.n], 0, H.DEFAULTS, 1)[0]) < 0.01 && Math.abs(s.m - 0.05293) < 1e-4 && Math.abs(s.h - 0.5961) < 1e-4 && Math.abs(s.n - 0.3177) < 1e-4);
  check('hh: rate functions finite at the removable points', Number.isFinite(H.rates(-40).am) && Math.abs(H.rates(-40).am - 1) < 1e-6 && Math.abs(H.rates(-55).an - 0.1) < 1e-6);
  check('hh: no stimulus, no spikes', H.simulate({ kind: 'step', amp: 0, start: 0, dur: 10 }, 50).spikes.length === 0);
};
