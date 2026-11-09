// #1187 Argand plane. Complex arithmetic, modulus, principal argument and powers checked against Python's
// complex numbers and cmath.phase; quadratic roots against numpy.roots.
import * as Z from '../../src/lib/sci/school-complex.ts';
const near = (a, b, t = 1e-12) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
const eq = (z, re, im, t = 1e-12) => near(z.re, re, t) && near(z.im, im, t);
export default async (check) => {
  const z = Z.cx(3, 2), w = Z.cx(-1, 4);
  check('complex: (3 + 2i) + (−1 + 4i) = 2 + 6i, difference 4 − 2i (Python)', eq(Z.add(z, w), 2, 6) && eq(Z.sub(z, w), 4, -2));
  check('complex: product −11 + 10i, quotient 0.294118 − 0.823529i (Python)', eq(Z.mul(z, w), -11, 10) && eq(Z.div(z, w), 0.29411764705882354, -0.8235294117647058));
  check('complex: |3 + 2i| = 3.605551, arg = 0.588003 (cmath.phase)', near(Z.abs(z), 3.605551275463989) && near(Z.arg(z), 0.5880026035475675));
  check('complex: arg(−2) = π and arg(−1 − i) = −3π/4, principal range (cmath.phase)', near(Z.arg(Z.cx(-2, 0)), Math.PI) && near(Z.arg(Z.cx(-1, -1)), -2.356194490192345) && Number.isNaN(Z.arg(Z.cx(0, 0))) && Z.arg(Z.cx(-2, -0)) === Math.PI);
  check('complex: (1 + i)⁸ = 16, (2 − i)⁵ = −38 − 41i, (3 + 2i)⁻² (Python)', eq(Z.pow(Z.cx(1, 1), 8), 16, 0) && eq(Z.pow(Z.cx(2, -1), 5), -38, -41) && eq(Z.pow(z, -2), 0.029585798816568046, -0.07100591715976332));
  check('complex: conjugate and division by zero', eq(Z.conj(z), 3, -2) && Z.div(z, Z.cx(0, 0)) === null);
  check('complex: powers of i cycle 1, i, −1, −i', [0, 1, 2, 3, 4, 7, 10, -1].map(Z.iPower).join() === '1,i,−1,−i,1,−i,−1,−i');
  const R = [[1, 2, 5, 'complex', [[-1, 2], [-1, -2]]], [2, -3, 1, 'real', [[0.5, 0], [1, 0]]], [1, -4, 4, 'repeated', [[2, 0], [2, 0]]], [3, 1, 2, 'complex', [[-0.16666666666666666, 0.7993052538854533], [-0.16666666666666666, -0.7993052538854533]]], [1, 0, 1, 'complex', [[0, 1], [0, -1]]]];
  for (const [a, b, c, kind, rs] of R) { const q = Z.quadRoots(a, b, c); check(`complex: roots of ${a}x² + ${b}x + ${c} (numpy.roots)`, q.kind === kind && q.roots.every((r, i) => eq(r, rs[i][0], rs[i][1], 1e-9))); }
  check('complex: show writes a + bi', Z.show(Z.cx(3, -2)) === '3 − 2i' && Z.show(Z.cx(0, -1)) === '−i' && Z.show(Z.cx(-4, 0)) === '−4' && Z.show(Z.cx(0.5, 1)) === '0.5 + i' && Z.show(Z.cx(0, 0)) === '0');
};
