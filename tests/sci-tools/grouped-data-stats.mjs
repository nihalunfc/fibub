// #1163 Grouped data statistics. Median checked against Python statistics.median_grouped (53.3333 for the example,
// 27.2727 for a second table); mean and mode against a separate Python calculation (mean 52.8, mode 53.33); the
// three mean methods must agree on random tables.
import { parseClasses, stats, EXAMPLE } from '../../src/lib/sci/grouped-school.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const { rows, error } = parseClasses(EXAMPLE);
  const s = stats(rows);
  check('parse: example has 5 classes, n = 50', !error && rows.length === 5 && s.n === 50 && s.h === 20);
  check('example: mean 52.8 by all three methods', near(s.meanDirect, 52.8) && near(s.meanAssumed, 52.8) && near(s.meanStep, 52.8) && s.a === 50);
  check('example: median 53.333 (Python median_grouped), median class 40-60, cf before 15', near(s.median, 53.333333333333336) && s.medianClass === 2 && s.cfBefore === 15);
  check('example: mode 53.333, modal class 40-60 with f0 = 9, f1 = 15, f2 = 12', near(s.mode, 53.33333333333333) && s.modalClass === 2 && s.f0 === 9 && s.f2 === 12);
  check('ogives: less-than ends at (100, 50), more-than starts at (0, 50)', s.lessThan.at(-1).join() === '100,50' && s.moreThan[0].join() === '0,50' && s.lessThan[2].join() === '60,30');
  const s2 = stats(parseClasses('0-10 7\n10-20 3\n20-30 11\n30-40 4\n40-50 9\n50-60 2').rows);
  check('second table: median 27.2727 (Python median_grouped)', near(s2.median, 27.272727272727273));
  check('assumed mean of your choice gives the same mean', near(stats(rows, 30).meanAssumed, 52.8) && near(stats(rows, 90).meanStep, 52.8));
  check('parse: other separators', parseClasses('10 – 20, 5\n20 to 30: 7').rows.length === 2 && !parseClasses('10 – 20, 5\n20 to 30: 7').error);
  check('parse: errors for gaps, bad lines, reversed limits, one class', /without gaps/.test(parseClasses('10-19 5\n20-29 4').error) && /should look like/.test(parseClasses('10-20 five\n20-30 2').error) && /bigger/.test(parseClasses('20-10 5\n20-30 1').error) && /at least two/.test(parseClasses('10-20 5').error));
  let ok = true;
  for (let i = 0; i < 300; i++) {
    const k = 3 + Math.floor(Math.random() * 6), h = [5, 10, 20][i % 3], lo0 = Math.floor(Math.random() * 5) * h;
    const R = Array.from({ length: k }, (_, j) => ({ lo: lo0 + j * h, hi: lo0 + (j + 1) * h, f: Math.floor(Math.random() * 20) + 1 }));
    const S = stats(R);
    const data = R.flatMap((r) => Array(r.f).fill((r.lo + r.hi) / 2)), mean = data.reduce((a, b) => a + b, 0) / data.length;
    if (!near(S.meanDirect, mean) || !near(S.meanAssumed, mean) || !near(S.meanStep, mean)) ok = false;
    if (S.median < R[S.medianClass].lo - 1e-9 || S.median > R[S.medianClass].hi + 1e-9) ok = false;
  }
  check('300 random tables: three means agree with the plain mean; median inside its class', ok);
};
