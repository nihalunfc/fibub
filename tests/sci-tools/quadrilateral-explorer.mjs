// #1166 Quadrilateral explorer. Angles and areas checked against a separate Python script (acos of the two edge
// vectors, reflex when the turn is against the orientation; shoelace area): dart (2,1),(6,3),(2,5),(3,3) has angles
// 36.87, 53.13, 36.87, 233.13 and area 6; the parallelogram preset 56.31/123.69 and area 18; the kite 67.38, 119.74,
// 53.13, 119.74 and area 14; the trapezium preset area 19.5.
import { sides, area, angles, shapeType, convex, diagonals, classify, midpoints, PRESETS } from '../../src/lib/sci/quadri-school.ts';

export default async (check) => {
  const near = (a, b, t = 0.01) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < t);
  const sum = (a) => a.reduce((s, x) => s + x, 0);
  const P = PRESETS;
  check('square: 4 × 4, area 16, all 90°, name square and also rectangle, rhombus, kite', classify(P.square).name === 'square' && area(P.square) === 16 && near(angles(P.square), [90, 90, 90, 90]) && ['rectangle', 'rhombus', 'kite', 'parallelogram', 'trapezium'].every((n) => classify(P.square).also.includes(n)));
  check('rectangle 6 × 3: area 18, diagonals equal and bisect, not perpendicular', classify(P.rectangle).name === 'rectangle' && area(P.rectangle) === 18 && diagonals(P.rectangle).equal && diagonals(P.rectangle).bisect && !diagonals(P.rectangle).perpendicular);
  check('rhombus: sides all 5, area 20 = ½ × √80 × √20, diagonals perpendicular', classify(P.rhombus).name === 'rhombus' && near(sides(P.rhombus), [5, 5, 5, 5]) && area(P.rhombus) === 20 && Math.abs(diagonals(P.rhombus).AC * diagonals(P.rhombus).BD / 2 - 20) < 1e-9 && diagonals(P.rhombus).perpendicular);
  check('parallelogram: 56.31°, 123.69°, area 18, diagonals bisect', classify(P.parallelogram).name === 'parallelogram' && near(angles(P.parallelogram), [56.31, 123.69, 56.31, 123.69]) && area(P.parallelogram) === 18 && diagonals(P.parallelogram).bisect);
  check('kite: 67.38, 119.74, 53.13, 119.74; area 14; diagonals perpendicular', classify(P.kite).name === 'kite' && near(angles(P.kite), [67.38, 119.74, 53.13, 119.74]) && area(P.kite) === 14 && diagonals(P.kite).perpendicular);
  check('trapezium: one parallel pair, area 19.5', classify(P.trapezium).name === 'trapezium' && classify(P.trapezium).parallelPairs === 1 && area(P.trapezium) === 19.5);
  check('isosceles trapezium (0,0),(8,0),(6,3),(2,3): area 18, equal diagonals', classify([[0, 0], [8, 0], [6, 3], [2, 3]]).name === 'isosceles trapezium' && area([[0, 0], [8, 0], [6, 3], [2, 3]]) === 18 && diagonals([[0, 0], [8, 0], [6, 3], [2, 3]]).equal);
  check('dart: concave, reflex 233.13°, angles add to 360, area 6, still a kite', !convex(P.dart) && near(angles(P.dart), [36.87, 53.13, 36.87, 233.13]) && Math.abs(sum(angles(P.dart)) - 360) < 1e-9 && area(P.dart) === 6 && classify(P.dart).name === 'kite');
  check('angles add to 360 for clockwise order too', Math.abs(sum(angles([...P.parallelogram].reverse())) - 360) < 1e-9);
  check('crossed bow tie and three points in a line are recognised', shapeType([[0, 0], [4, 4], [4, 0], [0, 4]]) === 'crossed' && shapeType([[0, 0], [2, 0], [4, 0], [2, 3]]) === 'degenerate' && classify([[0, 0], [4, 4], [4, 0], [0, 4]]).name === 'crossed');
  { const M = midpoints(P.trapezium), ab = [M[1][0] - M[0][0], M[1][1] - M[0][1]], dc = [M[2][0] - M[3][0], M[2][1] - M[3][1]];
    check('midpoints of any quadrilateral make a parallelogram with half the area', ab[0] === dc[0] && ab[1] === dc[1] && Math.abs(area(M) - area(P.trapezium) / 2) < 1e-9); }
};
