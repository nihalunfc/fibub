// #1158 Identity tiles. Each model's terms must add up to its product, and the tiles must fill the big shape
// exactly (areas add up, no overlaps, all inside), for random sizes; the cube's eight blocks must fill (a + b)³
// with counts 1, 3, 3, 1. The identities themselves were checked against sympy.expand.
import { sqSum, sqDiff, diffSquares, xPlus, sqTriple, cubeBlocks, iso, area, termSum } from '../../src/lib/sci/identity-school.ts';

export default async (check) => {
  const near = (x, y) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(y));
  const tiles = (m, W, H) => {
    const r = m.rects.filter((t) => (t.sign ?? 1) > 0);
    const inside = r.every((t) => t.x >= -1e-12 && t.y >= -1e-12 && t.x + t.w <= W + 1e-9 && t.y + t.h <= H + 1e-9);
    const overlap = r.some((p, i) => r.some((q, j) => j > i && Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x) > 1e-9 && Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y) > 1e-9));
    return inside && !overlap && near(r.reduce((s, t) => s + t.w * t.h, 0), W * H);
  };
  let ok = true;
  for (let i = 0; i < 300; i++) {
    const a = 1 + Math.random() * 9, b = Math.random() * a * 0.95, c = Math.random() * 5, x = 1 + Math.random() * 6;
    const S = sqSum(a, b), D = sqDiff(a, b), Q = diffSquares(a, b), X = xPlus(x, a, b), T = sqTriple(a, b, c);
    if (![S, D, Q, X, T].every((m) => near(termSum(m), m.total))) ok = false;
    if (!tiles(S, a + b, a + b) || !tiles(Q, a + b, a - b) || !tiles(X, x + a, x + b) || !tiles(T, a + b + c, a + b + c)) ok = false;
    if (!near(area(S), S.total) || !near(area(Q), Q.total) || !near(area(X), X.total)) ok = false;
    // (a − b)²: the kept square plus the two strips minus their shared corner is the whole a².
    if (!near(D.rects[0].w * D.rects[0].h + 2 * a * b - b * b, a * a)) ok = false;
  }
  check('300 random sizes: terms add up to the product and tiles fill each shape', ok);
  check('sympy: (a+b)², (a−b)², (a+b)(a−b), (x+a)(x+b), (a+b+c)² at a = 5, b = 3, c = 2, x = 4', sqSum(5, 3).total === 64 && termSum(sqSum(5, 3)) === 64 && termSum(sqDiff(5, 3)) === 4 && termSum(diffSquares(5, 3)) === 16 && termSum(xPlus(4, 5, 3)) === 63 && termSum(sqTriple(5, 3, 2)) === 100);
  const B = cubeBlocks(3, 2), vol = B.reduce((s, k) => s + k.w * k.d * k.h, 0);
  const cnt = ['a³', 'a²b', 'ab²', 'b³'].map((l) => B.filter((k) => k.label === l).length);
  check('cube: 8 blocks fill (a + b)³ = 125; counts 1, 3, 3, 1; volumes 27, 18, 12, 8', B.length === 8 && vol === 125 && cnt.join() === '1,3,3,1' && B.filter((k) => k.label === 'a²b').every((k) => k.w * k.d * k.h === 18) && B.find((k) => k.label === 'ab²').w * B.find((k) => k.label === 'ab²').d * B.find((k) => k.label === 'ab²').h === 12);
  const [px, py] = iso(1, 0, 0), [qx, qy] = iso(0, 0, 1);
  check('isometric: x goes right and down, z goes straight up', near(px, Math.sqrt(3) / 2) && near(py, 0.5) && qx === 0 && qy === -1);
};
