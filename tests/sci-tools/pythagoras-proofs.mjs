// #1152 Pythagoras proofs. Triples checked against the well-known list of primitive triples with c ≤ 100 (16 of
// them, e.g. 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29, 65-72-97) and by brute force over all a < b < c ≤ 100;
// proof figures checked by their areas (shoelace) and side lengths.
import { triples, tripleFrom, rightAngleAt, rearrangement, bhaskara, altitudeSplit, area, hyp } from '../../src/lib/sci/pythagoras-school.ts';

export default async (check) => {
  const near = (x, y, t = 1e-9) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  const T = triples(100);
  const brute = [];
  for (let c = 1; c <= 100; c++) for (let a = 1; a < c; a++) for (let b = a + 1; b < c; b++) if (a * a + b * b === c * c) brute.push(`${a}-${b}-${c}`);
  check(`triples: all ${brute.length} triples with c ≤ 100 found, none extra`, T.length === brute.length && T.map((t) => `${t.a}-${t.b}-${t.c}`).sort().join() === brute.sort().join());
  const prim = T.filter((t) => t.primitive).map((t) => `${t.a}-${t.b}-${t.c}`);
  check('triples: 16 primitive with c ≤ 100', prim.length === 16 && ['3-4-5', '5-12-13', '8-15-17', '7-24-25', '20-21-29', '65-72-97'].every((x) => prim.includes(x)));
  check('triples: sorted by hypotenuse', T.every((t, i) => !i || T[i - 1].c <= t.c) && T[0].c === 5);
  check('class 8 family: m = 4 gives 8, 15, 17', tripleFrom(4).join() === '8,15,17' && tripleFrom(2).join() === '4,3,5');
  check('converse: 5, 13, 12 right, 4, 5, 6 not', rightAngleAt([5, 13, 12]) === 1 && rightAngleAt([4, 5, 6]) === -1 && rightAngleAt([1, 1, Math.SQRT2]) === 2 && rightAngleAt([0, 3, 3]) === -1);
  check('hyp: 3, 4 → 5', hyp(3, 4) === 5);
  for (const [a, b] of [[3, 4], [5, 12], [2.5, 6], [7, 7]]) {
    const s = a + b, c = hyp(a, b);
    const t0 = rearrangement(a, b, 0), t1 = rearrangement(a, b, 1);
    const triA = t0.map((t) => Math.abs(area(t)));
    const congruent = [...t0, ...t1].every((t) => { const d = [0, 1, 2].map((i) => hyp(t[i][0] - t[(i + 1) % 3][0], t[i][1] - t[(i + 1) % 3][1])).sort((x, y) => x - y); return near(d[0], Math.min(a, b)) && near(d[1], Math.max(a, b)) && near(d[2], c); });
    const inside = t1.every((t) => t.every(([x, y]) => x >= -1e-9 && y >= -1e-9 && x <= s + 1e-9 && y <= s + 1e-9));
    // At t = 1 the triangles cover exactly the two a × b rectangles: [0, a] × [a, s] and [a, s] × [0, a].
    const inRects = t1.every((t) => t.every(([x, y]) => (x <= a + 1e-9 && y >= a - 1e-9) || (x >= a - 1e-9 && y <= a + 1e-9)));
    check(`rearrangement ${a}, ${b}: four triangles of area ab/2, congruent, inside the big square, uncovered c² = a² + b²`, triA.every((x) => near(x, (a * b) / 2)) && congruent && inside && inRects && near(s * s - 4 * (a * b) / 2, c * c));
    const B = bhaskara(a, b);
    const sides = B.big.map((p, i) => hyp(p[0] - B.big[(i + 1) % 4][0], p[1] - B.big[(i + 1) % 4][1]));
    check(`bhaskara ${a}, ${b}: big square side c, four triangles + inner square fill it`, sides.every((x) => near(x, c)) && near(area(B.big), c * c) && near(B.tris.reduce((s2, t) => s2 + Math.abs(area(t)), 0) + Math.abs(area(B.inner)), c * c) && near(Math.abs(area(B.inner)), (b - a) ** 2));
    const A = altitudeSplit(a, b);
    check(`similar triangles ${a}, ${b}: a² = cp, b² = cq, p + q = c, h² = pq`, near(a * a, A.c * A.p) && near(b * b, A.c * A.q) && near(A.p + A.q, A.c) && near(A.h * A.h, A.p * A.q));
  }
};
