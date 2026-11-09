// #969 gravitational-wave chirp. References: SciPy solve_ivp integrating df/dt from 20 to 200 Hz, quad for the
// number of cycles, NumPy for the closed forms, and GM☉/c³ from CODATA G with the IAU solar mass.
import * as W from '../../src/lib/sci/phgw.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  const Mc = W.chirpMass(30, 25);
  check('gw: chirp mass of 30 + 25 M☉ = 23.8212', near(Mc, 23.821232072402477, 1e-14) && near(W.chirpMass(10, 10), 10 / Math.pow(2, 0.2), 1e-14));
  check('gw: symmetric mass ratio', W.eta(10, 10) === 0.25 && near(W.eta(30, 25), 750 / 3025, 1e-14));
  check('gw: time to coalescence from 20 Hz = 1.11317 s', near(W.tau(20, Mc), 1.1131682396174005, 1e-12));
  check('gw: 20 → 200 Hz takes 1.11077 s (SciPy solve_ivp of df/dt)', near(W.tau(20, Mc) - W.tau(200, Mc), 1.1107699913458844, 1e-10));
  check('gw: 34.854 cycles from 20 to 200 Hz (SciPy quad)', near(W.cycles(20, 200, Mc), 34.853944220949316, 1e-12));
  check('gw: frequency and time to coalescence invert', near(W.freqAt(W.tau(37, Mc), Mc), 37, 1e-12));
  check('gw: phase advances at 2πf', (() => { const t = 0.3, h = 1e-6, dphi = (W.phaseAt(t - h, Mc) - W.phaseAt(t + h, Mc)) / (2 * h); return near(dphi, 2 * Math.PI * W.freqAt(t, Mc), 1e-7); })());
  check('gw: face-on strain at 20 Hz and 400 Mpc = 4.318 × 10⁻²²', near(W.strain(20, Mc, 400), 4.317970062179675e-22, 1e-12));
  check('gw: strain falls as 1/d and grows as f^(2/3)', near(W.strain(20, Mc, 800), W.strain(20, Mc, 400) / 2, 1e-14) && near(W.strain(160, Mc, 400), 4 * W.strain(20, Mc, 400), 1e-12));
  check('gw: characteristic strain h√(2f²/ḟ)', near(W.hChar(20, Mc, 400), 4.705159954450177e-21, 1e-10));
  check('gw: ISCO frequency of 55 M☉ = 79.95 Hz', near(W.fIsco(55), 79.94863116171187, 1e-12));
  check('gw: separation at 20 Hz = 1227 km; v/c at ISCO = 1/√6', near(W.separation(20, 55) / 1e3, 1227.3587559507062, 1e-12) && near(W.vOverC(W.fIsco(55), 55), 1 / Math.sqrt(6), 1e-12));
  check('gw: GM☉/c³ and GM☉/c² agree with CODATA G and the IAU mass', near(W.TSUN, 4.9254909476412675e-6, 1e-6) && near(W.LSUN, 1476.6250380501249, 1e-7));
};
