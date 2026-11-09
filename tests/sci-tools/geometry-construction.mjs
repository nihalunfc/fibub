// #553 Interactive geometry construction. Reference values from Python sympy (/home/user/pyenv):
// Triangle((-4,-2), (3,-3), (1,4)): circumcenter, circumradius, incenter, area 47/2, angle B, perimeter;
// Line.intersection(Circle), Circle.intersection(Circle), Line.projection (foot of the perpendicular).
import { evaluate, intersect, angleDeg, polygonMeasures, dependants, distanceTo } from '../../src/lib/sci/construct.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const P = (id, x, y) => ({ id, def: { k: 'point', x, y } });
  const base = [P('A', -4, -2), P('B', 3, -3), P('C', 1, 4)];
  // Circumcentre from two perpendicular bisectors, and the circumcircle.
  { const g = evaluate([...base, { id: 'p1', def: { k: 'pbis', a: 'A', b: 'B' } }, { id: 'p2', def: { k: 'pbis', a: 'B', b: 'C' } }, { id: 'O', def: { k: 'inter', a: 'p1', b: 'p2', i: 0 } },
      { id: 'c1', def: { k: 'circle', c: 'O', p: 'A' } }, { id: 'dOC', def: { k: 'dist', a: 'O', b: 'C' } }]);
    const O = g.get('O'), c = g.get('c1');
    check('construct: circumcentre from perpendicular bisectors (sympy)', near(O.x, -0.15957446808510638) && near(O.y, -0.11702127659574468));
    check('construct: circumradius and the circle passes through C (sympy)', near(c.r, 4.277204360207367) && near(g.get('dOC').v, 4.277204360207367)); }
  // Incentre from two angle bisectors.
  { const g = evaluate([...base, { id: 'b1', def: { k: 'abis', a: 'B', b: 'A', c: 'C' } }, { id: 'b2', def: { k: 'abis', a: 'A', b: 'B', c: 'C' } }, { id: 'I', def: { k: 'inter', a: 'b1', b: 'b2', i: 0 } }]);
    check('construct: incentre from angle bisectors (sympy)', near(g.get('I').x, 0.062332504985384257) && near(g.get('I').y, -0.43799965560296134)); }
  { const g = evaluate([...base, { id: 'm', def: { k: 'angle', a: 'A', b: 'B', c: 'C' } }, { id: 't', def: { k: 'poly', pts: ['A', 'B', 'C'] } }]);
    check('construct: angle ABC = 65.9245017449° (sympy)', near(g.get('m').v, 65.924501744921167, 1e-13));
    check('construct: triangle area 47/2 and perimeter (sympy)', g.get('t').area === 23.5 && near(g.get('t').perimeter, 22.161427377052648)); }
  // Foot of the perpendicular from C to AB.
  { const g = evaluate([...base, { id: 'l', def: { k: 'line', a: 'A', b: 'B' } }, { id: 'pp', def: { k: 'perp', l: 'l', p: 'C' } }, { id: 'F', def: { k: 'inter', a: 'l', b: 'pp', i: 0 } }]);
    check('construct: foot of the perpendicular (3/50, -129/50)', near(g.get('F').x, 0.06) && near(g.get('F').y, -2.58)); }
  { const g = evaluate([...base, { id: 'l', def: { k: 'line', a: 'A', b: 'B' } }, { id: 'q', def: { k: 'par', l: 'l', p: 'C' } }, { id: 'X', def: { k: 'inter', a: 'l', b: 'q', i: 0 } }]);
    check('construct: parallel lines do not meet', g.get('X') === null && near(g.get('q').dx, g.get('l').dx)); }
  // Line and circle; circle and circle.
  { const r = intersect({ t: 'ln', px: -4, py: -2, dx: 5 / Math.hypot(5, 6), dy: 6 / Math.hypot(5, 6) }, { t: 'ci', cx: 0, cy: 0, r: 5 });
    check('construct: line meets circle at two points (sympy)', r.length === 2 && near(r[0].x, -4.3652010055013417) && near(r[0].y, -2.4382412066016101) && near(r[1].x, 1.611102644845604) && near(r[1].y, 4.7333231738147248)); }
  { const r = intersect({ t: 'ci', cx: 0, cy: 0, r: 5 }, { t: 'ci', cx: 4, cy: 1, r: 3 });
    check('construct: two circles meet at two points (sympy)', r.length === 2 && near(r[0].x, 3.1553407591583368) && near(r[0].y, 3.878636963366653) && near(r[1].x, 4.6093651231946044) && near(r[1].y, -1.9374604927784177)); }
  check('construct: circles apart, nested, tangent', intersect({ t: 'ci', cx: 0, cy: 0, r: 1 }, { t: 'ci', cx: 5, cy: 0, r: 1 }).length === 0 && intersect({ t: 'ci', cx: 0, cy: 0, r: 5 }, { t: 'ci', cx: 1, cy: 0, r: 1 }).length === 0 && intersect({ t: 'ci', cx: 0, cy: 0, r: 1 }, { t: 'ci', cx: 2, cy: 0, r: 1 }).length === 1);
  check('construct: tangent line touches once', intersect({ t: 'ln', px: -3, py: 2, dx: 1, dy: 0 }, { t: 'ci', cx: 0, cy: 0, r: 2 }).length === 1);
  { const s = { t: 'ln', px: 0, py: 0, dx: 1, dy: 0, len: 2 }; check('construct: segments meet only within their ends', intersect(s, { t: 'ln', px: 3, py: -1, dx: 0, dy: 1 }).length === 0 && intersect(s, { t: 'ln', px: 1, py: -1, dx: 0, dy: 1 }).length === 1); }
  // Moving a point updates what depends on it; deleting removes dependants.
  { const items = [...base, { id: 'M', def: { k: 'mid', a: 'A', b: 'B' } }, { id: 's', def: { k: 'segment', a: 'M', b: 'C' } }, { id: 'd', def: { k: 'dist', a: 'M', b: 'C' } }];
    items[0].def.x = 2; const g = evaluate(items); check('construct: dragging A moves the midpoint and the median length', g.get('M').x === 2.5 && near(g.get('d').v, Math.hypot(1.5, 6.5)));
    const dep = dependants(items, 'A'); check('construct: deleting A removes M, the segment and the measure', dep.has('M') && dep.has('s') && dep.has('d') && !dep.has('B')); }
  { const g = evaluate([P('A', 1, 1), P('B', 1, 1), { id: 's', def: { k: 'segment', a: 'A', b: 'B' } }, { id: 'c', def: { k: 'circle', c: 'A', p: 'B' } }]); check('construct: zero-length segment and zero circle do not exist', g.get('s') === null && g.get('c') === null); }
  check('construct: angles and polygons', near(angleDeg({ x: 1, y: 0 }, { x: 0, y: 0 }, { x: -1, y: 1e-300 }), 180) && polygonMeasures([[0, 0], [4, 0], [4, 3]]).area === 6 && polygonMeasures([[0, 0], [4, 0], [4, 3]]).perimeter === 12);
  check('construct: distance to objects', distanceTo({ t: 'ci', cx: 0, cy: 0, r: 2 }, 3, 4) === 3 && distanceTo({ t: 'ln', px: 0, py: 0, dx: 1, dy: 0, len: 2 }, 5, 4) === 5);
};
