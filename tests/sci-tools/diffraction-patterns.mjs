// #933 Diffraction patterns: special functions against SciPy (j0, j1, fresnel), the Fresnel circular-hole integral
// against SciPy quad, double-slit Fresnel against direct quadrature, plus closed forms and the far-field limit.
import { besselJ, fresnelCS, fraunhofer, fresnelSlits, fresnelCircle, circleOnAxis, fresnelNumber, irradiance, J1_ZERO } from '../../src/lib/sci/phdiff.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const xs = [0, 0.3, 1.0, 1.49, 1.51, 2.0, 3.7, 7.9, 11.99, 12.01, 15, 40, 123.4, 1000.5];
  const J0 = [1.0, 0.9776262465382961, 0.7651976865579665, 0.5173999761456396, 0.5062413803906856, 0.22389077914123562, -0.3992302033711912, 0.1943618448412782, 0.04545156035285862, 0.04992043031982534, -0.014224472826780792, 0.007366890584237292, -0.07152553671926017, 0.019486559987130135];
  const J1 = [0.0, 0.148318816273104, 0.44005058574493355, 0.5565176603736033, 0.5593150345820901, 0.5767248077568734, 0.05383398774546181, 0.21917939992175126, -0.22409937126624874, -0.22277320092970332, 0.20510403861352283, 0.12603831803758503, -0.006850999885654379, 0.016027715373203338];
  check('diff: J0 vs SciPy at 14 points (0 to 1000)', xs.every((x, i) => near(besselJ(0, x), J0[i], 1e-10)));
  check('diff: J1 vs SciPy at 14 points (0 to 1000)', xs.every((x, i) => near(besselJ(1, x), J1[i], 1e-10)));
  check('diff: J1 odd, J0 even', near(besselJ(1, -2), -besselJ(1, 2), 1e-15) && near(besselJ(0, -15), besselJ(0, 15), 1e-15));
  check('diff: first zero of J1 at 3.8317', near(besselJ(1, J1_ZERO), 0, 1e-12));
  const fx = [0, 0.2, 0.9, 1.49, 1.5, 1.51, 2.3, 5.0, -3.3, 17.2, 60.0];
  const C = [0.0, 0.19992105759445308, 0.7648230212733264, 0.45458652017763695, 0.44526117603982157, 0.4361161680360173, 0.6265617097919522, 0.5636311887040122, -0.4056944037062585, 0.49537837816357017, 0.4999995309205011];
  const S = [0.0, 0.004187609161656763, 0.3397763443931403, 0.7011132249982798, 0.697504960082093, 0.693461421915976, 0.553151641560702, 0.49919138191711687, -0.5192860849820631, 0.48208003757999324, 0.4946948353546973];
  check('diff: Fresnel C vs SciPy at 11 points', fx.every((x, i) => near(fresnelCS(x)[0], C[i], 1e-12)));
  check('diff: Fresnel S vs SciPy at 11 points', fx.every((x, i) => near(fresnelCS(x)[1], S[i], 1e-12)));
  // Circular hole, 2 mm, 633 nm, 1 m: N_F = 1.58.
  const rs = [0, 0.2e-3, 0.5e-3, 1.0e-3, 1.3e-3], ref = [1.5039663333780362, 1.0774252777176183, 1.4045056948307857, 0.15851501886871638, 0.04359308023604497];
  check('diff: Fresnel circle vs SciPy quad at 5 radii', rs.every((r, i) => near(fresnelCircle(2e-3, 633e-9, 1, r), ref[i], 1e-8)));
  check('diff: Fresnel circle on axis = 4 sin²(πR²/2λz)', near(fresnelCircle(2e-3, 633e-9, 1, 0), circleOnAxis(2e-3, 633e-9, 1), 1e-8));
  check('diff: on axis dark when an even number of zones is open', near(circleOnAxis(2e-3, 500e-9, 1), 0, 1e-12) && near(circleOnAxis(2e-3, 1000e-9, 1), 4, 1e-12));
  const dbl = { kind: 'double', a: 0.1e-3, d: 0.5e-3, N: 2 };
  check('diff: Fresnel double slit vs direct quadrature', near(fresnelSlits(dbl, 532e-9, 0.5, 0), 0.14604527808632595, 1e-9) && near(fresnelSlits(dbl, 532e-9, 0.5, 0.3e-3), 0.005725032862251426, 1e-9) && near(fresnelSlits(dbl, 532e-9, 0.5, 1e-3), 0.0780048929983756, 1e-9));
  const slit = { kind: 'slit', a: 50e-6, d: 0, N: 1 };
  check('diff: single slit first minimum at λz/a', near(fraunhofer(slit, 600e-9, 1, (600e-9 * 1) / Math.sqrt(50e-6 ** 2 - 600e-9 ** 2) * 1), 0, 1e-12));
  check('diff: single slit peak a²/(λz)', near(fraunhofer(slit, 600e-9, 1, 0), (50e-6) ** 2 / (600e-9), 1e-12));
  check('diff: far-field limit: Fresnel → Fraunhofer for N_F = 0.001', fresnelNumber(slit, 600e-9, 1) < 0.002 && [0, 3e-3, 7e-3, 15e-3].every((x) => near(fresnelSlits(slit, 600e-9, 1, x), fraunhofer(slit, 600e-9, 1, x), 2e-3 * fraunhofer(slit, 600e-9, 1, 0))));
  const circ = { kind: 'circle', a: 0.2e-3, d: 0, N: 1 };
  { const x = Math.tan(Math.asin((J1_ZERO * 633e-9) / (Math.PI * 0.2e-3))) * 2;
    check('diff: Airy first dark ring at sinθ = 1.2197 λ/D', near(fraunhofer(circ, 633e-9, 2, x), 0, 1e-12) && near(J1_ZERO / Math.PI, 1.2197, 1e-4)); }
  check('diff: circle far-field limit (N_F = 0.0079)', [0, 2e-3, 5e-3].every((r) => near(fresnelCircle(0.2e-3, 633e-9, 2, r), fraunhofer(circ, 633e-9, 2, r), 0.02 * fraunhofer(circ, 633e-9, 2, 0))));
  const gr = { kind: 'grating', a: 0.5e-6, d: 1.6e-6, N: 10 };
  { const s1 = 532e-9 / 1.6e-6, x1 = Math.tan(Math.asin(s1)) * 0.3; check('diff: grating first order at sinθ = λ/d, peak N² × slit envelope', near(fraunhofer(gr, 532e-9, 0.3, x1) / fraunhofer(gr, 532e-9, 0.3, 0), (Math.sin(Math.PI * 0.5e-6 * s1 / 532e-9) / (Math.PI * 0.5e-6 * s1 / 532e-9)) ** 2, 1e-9)); }
  check('diff: grating central peak = N² × single slit', near(fraunhofer(gr, 532e-9, 0.3, 0), 100 * fraunhofer({ ...gr, kind: 'slit' }, 532e-9, 0.3, 0), 1e-12));
  check('diff: double-slit fringe minimum at λz/(2d)', fraunhofer(dbl, 532e-9, 1, (532e-9 * 1) / (2 * 0.5e-3)) < 1e-6 * fraunhofer(dbl, 532e-9, 1, 0));
  check('diff: Fresnel number of 2 mm hole at 1 m, 633 nm = 1.58', near(fresnelNumber({ kind: 'circle', a: 2e-3, d: 0, N: 1 }, 633e-9, 1), 1.5797788309636651, 1e-12));
  check('diff: irradiance dispatches both regimes', irradiance(slit, 600e-9, 1, 0, 'far') === fraunhofer(slit, 600e-9, 1, 0) && irradiance(circ, 633e-9, 2, -1e-3, 'near') === fresnelCircle(0.2e-3, 633e-9, 2, 1e-3));
  // Wide slit close up: the geometric shadow (edge irradiance 1/4 at each edge for an isolated edge).
  { const w = { kind: 'slit', a: 10e-3, d: 0, N: 1 }; check('diff: wide slit edge irradiance 0.25, centre near 1', near(fresnelSlits(w, 500e-9, 0.1, 5e-3), 0.25, 0.01) && near(fresnelSlits(w, 500e-9, 0.1, 0), 1, 0.05)); }
};
