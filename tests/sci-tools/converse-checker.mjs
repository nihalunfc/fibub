// #1281 Statement and converse checker. Every generator is checked to really make its "if" part (500 seeded
// examples each), the tester's verdicts match the known truth of each statement and converse, and the shape tests
// are checked on hand-made figures (a square, a 3 × 5 rectangle, a kite, a 3-4-5 triangle, an isosceles trapezium).
import { STATEMENTS, test, rng, isSquare, isRhombus, isParallelogram, diagonalsBisect, diagonalsPerpendicular, angleAt, isPrime, sides, diagonals, describe } from '../../src/lib/sci/converse-school.ts';

export default async (check) => {
  const r = rng(7);
  for (const s of STATEMENTS) {
    let okP = true, okQ = true;
    for (let i = 0; i < 500; i++) { if (!s.isP(s.genP(r))) okP = false; if (!s.isQ(s.genQ(r))) okQ = false; }
    check(`${s.id}: generators make their "if" part`, okP && okQ);
    const a = test(s, 'statement', 200, r), b = test(s, 'converse', 200, r);
    check(`${s.id}: statement ${s.statementTrue ? 'holds' : 'fails'}, converse ${s.converseTrue ? 'holds' : 'fails'} in 200 tries`, (a.counter === null) === s.statementTrue && (b.counter === null) === s.converseTrue);
  }
  const sq = [[0, 0], [2, 0], [2, 2], [0, 2]], rect = [[0, 0], [5, 0], [5, 3], [0, 3]], kite = [[0, 0], [2, -1], [5, 0], [2, 1]], trap = [[0, 0], [6, 0], [4, 3], [2, 3]];
  check('square', isSquare(sq) && isRhombus(sq) && isParallelogram(sq) && diagonalsPerpendicular(sq));
  check('rectangle: equal diagonals, not a square', !isSquare(rect) && Math.abs(diagonals(rect)[0] - diagonals(rect)[1]) < 1e-12 && isParallelogram(rect) && diagonalsBisect(rect) && !diagonalsPerpendicular(rect));
  check('kite: perpendicular diagonals, not a rhombus', diagonalsPerpendicular(kite) && !isRhombus(kite) && !diagonalsBisect(kite));
  check('isosceles trapezium: equal diagonals, not a parallelogram', Math.abs(diagonals(trap)[0] - diagonals(trap)[1]) < 1e-12 && !isParallelogram(trap));
  const t345 = [[0, 0], [4, 0], [4, 3]];
  check('3-4-5 angles 36.87, 90, 53.13', Math.abs(angleAt(t345, 0) - 36.8699) < 1e-3 && Math.abs(angleAt(t345, 1) - 90) < 1e-9 && Math.abs(angleAt(t345, 2) - 53.1301) < 1e-3);
  check('sides', sides(rect).join() === '5,3,5,3');
  check('primes', [2, 3, 5, 97, 199].every(isPrime) && ![1, 9, 15, 91, 200].some(isPrime));
  check('describe a number and a quad', describe({ kind: 'num', n: 6 }) === 'n = 6' && describe({ kind: 'quad', p: rect }).startsWith('sides 5, 3, 5, 3; diagonals 5.83 and 5.83'));
  const r1 = rng(3), r2 = rng(3);
  check('seeded random repeats', r1() === r2() && r1() === r2());
};
