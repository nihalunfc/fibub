// #1189 matrix as a transformation. Determinants, adjoints, inverses and solutions of 3 × 3 systems checked
// against sympy 1.14 (det, adjugate, inv, rank); 2 × 2 products and inverses against sympy too.
import * as MX from '../../src/lib/sci/school-matrix.ts';
const qs = (a) => a.map(MX.qstr).join(',');
export default async (check) => {
  check('matrix: 2 × 2 det, product and inverse (sympy)', MX.det2([2, 1, 1, 3]) === 5 && MX.mul2([2, 1, 1, 3], [0, -1, 1, 0]).join() === '1,-2,3,-1' && MX.inv2([2, 1, 1, 3]).map((v) => Math.round(v * 5)).join() === '3,-1,-1,2' && MX.inv2([1, 2, 2, 4]) === null);
  check('matrix: rotation by 90° sends (1, 0) to (0, 1), det 1', (() => { const m = MX.PRESETS2[0].m(90); const p = MX.apply2(m, [1, 0]); return Math.abs(p[0]) < 1e-12 && Math.abs(p[1] - 1) < 1e-12 && Math.abs(MX.det2(m) - 1) < 1e-12; })());
  check('matrix: reflections have det −1, the squash det 0', MX.det2(MX.PRESETS2.find((p) => p.id === 'refx').m(0)) === -1 && MX.det2(MX.PRESETS2.find((p) => p.id === 'refyx').m(0)) === -1 && MX.det2(MX.PRESETS2.find((p) => p.id === 'proj').m(0)) === 0);
  check('matrix: AB ≠ BA for a shear and a rotation', MX.mul2([1, 1, 0, 1], [0, -1, 1, 0]).join() !== MX.mul2([0, -1, 1, 0], [1, 1, 0, 1]).join());
  const A = [[1, 1, 1], [0, 2, 5], [2, 5, -1]], r = MX.solve3(A, [6, -4, 27]);
  check('matrix: det −21 and adjoint (sympy adjugate)', r.det === -21 && JSON.stringify(r.adj) === JSON.stringify([[-27, 6, 3], [10, -3, -5], [-4, -3, 2]]));
  check('matrix: inverse in fractions (sympy inv)', r.inv.map(qs).join(';') === '9/7,−2/7,−1/7;−10/21,1/7,5/21;4/21,1/7,−2/21');
  check('matrix: x = 5, y = 3, z = −2 (sympy)', r.kind === 'unique' && qs(r.x) === '5,3,−2');
  const r2 = MX.solve3([[3, -2, 3], [2, 1, -1], [4, -3, 2]], [8, 1, 4]);
  check('matrix: second system det −17, x = 1, 2, 3 (sympy)', r2.det === -17 && qs(r2.x) === '1,2,3' && r2.inv.map(qs).join(';') === '1/17,5/17,1/17;8/17,6/17,−9/17;10/17,−1/17,−7/17');
  const S = [[1, 2, 3], [2, 4, 6], [1, 1, 1]];
  check('matrix: singular system with (adj A)B = 0 and equal ranks has many solutions (sympy rank 2, 2)', MX.solve3(S, [1, 2, 3]).kind === 'many');
  check('matrix: singular system with (adj A)B ≠ 0 has none (sympy (adj A)B = (1, −2, 1))', (() => { const s = MX.solve3(S, [1, 3, 3]); return s.kind === 'none' && s.adjB.join() === '1,-2,1'; })());
  check('matrix: fractions reduce and keep the sign on top', MX.qstr(MX.q(6, -8)) === '−3/4' && MX.qstr(MX.qadd(MX.q(1, 3), MX.q(1, 6))) === '1/2' && MX.qstr(MX.qdiv(MX.q(2), MX.q(4))) === '1/2');
  check('matrix: rank of a 3 × 4 matrix', MX.rank([[1, 2, 3, 1], [2, 4, 6, 3], [1, 1, 1, 3]]) === 3);
};
