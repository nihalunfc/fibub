// #415 Historic calendar converter. Reference values from the Python library convertdate (2.4); the full
// cross-check (20,000 random days, both directions, all four calendars and the weekday: 163,908 checks) was run
// outside the test suite; a sample of it is kept here.
import * as C from '../../src/lib/sci/calendars.ts';
export default async (check) => {
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  check('calendars: 1 January 2000 is JDN 2451545, a Saturday', C.gregorianToJdn(2000, 1, 1) === 2451545 && C.WEEKDAYS[C.weekday(2451545)] === 'Saturday');
  check('calendars: Gregorian reform: 15 Oct 1582 (Gregorian) follows 4 Oct 1582 (Julian)', C.gregorianToJdn(1582, 10, 15) === 2299161 && C.julianToJdn(1582, 10, 4) === 2299160 && C.historicalIsGregorian(2299161) && !C.historicalIsGregorian(2299160));
  check('calendars: JDN 0 is 1 January 4713 BC (Julian), a Monday', eq(C.jdnToJulian(0), { y: -4712, m: 1, d: 1 }) && C.weekday(0) === 1 && C.yearLabel('julian', -4712) === '4713 BC');
  check('calendars: 1 Muharram AH 1 is 16 July 622 (Julian), a Friday', C.islamicToJdn(1, 1, 1) === 1948440 && eq(C.jdnToJulian(1948440), { y: 622, m: 7, d: 16 }) && C.weekday(1948440) === 5);
  check('calendars: 1 Ramadan 1445 (tabular) is 11 March 2024', eq(C.jdnToGregorian(C.islamicToJdn(1445, 9, 1)), { y: 2024, m: 3, d: 11 }));
  check('calendars: 1 Tishri AM 1 is 7 October 3761 BC (Julian), JDN 347998', C.hebrewToJdn(1, 7, 1) === 347998 && eq(C.jdnToJulian(347998), { y: -3760, m: 10, d: 7 }));
  check('calendars: Rosh Hashanah 5785 is 3 October 2024', eq(C.jdnToGregorian(C.hebrewToJdn(5785, 7, 1)), { y: 2024, m: 10, d: 3 }));
  check('calendars: Hebrew year lengths are 353-355 or 383-385 days', [5781, 5782, 5783, 5784, 5785, 5786, 5787].map(C.hebrewYearDays).every((n) => [353, 354, 355, 383, 384, 385].includes(n)) && C.hebrewYearDays(5784) === 383 && C.isHebrewLeap(5784));
  check('calendars: Islamic leap years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29', eq(Array.from({ length: 30 }, (_, i) => i + 1).filter(C.isIslamicLeap), [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29]));
  const py = [[2089331, [1008, 4, 17], [1008, 4, 11], [398, 8, 1], [4768, 2, 2]], [2545293, [2256, 9, 3], [2256, 8, 19], [1685, 4, 12], [6016, 6, 13]], [2837038, [3055, 6, 12], [3055, 5, 22], [2508, 7, 25], [6815, 3, 24]], [2789675, [2925, 10, 8], [2925, 9, 18], [2374, 11, 29], [6686, 7, 29]], [2749315, [2815, 4, 8], [2815, 3, 20], [2261, 1, 7], [6575, 1, 7]], [2014612, [803, 9, 20], [803, 9, 16], [187, 9, 25], [4563, 6, 25]], [2215899, [1354, 10, 28], [1354, 10, 20], [755, 10, 2], [5115, 8, 3]], [2072086, [961, 1, 28], [961, 1, 23], [349, 12, 2], [4721, 11, 3]], [2467941, [2044, 11, 21], [2044, 11, 8], [1466, 12, 30], [5805, 9, 1]], [2746366, [2807, 3, 12], [2807, 2, 21], [2252, 9, 12], [6567, 12, 11]], [2419765, [1912, 12, 28], [1912, 12, 15], [1331, 1, 18], [5673, 10, 18]], [2443625, [1978, 4, 26], [1978, 4, 13], [1398, 5, 18], [5738, 1, 19]]];
  const cals = ['gregorian', 'julian', 'islamic', 'hebrew'];
  check('calendars: 12 random days match convertdate in all four calendars, both ways', py.every(([j, ...v]) => cals.every((c, k) => { const r = C.fromJdn(c, j); return eq([r.y, r.m, r.d], v[k]) && C.toJdn(c, ...v[k]) === j; })));
  let ok = true;
  for (let j = 347998; j < 2600000; j += 997) for (const c of cals) { if (c === 'islamic' && j < 1948440) continue; const r = C.fromJdn(c, j); if (C.toJdn(c, r.y, r.m, r.d) !== j || C.invalid(c, r.y, r.m, r.d)) ok = false; }
  check('calendars: every 997th day from AM 1 to AD 2405 round-trips and is a valid date', ok);
  check('calendars: invalid dates are caught', C.invalid('gregorian', 1900, 2, 29) === 'February 1900 has 28 days.' && C.invalid('julian', 1900, 2, 29) === '' && C.invalid('hebrew', 5785, 13, 1).includes('no Adar II') && C.invalid('islamic', 0, 1, 1).includes('AH 1') && C.invalid('islamic', 1445, 12, 30) === '' && C.invalid('islamic', 1444, 12, 30) !== '');
  check('calendars: names', C.format('hebrew', { y: 5784, m: 12, d: 1 }) === '1 Adar I 5784 AM' && C.format('islamic', { y: 1445, m: 9, d: 1 }) === '1 Ramadan 1445 AH' && C.format('julian', { y: 0, m: 3, d: 1 }) === '1 March 1 BC');
};
