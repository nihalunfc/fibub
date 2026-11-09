// #844 Miller index calculator: metric tensor d-spacings and angles in every crystal system, zone axes,
// Miller-Bravais conversion and the plane polygons. Reference numbers from NumPy (reciprocal vectors built with
// cross products, a* = b × c / V, independent of the metric-tensor route used in the lib).
import * as M from '../../src/lib/sci/miller.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const tri = { a: 5.1, b: 6.3, c: 7.7, alpha: 82, beta: 97, gamma: 104 };
  check('miller: triclinic cell volume 236.71233 Å³ (NumPy)', near(M.volume(tri), 236.7123343517445));
  const dn = [4.927615790221348, 1.7638584383765643, 2.470472032158471, 1.8982178495030964];
  check('miller: triclinic d(100), d(123), d(−211), d(004) match NumPy', [[1, 0, 0], [1, 2, 3], [-2, 1, 1], [0, 0, 4]].every((h, i) => near(M.dSpacing(tri, h), dn[i])));
  check('miller: triclinic angle between (123) and (−211) = 95.9192° (NumPy)', near(M.planeAngle(tri, [1, 2, 3], [-2, 1, 1]), 95.91922867419218, 1e-9));
  check('miller: triclinic angle [110]^[011] 63.1852°, |[1−12]| 16.5002 Å, [110] to (123) normal 41.6523°', near(M.dirAngle(tri, [1, 1, 0], [0, 1, 1]), 63.185243635793) && near(M.dirLength(tri, [1, -1, 2]), 16.500227757181506) && near(M.dirPlaneAngle(tri, [1, 1, 0], [1, 2, 3]), 41.65234423028027));
  check('miller: hexagonal d(101), a 3.21, c 5.21 = 2.45264 Å (NumPy and the 4/3 textbook formula)', near(M.dSpacing(M.cellFor('hexagonal', { a: 3.21, c: 5.21 }), [1, 0, 1]), 2.4526403546701223, 1e-12));
  check('miller: rhombohedral d(110), a 5, α 55° = 3.38304 Å (NumPy)', near(M.dSpacing(M.cellFor('trigonal', { a: 5, alpha: 55 }), [1, 1, 0]), 3.383039645933659, 1e-12));
  check('miller: monoclinic d(101), β 110° = 3.32331 Å (NumPy)', near(M.dSpacing(M.cellFor('monoclinic', { a: 5, b: 6, c: 7, beta: 110 }), [1, 0, 1]), 3.323308701836767, 1e-12));
  const cub = M.cellFor('cubic', { a: 4 });
  check('miller: cubic d = a/√(h²+k²+l²)', [[1, 1, 1], [2, 1, 0], [3, 3, 1]].every((h) => near(M.dSpacing(cub, h), 4 / Math.hypot(...h), 1e-12)));
  check('miller: cubic angles (100)^(110) 45°, (100)^(111) 54.7356°, (111)^(1−1−1) 109.4712°', near(M.planeAngle(cub, [1, 0, 0], [1, 1, 0]), 45) && near(M.planeAngle(cub, [1, 0, 0], [1, 1, 1]), 54.73561031724535) && near(M.planeAngle(cub, [1, 1, 1], [1, -1, -1]), 109.47122063449069));
  const tet = M.cellFor('tetragonal', { a: 4, c: 6 });
  check('miller: tetragonal 1/d² = (h²+k²)/a² + l²/c²', near(M.dSpacing(tet, [1, 1, 2]), 1 / Math.sqrt(2 / 16 + 4 / 36), 1e-12));
  check('miller: orthorhombic 1/d² = h²/a² + k²/b² + l²/c²', near(M.dSpacing(M.cellFor('orthorhombic', { a: 3, b: 4, c: 5 }), [1, 2, 3]), 1 / Math.sqrt(1 / 9 + 4 / 16 + 9 / 25), 1e-12));
  check('miller: hexagonal (100)^(010) = 60°', near(M.planeAngle(M.cellFor('hexagonal', { a: 3, c: 5 }), [1, 0, 0], [0, 1, 0]), 60, 1e-9));
  check('miller: impossible angles are caught', M.cellProblem({ a: 1, b: 1, c: 1, alpha: 100, beta: 100, gamma: 170 }) !== '' && M.cellProblem(tri) === '' && M.cellProblem({ ...tri, a: -1 }) !== '');
  check('miller: zone axis of (110) and (1−11) is [1−1−2] (NumPy cross); parallel planes give [000]', M.zoneAxis([1, 1, 0], [1, -1, 1]).join() === '1,-1,-2' && M.zoneAxis([1, 1, 0], [2, 2, 0]).every((x) => x === 0));
  check('miller: zone law: the zone axis lies in both planes (90° to both normals) in a triclinic cell', (() => { const z = M.zoneAxis([1, 2, 3], [-2, 1, 1]); return near(M.dirPlaneAngle(tri, z, [1, 2, 3]), 90, 1e-9) && near(M.dirPlaneAngle(tri, z, [-2, 1, 1]), 90, 1e-9); })());
  check('miller: reduce keeps signs and lowest terms', M.reduce([2, -4, 6]).join() === '1,-2,3' && M.reduce([0, 0, 3]).join() === '0,0,1');
  check('miller: Miller-Bravais planes (101) ↔ (10−11)', M.toBravaisPlane([1, 0, 1]).join() === '1,0,-1,1' && M.fromBravaisPlane([1, 0, -1, 1]).join() === '1,0,1' && M.fromBravaisPlane([1, 0, 0, 1]) === null);
  check('miller: Miller-Bravais directions [100] → [2−1−10], [110] → [11−20], [001] → [0001], and back', M.toBravaisDir([1, 0, 0]).join() === '2,-1,-1,0' && M.toBravaisDir([1, 1, 0]).join() === '1,1,-2,0' && M.toBravaisDir([0, 0, 1]).join() === '0,0,0,1' && M.fromBravaisDir([2, -1, -1, 0]).join() === '1,0,0' && M.fromBravaisDir([1, 1, -2, 0]).join() === '1,1,0' && M.fromBravaisDir([1, 1, 1, 0]) === null);
  check('miller: four-index direction keeps its Cartesian direction', (() => { const h = M.cellFor('hexagonal', { a: 3, c: 5 }); const back = M.fromBravaisDir(M.toBravaisDir([1, 2, 1])); return near(M.dirAngle(h, back, [1, 2, 1]), 0, 1e-6); })());
  check('miller: index text: "1-10", "(2 -1 -1 0)", "[1,1,1]", "1−10"; rejects "12" and "1 a 0"', M.parseIndices('1-10').join() === '1,-1,0' && M.parseIndices('(2 -1 -1 0)').join() === '2,-1,-1,0' && M.parseIndices('[1,1,1]').join() === '1,1,1' && M.parseIndices('1−10').join() === '1,-1,0' && M.parseIndices('12') === null && M.parseIndices('1 a 0') === null && M.parseIndices('10 0 1').join() === '10,0,1');
  check('miller: fmtIdx writes bars as minus signs', M.fmtIdx([1, -1, 0]) === '1−10' && M.fmtIdx([10, 0, -1]) === '10 0 −1');
  check('miller: (111) cuts the cube in two triangles (n = 1, 2); (100) gives two faces; (1−10) one rectangle through the origin', M.planePolygons([1, 1, 1]).map((p) => `${p.n}:${p.pts.length}`).join() === '1:3,2:3' && M.planePolygons([1, 0, 0]).map((p) => `${p.n}:${p.pts.length}`).join() === '0:4,1:4' && M.planePolygons([1, -1, 0]).map((p) => `${p.n}:${p.pts.length}`).join() === '0:4');
  check('miller: (110) polygon corners all satisfy x + y = 1; (123) cuts the cell in five planes (n = 1 to 5)', M.planePolygons([1, 1, 0]).find((p) => p.n === 1).pts.every((q) => near(q[0] + q[1], 1)) && M.planePolygons([1, 2, 3]).length === 5);
  check('miller: main plane picks n = 1, else −1, else 0', M.mainPlane(M.planePolygons([1, 1, 1])).n === 1 && M.mainPlane(M.planePolygons([1, -1, 0])).n === 0 && M.mainPlane(M.planePolygons([-1, 0, 0])).n === -1);
  check('miller: cartesian cell reproduces the metric tensor', (() => { const C = M.cartesian(tri), G = M.metric(tri); return [0, 1, 2].every((i) => [0, 1, 2].every((j) => near(C[i][0] * C[j][0] + C[i][1] * C[j][1] + C[i][2] * C[j][2], G[i][j], 1e-9))); })());
  { const r = M.reflections(cub, 2);
    check('miller: cubic reflection list: {100} ×6, {110} ×12, {111} ×8, {200} ×6, {210} ×24', r.slice(0, 5).map((g) => `${g.hkl.join('')}x${g.count}`).join() === '100x6,110x12,111x8,200x6,210x24' && near(r[2].d, 4 / Math.sqrt(3), 1e-12)); }
};
