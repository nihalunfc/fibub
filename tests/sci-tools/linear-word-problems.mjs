// #1319 Linear word problems. Each story is built from a hidden answer; checked that the two equations solve
// (Cramer's rule in linpair-school, and a separate exact solve here) back to that answer for 1000 stories of each
// kind, that the answers are positive whole numbers that make sense, and against hand-worked stories.
import { makeStory, STORIES } from '../../src/lib/sci/linear-word-problems.ts';
import { solve, elimination, substitution } from '../../src/lib/sci/linpair-school.ts';

export default async (check) => {
  // A fixed "random" stream so the hand-worked story is repeatable.
  const seq = (xs) => { let i = 0; return () => xs[i++ % xs.length]; };
  const boat = makeStory('boat', seq([0.5, 0.5, 0.5, 0.5]));
  // y = 1 + floor(0.5·5) = 3, x = 3 + 3 + floor(0.5·13) = 12, t1 = t2 = 1 + floor(0.5·4) = 3: 45 km down, 27 km up.
  check('word problems: boat story 45 km down in 3 h, 27 km up in 3 h → 12 and 3 km/h', boat.ans.join() === '12,3' && boat.text.includes('45 km downstream in 3 hours') && boat.text.includes('27 km upstream') && boat.l1.c === 15 && boat.l2.c === 9);
  const ages = makeStory('ages', seq([0, 0, 0, 0]));
  // y = 6, n = 2, k = 2, x = 2·8 − 2 = 14, sum 20.
  check('word problems: ages story sum 20, in 2 years twice as old → 14 and 6', ages.ans.join() === '14,6' && ages.text.includes('add up to 20') && ages.l2.b === -2 && ages.l2.c === 2);
  let ok = true, bad = '';
  for (const { id } of STORIES) for (let i = 0; i < 1000; i++) {
    const s = makeStory(id), r = solve(s.l1, s.l2);
    const exact = (l) => l.a * s.ans[0] + l.b * s.ans[1] === l.c;
    if (r.kind !== 'unique' || Math.abs(r.x - s.ans[0]) > 1e-9 || Math.abs(r.y - s.ans[1]) > 1e-9 || !exact(s.l1) || !exact(s.l2)
      || !s.ans.every((v) => Number.isInteger(v) && v > 0) || (id === 'ages' && s.ans[0] <= s.ans[1]) || (id === 'boat' && s.ans[0] <= s.ans[1])) { ok = false; bad = `${id} ${JSON.stringify(s)}`; }
    const e = elimination(s.l1, s.l2).at(-1), u = substitution(s.l1, s.l2).at(-1);
    if (!e.includes(`= ${s.ans[0]}.`) || !u.includes(`= ${s.ans[1]}.`)) { ok = false; bad = `${id} steps: ${e} | ${u}`; }
  }
  check(`word problems: 5000 stories solve back to their whole-number answers ${bad}`, ok);
};
