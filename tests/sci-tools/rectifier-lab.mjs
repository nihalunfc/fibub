// #1431 Rectifier lab. The step simulation is checked against an independent exact Python solution (scipy brentq
// for where the capacitor leaves and meets the rectified wave, quad for the average) and the ideal averages Vm/π, 2Vm/π.
import * as R from '../../src/lib/sci/rectifier.ts';
const PY = [[{ mode: 'bridge', vp: 12, C: 1e-3, RL: 1000 }, 10.6, 0.1010849195185255, 10.550098586508357], [{ mode: 'half', vp: 12, C: 470e-6, RL: 1000 }, 11.3, 0.45035401567882616, 11.076745074540346], [{ mode: 'full', vp: 10, C: 100e-6, RL: 500 }, 9.3, 1.4062714095180624, 8.62698339008255]];
const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
export default async (check) => {
  for (const [s, vm, rip, dc] of PY) {
    const m = R.measure(s);
    check(`rectifier: ${s.mode} with C matches exact Python (ripple ${m.ripple.toFixed(4)} vs ${rip.toFixed(4)})`, Math.abs(R.peak(s) - vm) < 1e-12 && rel(m.max, vm, 1e-6) && rel(m.ripple, rip, 0.01) && rel(m.dc, dc, 0.002));
    const e = R.estimate(s);
    // the estimate Vm/(f_r R C) is good for small ripple and too big when the ripple is large (third case)
    check(`rectifier: ${s.mode} textbook ripple estimate`, rip / vm < 0.05 ? rel(e.ripple, rip, 0.1) : e.ripple > rip);
  }
  const h = R.measure({ mode: 'half', vp: 12, vd: 0, RL: 1000 }), f = R.measure({ mode: 'full', vp: 12, vd: 0, RL: 1000 });
  check('rectifier: ideal averages Vm/π and 2Vm/π', rel(h.dc, 3.819718634205488, 1e-3) && rel(f.dc, 7.639437268410976, 1e-3));
  check('rectifier: ideal ripple factors 1.21 and 0.48', Math.abs(h.factor - 1.21) < 0.01 && Math.abs(f.factor - 0.483) < 0.01);
  check('rectifier: ripple frequency and peak drops', R.rippleFreq({ mode: 'half' }) === 50 && R.rippleFreq({ mode: 'bridge' }) === 100 && Math.abs(R.peak({ mode: 'bridge', vp: 5 }) - 3.6) < 1e-12);
  check('rectifier: half-wave blocks the negative half', R.rectified({ mode: 'half', vp: 10 }, 0.015) === 0 && R.rectified({ mode: 'full', vp: 10 }, 0.015) > 9);
  let bad = 0; try { R.simulate({ mode: 'half', vp: 0, RL: 1 }); } catch { bad++; } check('rectifier: bad input refused', bad === 1);
};
