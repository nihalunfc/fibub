// #900 Walter-Lieth climate diagram. The dry-season logic (straight curves from mid-month to mid-month, wrapping
// December to January, dry where T > P/2) was checked against NumPy dense sampling (np.interp, period 12, 1.2 million
// points) on 400 random climates, a third in southern order: dry length within 2.3e-5 months (the grid step),
// crossings within 1e-5, same number of crossings and dry months in every case.
import { pScale, pUnscale, at, dryPeriods, layout, order, parseMonthly, periodText, extremes } from '../../src/lib/sci/walterlieth.ts';
import { num } from '../../src/lib/sci/num.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('walter-lieth: 20 mm per 10 °C up to 100 mm, then 200 mm per 10 °C', pScale(40) === 20 && pScale(100) === 50 && pScale(300) === 60 && pUnscale(70) === 500 && pUnscale(pScale(77)) === 77);
  const v = [0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24];
  check('walter-lieth: curve runs mid-month to mid-month and wraps December to January', at(v, 1.5) === 12 && at(v, 1) === 6 && at(v, 0) === 12 && at(v, 12) === 12 && at(v, 11.5) === 24);
  // One month dry: T 10 everywhere, P 40 except July 0 → dry from 6.0 to 7.0 (crossing halfway to each neighbour).
  const T = Array(12).fill(10), P = Array(12).fill(40); P[6] = 0;
  const d = dryPeriods(T, P);
  check('walter-lieth: crossings found exactly', d.periods.length === 1 && near(d.periods[0][0], 6) && near(d.periods[0][1], 7) && near(d.length, 1) && d.crossings.length === 2);
  const w = Array(12).fill(40); w[0] = 0; w[11] = 0;
  const dw = dryPeriods(T, w);
  check('walter-lieth: a dry spell over the year end is one period', dw.periods.length === 1 && near(dw.periods[0][0], 11) && near(dw.periods[0][1], 13) && near(dw.length, 2));
  check('walter-lieth: all dry and never dry', near(dryPeriods(T, Array(12).fill(5)).length, 12) && dryPeriods(T, Array(12).fill(30)).length === 0);
  check('walter-lieth: southern order starts in July', order([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], true).join() === '7,8,9,10,11,12,1,2,3,4,5,6');
  const Tm = [9.5, 10.4, 12.6, 15, 18.9, 23.2, 26.3, 26.4, 23.1, 18.8, 13.9, 10.6], Pm = [88, 71, 56, 42, 23, 8, 2, 4, 21, 64, 104, 118];
  const L = layout({ T: Tm, P: Pm, tmax: Tm.map((t) => t + 6), tmin: Tm.map((t) => t - 5), amin: Tm.map((t) => t - 12) });
  check('walter-lieth: annual mean and total', near(L.stats.annualT, 17.39166666666667, 1e-9) && L.stats.annualP === 601);
  check('walter-lieth: dry months (P < 2T) and wet months (P > 100)', L.stats.dryMonths === 5 && L.stats.wetMonths === 2);
  check('walter-lieth: frost: none sure, probable where the absolute minimum is below 0', L.stats.frostSure === 0 && L.stats.frostProb === 3 && L.frostProb[0] && L.frostProb[11] && !L.frostProb[2]);
  check('walter-lieth: extremes', L.stats.warmMax === 32.4 && near(L.stats.coldMin, 4.5) && near(L.stats.absMin, -2.5) && extremes(L.stats) === 'Warmest month max 32.4 · coldest month min 4.5 · absolute min −2.5 °C');
  check('walter-lieth: solid area only above 100 mm, y range', L.solid.length === 2 && L.solid[0][0][0] === 0 && L.solid[0].every(([, y]) => y >= 50 - 1e-9) && L.yMin === 0 && L.yMax === 60);
  check('walter-lieth: hatching between the curves', L.dry.every(([, a, b]) => b > a) && L.humid.every(([, a, b]) => b > a) && L.dry.length > 40 && L.humid.length > 40);
  check('walter-lieth: dry period read in words', near(L.stats.dryLength, 5.0406, 1e-4) && periodText(...L.stats.periods[0]) === 'late April to late September' && periodText(11, 13) === 'early December to late January' && periodText(0, 6, true) === 'early July to late December');
  const p = parseMonthly('Month,T,P,Tmax,Tmin,Absmin\nJan,1,50,5,-3,-15\nFeb,2,40,6,-2,-12\nMar,5,40,9,1,-8\nApr,9,45,14,4,-4\nMay,14,60,19,8,0\nJun,18,70,23,12,4\nJul,20,70,25,14,6\nFeb,19,65,24,13,5\nSep,15,50,20,9,1\nOct,10,45,14,5,-3\nNov,5,50,8,1,-8\nDec,2,55,5,-2,-13\nYear,10,640,,,'.split('\n').map((l) => l.split(',')), num);
  check('walter-lieth: parses a CSV with header, extremes and a year row', !('error' in p) && p.m.T[6] === 20 && p.m.P.length === 12 && p.m.amin[0] === -15 && p.notes.length === 0);
  const q = parseMonthly([['1', '5', '30'], ['2', '6', '30'], ...Array.from({ length: 10 }, (_, i) => [String(i + 3), '8', '20', '12'])], num);
  check('walter-lieth: month numbers skipped; a partial column is left out with a note', !('error' in q) && q.m.T[0] === 5 && q.m.P[0] === 30 && !q.m.tmax && q.notes[0].includes('10 of 12'));
  check('walter-lieth: wrong row count and bad values are errors', 'error' in parseMonthly([['1', '2']], num) && 'error' in parseMonthly(Array.from({ length: 12 }, () => ['5', '-3']), num) && 'error' in parseMonthly(Array.from({ length: 12 }, () => ['500', '3']), num));
};
