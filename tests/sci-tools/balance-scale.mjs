// #1250 Balance scale equation solver. solve() checked against (d − b)/(a − c) for every equation with 0 to 9 boxes
// and 0 to 30 weights a side (96 100 cases, the same set checked with Python fractions.Fraction), and the moves
// checked to keep the solution unchanged.
import { solve, solText, eqText, move, isSolved, tip, hint } from '../../src/lib/sci/balance-scale.ts';

export default async (check) => {
  let ok = true, kept = true;
  for (let a = 0; a <= 9; a++) for (let b = 0; b <= 30; b++) for (let c = 0; c <= 9; c++) for (let d = 0; d <= 30; d++) {
    const s = solve({ a, b, c, d });
    if (a === c) { if (s.kind !== (b === d ? 'all' : 'none')) ok = false; continue; }
    if (s.kind !== 'one' || Math.abs(s.p / s.q - (d - b) / (a - c)) > 1e-12 || s.q <= 0) ok = false;
    for (const [m, k] of [['unit'], ['units'], ['box'], ['share', 2], ['share', 3], ['swap']]) {
      const r = move({ a, b, c, d }, m, k);
      if (typeof r === 'string') continue;
      const t = solve(r);
      if (t.kind !== 'one' || t.p !== s.p || t.q !== s.q) kept = false;
    }
  }
  check('96 100 equations solved exactly', ok);
  check('every allowed move keeps the same solution', kept);
  check('3x + 5 = x + 13 → 4', solText(solve({ a: 3, b: 5, c: 1, d: 13 })) === '4' && eqText({ a: 3, b: 5, c: 1, d: 13 }) === '3x + 5 = x + 13');
  check('3x = 7 → 7/3; 2x + 4 = 2x + 6 has none', solText(solve({ a: 3, b: 0, c: 0, d: 7 })) === '7/3' && solText(solve({ a: 2, b: 4, c: 2, d: 6 })) === 'no number');
  check('x + 9 = 3x + 1 → 4 (x on the right)', solText(solve({ a: 1, b: 9, c: 3, d: 1 })) === '4');
  check('moves refuse what one pan cannot give', typeof move({ a: 2, b: 0, c: 1, d: 5 }, 'unit') === 'string' && typeof move({ a: 2, b: 4, c: 0, d: 6 }, 'box') === 'string' && typeof move({ a: 2, b: 1, c: 0, d: 6 }, 'share', 2) === 'string');
  check('solved forms', isSolved({ a: 1, b: 0, c: 0, d: 4 }) && isSolved({ a: 0, b: 4, c: 1, d: 0 }) && !isSolved({ a: 2, b: 0, c: 0, d: 8 }));
  const t = tip({ a: 3, b: 5, c: 1, d: 13 }, 2);
  check('guess 2: left 11, right 15, tips right', t.left === 11 && t.right === 15 && t.t > 0 && tip({ a: 3, b: 5, c: 1, d: 13 }, 4).t === 0);
  check('hint for 3x = 7 mentions a fraction', hint({ a: 3, b: 0, c: 0, d: 7 }).includes('fraction'));
};
