// #859 DLS analyser: cumulants checked against an independent NumPy weighted least-squares fit, the regularised
// distribution against scipy.optimize.nnls on the same augmented (Tikhonov) system built in NumPy, water viscosity
// against IAPWS 2008 (Python iapws package), and noise-free monodisperse and bimodal data against their truth.
import { waterViscosity, scatteringVector, gammaOf, diameterOf, cumulants, distribution, baseline, exampleData, nnlsGram } from '../../src/lib/sci/dls.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol, rel = (a, b, tol) => Math.abs(a / b - 1) <= tol;
  // Viscosity of water: the Kestin correlation against IAPWS 2008 (iapws.IAPWS95 at 0.101325 MPa).
  const iapws = [[0.5, 1.76097], [5, 1.51817], [15, 1.13757], [25, 0.890022], [30, 0.797222], [45, 0.595769], [60, 0.466035], [70, 0.403548], [90, 0.314175], [99.5, 0.283067]];
  check('dls: water viscosity within 0.3 % of IAPWS 2008, 0 to 100 °C', iapws.every(([t, mu]) => rel(waterViscosity(t), mu, 0.003)));
  check('dls: water viscosity 1.002 mPa·s at 20 °C', near(waterViscosity(20), 1.002, 1e-12));
  const s = { q: scatteringVector(1.33, 633, 173), T: 298.15, eta: waterViscosity(25) * 1e-3 };
  check('dls: scattering vector matches numpy', rel(s.q, 26354027.320816685, 1e-12) && rel(scatteringVector(1.33, 633, 90), (4 * Math.PI * 1.33 * Math.SQRT1_2) / 633e-9, 1e-14));
  check('dls: Stokes–Einstein round trip', rel(diameterOf(gammaOf(1e-7, s), s), 1e-7, 1e-14) && rel(gammaOf(1e-7, s), 3407.958014740938, 1e-12));
  // The made-up example, against NumPy (weighted lstsq of ln y with weights y, the same points).
  const e = exampleData(), tau = e.tauUs.map((t) => t * 1e-6), y = e.g2.map((v) => v - baseline(e.g2, 'one'));
  const c2 = cumulants(tau, y, s, 2, 0.1), c3 = cumulants(tau, y, s, 3, 0.1);
  check('dls: 2nd-order cumulants match numpy', c2.n === 72 && rel(c2.Gamma, 5024.420979668605, 1e-10) && rel(c2.pdi, 0.16896594617614646, 1e-9) && rel(c2.zAvg * 1e9, 67.82787566032567, 1e-10) && rel(c2.beta, 0.9202879262199937, 1e-9));
  check('dls: 3rd-order cumulants match numpy', rel(c3.Gamma, 4982.303326175556, 1e-10) && rel(c3.pdi, 0.10359618232923334, 1e-8) && rel(c3.zAvg * 1e9, 68.40125523543557, 1e-10));
  const D = distribution(tau, y, s, { dMin: 1, dMax: 10000, bins: 80, alpha: 0.01 });
  check('dls: distribution matches scipy nnls (same augmented system)', D.nPts === 121 && near(D.harmonic, 67.78942119191228, 1e-6));
  check('dls: two intensity peaks near the made-up 60 and 400 nm, 85/15 %', D.peaks.intensity.length === 2 && near(D.peaks.intensity[0].mean, 61.9, 0.2) && near(D.peaks.intensity[0].area, 85.4, 0.2) && near(D.peaks.intensity[1].mean, 370.4, 0.5));
  check('dls: intensity harmonic mean agrees with the z-average', rel(D.harmonic, c2.zAvg * 1e9, 0.002));
  check('dls: distributions each sum to 100 %', [D.intensity, D.volume, D.number].every((v) => near(v.reduce((a, b) => a + b, 0), 100, 1e-9)));
  // Noise-free monodisperse 100 nm: z-average exact, PDI 0, distribution peak at 100 nm.
  const t1 = Array.from({ length: 120 }, (_, i) => 1e-6 * 1e5 ** (i / 119)), G = gammaOf(100e-9, s), y1 = t1.map((t) => 0.8 * Math.exp(-2 * G * t));
  const m = cumulants(t1, y1, s, 2, 0.1);
  check('dls: monodisperse 100 nm gives z-average 100 nm, PDI 0', rel(m.zAvg, 100e-9, 1e-9) && near(m.pdi, 0, 1e-9) && rel(m.beta, 0.8, 1e-9));
  const Dm = distribution(t1, y1, s, { dMin: 1, dMax: 10000, bins: 81, alpha: 0.01 });
  check('dls: monodisperse distribution peaks at 100 nm', Dm.peaks.intensity.length === 1 && near(Dm.peaks.intensity[0].mode, 100, 0.1) && rel(Dm.harmonic, 100, 0.01));
  // Rayleigh weighting: equal intensity from 10 and 100 nm means 10⁶ times more 10 nm particles by number.
  const tb = Array.from({ length: 150 }, (_, i) => 0.2e-6 * 2e5 ** (i / 149)), Ga = gammaOf(10e-9, s), Gb = gammaOf(100e-9, s);
  const yb = tb.map((t) => (0.5 * Math.exp(-Ga * t) + 0.5 * Math.exp(-Gb * t)) ** 2);
  const Db = distribution(tb, yb, s, { dMin: 1, dMax: 10000, bins: 81, alpha: 0.001 });
  const [pa, pb] = [...Db.peaks.intensity].sort((a, b) => a.mean - b.mean);
  check('dls: bimodal 10 + 100 nm resolved, 50/50 by intensity', Db.peaks.intensity.length === 2 && near(pa.area, 50, 1) && near(pb.area, 50, 1) && rel(pa.mean, 10, 0.03) && rel(pb.mean, 100, 0.03));
  const nb = [...Db.peaks.number].sort((a, b) => a.mean - b.mean);
  check('dls: number distribution almost all 10 nm (d⁶ weighting)', nb[0].area > 99.99);
  // Baseline from the tail and errors.
  check('dls: baseline modes', baseline([2, 2, 2, 1.1, 1.1, 1.1], 'tail') === 1.1 && baseline([1.5], 'one') === 1 && baseline([1.5], 'none') === 0);
  let threw = ''; try { cumulants(tau, y.map((v) => -v), s); } catch (er) { threw = er.message; }
  check('dls: a correlation below the baseline is an error', threw.includes('baseline'));
  const x = nnlsGram([[2, 0], [0, 1]], [2, -1]);
  check('dls: NNLS keeps the solution non-negative', near(x[0], 1, 1e-12) && x[1] === 0);
};
