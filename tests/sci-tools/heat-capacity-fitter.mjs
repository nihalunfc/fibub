// #964 Debye and Einstein heat capacity fitter. References: SciPy quad for the Debye integral, SciPy curve_fit
// (sigma = C for relative weights, or none) on the same made-up data set, and the textbook limits.
import * as H from '../../src/lib/sci/phheat.ts';
const DATA = `4	0.00597
6	0.01493
8	0.03084
10	0.05595
12	0.09343
15	0.17565
20	0.40982
25	0.79907
30	1.3348
40	2.9571
50	5.1442
60	7.4652
80	11.707
100	14.818
125	17.778
150	19.791
175	20.645
200	21.721
250	22.519
300	23.318`.split('\n').map((l) => l.split('\t').map(Number));
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1e-300, Math.abs(b));
  const T = DATA.map((r) => r[0]), C = DATA.map((r) => r[1]);
  check('heat: Debye C at T = θ/30, θ/3, θ, 3.3θ (SciPy quad)', [[10, 0.07199148829720017], [100, 16.531430948651426], [300, 23.73942379396266], [1000, 24.83150239733246]].every(([t, v]) => near(H.debyeC(t, 300), v, 1e-9)));
  check('heat: Einstein C (closed form)', near(H.einsteinC(100, 300), 12.378631382076819, 1e-12) && near(H.einsteinC(10, 300), 2.100697371929908e-9, 1e-9));
  check('heat: Dulong-Petit limit 3nR', near(H.debyeC(1e5, 300, 2), 6 * H.R, 1e-6) && near(H.einsteinC(1e5, 300, 2), 6 * H.R, 1e-6));
  check('heat: Debye T³ law at T = θ/100', near(H.debyeC(3, 300), H.debyeBeta(300) * 27, 1e-9));
  check('heat: Debye integral to infinity is 4π⁴/15', near(H.debyeIntegral(200), (4 * Math.PI ** 4) / 15, 1e-10));
  check('heat: θ from β round trip', near(H.thetaFromBeta(H.debyeBeta(275, 3), 3), 275, 1e-12));
  const fit = (o) => H.fitHeat(T, C, { n: 1, ...o });
  { const f = fit({ model: 'debye', gamma: true, weight: 'rel' }); check('heat: Debye + γT, relative weights, matches curve_fit', near(f.theta, 340.242765, 1e-6) && near(f.gamma, 7.01021277e-4, 1e-5) && near(f.seTheta, 0.389999, 1e-3) && near(f.seGamma, 1.18643430e-5, 1e-3)); }
  { const f = fit({ model: 'debye', gamma: false, weight: 'rel' }); check('heat: Debye only, relative weights', near(f.theta, 328.658524, 1e-6) && near(f.seTheta, 3.97291168, 1e-3)); }
  { const f = fit({ model: 'debye', gamma: false, weight: 'abs' }); check('heat: Debye only, equal weights', near(f.theta, 339.168034, 1e-6) && near(f.seTheta, 0.9827352, 1e-4) && near(f.rms, 0.0953835, 1e-5)); }
  { const f = fit({ model: 'einstein', gamma: false, weight: 'rel' }); check('heat: Einstein, relative weights', near(f.theta, 206.981, 1e-4) && near(f.seTheta, 15.3801, 1e-3)); }
  { const f = fit({ model: 'einstein', gamma: true, weight: 'abs' }); check('heat: Einstein + γT, equal weights', near(f.theta, 241.999545, 1e-6) && near(f.gamma, -2.03833012e-3, 1e-5)); }
  { const l = H.lowT(T, C, 15, 1); check('heat: low-T C/T vs T² line (NumPy lstsq)', l.n === 6 && near(l.gamma, 7.21219547e-4, 1e-6) && near(l.beta, 4.88877767e-5, 1e-6) && near(l.theta, 341.3093691639282, 1e-6)); }
  { const tt = [20, 50, 100, 200, 300], cc = tt.map((t) => H.einsteinC(t, 250, 2)); const f = H.fitHeat(tt, cc, { model: 'einstein', gamma: false, weight: 'rel', n: 2 }); check('heat: exact Einstein data recovers θ', near(f.theta, 250, 1e-7)); }
};
