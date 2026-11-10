// #1281 Statement and converse checker. The truth of each statement and converse is standard geometry and number
// facts; the hunt is checked to find no counterexample to any true direction in 3 000 random figures, and to find
// one for every false converse (rectangle for "equal diagonals → square", kite for "perpendicular diagonals →
// rhombus", 9 for "divisible by 3 → divisible by 6").
import { STATEMENTS, hunt, rng, Q, square, rhombus, T, measures } from '../../src/lib/sci/converse-school.ts';
export default async (check) => {
  check('converse: square has equal, perpendicular, bisecting diagonals', square([[0, 0], [2, 0], [2, 2], [0, 2]]) && Q.diagonalsEqual([[0, 0], [2, 0], [2, 2], [0, 2]]) && Q.diagonalsPerp([[0, 0], [2, 0], [2, 2], [0, 2]]));
  const kite = [[0, 0], [1, 1], [0, 3], [-1, 1]];
  check('converse: a kite has perpendicular diagonals but is not a rhombus', Q.diagonalsPerp(kite) && !rhombus(kite) && !Q.diagonalsBisect(kite));
  const rect = [[0, 0], [3, 0], [3, 1], [0, 1]];
  check('converse: a 3 × 1 rectangle has equal diagonals √10 but is not a square', Q.diagonalsEqual(rect) && !square(rect) && Math.abs(measures(rect).d[0] - Math.sqrt(10)) < 1e-12);
  check('converse: 3-4-5 right triangle passes Pythagoras', T.rightAtA([[0, 0], [3, 0], [0, 4]]) && T.pythag([[0, 0], [3, 0], [0, 4]]));
  let ok = true, found = true;
  for (const s of STATEMENTS) for (const conv of [false, true]) {
    const h = hunt(s, conv, 3000, rng(7 + s.id.length));
    const truth = conv ? s.converseTrue : s.statementTrue;
    if (h.hyp === 0) ok = false;
    if (truth && h.counter) ok = false;
    if (!truth && !h.counter) found = false;
  }
  check('converse: no counterexample to any true direction; every direction gets tested', ok);
  check('converse: a counterexample turns up for every false converse', found);
  const d = hunt(STATEMENTS.find((s) => s.id === 'div6'), true, 500, rng(3));
  check('converse: a counterexample to "divisible by 3 → by 6" is odd', d.counter && d.counter.n % 3 === 0 && d.counter.n % 2 === 1);
};
