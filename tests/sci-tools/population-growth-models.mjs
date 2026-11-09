// #303 population growth models: Leslie results checked against NumPy 2.x (numpy.linalg.eig of the matrix
// and its transpose, matrix powers); exponential and logistic values against Python's math module.
import { expN, logisticN, expTime, logisticTime, leslie, project, matrix } from '../../src/lib/sci/popgrowth.ts';

export default async (check) => {
  const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const arr = (a, b, tol) => a.length === b.length && a.every((x, i) => close(x, b[i], tol));
  check('growth: exponential 20 e^(0.3×15) = 1800.34', close(expN(20, 0.3, 15), 1800.342626010436));
  check('growth: logistic K 500 at t 15 = 394.753', close(logisticN(20, 0.3, 500, 15), 394.75265810388726));
  check('growth: doubling time ln 2 / 0.3 = 2.3105', close(expTime(1, 0.3, 2), 2.3104906018664844));
  check('growth: logistic reaches K/2 at t = 10.5935', close(logisticTime(20, 0.3, 500, 250), 10.593512767826486) && logisticTime(20, 0.3, 500, 600) === Infinity);
  const a = leslie([0, 1.2, 2.0, 1.5], [0.5, 0.6, 0.4, 0]);
  check('leslie: λ = 1.128335 (numpy.linalg.eig)', close(a.lambda, 1.1283349443808182));
  check('leslie: stable distribution matches the right eigenvector', arr(a.stable, [0.5674391533945335, 0.25144978280625674, 0.1337101810371961, 0.047400882762013666], 1e-8));
  check('leslie: reproductive values match the left eigenvector', arr(a.repro, [1.0, 2.2566698887616403, 2.2437991557028925, 1.3293924888793833], 1e-8));
  check('leslie: R0 = 0.6 + 0.6 + 0.18 = 1.38', close(a.R0, 1.38));
  const b = leslie([0, 0.8, 1.6, 1.2], [0.4, 0.7, 0.6, 0.3]);
  check('leslie: plus group (last-class survival 0.3) λ = 1.017862', close(b.lambda, 1.0178622858154027) && arr(b.stable, [0.5293453819434604, 0.20802239726149385, 0.14306029421887245, 0.11957192657617337], 1e-8) && arr(b.repro, [1.0, 2.54465571453851, 2.55729868887628, 1.6716298149539153], 1e-8));
  const c = leslie([0, 0, 5], [0.3, 0.5, 0]);
  check('leslie: imprimitive matrix (only the last class breeds) λ = 0.908560', close(c.lambda, 0.90856029641607) && arr(c.stable, [0.6614173130930373, 0.21839518489925666, 0.12018750200770605], 1e-8) && arr(c.repro, [1, 3.0285343213869016, 5.5032120814910455], 1e-8));
  const N = project([0, 1.2, 2.0, 1.5], [0.5, 0.6, 0.4, 0], [100, 50, 30, 10], 10);
  check('leslie: 10-step projection matches A¹⁰ N0', arr(N[10], [371.8872, 164.781, 87.5448, 31.104], 1e-9));
  check('leslie: matrix layout', JSON.stringify(matrix([0, 2], [0.5, 0.1])) === '[[0,2],[0.5,0.1]]');
  let threw = 0; for (const [F, P] of [[[0, 0], [0.5, 0]], [[1, 1], [1.2, 0]], [[0.1, 0], [0.5, 0.9]]]) { try { leslie(F, P); } catch { threw++; } }
  check('leslie: no breeding, survival above 1 and a plus group that dominates are rejected', threw === 3);
};
