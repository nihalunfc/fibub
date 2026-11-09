// #320 trap count index. Reference values from an independent pandas implementation (groupby site, date
// differences, rolling(3, center=True, min_periods=1) means, isocalendar weeks) on the page's made-up example.
import { trapIndex, summarise, byWeek, isoWeek, daysBetween } from '../../src/lib/sci/trapcount.ts';

export default async (check) => {
  const near = (name, a, b, tol = 1e-9) => check(`trap index: ${name} (${a} vs ${b})`, Math.abs(a - b) <= tol);
  const rows = EXAMPLE.trim().split('\n').slice(1).map((l) => { const [date, site, traps, count] = l.split('\t'); return { date, site, traps: +traps, count: +count }; });
  const o = { firstDays: 7, window: 3, per: 1, threshold: 5, peakShare: 0.2 };
  const r = trapIndex(rows, o), N = r.filter((x) => x.site === 'North orchard'), S = r.filter((x) => x.site === 'South orchard');
  near('North 25 May index', N[3].index, 6.523810, 1e-6);
  near('North 15 June index (one trap lost)', N[6].index, 4.428571, 1e-6);
  near('North 29 June smoothed', N[8].smooth, 8.396825, 1e-6);
  near('North first check smoothed (two checks)', N[0].smooth, 0.833333, 1e-6);
  near('South last check smoothed (two checks)', S[13].smooth, 1.928571, 1e-6);
  check('trap index: North peaks on 25 May and 29 June', N.filter((x) => x.peak).map((x) => x.date).join() === '2026-05-25,2026-06-29');
  check('trap index: South peaks on 26 May and 14 July', S.filter((x) => x.peak).map((x) => x.date).join() === '2026-05-26,2026-07-14');
  check('trap index: 4 checks flagged at 5 or more per site', N.filter((x) => x.flagged).length === 4 && S.filter((x) => x.flagged).length === 4);
  const sm = summarise(r, 1);
  near('North season index', sm[0].index, 3.9825783972125435);
  near('North mean of check indices', sm[0].meanIndex, 3.993197278911564);
  near('South season index', sm[1].index, 2.892857142857143);
  check('trap index: North totals', sm[0].catch === 1143 && sm[0].trapDays === 287 && sm[0].maxDate === '2026-06-29' && sm[0].firstFlag === '2026-05-25');
  check('trap index: South totals', sm[1].catch === 567 && sm[1].trapDays === 196 && sm[1].maxDate === '2026-07-14' && sm[1].firstFlag === '2026-05-26');
  const wk = byWeek(r, 1);
  check('trap index: 14 ISO weeks from 2026-W19', wk.weeks.length === 14 && wk.weeks[0] === '2026-W19' && wk.weeks[13] === '2026-W32');
  near('week 21 North', wk.cell[2][0], 3.666667, 1e-6); near('week 21 South', wk.cell[2][1], 3.142857, 1e-6);
  near('per trap per week', summarise(trapIndex(rows, { ...o, per: 7 }), 7)[0].index, 3.9825783972125435 * 7, 1e-9);
  // A days column wins over the dates; no smoothing; a stricter peak share.
  const d = trapIndex([{ date: '2026-06-01', site: 'A', traps: 4, count: 10, days: 2 }, { date: '2026-06-05', site: 'A', traps: 4, count: 30, days: 3 }, { date: '2026-06-09', site: 'A', traps: 4, count: 4 }], { ...o, window: 1, peakShare: 0.5 });
  near('days column', d[0].index, 1.25); near('days column, second', d[1].index, 2.5); near('days from dates', d[2].index, 0.25);
  check('trap index: one peak with no smoothing', d.filter((x) => x.peak).length === 1 && d[1].peak);
  check('trap index: ISO weeks at year ends', isoWeek('2026-01-01') === '2026-W01' && isoWeek('2027-01-01') === '2026-W53' && isoWeek('2024-12-30') === '2025-W01' && isoWeek('2021-01-03') === '2020-W53');
  check('trap index: days between', daysBetween('2026-02-25', '2026-03-04') === 7);
};

const EXAMPLE = `date	site	traps	count
2026-05-04	North orchard	3	7
2026-05-11	North orchard	3	28
2026-05-18	North orchard	3	77
2026-05-25	North orchard	3	137
2026-06-01	North orchard	3	83
2026-06-08	North orchard	3	59
2026-06-15	North orchard	2	62
2026-06-22	North orchard	3	177
2026-06-29	North orchard	3	203
2026-07-06	North orchard	3	149
2026-07-13	North orchard	3	101
2026-07-20	North orchard	3	39
2026-07-27	North orchard	3	13
2026-08-03	North orchard	3	8
2026-05-05	South orchard	2	5
2026-05-12	South orchard	2	19
2026-05-19	South orchard	2	44
2026-05-26	South orchard	2	71
2026-06-02	South orchard	2	48
2026-06-09	South orchard	2	10
2026-06-16	South orchard	2	10
2026-06-23	South orchard	2	16
2026-06-30	South orchard	2	39
2026-07-07	South orchard	2	75
2026-07-14	South orchard	2	98
2026-07-21	South orchard	2	78
2026-07-28	South orchard	2	39
2026-08-04	South orchard	2	15`;
