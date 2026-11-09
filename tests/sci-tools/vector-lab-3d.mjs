// #1190 3D vector lab. Sum, dot, cross, angle, projection and direction cosines checked against NumPy;
// the shortest distance between lines against a direct numerical minimisation with scipy.optimize.minimize
// (skew lines) and NumPy's cross-product formula (parallel lines).
import * as VV from '../../src/lib/sci/school-vectors.ts';
const near = (a, b, t = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const a = [2, 1, -2], b = [1, 3, 1];
  check('vectors: a + b, a · b, a × b (NumPy)', VV.add(a, b).join() === '3,4,-1' && VV.dot(a, b) === 3 && VV.cross(a, b).join() === '7,-4,5');
  check('vectors: |a × b| = 9.486833 and angle 72.4516° (NumPy)', near(VV.norm(VV.cross(a, b)), 9.486832980505138) && near(VV.angle(a, b), 72.4515993862077));
  check('vectors: projection of b on a = 1, direction cosines (2/3, 1/3, −2/3)', near(VV.projection(b, a).length, 1) && VV.dirCos(a).every((v, i) => near(v, [2 / 3, 1 / 3, -2 / 3][i])) && near(VV.projection(b, a).vector[0], 2 / 3));
  check('vectors: a × b is square to a and b; b × a = −(a × b)', VV.dot(VV.cross(a, b), a) === 0 && VV.dot(VV.cross(a, b), b) === 0 && VV.cross(b, a).join() === '-7,4,-5');
  check('vectors: zero vector angle is undefined', Number.isNaN(VV.angle([0, 0, 0], a)));
  const L1 = VV.lines([1, 2, 3], [1, -3, 2], [4, 5, 6], [2, 3, 1]);
  check('vectors: skew lines, shortest distance 0.6882472 at s 0.5263, t −1.4737 (scipy minimize)', L1.kind === 'skew' && near(L1.dist, 0.688247201611686, 1e-7) && near(L1.s, 0.52631578, 1e-6) && near(L1.t, -1.47368422, 1e-6));
  const L2 = VV.lines([1, 1, 0], [2, -1, 1], [2, 1, -1], [3, -5, 2]);
  check('vectors: second pair, distance 1.3018891 (scipy minimize)', L2.kind === 'skew' && near(L2.dist, 1.3018891098082446, 1e-7));
  const P = VV.lines([1, 2, -4], [2, 3, 6], [3, 3, -5], [4, 6, 12]);
  check('vectors: parallel lines, distance 2.4453204 (NumPy |(p₂ − p₁) × d| / |d|)', P.kind === 'parallel' && near(P.dist, 2.44532039551767));
  const M = VV.lines([0, 0, 0], [1, 0, 0], [1, -1, 0], [0, 1, 0]);
  check('vectors: lines that meet at (1, 0, 0) at 90°', M.kind === 'meet' && near(M.dist, 0) && near(M.angle, 90) && near(M.s, 1) && near(M.t, 1));
  check('vectors: the same line twice', VV.lines([0, 0, 0], [1, 1, 1], [2, 2, 2], [-2, -2, -2]).kind === 'same');
};
