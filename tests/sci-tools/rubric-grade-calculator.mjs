// #766 Rubric grade calculator: weighted totals, bands and class summary checked against numpy (b2/rb_check.py).
import { parseLevels, parseBands, weightedPercent, gradeFor, summary } from '../../src/lib/sci/rubric.ts';

export default async (check) => {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) < t;
  const L = parseLevels('Excellent = 4\nGood = 3\nDeveloping: 2\nBeginning 1');
  check('rubric: levels parsed, highest first', L.length === 4 && L[0].name === 'Excellent' && L[3].points === 1);
  const B = parseBands('F: 0\nA: 85\nB: 70 %\nC 55\nD = 40');
  check('rubric: bands sorted', B.map((b) => b.grade).join('') === 'ABCDF');
  const C = [{ name: 'Content', weight: 40 }, { name: 'Organisation', weight: 20 }, { name: 'Evidence', weight: 25 }, { name: 'Language', weight: 15 }];
  const S = [[4, 3, 4, 3], [3, 3, 2, 4], [2, 2, 3, 2], [4, 4, 4, 4], [1, 2, 2, 3], [3, 4, 3, 2]];
  const pct = S.map((s) => weightedPercent(s, C, 4)), want = [91.25, 72.5, 56.25, 100, 43.75, 76.25];
  check('rubric: weighted percentages (numpy)', pct.every((p, i) => near(p, want[i])));
  check('rubric: grades', pct.map((p) => gradeFor(p, B)).join('') === 'ABCADB' && gradeFor(85, B) === 'A' && gradeFor(84.99, B) === 'B');
  const s = summary(pct);
  check('rubric: class summary (numpy)', s.n === 6 && near(s.mean, 73.33333333333333) && near(s.median, 74.375) && near(s.sd, 21.01586702153082, 1e-10) && s.min === 43.75 && s.max === 100);
  check('rubric: unmarked criterion gives no total', Number.isNaN(weightedPercent([4, NaN, 3, 2], C, 4)));
  check('rubric: equal weights are a plain average', near(weightedPercent([4, 2], [{ name: 'a', weight: 1 }, { name: 'b', weight: 1 }], 4), 75));
  check('rubric: bad lines refused', (() => { try { parseLevels('Good'); return false; } catch { return true; } })() && (() => { try { parseBands('A: 120'); return false; } catch { return true; } })() && (() => { try { parseLevels('A=1\nB=1'); return false; } catch { return true; } })());
  check('rubric: zero weights refused', (() => { try { weightedPercent([1], [{ name: 'a', weight: 0 }], 4); return false; } catch { return true; } })());
};
