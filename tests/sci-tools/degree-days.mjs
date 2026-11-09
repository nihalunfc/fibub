// #216 degree days (heating, cooling, growing). Sine and triangle values checked against an independent Python
// script that samples the day's curve at 200,000 points and averages max(0, T - base) with numpy; mean and
// modified average against the same script's own formulas. The made-up example year is checked the same way.
import { heating, cooling, growing, degreeDays, monthly, fillGaps, readDays, exampleYear, sineAbove, triangleAbove } from '../../src/lib/sci/degreedays.ts';
import { num, parseTable } from '../../src/lib/sci/num.ts';

export default async (check) => {
  const near = (name, a, b, tol) => check(`degree days: ${name} (${a} vs ${b})`, Math.abs(a - b) <= tol);
  const D = (tmin, tmax) => ({ tmin, tmax, mean: (tmin + tmax) / 2 });
  // [tmin, tmax, heat base, cool base, grow base, upper, method] -> [HDD, CDD, GDD] from numpy.
  const cases = [
    [[5, 15, 18, 18, 10, 30, 'sine'], [8, 0, 1.591549]], [[5, 15, 18, 18, 10, 30, 'triangle'], [8, 0, 1.25]],
    [[10, 30, 18, 18, 10, 30, 'sine'], [2.246976, 4.246976, 10]], [[10, 30, 18, 18, 10, 30, 'triangle'], [1.6, 3.6, 10]],
    [[20, 36, 18, 18, 10, 30, 'sine'], [0, 10, 16.373521]], [[20, 36, 18, 18, 10, 30, 'triangle'], [0, 10, 16.875]],
    [[20, 36, 18, 18, 10, 30, 'modified'], [0, 10, 15]], [[20, 36, 18, 18, 10, 30, 'mean'], [0, 10, 18]],
    [[-5, 8, 18, 18, 10, 30, 'sine'], [16.5, 0, 0]], [[-5, 8, 18, 18, 10, 30, 'triangle'], [16.5, 0, 0]],
    [[12, 24, 15.5, 22, 10, null, 'sine'], [0.828180, 0.352643, 8]], [[12, 24, 15.5, 22, 10, null, 'triangle'], [0.510417, 0.166667, 8]],
    [[45, 80, 65, 65, 50, 86, 'sine'], [6.877361, 4.377361, 13.314088]], [[45, 80, 65, 65, 50, 86, 'triangle'], [5.714286, 3.214286, 12.857143]],
    [[60, 95, 65, 65, 50, 86, 'sine'], [0.814088, 13.314088, 25.508551]], [[60, 95, 65, 65, 50, 86, 'triangle'], [0.357143, 12.857143, 26.342857]],
    [[60, 95, 65, 65, 50, 86, 'modified'], [0, 12.5, 23]], [[31, 40, 18, 18, 10, 30, 'sine'], [0, 17.5, 20]],
    [[31, 40, 18, 18, 10, 30, 'triangle'], [0, 17.5, 20]], [[2, 9, 18, 18, 10, 30, 'modified'], [12.5, 0, 0]], [[8, 14, 18, 18, 10, 30, 'mean'], [7, 0, 1]],
  ];
  for (const [[a, b, hb, cb, gb, gu, m], [h, c, g]] of cases) {
    const d = D(a, b), tag = `${m} ${a} to ${b}`;
    near(`${tag} heating base ${hb}`, heating(d, hb, m), h, 2e-5);
    near(`${tag} cooling base ${cb}`, cooling(d, cb, m), c, 2e-5);
    near(`${tag} growing base ${gb} upper ${gu ?? 'none'}`, growing(d, gb, gu, m), g, 2e-5);
  }
  near('sine curve with min and max swapped', sineAbove(15, 5, 10), 1.591549, 2e-6);
  near('triangle at a base equal to the minimum', triangleAbove(10, 20, 10), 5, 1e-12);
  near('flat day (min = max) sine', sineAbove(12, 12, 10), 2, 1e-12);
  // Heating plus cooling at one base is the mean distance from it (sine and triangle alike).
  near('HDD - CDD = base - mean (triangle)', heating(D(3, 21), 15, 'triangle') - cooling(D(3, 21), 15, 'triangle'), 3, 1e-12);

  // The page's made-up year (2025, 14 March left out), bases 18 / 18 / 10 with an upper cutoff of 30 °C.
  const parsed = readDays(parseTable(exampleYear()), num);
  check('degree days: example reads 364 days with min and max', parsed.days.length === 364 && parsed.hasMinMax && !parsed.bad && !parsed.dup);
  const filled = fillGaps(parsed.days, 'interp');
  check('degree days: one missing day found and filled', filled.days.length === 365 && filled.gaps.missing === 1 && filled.gaps.dates[0] === '2025-03-14' && filled.days[72].filled);
  const s = { heatBase: 18, coolBase: 18, growBase: 10, growUpper: 30 };
  const want = { mean: [3065.85, 300.4, 1464.35], modified: [3065.85, 300.4, 1569.35], sine: [3180.925369, 415.475369, 1518.356454], triangle: [3142.000994, 376.550994, 1500.958443] };
  for (const [m, [h, c, g]] of Object.entries(want)) {
    const r = degreeDays(filled.days, { ...s, method: m }).at(-1);
    near(`example year ${m} heating`, r.chdd, h, 1e-3); near(`example year ${m} cooling`, r.ccdd, c, 1e-3); near(`example year ${m} growing`, r.cgdd, g, 1e-3);
  }
  // In °F (data converted, bases 64.4 / 64.4 / 50 / 86) every total is 1.8 times larger (numpy: 5725.6657, 747.8557, 2733.0416 for sine).
  { const f = (x) => x * 1.8 + 32; const fd = filled.days.map((d) => ({ ...d, tmin: f(d.tmin), tmax: f(d.tmax), mean: f(d.mean) }));
    const r = degreeDays(fd, { heatBase: 64.4, coolBase: 64.4, growBase: 50, growUpper: 86, method: 'sine' }).at(-1);
    near('example year sine in °F heating', r.chdd, 5725.665664, 2e-3); near('example year sine in °F cooling', r.ccdd, 747.855664, 2e-3); near('example year sine in °F growing', r.cgdd, 2733.041618, 2e-3); }
  const skip = degreeDays(fillGaps(parsed.days, 'skip').days, { ...s, method: 'mean' });
  check('degree days: skipping the missing day leaves 364 rows', skip.length === 364);
  near('skip lowers heating by about one March day', skip.at(-1).chdd, 3049.35, 1e-6);
  const mo = monthly(degreeDays(filled.days, { ...s, method: 'sine' }));
  check('degree days: 12 months, March has 31 days with 1 filled', mo.length === 12 && mo[2].days === 31 && mo[2].filled === 1);
  near('months add up to the year (heating)', mo.reduce((a, m) => a + m.hdd, 0), 3180.925369, 1e-3);
  near('cumulative growing at the end of June', mo[5].cgdd, mo.slice(0, 6).reduce((a, m) => a + m.gdd, 0), 1e-9);

  // Reading: mean-only data, missing values, unreadable rows, duplicates, US dates.
  const m1 = readDays(parseTable('date,mean\n2026-01-01,4\n2026-01-02,\n2026-01-04,6'), num);
  check('degree days: mean-only data', !m1.hasMinMax && m1.days.length === 2 && m1.days[1].mean === 6);
  const g1 = fillGaps(m1.days, 'interp');
  check('degree days: gap of two filled by a straight line', g1.gaps.missing === 2 && g1.gaps.longest === 2 && Math.abs(g1.days[1].mean - 14 / 3) < 1e-12);
  check('degree days: unreadable date counted', readDays(parseTable('2026-02-30,1,5\n2026-03-01,1,5'), num).bad === 1);
  check('degree days: duplicate date found', readDays(parseTable('2026-03-01,1,5\n2026-03-01,2,6'), num).dup === '2026-03-01');
  check('degree days: month/day/year dates', readDays(parseTable('03/04/2026,1,5'), num, true).days[0].date === '2026-03-04');
};
