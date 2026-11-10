// #1317 Triangle type from coordinates. Checked against hand-worked cases ((1,1),(5,1),(1,4): sides 4, 3, 5, area 6,
// right at A; (0,0),(2,0),(1,√3) equilateral; (1,1),(5,1),(9,1) collinear with B between) and on 2000 random
// triangles: the type by angles agrees with the largest angle from the law of cosines, and the angles add to 180°.
import { classify, angles, surd, slope, d2 } from '../../src/lib/sci/coord-triangle.ts';

export default async (check) => {
  const k = classify([1, 1], [5, 1], [1, 4]);
  check('coord triangle: (1,1),(5,1),(1,4) sides² 16, 25, 9, area 6, scalene, right at A', k.sides.join() === '16,25,9' && k.area === 6 && k.bySides === 'scalene' && k.byAngles === 'right' && k.at === 'A' && !k.collinear);
  const e = classify([0, 0], [2, 0], [1, Math.sqrt(3)]);
  check('coord triangle: (0,0),(2,0),(1,√3) is equilateral and acute', e.bySides === 'equilateral' && e.byAngles === 'acute' && e.at === null);
  const c = classify([1, 1], [5, 1], [9, 1]);
  check('coord triangle: (1,1),(5,1),(9,1) collinear with B in the middle', c.collinear && c.middle === 'B' && c.area === 0 && c.bySides === null);
  const c2 = classify([0, 0], [3, 6], [1, 2]);
  check('coord triangle: (0,0),(3,6),(1,2) collinear with C in the middle', c2.collinear && c2.middle === 'C');
  const i = classify([0, 0], [4, 0], [2, 5]);
  check('coord triangle: (0,0),(4,0),(2,5) isosceles with BC = CA, acute', i.bySides === 'isosceles' && i.equalPairs.sort().join() === 'BC,CA' && i.byAngles === 'acute');
  const o = classify([0, 0], [6, 0], [1, 1]);
  check('coord triangle: (0,0),(6,0),(1,1) obtuse at C', o.byAngles === 'obtuse' && o.at === 'C');
  const ri = classify([0, 0], [3, 0], [0, 3]);
  check('coord triangle: (0,0),(3,0),(0,3) isosceles right at A', ri.bySides === 'isosceles' && ri.byAngles === 'right' && ri.at === 'A');
  check('coord triangle: same points flagged', classify([1, 1], [1, 1], [2, 3]).same === 1 && classify([1, 1], [1, 1], [1, 1]).same === 3);
  check('coord triangle: surds 20 → 2√5, 16 → 4, 7 → √7, 72 → 6√2, 2.5 → null', surd(20) === '2√5' && surd(16) === '4' && surd(7) === '√7' && surd(72) === '6√2' && surd(2.5) === null);
  check('coord triangle: slopes, vertical is Infinity', slope([0, 0], [2, 4]) === 2 && slope([1, 0], [1, 5]) === Infinity && d2([0, 0], [3, 4]) === 25);
  let ok = true, bad = '';
  for (let n = 0; n < 2000; n++) {
    const p = () => [Math.round(Math.random() * 20 - 10), Math.round(Math.random() * 20 - 10)];
    const A = p(), B = p(), C = p(), t = classify(A, B, C);
    if (t.collinear || t.same) continue;
    const an = angles(A, B, C), big = Math.max(...an), at = 'ABC'[an.indexOf(big)];
    const want = Math.abs(big - 90) < 1e-7 ? 'right' : big > 90 ? 'obtuse' : 'acute';
    if (t.byAngles !== want || (want !== 'acute' && t.at !== at) || Math.abs(an[0] + an[1] + an[2] - 180) > 1e-9) { ok = false; bad = JSON.stringify([A, B, C]); }
  }
  check(`coord triangle: 2000 random triangles agree with the law of cosines ${bad}`, ok);
};
