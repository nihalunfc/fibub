// #1157 Pair of linear equations. Solutions checked against numpy.linalg.solve on random whole-number systems
// (via Cramer's rule put back into both equations) and hand-worked examples; ratio test by kind.
import { solve, ratioTest, substitution, elimination, eqText } from '../../src/lib/sci/linpair-school.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const L1 = { a: 2, b: 3, c: 12 }, L2 = { a: 1, b: -1, c: 1 };
  const s = solve(L1, L2);
  check('solve: 2x + 3y = 12, x − y = 1 → (3, 2)', s.kind === 'unique' && near(s.x, 3) && near(s.y, 2));
  // numpy.linalg.solve([[3, -5], [9, 2]], [-4, 7]) = [0.52941176, 1.11764706]  (9/17, 19/17)
  const t = solve({ a: 3, b: -5, c: -4 }, { a: 9, b: 2, c: 7 });
  check('solve: 3x − 5y = −4, 9x + 2y = 7 matches numpy (9/17, 19/17)', near(t.x, 0.52941176, 1e-7) && near(t.y, 1.11764706, 1e-7) && substitution({ a: 3, b: -5, c: -4 }, { a: 9, b: 2, c: 7 }).join().includes('x = 9/17'));
  check('kinds: parallel and coincident', solve({ a: 1, b: 2, c: 3 }, { a: 2, b: 4, c: 9 }).kind === 'parallel' && solve({ a: 1, b: 2, c: 3 }, { a: 2, b: 4, c: 6 }).kind === 'coincident' && solve({ a: 0, b: 0, c: 3 }, L2).kind === 'invalid');
  const r = ratioTest({ a: 1, b: 2, c: 3 }, { a: 2, b: 4, c: 9 });
  check('ratio test: 1/2 = 1/2 ≠ 1/3 parallel', r.a === '1/2' && r.b === '1/2' && r.c === '1/3' && r.kind === 'parallel');
  check('ratio test: unique words', ratioTest(L1, L2).sign === 'a1/a2 ≠ b1/b2' && ratioTest(L1, L2).a === '2');
  const sub = substitution(L1, L2).join(' | ');
  check('substitution steps for (3, 2)', sub.includes('So x = 3.') && sub.includes('= 2.') && sub.includes('From (1): y = (12 − 2x) / 3.'));
  const el = elimination(L1, L2).join(' | ');
  check('elimination steps for (3, 2)', el.includes('y = 2.') && el.includes('x = 3.') && el.includes('2x + 3y = 12   and   2x − 2y = 2'));
  check('elimination when a1 = 0', elimination({ a: 0, b: 2, c: 6 }, { a: 1, b: 1, c: 5 }).join(' ').endsWith('= 2.'));
  check('steps say no solution / infinitely many', substitution({ a: 1, b: 2, c: 3 }, { a: 2, b: 4, c: 9 })[0].includes('no solution') && elimination({ a: 1, b: 2, c: 3 }, { a: 2, b: 4, c: 6 })[0].includes('infinitely many'));
  check('eqText', eqText({ a: 1, b: -1, c: 1 }) === 'x − y = 1' && eqText({ a: 0, b: 2, c: -6 }) === '2y = −6' && eqText({ a: -3, b: 0, c: 0 }) === '−3x = 0');
  // Random whole-number systems: the solution satisfies both equations, and the step texts end in the same values.
  let ok = true, okText = true;
  for (let i = 0; i < 400; i++) {
    const R = () => Math.floor(Math.random() * 19) - 9;
    const l1 = { a: R(), b: R(), c: R() }, l2 = { a: R(), b: R(), c: R() };
    const S = solve(l1, l2);
    if (S.kind === 'unique') {
      if (!near(l1.a * S.x + l1.b * S.y, l1.c, 1e-9) || !near(l2.a * S.x + l2.b * S.y, l2.c, 1e-9)) ok = false;
      const sub2 = substitution(l1, l2), el2 = elimination(l1, l2);
      const val = (t) => { const m = /= (−?\d+)(?:\/(\d+))?(?: ≈ \S+)?\.$/.exec(t); return m ? Number(m[1].replace('−', '-')) / (m[2] ? Number(m[2]) : 1) : NaN; };
      if (!near(val(sub2.at(-1)), S.y, 1e-9) || !near(val(el2.at(-1)), S.x, 1e-9)) okText = false;
    }
  }
  check('400 random systems: solutions satisfy both equations', ok);
  check('400 random systems: substitution ends with y, elimination with x, as exact fractions', okText);
};
